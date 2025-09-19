import { NextRequest } from 'next/server'
import { db } from '@/lib/database'
import { apiResponse, apiError } from '@/lib/api/utils'

export async function GET(request: NextRequest) {
  try {
    // Test simple database connection
    const result = await db.$queryRaw`SELECT COUNT(*)::int as count FROM events`
    
    return apiResponse({
      message: 'Database connection successful',
      result: result
    })
    
  } catch (error) {
    console.error('Database connection error:', error)
    return apiError('Database connection failed: ' + (error as Error).message)
  }
}