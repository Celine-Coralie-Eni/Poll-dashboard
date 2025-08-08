# OAuth Setup Guide

## Issue: Google OAuth redirects back to signin page

The problem is likely due to missing or incorrect environment variables. Follow these steps to fix it:

## 1. Create Environment File

Create a `.env.local` file in your project root with the following variables:

```bash
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here-make-it-long-and-random

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# GitHub OAuth Configuration (optional)
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

## 2. Generate NEXTAUTH_SECRET

Run this command to generate a secure secret:

```bash
openssl rand -base64 32
```

## 3. Set up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Set application type to "Web application"
6. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (for development)
   - `https://yourdomain.com/api/auth/callback/google` (for production)
7. Copy the Client ID and Client Secret to your `.env.local` file

## 4. Restart Development Server

After setting up the environment variables:

```bash
npm run dev
```

## 5. Test OAuth

Visit `/debug-oauth` to test your OAuth configuration and see if all environment variables are set correctly.

## Common Issues:

1. **Missing NEXTAUTH_URL**: This is crucial for OAuth to work
2. **Incorrect redirect URIs**: Make sure they match exactly in Google Console
3. **Missing NEXTAUTH_SECRET**: Required for session management
4. **Wrong callback URL**: Should be `/api/auth/callback/google`

## Debug Steps:

1. Check browser console for errors
2. Visit `/debug-oauth` to see environment variable status
3. Check network tab for failed requests
4. Verify Google Console configuration matches your setup
