# OAuth Setup Guide - Blues Dance Festival Finder

This guide explains how to set up OAuth providers for the Blues Dance Festival Finder authentication system.

## Overview

The application supports three authentication methods:
1. **Google OAuth** - Social login with Google accounts
2. **Facebook OAuth** - Social login with Facebook accounts  
3. **Credentials** - Email/password authentication

## Prerequisites

- NextAuth.js is already configured in the application
- Database schema includes required tables (User, Account, Session, VerificationToken)
- Environment variables are set up in `.env` file

## Google OAuth Setup

### 1. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing project
3. Enable the Google+ API and Google Identity Services

### 2. Configure OAuth Consent Screen

1. Go to **APIs & Services > OAuth consent screen**
2. Choose **External** user type
3. Fill in required information:
   - App name: `Blues Dance Festival Finder`
   - User support email: `your-email@domain.com`
   - Developer contact information: `your-email@domain.com`
4. Add scopes:
   - `openid`
   - `email` 
   - `profile`
5. Add test users (during development)

### 3. Create OAuth Credentials

1. Go to **APIs & Services > Credentials**
2. Click **Create Credentials > OAuth 2.0 Client IDs**
3. Application type: **Web application**
4. Name: `Blues Dance Festival Finder`
5. Authorized redirect URIs:
   - Development: `http://localhost:3000/api/auth/callback/google`
   - Production: `https://yourdomain.com/api/auth/callback/google`
6. Save and copy the **Client ID** and **Client Secret**

### 4. Update Environment Variables

```env
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

## Facebook OAuth Setup

### 1. Create Facebook App

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Click **My Apps > Create App**
3. Choose **Consumer** app type
4. Fill in app details:
   - App Name: `Blues Dance Festival Finder`
   - Contact Email: `your-email@domain.com`

### 2. Configure Facebook Login

1. In your Facebook app dashboard, go to **Products**
2. Add **Facebook Login** product
3. In **Facebook Login > Settings**:
   - Valid OAuth Redirect URIs:
     - Development: `http://localhost:3000/api/auth/callback/facebook`
     - Production: `https://yourdomain.com/api/auth/callback/facebook`
   - Enable **Login with the JavaScript SDK**
   - Enable **Web OAuth Login**

### 3. Configure App Settings

1. Go to **Settings > Basic**
2. Add **App Domains**:
   - Development: `localhost`
   - Production: `yourdomain.com`
3. Add **Privacy Policy URL** and **Terms of Service URL**
4. Copy **App ID** and **App Secret**

### 4. Update Environment Variables

```env
FACEBOOK_CLIENT_ID="your-facebook-app-id"
FACEBOOK_CLIENT_SECRET="your-facebook-app-secret"
```

## Environment Variables Summary

Complete `.env` file for authentication:

```env
# NextAuth.js Configuration
NEXTAUTH_SECRET="your-secret-key-here-make-it-long-and-secure"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Facebook OAuth
FACEBOOK_CLIENT_ID="your-facebook-app-id"
FACEBOOK_CLIENT_SECRET="your-facebook-app-secret"

# Database (already configured)
DATABASE_URL="postgresql://scraper:scraper_password@localhost:5432/swing_events"
```

## Testing Authentication

### 1. Start Development Server

```bash
npm run dev
```

### 2. Test OAuth Providers

Visit these URLs to test authentication:

- **Google OAuth**: `http://localhost:3000/api/auth/signin/google`
- **Facebook OAuth**: `http://localhost:3000/api/auth/signin/facebook`
- **Credentials**: `http://localhost:3000/auth/signin`

### 3. Test Authentication API

```bash
curl http://localhost:3000/api/auth/test
```

This should return authentication configuration and status.

### 4. Check Database

After successful authentication, verify that users are created in the database:

```sql
SELECT * FROM users;
SELECT * FROM accounts;
SELECT * FROM sessions;
```

## Authentication Flow

### OAuth Flow (Google/Facebook)

1. User clicks "Sign in with Google/Facebook"
2. Redirect to OAuth provider
3. User grants permissions
4. Provider redirects back with authorization code
5. NextAuth.js exchanges code for access token
6. User profile is fetched from provider
7. User is created/updated in database
8. Session is created
9. User is redirected to dashboard

### Credentials Flow (Email/Password)

1. User submits email/password form
2. Password is verified against hashed version in database
3. User session is created
4. User is redirected to dashboard

## Security Considerations

### Production Settings

1. **Use HTTPS**: Always use HTTPS in production
2. **Secure Cookies**: NextAuth.js automatically uses secure cookies in production
3. **Environment Variables**: Never commit real credentials to version control
4. **NEXTAUTH_SECRET**: Use a strong, random secret (32+ characters)

### OAuth Security

1. **Redirect URIs**: Only add trusted domains to redirect URIs
2. **App Review**: Submit apps for review before public launch
3. **Scopes**: Request minimal necessary scopes
4. **Rate Limiting**: Implement rate limiting on auth endpoints

## Troubleshooting

### Common Issues

1. **"Invalid redirect URI"**
   - Check that redirect URI in OAuth provider matches exactly
   - Include protocol (http/https)
   - Check for trailing slashes

2. **"Client authentication failed"**
   - Verify CLIENT_ID and CLIENT_SECRET are correct
   - Check for extra spaces or newlines in environment variables

3. **"User creation failed"**
   - Check database connection
   - Verify Prisma schema is applied
   - Check for unique constraint violations

4. **"Session not persisting"**
   - Verify NEXTAUTH_SECRET is set
   - Check cookie domain settings
   - Verify database session table exists

### Debug Mode

Enable debug mode in development:

```env
NEXTAUTH_DEBUG=true
```

This will provide detailed logs of the authentication process.

## API Endpoints

The application provides these authentication endpoints:

- `GET /api/auth/signin` - Sign in page
- `GET /api/auth/signout` - Sign out
- `GET /api/auth/session` - Get current session
- `GET /api/auth/csrf` - Get CSRF token
- `GET /api/auth/providers` - Get available providers
- `POST /api/auth/callback/:provider` - OAuth callback
- `GET /api/auth/test` - Test configuration

## Next Steps

1. Set up OAuth applications with real credentials
2. Test authentication flows thoroughly
3. Configure production domains and redirect URIs
4. Set up monitoring for authentication errors
5. Implement user onboarding flow
6. Add email verification for credentials provider

## Resources

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Google OAuth 2.0 Setup](https://developers.google.com/identity/protocols/oauth2)
- [Facebook Login Documentation](https://developers.facebook.com/docs/facebook-login/)
- [Prisma NextAuth Adapter](https://authjs.dev/reference/adapter/prisma)