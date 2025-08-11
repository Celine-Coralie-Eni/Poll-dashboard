import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
// verifyPassword function defined at bottom of file

// Helper function to add timeout to async operations
const withTimeout = <T>(promise: Promise<T>, timeoutMs: number): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`Operation timed out after ${timeoutMs}ms`)), timeoutMs)
    ),
  ]);
};

// Helper function to retry operations with exponential backoff
const withRetry = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> => {
  let lastError: Error;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === maxRetries) {
        throw lastError;
      }
      
      // Exponential backoff with jitter
      const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 1000;
      console.log(`Database operation failed, retrying in ${Math.round(delay)}ms (attempt ${attempt + 1}/${maxRetries + 1})`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError!;
};

// Dynamic import to avoid build-time issues
async function getPrisma() {
  try {
    const { prisma } = await import("./db-optimized");
    return prisma;
  } catch (error) {
    console.log("Prisma not available at build time");
    return null;
  }
}

export async function getAuthOptions(): Promise<NextAuthOptions> {
  const prisma = await getPrisma();
  
  console.log('=== AUTH CONFIGURATION ===');
  console.log('Prisma client available:', !!prisma);
  console.log('Database URL configured:', !!process.env.DATABASE_URL);
  
  // If prisma is null (build time), return a basic config without adapter
  if (!prisma) {
    return {
      providers: [
        GoogleProvider({
          clientId: process.env.GOOGLE_CLIENT_ID!,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        CredentialsProvider({
          name: "credentials",
          credentials: {
            email: { label: "Email", type: "email" },
            password: { label: "Password", type: "password" },
          },
          async authorize(credentials) {
            if (!credentials?.email || !credentials?.password) {
              return null;
            }
            return null; // No database access at build time
          },
        }),
      ],
      session: {
        strategy: "jwt",
      },
      pages: {
        signIn: "/auth/login",
      },
    };
  }

  return {
    // TEMPORARILY DISABLE PRISMA ADAPTER - will handle user creation manually in callbacks
    // adapter: PrismaAdapter(prisma),
    providers: [
      // Google OAuth Provider
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      }),
      // GitHub Provider
      GitHubProvider({
        clientId: process.env.GITHUB_CLIENT_ID!,
        clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      }),
      // Credentials Provider
      CredentialsProvider({
        name: "credentials",
        credentials: {
          email: { label: "Email", type: "email" },
          password: { label: "Password", type: "password" },
        },
        async authorize(credentials) {
          if (!credentials?.email || !credentials?.password) {
            return null;
          }

          try {
            const prisma = await getPrisma();
            if (!prisma) {
              console.error("Prisma client not available");
              return null;
            }

            const user: any = await withRetry(async () => {
              return await withTimeout(
                prisma.user.findUnique({
                  where: {
                    email: credentials.email,
                  },
                }), 
                30000
              );
            }, 2, 1000);

            if (!user) {
              console.log("User not found");
              return null;
            }

            if (!user.password) {
              console.log("User has no password (OAuth user)");
              return null;
            }

            const isValidPassword = await verifyPassword(
              credentials.password,
              user.password
            );

            if (!isValidPassword) {
              console.log("Invalid password");
              return null;
            }

            return {
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role,
              image: user.image,
            };
          } catch (error) {
            console.error("Error in authorize:", error);
            return null;
          }
        },
      }),
    ],
    session: {
      strategy: "jwt",
    },
    pages: {
      signIn: "/auth/login",
    },
    callbacks: {
      async jwt({ token, user, account }) {
        console.log("=== JWT CALLBACK START ===");
        console.log("Token:", token);
        console.log("User:", user);
        console.log("Account:", account);

        if (user) {
          token.role = user.role;
          token.id = user.id;
        }

        if (account?.provider === "google" || account?.provider === "github") {
          // Handle OAuth sign-in
          try {
            const prisma = await getPrisma();
            if (prisma && token.email) {
              // Check if user exists, create if not
              let dbUser: any = await withRetry(async () => {
                return await withTimeout(
                  prisma.user.findUnique({
                    where: { email: token.email as string }
                  }), 
                  30000
                );
              }, 2, 1000);

              if (!dbUser) {
                // Create new user
                dbUser = await withRetry(async () => {
                  return await withTimeout(
                    prisma.user.create({
                      data: {
                        email: token.email as string,
                        name: token.name as string,
                        image: token.picture as string,
                        role: "USER",
                      },
                    }), 
                    30000
                  );
                }, 2, 2000);
                console.log(`Created new user: ${dbUser.email}`);
              }

              // Update token with user info
              token.id = dbUser.id;
              token.role = dbUser.role;
            }
          } catch (error) {
            console.error("Error handling OAuth user creation:", error);
            // Don't fail the JWT if user creation fails
          }
        }

        console.log("=== JWT CALLBACK END ===");
        return token;
      },
      async session({ session, token }) {
        console.log("=== SESSION CALLBACK START ===");
        console.log("Session:", session);
        console.log("Token:", token);

        // Initialize session.user if it doesn't exist
        if (!session.user) {
          session.user = {
            id: "",
            name: "",
            email: "",
            image: "",
            role: "USER"
          };
        }

        // Ensure all required properties are set
        if (token.id) {
          session.user.id = token.id as string;
        }
        if (token.name) {
          session.user.name = token.name as string;
        }
        if (token.email) {
          session.user.email = token.email as string;
        }
        if (token.picture) {
          session.user.image = token.picture as string;
        }
        if (token.role) {
          session.user.role = token.role as string;
        }
        
        // Handle admin assignment for the first user with retry logic
        try {
          const prisma = await getPrisma();
          if (prisma && token.email) {
            await withRetry(async () => {
              // Check if this is the first user and make them admin
              const userCount = await withTimeout(prisma.user.count(), 30000);
              if (userCount === 1) {
                const user = await withTimeout(
                  prisma.user.findUnique({
                    where: { email: token.email as string }
                  }), 
                  30000
                );
                
                if (user && user.role !== 'ADMIN') {
                  await withTimeout(
                    prisma.user.update({
                      where: { email: token.email as string },
                      data: { role: 'ADMIN' }
                    }), 
                    30000
                  );
                  console.log(`Made first user ${token.email} an admin`);
                  
                  // Update the token role
                  token.role = 'ADMIN';
                  session.user.role = 'ADMIN';
                }
              }
            }, 2, 2000); // 2 retries with 2 second base delay
          }
        } catch (error) {
          console.error('Error handling admin assignment (after retries):', error);
          // Don't fail the session if admin assignment fails
        }

        console.log("Final session being returned:", session);
        console.log("=== SESSION CALLBACK END ===");
        return session;
      },
      async signIn({ user, account, profile, email, credentials }) {
        console.log("=== SIGN IN CALLBACK START ===");
        console.log("User:", user);
        console.log("Account:", account);
        console.log("Profile:", profile);
        console.log("Email:", email);
        console.log("Credentials:", credentials);
        console.log("=== SIGN IN CALLBACK END ===");
        return true;
      },
      async redirect({ url, baseUrl }) {
        console.log("Redirect callback:", { url, baseUrl });
        // Always redirect to homepage after successful sign in
        return `${baseUrl}/`;
      },
    },
  };
}

// Export the auth options function
export { getAuthOptions as authOptions };

// Export the NextAuth handler function
export const handler = async () => {
  const options = await getAuthOptions();
  return NextAuth(options);
};

// Export the handler as default
export default handler;

// Utility functions for password hashing
export async function hashPassword(password: string): Promise<string> {
  const bcrypt = await import("bcryptjs");
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  const bcrypt = await import("bcryptjs");
  return bcrypt.compare(password, hashedPassword);
}
