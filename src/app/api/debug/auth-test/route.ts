import { NextRequest, NextResponse } from 'next/server'
import { findUserByEmail } from '@/lib/db/postgres'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    console.log('Debug auth test: Starting authentication test for:', email)

    if (!email || !password) {
      return NextResponse.json({
        success: false,
        error: 'Missing email or password',
        step: 'validation'
      }, { status: 400 })
    }

    console.log('Debug auth test: Finding user by email...')

    // Test the same logic as NextAuth
    const user = await findUserByEmail(email)

    if (!user) {
      console.log('Debug auth test: No user found')
      return NextResponse.json({
        success: false,
        error: 'User not found',
        step: 'user_lookup'
      })
    }

    console.log('Debug auth test: User found:', user.email)

    // Find credentials account
    const credentialsAccount = user.accounts.find(
      account => account.provider === 'credentials'
    )

    if (!credentialsAccount?.password) {
      console.log('Debug auth test: No credentials account found')
      return NextResponse.json({
        success: false,
        error: 'No credentials account',
        step: 'credentials_lookup'
      })
    }

    console.log('Debug auth test: Credentials account found, verifying password...')

    // Verify password
    const passwordMatch = await bcrypt.compare(password, credentialsAccount.password)

    if (!passwordMatch) {
      console.log('Debug auth test: Password mismatch')
      return NextResponse.json({
        success: false,
        error: 'Password mismatch',
        step: 'password_verification'
      })
    }

    console.log('Debug auth test: Authentication successful!')

    return NextResponse.json({
      success: true,
      user: {
        id: user.id.toString(),
        email: user.email,
        name: user.name,
        verified: user.verified
      },
      step: 'complete'
    })

  } catch (error) {
    console.error('Debug auth test error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      step: 'exception'
    }, { status: 500 })
  }
}