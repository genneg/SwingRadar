// Standard Prisma client for production use
import { PrismaClient } from '@prisma/client'

// Global Prisma client instance
declare global {
  var __prisma: PrismaClient | undefined
}

// Configure database URL with connection pooling
function getDatabaseUrl() {
  // Use direct URL for connection pooling if available (Supabase pooler)
  const directUrl = process.env.DIRECT_URL
  const url = process.env.DATABASE_URL
  
  if (!url) {
    throw new Error('DATABASE_URL environment variable is not set')
  }

  // For production/serverless environments, use pooler if available
  if ((process.env.NODE_ENV === 'production' || process.env.VERCEL) && directUrl) {
    return directUrl
  }
  
  // For production/serverless environments, optimize for Supabase pooling
  if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
    const urlObj = new URL(url)
    
    // Convert to pooler URL if it's a direct Supabase connection
    if (urlObj.hostname.includes('supabase.co') && !urlObj.hostname.includes('pooler')) {
      // Replace db.xxx.supabase.co with aws-0-xxx.pooler.supabase.com
      const projectRef = urlObj.hostname.split('.')[1]
      urlObj.hostname = `aws-0-${projectRef}.pooler.supabase.com`
      urlObj.port = '6543' // Supabase pooler port
    }
    
    // Add connection pool parameters
    if (!urlObj.searchParams.has('pgbouncer')) {
      urlObj.searchParams.set('pgbouncer', 'true')
    }
    if (!urlObj.searchParams.has('connection_limit')) {
      urlObj.searchParams.set('connection_limit', '1')  // Single connection for serverless
    }
    if (!urlObj.searchParams.has('pool_timeout')) {
      urlObj.searchParams.set('pool_timeout', '20')
    }
    
    return urlObj.toString()
  }
  
  return url
}

// Create singleton Prisma client with optimized settings
export const db = globalThis.__prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error'] : ['error'], // Reduced logging
  datasources: {
    db: {
      url: getDatabaseUrl(),
    },
  },
  // Optimize for serverless
  __internal: {
    engine: {
      queryEngineTimeout: 30000,
    },
  },
})

if (process.env.NODE_ENV !== 'production') {
  globalThis.__prisma = db
}

// Connection helpers
export async function connectDatabase() {
  try {
    await db.$connect()
    console.log('Database connected successfully')
  } catch (error) {
    console.error('Database connection failed:', error)
    throw error
  }
}

export async function disconnectDatabase() {
  try {
    await db.$disconnect()
    console.log('Database disconnected successfully')
  } catch (error) {
    console.error('Database disconnection failed:', error)
    throw error
  }
}

// Health check
export async function checkDatabaseHealth() {
  try {
    await db.$queryRaw`SELECT 1`
    return { status: 'healthy', timestamp: new Date() }
  } catch (error) {
    return { status: 'unhealthy', error: error instanceof Error ? error.message : 'Unknown error', timestamp: new Date() }
  }
}