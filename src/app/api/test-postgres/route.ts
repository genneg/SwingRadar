// Test direct PostgreSQL connection
import { NextRequest, NextResponse } from 'next/server'

import { findUserByEmail, testConnectionDetailed } from '@/lib/db/postgres'

export const dynamic = 'force-dynamic'

export async function GET(_request: NextRequest) {
  try {
    // Test detailed connection
    const detailedResult = await testConnectionDetailed()

    if (!detailedResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: detailedResult.error,
          details: detailedResult.details,
          timestamp: new Date().toISOString(),
        },
        { status: 500 }
      )
    }

    // Test user lookup
    const testUser = await findUserByEmail('test@swingradar.com')

    return NextResponse.json({
      success: true,
      message: 'PostgreSQL connection successful',
      connectionDetails: detailedResult.details,
      testUser: testUser
        ? {
            id: testUser.id,
            email: testUser.email,
            name: testUser.name,
            verified: testUser.verified,
            accountsCount: testUser.accounts.length,
            hasCredentialsAccount: testUser.accounts.some(acc => acc.provider === 'credentials'),
          }
        : null,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('PostgreSQL test error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}
