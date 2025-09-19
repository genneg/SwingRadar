// Test login without database dependency
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Simulate test user validation without database
    if (email === 'test@swingradar.com') {
      // Test password hash for 'Test123!'
      const testPasswordHash = '$2a$10$rJZZgZqZJZzJZzJZzJZzJu.rJZZgZqZJZzJZzJZzJZzJZzJZzJZzJ'
      const isValidPassword = password === 'Test123!'

      return NextResponse.json({
        success: true,
        message: 'Login test successful (no database)',
        user: {
          email: 'test@swingradar.com',
          name: 'Test User',
          id: 'test-id'
        },
        passwordValid: isValidPassword,
        nextAuthConfig: {
          url: process.env.NEXTAUTH_URL,
          hasSecret: !!process.env.NEXTAUTH_SECRET,
          secretLength: process.env.NEXTAUTH_SECRET?.length || 0
        },
        timestamp: new Date().toISOString()
      })
    }

    return NextResponse.json({
      success: false,
      error: 'Invalid credentials'
    }, { status: 401 })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}