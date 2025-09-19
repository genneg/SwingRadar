'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import AuthForm from '@/components/auth/AuthForm'
import { CheckCircle, XCircle, User, Mail, Shield } from 'lucide-react'

export default function AuthTestPage() {
  const { user, loading, signOut, isAuthenticated } = useAuth()
  const [testResults, setTestResults] = useState<{
    signin: boolean | null
    signup: boolean | null
    oauth: boolean | null
  }>({
    signin: null,
    signup: null,
    oauth: null
  })

  const handleSignIn = async (data: any) => {
    try {
      // This would normally be handled by the AuthForm
      setTestResults(prev => ({ ...prev, signin: true }))
    } catch (error) {
      setTestResults(prev => ({ ...prev, signin: false }))
    }
  }

  const handleSignUp = async (data: any) => {
    try {
      // This would normally be handled by the AuthForm
      setTestResults(prev => ({ ...prev, signup: true }))
    } catch (error) {
      setTestResults(prev => ({ ...prev, signup: false }))
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Authentication UI Test Page</h1>
          <p className="text-gray-600">
            This page is for testing the authentication UI components and flows.
          </p>
        </div>

        {/* Authentication Status */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Authentication Status</h2>
          
          {isAuthenticated ? (
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-green-600">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Authenticated</span>
              </div>
              
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <User className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-green-800">User Information</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-green-600" />
                    <span className="text-green-700">Email: {user?.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-green-600" />
                    <span className="text-green-700">Name: {user?.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-green-600" />
                    <span className="text-green-700">
                      Verified: {user?.verified ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => signOut()}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-3 text-red-600">
              <XCircle className="w-5 h-5" />
              <span className="font-medium">Not Authenticated</span>
            </div>
          )}
        </div>

        {/* Test Results */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Test Results</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">Sign In Test</h3>
              <div className="flex items-center space-x-2">
                {testResults.signin === null ? (
                  <span className="text-gray-500">Not tested</span>
                ) : testResults.signin ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-green-600">Passed</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-red-600" />
                    <span className="text-red-600">Failed</span>
                  </>
                )}
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">Sign Up Test</h3>
              <div className="flex items-center space-x-2">
                {testResults.signup === null ? (
                  <span className="text-gray-500">Not tested</span>
                ) : testResults.signup ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-green-600">Passed</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-red-600" />
                    <span className="text-red-600">Failed</span>
                  </>
                )}
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">OAuth Test</h3>
              <div className="flex items-center space-x-2">
                {testResults.oauth === null ? (
                  <span className="text-gray-500">Not tested</span>
                ) : testResults.oauth ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-green-600">Passed</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-red-600" />
                    <span className="text-red-600">Failed</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Auth Forms */}
        {!isAuthenticated && (
          <div className="grid md:grid-cols-2 gap-8">
            {/* Sign In Form */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Sign In Form Test</h2>
              <AuthForm
                mode="signin"
                onSubmit={handleSignIn}
              />
            </div>

            {/* Sign Up Form */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Sign Up Form Test</h2>
              <AuthForm
                mode="signup"
                onSubmit={handleSignUp}
              />
            </div>
          </div>
        )}

        {/* Navigation Links */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Test Navigation</h2>
          <div className="space-y-2">
            <a
              href="/auth/signin"
              className="block text-blue-600 hover:text-blue-500"
            >
              → Go to Sign In Page
            </a>
            <a
              href="/auth/signup"
              className="block text-blue-600 hover:text-blue-500"
            >
              → Go to Sign Up Page
            </a>
            <a
              href="/auth/forgot-password"
              className="block text-blue-600 hover:text-blue-500"
            >
              → Go to Forgot Password Page
            </a>
            <a
              href="/auth/error"
              className="block text-blue-600 hover:text-blue-500"
            >
              → Go to Auth Error Page
            </a>
            <a
              href="/auth/verify"
              className="block text-blue-600 hover:text-blue-500"
            >
              → Go to Verify Page
            </a>
            <a
              href="/auth/welcome"
              className="block text-blue-600 hover:text-blue-500"
            >
              → Go to Welcome Page
            </a>
            <a
              href="/dashboard"
              className="block text-blue-600 hover:text-blue-500"
            >
              → Go to Dashboard
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}