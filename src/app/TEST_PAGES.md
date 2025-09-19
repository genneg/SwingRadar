# Test & Debug Pages

This document lists development/testing pages that are included in the application for debugging and testing purposes.

## Authentication Test Pages

### `/auth/test` 
- **Purpose**: Test NextAuth.js authentication configuration
- **Features**: Session testing, provider verification, auth state debugging
- **Status**: Development tool - safe to keep

### `/auth/test-ui`
- **Purpose**: Test authentication UI components and flows
- **Features**: AuthForm testing, UI state validation, component integration
- **Status**: Development tool - safe to keep

### `/profile/test`
- **Purpose**: Test user profile functionality and components
- **Features**: Profile data testing, user state management
- **Status**: Development tool - safe to keep

## API Test Pages

### `/api/test-events`
- **Purpose**: Test event data loading and API endpoints
- **Features**: Event API testing, data validation, component rendering
- **Status**: Development tool - safe to keep

## Debug Routes

Additional API debug routes available:
- `/api/auth/test` - NextAuth.js configuration testing
- `/api/health` - Application health check

## Production Considerations

### Keep for Development
- These pages are useful for debugging and testing
- They help verify functionality during development
- They don't expose sensitive information

### Remove for Production (Optional)
If desired for production cleanup:
1. Delete the test page directories listed above
2. Remove any navigation links to test pages
3. Update routing if these pages are referenced anywhere

### Security Note
- Test pages use the same authentication as the main app
- No sensitive data is exposed through these pages
- They follow the same security patterns as production pages

## Access URLs

During development, these pages are accessible at:
- http://localhost:3000/auth/test
- http://localhost:3000/auth/test-ui  
- http://localhost:3000/profile/test
- http://localhost:3000/api/test-events