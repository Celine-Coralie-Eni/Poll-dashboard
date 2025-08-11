export function getAuthConfig() {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const isProduction = process.env.NODE_ENV === 'production';
  
  // Get the base URL from environment or detect automatically
  let baseUrl = process.env.NEXTAUTH_URL;
  
  if (!baseUrl) {
    if (isDevelopment) {
      // Default to localhost:3001 for development
      baseUrl = 'http://localhost:3001';
    } else if (isProduction) {
      // For production, try to detect from Vercel or other hosting
      baseUrl = process.env.VERCEL_URL 
        ? `https://${process.env.VERCEL_URL}`
        : process.env.NEXT_PUBLIC_APP_URL || 'https://your-domain.com';
    }
  }
  
  return {
    baseUrl,
    isDevelopment,
    isProduction,
    secret: process.env.NEXTAUTH_SECRET,
    github: {
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }
  };
}
