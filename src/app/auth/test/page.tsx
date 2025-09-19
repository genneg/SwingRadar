'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import { useState } from 'react'

export default function AuthTestPage() {
  const { data: session, status } = useSession()
  const [testResult, setTestResult] = useState<any>(null)

  const testAuthConfig = async () => {
    try {
      const response = await fetch('/api/auth/test')
      const data = await response.json()
      setTestResult(data)
    } catch (error) {
      setTestResult({ error: error instanceof Error ? error.message : 'Unknown error' })
    }
  }

  if (status === 'loading') {
    return <div className="p-8">Loading...</div>
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Authentication Test</h1>
      
      <div className="space-y-6">
        {/* Session Status */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Session Status</h2>
          <div className="space-y-2">
            <p><strong>Status:</strong> {status}</p>
            {session ? (
              <div>
                <p><strong>User ID:</strong> {session.user.id}</p>
                <p><strong>Email:</strong> {session.user.email}</p>
                <p><strong>Name:</strong> {session.user.name}</p>
                <p><strong>Verified:</strong> {session.user.verified ? 'Yes' : 'No'}</p>
                <p><strong>Expires:</strong> {new Date(session.expires).toLocaleString()}</p>
              </div>
            ) : (
              <p>No active session</p>
            )}
          </div>
        </div>

        {/* Authentication Actions */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Authentication Actions</h2>
          <div className="space-x-4">
            {!session ? (
              <>
                <button
                  onClick={() => signIn('google')}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Sign in with Google
                </button>
                <button
                  onClick={() => signIn('facebook')}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Sign in with Facebook
                </button>
                <button
                  onClick={() => signIn('credentials')}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Sign in with Credentials
                </button>
              </>
            ) : (
              <button
                onClick={() => signOut()}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Sign Out
              </button>
            )}
          </div>
        </div>

        {/* Configuration Test */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Configuration Test</h2>
          <button
            onClick={testAuthConfig}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Test Auth Configuration
          </button>
          {testResult && (
            <div className="mt-4">
              <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
                {JSON.stringify(testResult, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}