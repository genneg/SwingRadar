'use client'

import { SessionProvider } from 'next-auth/react'
import { ReactNode } from 'react'


interface AuthProviderProps {
  children: ReactNode
  session?: unknown
}

/**
 * NextAuth.js Session Provider wrapper with optimized settings for session persistence
 * This component provides authentication context to the entire app
 */
export function AuthProvider({ children, session }: AuthProviderProps) {
  return (
    <SessionProvider
      session={session}
      refetchInterval={10 * 60} // Refetch every 10 minutes (reduced frequency)
      refetchOnWindowFocus={true} // Refresh session when window gains focus
      refetchWhenOffline={false} // Don't refetch when offline
      // Ensure session persists across page reloads and tab switches
      basePath="/api/auth"
    >
      {children}
    </SessionProvider>
  )
}
