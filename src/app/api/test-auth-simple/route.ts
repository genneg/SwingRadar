// Simple authentication test endpoint
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Test basic database import
    const { db } = await import('../../../../packages/database/src')

    // Test basic user count
    const userCount = await db.user.count()

    // Test specific user
    const testUser = await db.user.findUnique({
      where: { email: 'test@swingradar.com' }
    })

    return NextResponse.json({
      success: true,
      environment: {
        hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
        hasDbUrl: !!process.env.DATABASE_URL
      },
      database: {
        userCount,
        hasTestUser: !!testUser
      },
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}