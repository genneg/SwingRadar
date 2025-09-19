// Database package entry point
// Exports Prisma client and database utilities

import { PrismaClient } from './generated'

// Global Prisma client instance
declare global {
  var __prisma: PrismaClient | undefined
}

// Create singleton Prisma client
export const db = globalThis.__prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})

if (process.env.NODE_ENV !== 'production') {
  globalThis.__prisma = db
}

// Re-export Prisma client and types
export { PrismaClient } from './generated'
export type {
  Event,
  Teacher,
  Musician,
  User,
  Account,
  UserPreferences,
  SavedSearch,
  UserFollowTeacher,
  UserFollowMusician,
  UserFollowEvent,
  UserNotification,
  ExternalEventTeacher,
  ExternalEventVenue,
  event_musicians,
  event_prices,
  social_media,
} from './generated'

// Export utility functions
// export * from './utils'
// export * from './seed'

// Export enhanced models and schemas  
// export * from './models'
// export * from './schemas'

// Database configuration
export const databaseVersion = '1.0.0'

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