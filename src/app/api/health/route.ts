import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const hasSecret = !!process.env.NEXTAUTH_SECRET
    const environment = process.env.NODE_ENV

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment,
      authentication: {
        secretConfigured: hasSecret,
        nextAuthUrl: process.env.NEXTAUTH_URL || 'auto-detected',
      }
    })
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      error: 'Health check failed',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}