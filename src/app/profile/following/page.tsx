import { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth/config'
import { FollowingManagement } from '@/components/features/FollowingManagement'

export const metadata: Metadata = {
  title: 'Following Management - Blues Dance Festival Finder',
  description: 'Manage your followed teachers, musicians, and festivals'
}

export default async function FollowingPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    redirect('/auth/signin')
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <FollowingManagement userId={session.user.id} />
    </div>
  )
}