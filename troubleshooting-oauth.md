# OAuth Troubleshooting Guide

## Your Issue: Google OAuth redirects back to signin page

Since you already have environment variables set up, let's debug step by step:

## Step 1: Check Environment Variables

Visit `/debug-oauth` in your browser and check:
- Are all environment variables showing as "Set"?
- Is `NEXTAUTH_URL` set to `http://localhost:3000`?
- Are Google credentials properly configured?

## Step 2: Check Google Console Configuration

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to "APIs & Services" → "Credentials"
3. Find your OAuth 2.0 Client ID
4. Check "Authorized redirect URIs" - should include:
   - `http://localhost:3000/api/auth/callback/google`
   - `http://localhost:3000/api/auth/callback/google/`

## Step 3: Test OAuth Flow

1. Visit `/debug-oauth`
2. Click "Test Google Sign In"
3. Check the browser console for any errors
4. Look at the "Debug Result" section for detailed information

## Step 4: Check Server Logs

When you try to sign in, check your terminal/console for:
- "SignIn callback" logs
- "Session callback" logs
- Any error messages

## Step 5: Common Issues & Solutions

### Issue 1: "ConfigurationError"
**Solution**: Check that `NEXTAUTH_URL` matches your actual URL exactly

### Issue 2: "OAuthCallbackError"
**Solution**: Verify redirect URIs in Google Console match exactly

### Issue 3: "OAuthSigninError" 
**Solution**: Check that Google Client ID and Secret are correct

### Issue 4: Database Connection Issues
**Solution**: Ensure your database is running and accessible

## Step 6: Manual Testing

Try this in your browser console:
```javascript
// Test OAuth URL generation
fetch('/api/auth/signin/google')
  .then(res => res.text())
  .then(html => console.log(html))
  .catch(err => console.error(err));
```

## Step 7: Check Network Tab

1. Open browser DevTools
2. Go to Network tab
3. Try signing in with Google
4. Look for failed requests or error responses

## Step 8: Verify Database

Make sure your database tables exist:
- `users`
- `accounts` 
- `sessions`

Run: `npx prisma db push` if needed.

## Still Having Issues?

1. Share the output from `/debug-oauth`
2. Share any console errors
3. Share the network tab results
4. Check if you're using any proxy or VPN that might interfere
