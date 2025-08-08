import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import * as bcrypt from "bcryptjs";

// Dynamic import to avoid build-time issues
async function getPrisma() {
  try {
    const { prisma } = await import('./db-optimized');
    return prisma;
  } catch (error) {
    console.error('Failed to import Prisma client:', error);
    // Return a mock adapter for build time
    if (process.env.NODE_ENV === 'production' && process.env.VERCEL) {
      console.log('Using mock adapter for Vercel deployment');
      return null;
    }
    throw new Error('Database connection failed');
  }
}

export async function getAuthOptions(): Promise<NextAuthOptions> {
  const prisma = await getPrisma();
  
  // If prisma is null (build time), return a basic config without adapter
  if (!prisma) {
    return {
      providers: [
        // Google OAuth Provider
        GoogleProvider({
          clientId: process.env.GOOGLE_CLIENT_ID!,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
          authorization: {
            params: {
              prompt: "consent",
              access_type: "offline",
              response_type: "code"
            }
          }
        }),
        // GitHub OAuth Provider
        GitHubProvider({
          clientId: process.env.GITHUB_CLIENT_ID!,
          clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        }),
      ],
      session: {
        strategy: "jwt",
      },
      callbacks: {
        async jwt({ token, user, account }) {
          if (user) {
            token.id = user.id;
            token.role = user.role;
          }
          return token;
        },
        async session({ session, token }) {
          if (token) {
            session.user.id = token.id as string;
            session.user.role = token.role as string;
          }
          return session;
        },
      },
      pages: {
        signIn: "/auth/login",
      },
      secret: process.env.NEXTAUTH_SECRET,
      debug: process.env.NODE_ENV === "development",
    };
  }
  
  return {
    adapter: PrismaAdapter(prisma),
    providers: [
      // Google OAuth Provider
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        authorization: {
          params: {
            prompt: "consent",
            access_type: "offline",
            response_type: "code"
          }
        }
      }),
      // GitHub OAuth Provider
      GitHubProvider({
        clientId: process.env.GITHUB_CLIENT_ID!,
        clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      }),
      // Credentials Provider (existing email/password login)
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

          if (!prisma) {
            console.log('Prisma not available for credentials auth');
            return null;
          }

          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email,
            },
          });

          if (!user) {
            return null;
          }

          if (!user.password) {
            return null;
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isPasswordValid) {
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          };
        },
      }),
    ],
    session: {
      strategy: "jwt",
    },
    callbacks: {
      async jwt({ token, user, account }) {
        if (user) {
          token.id = user.id;
          token.role = user.role;
        }
        return token;
      },
      async session({ session, token }) {
        console.log("Session callback:", { 
          sessionUser: session.user ? { email: session.user.email, name: session.user.name } : null,
          token: token ? { id: token.id, role: token.role } : null
        });
        
        if (token) {
          session.user.id = token.id as string;
          session.user.role = token.role as string;
        }
        return session;
      },
      async signIn({ user, account, profile, email, credentials }) {
        console.log("SignIn callback:", { 
          user: user ? { id: user.id, email: user.email, name: user.name } : null, 
          account: account ? { provider: account.provider, type: account.type } : null, 
          profile: profile ? { email: profile.email, name: profile.name } : null 
        });
        return true;
      },
      async redirect({ url, baseUrl }) {
        console.log("Redirect callback:", { url, baseUrl });
        // Allows relative callback URLs
        if (url.startsWith("/")) return `${baseUrl}${url}`;
        // Allows callback URLs on the same origin
        else if (new URL(url).origin === baseUrl) return url;
        return baseUrl;
      },
    },
    pages: {
      signIn: "/auth/login",
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: process.env.NODE_ENV === "development",
  };
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}
 