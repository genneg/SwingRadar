'use client'

import { useSession, signIn as nextAuthSignIn, signOut as nextAuthSignOut } from 'next-auth/react'
import { useState } from 'react'

// User interface based on NextAuth session
interface User {
  id: string
  email: string
  name: string
  image?: string
  verified?: boolean
}

interface AuthState {
  user: User | null
  loading: boolean
  error: string | null
}

interface SignInResult {
  success: boolean
  error?: string
}

interface SignUpResult {
  success: boolean
  error?: string
  details?: string[]
}

/**
 * Custom hook for authentication state management with NextAuth.js
 */
export function useAuth() {
  const { data: session, status } = useSession()
  const [error, setError] = useState<string | null>(null)

  // Convert session to our auth state format
  const authState: AuthState = {
    user: session?.user ? {
      id: session.user.id,
      email: session.user.email!,
      name: session.user.name!,
      image: session.user.image || undefined,
      verified: session.user.verified
    } : null,
    loading: status === 'loading',
    error
  }

  /**
   * Sign in with email and password
   */
  const signIn = async (email: string, password: string, callbackUrl?: string): Promise<SignInResult> => {
    setError(null)
    
    try {
      const result = await nextAuthSignIn('credentials', {
        email,
        password,
        redirect: false,
        callbackUrl: callbackUrl || '/dashboard'
      })

      if (result?.error) {
        setError(result.error)
        return { success: false, error: result.error }
      }

      return { success: true }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sign in failed'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  /**
   * Sign in with OAuth provider
   */
  const signInWithProvider = async (provider: 'google' | 'facebook', callbackUrl?: string): Promise<SignInResult> => {
    setError(null)
    
    try {
      const result = await nextAuthSignIn(provider, {
        redirect: false,
        callbackUrl: callbackUrl || '/dashboard'
      })

      if (result?.error) {
        setError(result.error)
        return { success: false, error: result.error }
      }

      return { success: true }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : `${provider} sign in failed`
      setError(errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  /**
   * Sign out current user
   */
  const signOut = async (callbackUrl?: string): Promise<void> => {
    setError(null)
    
    try {
      await nextAuthSignOut({
        redirect: false,
        callbackUrl: callbackUrl || '/'
      })
    } catch (error) {
      console.error('Sign out error:', error)
      // Force sign out locally even if API call fails
    }
  }

  /**
   * Register new user with email and password
   */
  const signUp = async (name: string, email: string, password: string): Promise<SignUpResult> => {
    setError(null)
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      })

      const data = await response.json()

      if (response.ok) {
        return { success: true }
      } else {
        setError(data.error)
        return { 
          success: false, 
          error: data.error,
          details: data.details 
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  /**
   * Clear any authentication errors
   */
  const clearError = () => {
    setError(null)
  }

  /**
   * Check if user has specific role or permission
   */
  const hasRole = (role: string): boolean => {
    // TODO: Implement role checking when roles are added to user model
    return false
  }

  /**
   * Check if user is verified
   */
  const isVerified = (): boolean => {
    return authState.user?.verified || false
  }

  return {
    ...authState,
    signIn,
    signInWithProvider,
    signOut,
    signUp,
    clearError,
    hasRole,
    isVerified,
    isAuthenticated: !!authState.user,
    isLoading: authState.loading
  }
}