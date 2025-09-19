// Authentication utilities and NextAuth.js configuration
import { getServerSession } from 'next-auth/next'
import { authOptions } from './config'
import bcrypt from 'bcryptjs'

// Re-export the configuration
export { authOptions } from './config'

// Server-side authentication utilities
export async function getSession() {
  return await getServerSession(authOptions)
}

export async function getCurrentUser() {
  const session = await getSession()
  return session?.user
}

export async function requireAuth() {
  const session = await getSession()
  if (!session?.user) {
    throw new Error('Authentication required')
  }
  return session.user
}

// Password utilities
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12
  return await bcrypt.hash(password, saltRounds)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword)
}

// Validation utilities
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePassword(password: string): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long')
  }
  
  if (!/(?=.*[a-z])/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }
  
  if (!/(?=.*[A-Z])/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }
  
  if (!/(?=.*\d)/.test(password)) {
    errors.push('Password must contain at least one number')
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

// URL utilities
export function getAuthUrl(provider: string, callbackUrl?: string): string {
  const params = new URLSearchParams({
    provider,
    ...(callbackUrl && { callbackUrl })
  })
  return `/api/auth/signin?${params}`
}

export function getSignUpUrl(callbackUrl?: string): string {
  const params = new URLSearchParams()
  if (callbackUrl) {
    params.set('callbackUrl', callbackUrl)
  }
  return `/auth/signup?${params}`
}

export function getSignInUrl(callbackUrl?: string): string {
  const params = new URLSearchParams()
  if (callbackUrl) {
    params.set('callbackUrl', callbackUrl)
  }
  return `/auth/signin?${params}`
}

// User creation utility
export async function createUserWithPassword(userData: {
  email: string
  password: string
  name?: string
}) {
  const { email, password, name } = userData

  // Validate inputs
  if (!validateEmail(email)) {
    throw new Error('Invalid email format')
  }

  const passwordValidation = validatePassword(password)
  if (!passwordValidation.isValid) {
    throw new Error(`Password validation failed: ${passwordValidation.errors.join(', ')}`)
  }

  // Hash password
  const hashedPassword = await hashPassword(password)

  // Create user with credentials account using direct PostgreSQL
  const { createUserWithCredentials, findUserByEmail } = await import('../db/postgres')

  try {
    // Check if user already exists
    const existingUser = await findUserByEmail(email)

    if (existingUser) {
      throw new Error('User with this email already exists')
    }

    // Create user with credentials account
    const user = await createUserWithCredentials(
      email,
      name || email.split('@')[0],
      hashedPassword
    )

    return user
  } catch (error) {
    console.error('Error creating user:', error)
    throw error
  }
}

// Auth configuration interface (legacy support)
export interface AuthConfig {
  providers: string[]
  pages: {
    signIn: string
    signUp: string
    error: string
  }
  callbacks: {
    redirect?: (url: string, baseUrl: string) => string
  }
}

export const authConfig: AuthConfig = {
  providers: ['google', 'facebook', 'credentials'],
  pages: {
    signIn: '/auth/signin',
    signUp: '/auth/signup',
    error: '/auth/error'
  },
  callbacks: {
    redirect: (url: string, baseUrl: string) => {
      // Redirect to dashboard after successful auth
      if (url.startsWith(baseUrl)) {
        return url
      }
      return `${baseUrl}/dashboard`
    }
  }
}