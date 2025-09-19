'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { AlertCircle, Home, RefreshCw, ArrowLeft } from 'lucide-react'

const errorMessages = {
  configuration: 'There is a problem with the server configuration.',
  accessdenied: 'You do not have permission to sign in.',
  verification: 'The sign in link is no longer valid. It may have been used already or it may have expired.',
  default: 'An unexpected error occurred during authentication.'
}

function AuthErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error') as keyof typeof errorMessages || 'default'
  
  const getErrorMessage = () => {
    return errorMessages[error] || errorMessages.default
  }

  const getErrorTitle = () => {
    switch (error) {
      case 'configuration':
        return 'Server Configuration Error'
      case 'accessdenied':
        return 'Access Denied'
      case 'verification':
        return 'Invalid Sign In Link'
      default:
        return 'Authentication Error'
    }
  }

  const getErrorSuggestion = () => {
    switch (error) {
      case 'configuration':
        return 'Please contact support if this problem persists.'
      case 'accessdenied':
        return 'Please contact an administrator for access.'
      case 'verification':
        return 'Please request a new sign in link.'
      default:
        return 'Please try again or contact support if the problem persists.'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Error Icon */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-10 h-10 text-red-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">{getErrorTitle()}</h1>
          <p className="mt-2 text-gray-600">Something went wrong with your authentication</p>
        </div>

        {/* Error Details */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-red-800 mb-2">What happened?</h3>
              <p className="text-sm text-red-700">{getErrorMessage()}</p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-blue-800 mb-2">What can you do?</h3>
              <p className="text-sm text-blue-700">{getErrorSuggestion()}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 space-y-3">
            <Link
              href="/auth/signin"
              className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Try Sign In Again
            </Link>

            <Link
              href="/"
              className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              <Home className="w-4 h-4 mr-2" />
              Go to Homepage
            </Link>

            <button
              onClick={() => window.location.reload()}
              className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Page
            </button>
          </div>

          {/* Support Info */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Need help? Contact us at{' '}
              <a href="mailto:support@festivalscout.com" className="text-blue-600 hover:text-blue-500">
                support@festivalscout.com
              </a>
            </p>
            {error !== 'default' && (
              <p className="text-xs text-gray-400 mt-1">
                Error code: {error}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <AuthErrorContent />
    </Suspense>
  )
}