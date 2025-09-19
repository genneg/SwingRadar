'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { PreferencesForm } from '@/components/profile/PreferencesForm'
import { PasswordChangeForm } from '@/components/profile/PasswordChangeForm'
import { DangerZone } from '@/components/profile/DangerZone'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

export default function ProfileSettingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    )
  }

  if (!session?.user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-600 mt-2">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Navigation */}
        <div className="mb-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push('/profile')}
          >
            ← Back to Profile
          </Button>
        </div>

        <div className="space-y-8">
          {/* Preferences */}
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Preferences
              </h2>
              <PreferencesForm userId={session.user.id} />
            </div>
          </Card>

          {/* Password Change */}
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Change Password
              </h2>
              <PasswordChangeForm userId={session.user.id} />
            </div>
          </Card>

          {/* Danger Zone */}
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold text-red-600 mb-4">
                Danger Zone
              </h2>
              <DangerZone userId={session.user.id} />
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}