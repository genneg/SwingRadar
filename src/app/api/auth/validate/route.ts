import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'

import { authOptions } from '@/lib/auth/config'

export async function GET(_request: NextRequest) {
  try {
    // Get the current session
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({
        success: false,
        message: 'No active session found',
        session: null,
      })
    }

    // Validate session structure
    const validation = {
      hasUser: !!session.user,
      hasUserId: !!session.user?.id,
      hasEmail: !!session.user?.email,
      hasName: !!session.user?.name,
      hasVerified: session.user?.verified !== undefined,
      hasExpires: !!session.expires,
      isValid: !!session.user && !!session.user?.id && !!session.expires,
    }

    return NextResponse.json({
      success: true,
      message: 'Session validation completed',
      session: {
        user: {
          id: session.user?.id,
          email: session.user?.email,
          name: session.user?.name,
          verified: session.user?.verified,
        },
        expires: session.expires,
      },
      validation,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Session validation error:', error)
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
    const { token } = body

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error: 'Token is required',
        },
        { status: 400 }
      )
    }

    // For now, we'll just validate the token format
    // In a real implementation, you would decode and validate the JWT
    const isValidFormat = typeof token === 'string' && token.length > 0

    return NextResponse.json({
      success: true,
      message: 'Token format validation completed',
      token: {
        format: isValidFormat ? 'valid' : 'invalid',
        length: token?.length ?? 0,
        preview: token ? `${token.substring(0, 10)}...` : null,
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Token validation error:', error)
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
