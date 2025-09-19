'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AuthPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to signin page
    router.replace('/auth/signin')
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="text-navy-700 jazz-font text-lg">Redirecting to sign in...</div>
    </div>
  )
}