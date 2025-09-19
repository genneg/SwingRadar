// Environment variables utility with validation

interface EnvironmentConfig {
  // Database
  DATABASE_URL: string
  REDIS_URL: string
  
  // NextAuth
  NEXTAUTH_SECRET: string
  NEXTAUTH_URL: string
  
  // OAuth
  GOOGLE_CLIENT_ID?: string
  GOOGLE_CLIENT_SECRET?: string
  FACEBOOK_CLIENT_ID?: string
  FACEBOOK_CLIENT_SECRET?: string
  
  // APIs
  GOOGLE_MAPS_API_KEY?: string
  SENDGRID_API_KEY?: string
  
  // App Config
  NEXT_PUBLIC_APP_NAME: string
  NEXT_PUBLIC_APP_URL: string
  NEXT_PUBLIC_ENVIRONMENT: string
  
  // Node Environment
  NODE_ENV: 'development' | 'production' | 'test'
}

function getEnvVar(key: string, defaultValue?: string): string {
  const value = process.env[key] ?? defaultValue
  if (!value) {
    throw new Error(`Environment variable ${key} is required but not set`)
  }
  return value
}

function getOptionalEnvVar(key: string, defaultValue?: string): string | undefined {
  return process.env[key] ?? defaultValue
}

// Environment configuration with validation
export const env: EnvironmentConfig = {
  // Required database variables
  DATABASE_URL: getEnvVar('DATABASE_URL'),
  REDIS_URL: getEnvVar('REDIS_URL'),
  
  // Required auth variables
  NEXTAUTH_SECRET: getEnvVar('NEXTAUTH_SECRET'),
  NEXTAUTH_URL: getEnvVar('NEXTAUTH_URL'),
  
  // Optional OAuth variables
  GOOGLE_CLIENT_ID: getOptionalEnvVar('GOOGLE_CLIENT_ID'),
  GOOGLE_CLIENT_SECRET: getOptionalEnvVar('GOOGLE_CLIENT_SECRET'),
  FACEBOOK_CLIENT_ID: getOptionalEnvVar('FACEBOOK_CLIENT_ID'),
  FACEBOOK_CLIENT_SECRET: getOptionalEnvVar('FACEBOOK_CLIENT_SECRET'),
  
  // Optional API keys
  GOOGLE_MAPS_API_KEY: getOptionalEnvVar('GOOGLE_MAPS_API_KEY'),
  SENDGRID_API_KEY: getOptionalEnvVar('SENDGRID_API_KEY'),
  
  // Public app configuration
  NEXT_PUBLIC_APP_NAME: getEnvVar('NEXT_PUBLIC_APP_NAME', 'Blues Dance Festival Finder'),
  NEXT_PUBLIC_APP_URL: getEnvVar('NEXT_PUBLIC_APP_URL', 'http://localhost:3000'),
  NEXT_PUBLIC_ENVIRONMENT: getEnvVar('NEXT_PUBLIC_ENVIRONMENT', 'development'),
  
  // Node environment
  NODE_ENV: (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'test') 
    ? process.env.NODE_ENV 
    : 'development'
}

// Helper functions
export const isDevelopment = env.NODE_ENV === 'development'
export const isProduction = env.NODE_ENV === 'production'
export const isTest = env.NODE_ENV === 'test'

// Feature flags based on environment
export const features = {
  enableScraping: isProduction || isDevelopment,
  enableAnalytics: isProduction,
  enableDebugMode: isDevelopment,
  enableTestData: isDevelopment || isTest,
  enableEmailNotifications: !!env.SENDGRID_API_KEY,
  enableGoogleMaps: !!env.GOOGLE_MAPS_API_KEY,
  enableGoogleAuth: !!(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET),
  enableFacebookAuth: !!(env.FACEBOOK_CLIENT_ID && env.FACEBOOK_CLIENT_SECRET)
}

// Validate critical environment variables on startup
export function validateEnvironment() {
  const requiredVars = [
    'DATABASE_URL',
    'REDIS_URL', 
    'NEXTAUTH_SECRET',
    'NEXTAUTH_URL'
  ]
  
  const missing = requiredVars.filter(key => !process.env[key])
  
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      `Please check your .env.local file and ensure all required variables are set.`
    )
  }
  
  // eslint-disable-next-line no-console
  console.log('✅ Environment validation passed')
}

// Log environment info (safe for production)
export function logEnvironmentInfo() {
  // eslint-disable-next-line no-console
  console.log(`🌍 Environment: ${env.NODE_ENV}`)
  // eslint-disable-next-line no-console
  console.log(`🚀 App: ${env.NEXT_PUBLIC_APP_NAME}`)
  // eslint-disable-next-line no-console
  console.log(`🔗 URL: ${env.NEXT_PUBLIC_APP_URL}`)
  // eslint-disable-next-line no-console
  console.log(`🔑 Features enabled:`, {
    scraping: features.enableScraping,
    analytics: features.enableAnalytics,
    googleMaps: features.enableGoogleMaps,
    googleAuth: features.enableGoogleAuth,
    facebookAuth: features.enableFacebookAuth,
    emailNotifications: features.enableEmailNotifications
  })
}