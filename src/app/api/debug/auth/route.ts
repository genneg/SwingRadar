// Debug endpoint for authentication issues
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

// Force dynamic runtime
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Test database connection
    const { db } = await import('../../../../../packages/database/src')

    // Test basic database connectivity
    const userCount = await db.user.count()
    const accountCount = await db.account.count()

    // Test specific user lookup
    const testUser = await db.user.findUnique({
      where: { email: 'test@swingradar.com' },
      include: {
        accounts: {
          where: {
            provider: 'credentials'
          }
        }
      }
    })

    // Test password hash verification
    let passwordTest = null
    if (testUser?.accounts[0]?.password) {
      passwordTest = {
        hasPassword: true,
        passwordLength: testUser.accounts[0].password.length,
        testResult: await bcrypt.compare('Test123!', testUser.accounts[0].password)
      }
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      database: {
        connected: true,
        userCount,
        accountCount
      },
      testUser: testUser ? {
        id: testUser.id,
        email: testUser.email,
        name: testUser.name,
        verified: testUser.verified,
        accountsCount: testUser.accounts.length,
        hasCredentialsAccount: testUser.accounts.length > 0
      } : null,
      passwordTest,
      environment: {
        nodeEnv: process.env.NODE_ENV,
        nextAuthUrl: process.env.NEXTAUTH_URL,
        hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
        secretLength: process.env.NEXTAUTH_SECRET?.length || 0,
        databaseUrl: process.env.DATABASE_URL ? 'configured' : 'missing'
      }
    })

  } catch (error) {
    console.error('Debug auth error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : null,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, email, password } = body

    if (action === 'test-registration') {
      // Test the registration logic
      const { createUserWithPassword } = await import('@/lib/auth')

      const result = await createUserWithPassword({
        email: email || 'test-debug@swingradar.com',
        password: password || 'Debug123!',
        name: 'Debug User'
      })

      return NextResponse.json({
        success: true,
        message: 'Registration test successful',
        userId: result.id,
        timestamp: new Date().toISOString()
      })
    }

    if (action === 'test-login') {
      // Test the login logic manually
      const { db } = await import('../../../../../packages/database/src')

      const user = await db.user.findUnique({
        where: { email: email || 'test@swingradar.com' },
        include: {
          accounts: {
            where: {
              provider: 'credentials'
            }
          }
        }
      })

      if (!user) {
        return NextResponse.json({
          success: false,
          error: 'User not found'
        }, { status: 404 })
      }

      const credentialsAccount = user.accounts.find(
        account => account.provider === 'credentials'
      )

      if (!credentialsAccount || !credentialsAccount.password) {
        return NextResponse.json({
          success: false,
          error: 'No credentials account found'
        }, { status: 400 })
      }

      const passwordMatch = await bcrypt.compare(
        password || 'Test123!',
        credentialsAccount.password
      )

      return NextResponse.json({
        success: true,
        message: 'Login test successful',
        passwordMatch,
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        },
        timestamp: new Date().toISOString()
      })
    }

    return NextResponse.json({
      success: false,
      error: 'Invalid action'
    }, { status: 400 })

  } catch (error) {
    console.error('Debug auth POST error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : null,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}