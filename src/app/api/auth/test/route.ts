// Authentication test endpoint
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'

// Force dynamic runtime
export const dynamic = 'force-dynamic'

async function testDatabase() {
  try {
    const { db } = await import('../../../../../packages/database/src')

    // Test basic connectivity
    const userCount = await db.user.count()
    const accountCount = await db.account.count()

    // Test specific user
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

    return {
      connected: true,
      userCount,
      accountCount,
      testUser: testUser ? {
        id: testUser.id,
        email: testUser.email,
        name: testUser.name,
        verified: testUser.verified,
        hasCredentialsAccount: testUser.accounts.length > 0,
        credentialsAccountId: testUser.accounts[0]?.id || null
      } : null
    }
  } catch (error) {
    return {
      connected: false,
      error: error instanceof Error ? error.message : 'Unknown database error'
    }
  }
}

export async function GET(request: NextRequest) {
  try {
    // Test configuration
    const config = {
      providers: authOptions.providers.map(p => ({
        id: p.id,
        name: p.name,
        type: p.type
      })),
      session: {
        strategy: authOptions.session?.strategy,
        maxAge: authOptions.session?.maxAge
      },
      pages: authOptions.pages,
      features: {
        database: !!authOptions.adapter,
        jwt: !!authOptions.jwt,
        callbacks: !!authOptions.callbacks
      }
    }

    // Test session
    const session = await getServerSession(authOptions)

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      config,
      session: session ? {
        user: {
          id: session.user.id,
          email: session.user.email,
          name: session.user.name,
          verified: session.user.verified
        },
        expires: session.expires
      } : null,
      environment: {
        nodeEnv: process.env.NODE_ENV,
        nextAuthUrl: process.env.NEXTAUTH_URL,
        hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
        nextAuthSecretLength: process.env.NEXTAUTH_SECRET?.length || 0,
        hasGoogleOAuth: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
        hasFacebookOAuth: !!(process.env.FACEBOOK_CLIENT_ID && process.env.FACEBOOK_CLIENT_SECRET),
        hasDatabaseUrl: !!process.env.DATABASE_URL
      },
      database: await testDatabase()
    })

  } catch (error) {
    console.error('Auth test error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}