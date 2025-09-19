import { NextRequest } from 'next/server'
import { db } from '../../../../packages/database/src/index'

export async function GET(request: NextRequest) {
  try {
    // Simplest possible query
    const teachers = await db.teacher.findMany({
      take: 2
    })
    
    return Response.json({
      success: true,
      count: teachers.length,
      data: teachers
    })
    
  } catch (error) {
    console.error('Simple teachers error:', error)
    return Response.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}