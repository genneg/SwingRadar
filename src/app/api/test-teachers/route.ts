import { NextRequest } from 'next/server'
import { db } from '@/lib/database'
import { apiResponse, apiError } from '@/lib/api/utils'

export async function GET(request: NextRequest) {
  try {
    console.log('Testing direct teacher query...')
    
    // Direct query without service
    const teachers = await db.teacher.findMany({
      take: 2,
      select: {
        id: true,
        name: true,
        bio: true
      }
    })
    
    console.log('Teachers found:', teachers.length)
    
    return apiResponse({
      message: 'Direct teacher query successful',
      count: teachers.length,
      teachers: teachers
    })
    
  } catch (error) {
    console.error('Direct teacher query error:', error)
    return apiError('Direct teacher query failed: ' + (error as Error).message)
  }
}