'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ProfileHeader } from '@/components/profile/ProfileHeader'
import { ProfileTabs } from '@/components/profile/ProfileTabs'
import { ProfileStats } from '@/components/profile/ProfileStats'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

export default function ProfilePage() {
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
        {/* Profile Header */}
        <Card className="mb-8">
          <ProfileHeader user={session.user} />
        </Card>

        {/* Profile Stats */}
        <Card className="mb-8">
          <ProfileStats userId={session.user.id} />
        </Card>

        {/* Profile Content Tabs */}
        <Card>
          <ProfileTabs userId={session.user.id} />
        </Card>
      </div>
    </div>
  )
}