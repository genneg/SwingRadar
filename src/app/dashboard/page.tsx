'use client'

import { useRouter } from 'next/navigation'
import { useSession, getSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

import DashboardLayout from '@/components/dashboard/DashboardLayout'
import { PersonalizedDashboard } from '@/components/dashboard/PersonalizedDashboard'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isVerifying, setIsVerifying] = useState(true)
  const [verificationAttempts, setVerificationAttempts] = useState(0)

  useEffect(() => {
    const MAX_VERIFICATION_ATTEMPTS = 3
    const VERIFICATION_DELAY = 1500 // 1.5 seconds

    const verifySession = async () => {
      try {
        // Force a fresh session check
        const freshSession = await getSession()

        if (freshSession?.user) {
          setIsVerifying(false)
          return
        }

        // No session found, try again up to max attempts
        if (verificationAttempts < MAX_VERIFICATION_ATTEMPTS) {
          setVerificationAttempts(prev => prev + 1)
          setTimeout(verifySession, VERIFICATION_DELAY)
        } else {
          // Max attempts reached, redirect to signin
          setIsVerifying(false)
          setTimeout(() => {
            router.push('/auth/signin')
          }, 1000)
        }
      } catch (error) {
        console.error('Session verification failed:', error)
        setVerificationAttempts(prev => prev + 1)
      }
    }

    // If we already have a session, no need to verify
    if (session?.user) {
      setIsVerifying(false)
      return
    }

    // If definitely unauthenticated, redirect after brief delay
    if (status === 'unauthenticated') {
      setTimeout(() => {
        router.push('/auth/signin')
      }, 1000)
      return
    }

    // If still loading, start verification process
    if (status === 'loading' && verificationAttempts === 0) {
      setTimeout(verifySession, VERIFICATION_DELAY)
    }
  }, [session, status, router, verificationAttempts])

  // Show loading state while checking session or verifying
  if (status === 'loading' || isVerifying) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-navy-900 via-primary-900 to-primary-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-600 mx-auto" />
          <div className="space-y-2">
            <p className="text-gold-600 jazz-font text-lg">
              {verificationAttempts > 0 ? 'Verifying your session...' : 'Loading your dashboard...'}
            </p>
            {verificationAttempts > 0 && (
              <p className="text-gray-400 text-sm">
                Attempt {verificationAttempts} of 3
              </p>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Only render dashboard if we have a valid session
  if (session?.user) {
    return (
      <DashboardLayout>
        <PersonalizedDashboard />
      </DashboardLayout>
    )
  }

  // Fallback - should not normally reach here
  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-900 via-primary-900 to-primary-950 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-600 mx-auto mb-4" />
        <p className="text-gray-100 jazz-font">Redirecting...</p>
      </div>
    </div>
  )
}
