'use client'

import { AlertCircle, Eye, EyeOff, Lock, Mail } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { useState } from 'react'


// Metadata is handled in the layout.tsx file

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
    // Clear error when user starts typing
    if (error) {
      setError('')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // Use NextAuth with manual redirect handling for better debugging
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false
      })

      console.log('SignIn result:', result)

      if (result?.ok && !result?.error) {
        // Authentication successful, verify session was created
        console.log('Authentication successful, verifying session...')

        // Wait a moment for session to be established
        await new Promise(resolve => setTimeout(resolve, 1000))

        // Try to verify the session was actually created
        try {
          const sessionResponse = await fetch('/api/auth/session')
          const session = await sessionResponse.json()
          console.log('Session verification:', session)

          if (session && Object.keys(session).length > 0) {
            // Session exists, safe to redirect
            console.log('Session confirmed, redirecting to dashboard')
            router.push('/dashboard')
          } else {
            // Session not created, force retry with exponential backoff
            console.log('Session not found, retrying...')
            let retryCount = 0
            const maxRetries = 3

            const retryAuth = async (): Promise<void> => {
              if (retryCount >= maxRetries) {
                setError('Authentication completed but session could not be established. Please try refreshing the page.')
                return
              }

              retryCount++
              console.log(`Retry attempt ${retryCount}/${maxRetries}`)

              // Wait with exponential backoff
              await new Promise(resolve => setTimeout(resolve, 1000 * retryCount))

              // Check session again
              const retrySessionResponse = await fetch('/api/auth/session')
              const retrySession = await retrySessionResponse.json()
              console.log(`Retry ${retryCount} session:`, retrySession)

              if (retrySession && Object.keys(retrySession).length > 0) {
                console.log('Session established on retry, redirecting')
                router.push('/dashboard')
              } else {
                // Try again
                return retryAuth()
              }
            }

            await retryAuth()
          }
        } catch (sessionError) {
          console.error('Session verification error:', sessionError)
          // If session verification fails, still attempt redirect
          router.push('/dashboard')
        }
      } else {
        // Authentication failed
        setError(result?.error === 'CredentialsSignin'
          ? 'Invalid email or password'
          : result?.error || 'Authentication failed. Please try again.')
      }
    } catch (err: unknown) {
      console.error('Login error:', err)

      // Handle browser extension interference
      const error = err as Error
      if (error.message?.includes('message channel closed') ||
          error.message?.includes('asynchronous response')) {
        setError('Browser extension interference detected. Please disable ad-blockers and try again.')
      } else {
        setError('An unexpected error occurred. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialSignIn = async (provider: 'google' | 'facebook') => {
    setIsLoading(true)
    setError('')

    try {
      await signIn(provider, {
        callbackUrl: '/dashboard',
      })
      // NextAuth will handle the redirect automatically
    } catch (err: unknown) {
      console.error('Social sign in error:', err)
      const error = err as Error
      if (error.message?.includes('message channel closed')) {
        setError('Browser extension interference detected. Please disable ad-blockers and try again.')
      } else {
        setError('Social sign in failed. Please try again.')
      }
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Social Login Buttons */}
      <div className="space-y-3">
        <button
          onClick={() => handleSocialSignIn('google')}
          disabled={isLoading}
          className="w-full flex items-center justify-center px-4 py-3 border border-navy-300 rounded-lg hover:bg-gold-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          <span className="text-navy-900 font-medium">Continue with Google</span>
        </button>

        <button
          onClick={() => handleSocialSignIn('facebook')}
          disabled={isLoading}
          className="w-full flex items-center justify-center px-4 py-3 bg-[#1877F2] text-white rounded-lg hover:bg-[#166FE5] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
          <span className="font-medium">Continue with Facebook</span>
        </button>
      </div>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gold-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-cream-50 text-navy-700 jazz-font">Or continue with email</span>
        </div>
      </div>

      {/* Email/Password Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-navy-700 mb-2">
            Email address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-navy-400" />
            </div>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              className="appearance-none block w-full pl-10 pr-3 py-3 border border-gold-300 rounded-lg placeholder-navy-400 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent bg-white/50"
              placeholder="Enter your email"
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-navy-700 mb-2">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-navy-400" />
            </div>
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              required
              value={formData.password}
              onChange={handleInputChange}
              className="appearance-none block w-full pl-10 pr-10 py-3 border border-gold-300 rounded-lg placeholder-navy-400 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent bg-white/50"
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-navy-400" />
              ) : (
                <Eye className="h-5 w-5 text-navy-400" />
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-gold-600 focus:ring-gold-500 border-gold-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-navy-700">
              Remember me
            </label>
          </div>
          <Link
            href="/auth/forgot-password"
            className="text-sm text-gold-600 hover:text-gold-500 jazz-font"
          >
            Forgot your password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-navy-900 bg-gold-600 hover:bg-gold-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors vintage-button"
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      {/* Sign Up Link */}
      <div className="text-center">
        <p className="text-sm text-navy-700">
          Don't have an account?{' '}
          <Link
            href="/auth/signup"
            className="font-medium text-gold-600 hover:text-gold-500 jazz-font"
          >
            Sign up for free
          </Link>
        </p>
      </div>
    </div>
  )
}
