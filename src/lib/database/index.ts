// Database utilities
import { PrismaClient } from 'packages/database/src/generated'

// Re-export PrismaClient
export { PrismaClient }

export interface DatabaseConfig {
  url: string
  maxConnections: number
  ssl: boolean
}

export const dbConfig: DatabaseConfig = {
  url: process.env.DATABASE_URL || '',
  maxConnections: 10,
  ssl: process.env.NODE_ENV === 'production'
}

// Connection helper
export async function connectDB() {
  // TODO: Initialize Prisma client
  console.log('Database connection initialized')
}

// Transaction helper
export async function withTransaction<T>(
  callback: (tx: any) => Promise<T>
): Promise<T> {
  // TODO: Implement with Prisma transaction
  try {
    const result = await callback(null)
    return result
  } catch (error) {
    console.error('Transaction failed:', error)
    throw error
  }
}

// Query helpers
export function buildWhereClause(filters: Record<string, any>) {
  const where: Record<string, any> = {}
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (typeof value === 'string' && value.includes('%')) {
        where[key] = { contains: value.replace(/%/g, ''), mode: 'insensitive' }
      } else {
        where[key] = value
      }
    }
  })
  
  return where
}

export function buildPagination(page = 1, limit = 10) {
  const skip = (page - 1) * limit
  return { skip, take: limit }
}

// Cache helpers
export function getCacheKey(prefix: string, params: Record<string, any>) {
  const sortedParams = Object.keys(params)
    .sort()
    .reduce((result, key) => {
      result[key] = params[key]
      return result
    }, {} as Record<string, any>)
  
  return `${prefix}:${JSON.stringify(sortedParams)}`
}