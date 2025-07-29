# OAuth Setup Guide

This guide explains how to set up OAuth authentication with Google and GitHub for the Poll Dashboard application.

## Prerequisites

- A Google Cloud Platform account
- A GitHub account
- Access to the application's `.env` file

## Google OAuth Setup

### 1. Create a Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google OAuth2 API for your project:
   - Navigate to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it (this provides OAuth functionality)
   - Alternatively, search for "People API" if you need profile information

### 2. Configure OAuth Consent Screen

1. Navigate to "APIs & Services" > "OAuth consent screen"
2. Choose "External" user type (unless you have a Google Workspace account)
3. Fill in the required information:
   - App name: "Poll Dashboard"
   - User support email: Your email
   - Developer contact information: Your email
4. Add scopes: `email`, `profile`, `openid`
5. Save and continue

### 3. Create OAuth Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Choose "Web application" as the application type
4. Set the name: "Poll Dashboard Web Client"
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (for development)
   - `http://10.127.216.240:3000/api/auth/callback/google` (for your current setup)
   - Add your production URL when deploying: `https://yourdomain.com/api/auth/callback/google`
6. Click "Create"
7. Copy the Client ID and Client Secret

### 4. Update Environment Variables

Add the Google credentials to your `.env` file:

```env
GOOGLE_CLIENT_ID="your_google_client_id_here"
GOOGLE_CLIENT_SECRET="your_google_client_secret_here"
```

## GitHub OAuth Setup

### 1. Create a GitHub OAuth App

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in the application details:
   - Application name: "Poll Dashboard"
   - Homepage URL: `http://10.127.216.240:3000` (or your domain)
   - Application description: "Poll creation and voting dashboard"
   - Authorization callback URL: `http://10.127.216.240:3000/api/auth/callback/github`
4. Click "Register application"

### 2. Generate Client Secret

1. After creating the app, click "Generate a new client secret"
2. Copy both the Client ID and Client Secret

### 3. Update Environment Variables

Add the GitHub credentials to your `.env` file:

```env
GITHUB_CLIENT_ID="your_github_client_id_here"
GITHUB_CLIENT_SECRET="your_github_client_secret_here"
```

## Complete Environment Configuration

Your `.env` file should include these OAuth variables:

```env
# Database Configuration
DATABASE_URL="mysql://poll_user:poll_password@10.127.216.240:3306/poll_dashboard"

# NextAuth Configuration
NEXTAUTH_SECRET="rxkMMhC6T4N76H2qWuYRl2dKkFYN1p7z24qGubfb2ro="
NEXTAUTH_URL="http://10.127.216.240:3000"

# OAuth Configuration
GOOGLE_CLIENT_ID="your_google_client_id_here"
GOOGLE_CLIENT_SECRET="your_google_client_secret_here"
GITHUB_CLIENT_ID="your_github_client_id_here"
GITHUB_CLIENT_SECRET="your_github_client_secret_here"

# Tolgee Configuration
TOLGEE_API_KEY="tgpak_giydmojrl5xwmoltozxgqytfgfwdo2zwgrxwk5bwnq4goobxgvwq"
TOLGEE_API_URL="https://app.tolgee.io"

# Admin Credentials
ADMIN_EMAIL="celinecoralie0@gmail.com"
ADMIN_PASSWORD="CelineAdmin2024!"
ADMIN_NAME="Celine-Coralie"

# Application Configuration
NODE_ENV="development"
```

## Testing OAuth Integration

1. Replace the placeholder values in `.env` with your actual OAuth credentials
2. Restart your development server: `npm run dev`
3. Navigate to `/auth/login` or `/auth/register`
4. Click on "Sign in with Google" or "Sign in with GitHub"
5. Complete the OAuth flow
6. Verify that the user is created in your database with the correct OAuth account information

## Troubleshooting

### Common Issues

1. **"redirect_uri_mismatch" error**: Ensure the callback URLs in your OAuth app settings match exactly with your application URLs
2. **"invalid_client" error**: Double-check your Client ID and Client Secret
3. **OAuth app not found**: Make sure your OAuth applications are properly configured and not deleted

### Database Verification

After successful OAuth login, check your database to ensure the user and account records are created:

```sql
-- Check users table
SELECT * FROM User WHERE email = 'your-oauth-email@example.com';

-- Check accounts table
SELECT * FROM Account WHERE userId = 'user-id-from-above';
```

## Security Notes

- Never commit your actual OAuth credentials to version control
- Use different OAuth apps for development, staging, and production environments
- Regularly rotate your OAuth secrets
- Monitor your OAuth app usage in the respective developer consoles

## Production Deployment

When deploying to production:

1. Create separate OAuth applications for production
2. Update the callback URLs to use your production domain
3. Update the `NEXTAUTH_URL` environment variable
4. Ensure your production environment has all required OAuth environment variables