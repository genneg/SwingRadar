import { NextRequest, NextResponse } from 'next/server'

import { authOptions } from '@/lib/auth/config'
import { testConnectionDetailed } from '@/lib/db/postgres'

export async function GET(_request: NextRequest) {
  try {
    // Test database connection
    const dbResult = await testConnectionDetailed()

    // Check environment variables
    const envCheck = {
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'Present' : 'Missing',
      NEXTAUTH_URL: process.env.NEXTAUTH_URL ?? 'Not set',
      DATABASE_URL: process.env.DATABASE_URL ? 'Present' : 'Missing',
      NODE_ENV: process.env.NODE_ENV ?? 'Not set',
    }

    // Check NextAuth configuration
    const authCheck = {
      secret: authOptions.secret ? 'Present' : 'Missing',
      providers: authOptions.providers?.length ?? 0,
      sessionStrategy: authOptions.session?.strategy ?? 'Not set',
      debugMode: authOptions.debug ?? false,
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      database: dbResult,
      environment: envCheck,
      authentication: authCheck,
      message: 'Authentication system diagnostics completed',
    })
  } catch (error) {
    console.error('Auth debug endpoint error:', error)
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action } = body

    switch (action) {
      case 'test-registration':
        // Test user creation
        const { createUserWithCredentials } = await import('@/lib/db/postgres')
        const testUser = await createUserWithCredentials(
          'test@example.com',
          'Test User',
          'hashedpassword123'
        )
        return NextResponse.json({
          success: true,
          action: 'test-registration',
          user: testUser,
          message: 'Test user created successfully',
        })

      case 'test-login':
        // Test user lookup
        const { findUserByEmail } = await import('@/lib/db/postgres')
        const user = await findUserByEmail('test@swingradar.com')
        return NextResponse.json({
          success: true,
          action: 'test-login',
          user: user,
          message: 'User lookup completed',
        })

      default:
        return NextResponse.json(
          {
            success: false,
            error: 'Unknown action',
            availableActions: ['test-registration', 'test-login'],
          },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Auth debug POST error:', error)
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
