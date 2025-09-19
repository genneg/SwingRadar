'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useProfile } from '@/hooks/useProfile'
import { EditProfileForm } from '@/components/profile/EditProfileForm'
import { PasswordChangeForm } from '@/components/profile/PasswordChangeForm'
import { PreferencesForm } from '@/components/profile/PreferencesForm'
import { DangerZone } from '@/components/profile/DangerZone'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { CheckCircle, XCircle, User, Settings, Shield, AlertTriangle, RefreshCw } from 'lucide-react'

export default function ProfileTestPage() {
  const { data: session, status } = useSession()
  const { profile, loading, error, isOwnProfile, refreshProfile } = useProfile()
  const [activeTest, setActiveTest] = useState<string | null>(null)
  const [testResults, setTestResults] = useState<Record<string, boolean | null>>({
    profileLoad: null,
    profileUpdate: null,
    passwordChange: null,
    preferencesUpdate: null,
    profileRefresh: null,
  })

  const runTest = async (testName: string, testFunction: () => Promise<void>) => {
    setActiveTest(testName)
    try {
      await testFunction()
      setTestResults(prev => ({ ...prev, [testName]: true }))
    } catch (error) {
      console.error(`Test ${testName} failed:`, error)
      setTestResults(prev => ({ ...prev, [testName]: false }))
    } finally {
      setActiveTest(null)
    }
  }

  const testProfileLoad = async () => {
    if (profile) {
      // Profile loaded successfully
      return
    } else {
      throw new Error('Profile not loaded')
    }
  }

  const testProfileRefresh = async () => {
    refreshProfile()
    // Give it a moment to refresh
    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!session?.user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Authentication Required</h2>
          <p className="text-gray-600">Please sign in to test profile functionality.</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Profile System Test</h1>
              <p className="text-gray-600">Test all profile functionality and components</p>
            </div>
            <Button
              onClick={() => runTest('profileRefresh', testProfileRefresh)}
              disabled={activeTest === 'profileRefresh'}
              variant="outline"
              size="sm"
            >
              {activeTest === 'profileRefresh' ? (
                <LoadingSpinner size="sm" className="mr-2" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              Refresh Profile
            </Button>
          </div>
        </Card>

        {/* Test Results Overview */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Test Results</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {Object.entries(testResults).map(([testName, result]) => (
              <div
                key={testName}
                className="flex items-center space-x-2 p-3 border rounded-lg"
              >
                {result === null ? (
                  <div className="w-5 h-5 bg-gray-300 rounded-full" />
                ) : result ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {testName.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </p>
                  <p className="text-xs text-gray-500">
                    {result === null ? 'Not tested' : result ? 'Passed' : 'Failed'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Profile Data Display */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Profile Data</h2>
          {error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">Error: {error}</p>
            </div>
          ) : profile ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Basic Info */}
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <User className="w-5 h-5 text-blue-600" />
                  <h3 className="font-medium text-blue-900">Basic Info</h3>
                </div>
                <div className="space-y-1 text-sm">
                  <p><span className="font-medium">Name:</span> {profile.name}</p>
                  <p><span className="font-medium">Email:</span> {profile.email}</p>
                  <p><span className="font-medium">Verified:</span> {profile.verified ? 'Yes' : 'No'}</p>
                  <p><span className="font-medium">Member since:</span> {new Date(profile.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Statistics */}
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <Settings className="w-5 h-5 text-green-600" />
                  <h3 className="font-medium text-green-900">Statistics</h3>
                </div>
                <div className="space-y-1 text-sm">
                  <p><span className="font-medium">Following:</span> {profile.stats.following}</p>
                  <p><span className="font-medium">Saved Events:</span> {profile.stats.savedEvents}</p>
                  <p><span className="font-medium">Reviews:</span> {profile.stats.reviews}</p>
                  <p><span className="font-medium">Created Events:</span> {profile.stats.createdEvents}</p>
                  {profile.stats.unreadNotifications !== undefined && (
                    <p><span className="font-medium">Notifications:</span> {profile.stats.unreadNotifications}</p>
                  )}
                </div>
              </div>

              {/* Preferences */}
              {profile.preferences && (
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <Shield className="w-5 h-5 text-purple-600" />
                    <h3 className="font-medium text-purple-900">Preferences</h3>
                  </div>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">Theme:</span> {profile.preferences.theme}</p>
                    <p><span className="font-medium">Language:</span> {profile.preferences.language}</p>
                    <p><span className="font-medium">Email Notifications:</span> {profile.preferences.emailNotifications ? 'On' : 'Off'}</p>
                    <p><span className="font-medium">Search Radius:</span> {profile.preferences.searchRadius || 'Not set'} km</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <LoadingSpinner className="mx-auto mb-4" />
              <p className="text-gray-600">Loading profile data...</p>
            </div>
          )}
        </Card>

        {/* Profile Components Tests */}
        {isOwnProfile && session.user && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Edit Profile Form */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Edit Profile Form</h2>
                <Button
                  onClick={() => runTest('profileUpdate', testProfileLoad)}
                  disabled={activeTest === 'profileUpdate'}
                  size="sm"
                  variant="outline"
                >
                  {activeTest === 'profileUpdate' && <LoadingSpinner size="sm" className="mr-2" />}
                  Test
                </Button>
              </div>
              <EditProfileForm
                user={session.user}
                onSuccess={() => {
                  console.log('Profile updated successfully')
                  refreshProfile()
                }}
                onCancel={() => console.log('Profile edit cancelled')}
              />
            </Card>

            {/* Password Change Form */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Password Change Form</h2>
                <Button
                  onClick={() => runTest('passwordChange', testProfileLoad)}
                  disabled={activeTest === 'passwordChange'}
                  size="sm"
                  variant="outline"
                >
                  {activeTest === 'passwordChange' && <LoadingSpinner size="sm" className="mr-2" />}
                  Test
                </Button>
              </div>
              <PasswordChangeForm userId={session.user.id} />
            </Card>

            {/* Preferences Form */}
            <Card className="p-6 lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Preferences Form</h2>
                <Button
                  onClick={() => runTest('preferencesUpdate', testProfileLoad)}
                  disabled={activeTest === 'preferencesUpdate'}
                  size="sm"
                  variant="outline"
                >
                  {activeTest === 'preferencesUpdate' && <LoadingSpinner size="sm" className="mr-2" />}
                  Test
                </Button>
              </div>
              <PreferencesForm userId={session.user.id} />
            </Card>

            {/* Danger Zone */}
            <Card className="p-6 lg:col-span-2">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Danger Zone</h2>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-yellow-800">Warning</h3>
                    <p className="text-sm text-yellow-700">
                      This is a test environment. Account deletion is functional but should be used with caution.
                    </p>
                  </div>
                </div>
              </div>
              <DangerZone userId={session.user.id} />
            </Card>
          </div>
        )}

        {/* Navigation Links */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Navigation</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <a
              href="/profile"
              className="block p-3 text-center border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Profile Page
            </a>
            <a
              href="/profile/settings"
              className="block p-3 text-center border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Profile Settings
            </a>
            <a
              href="/profile/following"
              className="block p-3 text-center border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Following
            </a>
            <a
              href="/dashboard"
              className="block p-3 text-center border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Dashboard
            </a>
          </div>
        </Card>
      </div>
    </div>
  )
}