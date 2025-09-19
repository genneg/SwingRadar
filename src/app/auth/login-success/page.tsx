'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession, getSession } from 'next-auth/react'
import { CheckCircle, Loader2, AlertTriangle } from 'lucide-react'

export default function LoginSuccessPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [retryCount, setRetryCount] = useState(0)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const MAX_RETRIES = 5
    const INITIAL_DELAY = 2000 // 2 seconds initial delay
    const RETRY_DELAY = 1000 // 1 second between retries

    // Enhanced session detection with exponential backoff
    const checkSession = async () => {
      try {
        // Force refresh the session
        const freshSession = await getSession()

        if (freshSession?.user) {
          setIsChecking(false)
          setTimeout(() => {
            router.push('/dashboard')
          }, 500)
          return
        }

        // No session found, increment retry count
        if (retryCount < MAX_RETRIES) {
          setRetryCount(prev => prev + 1)

          // Schedule next retry with exponential backoff
          setTimeout(() => {
            checkSession()
          }, RETRY_DELAY * Math.pow(1.5, retryCount))
        } else {
          // Too many retries, redirect to signin
          setIsChecking(false)
          setTimeout(() => {
            router.push('/auth/signin')
          }, 2000)
        }
      } catch (error) {
        console.error('Session check failed:', error)
        setRetryCount(prev => prev + 1)
      }
    }

    // If we already have a session, redirect immediately
    if (session?.user) {
      setIsChecking(false)
      setTimeout(() => {
        router.push('/dashboard')
      }, 500)
      return
    }

    // Start checking after initial delay
    const initialTimer = setTimeout(() => {
      checkSession()
    }, INITIAL_DELAY)

    return () => clearTimeout(initialTimer)
  }, [session, router, retryCount])

  const handleManualRetry = () => {
    setRetryCount(0)
    setIsChecking(true)
    // Trigger a page reload to restart the process
    window.location.reload()
  }

  const getStatusInfo = () => {
    if (session?.user || !isChecking) {
      return {
        icon: <CheckCircle className="w-8 h-8 text-navy-900" />,
        title: 'Login Successful!',
        message: 'Welcome back! Redirecting you to your dashboard...',
        showProgress: true
      }
    }

    if (retryCount >= 5) {
      return {
        icon: <AlertTriangle className="w-8 h-8 text-navy-900" />,
        title: 'Session Check Failed',
        message: 'Unable to verify your session. Redirecting to sign in...',
        showProgress: false
      }
    }

    return {
      icon: <Loader2 className="w-8 h-8 text-navy-900 animate-spin" />,
      title: 'Verifying Login...',
      message: `Please wait while we verify your authentication${retryCount > 0 ? ` (attempt ${retryCount + 1}/5)` : ''}...`,
      showProgress: true
    }
  }

  const statusInfo = getStatusInfo()

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-900 via-primary-900 to-primary-950 flex items-center justify-center">
      <div className="text-center space-y-6">
        <div className="space-y-4">
          <div className="mx-auto flex items-center justify-center w-16 h-16 bg-gold-600 rounded-full">
            {statusInfo.icon}
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-gold-600 jazz-font">
              {statusInfo.title}
            </h1>
            <p className="text-gray-300 max-w-md mx-auto">
              {statusInfo.message}
            </p>
          </div>
        </div>

        {statusInfo.showProgress && (
          <div className="space-y-2">
            <div className="w-64 bg-navy-700 rounded-full h-2 mx-auto">
              <div
                className="bg-gold-600 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${Math.min(100, (retryCount + 1) * 20)}%` }}
              />
            </div>
            <p className="text-sm text-gray-400">
              This should only take a moment...
            </p>
          </div>
        )}

        {retryCount >= 5 && (
          <button
            onClick={handleManualRetry}
            className="mt-4 px-6 py-3 bg-gold-600 text-navy-900 rounded-lg hover:bg-gold-500 transition-colors font-medium"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  )
}