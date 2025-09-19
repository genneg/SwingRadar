'use client'

import { ReactNode } from 'react'
import { SwingCompassHeader } from './SwingCompassHeader'
import { BottomNavigationEnhanced } from './BottomNavigationEnhanced'
import { usePathname } from 'next/navigation'

interface SwingCompassLayoutProps {
  children: ReactNode
  showHeader?: boolean
  showBottomNav?: boolean
  showStyleNavigation?: boolean
  activeTab?: string
  onTabChange?: (tab: string) => void
  className?: string
}

export function SwingCompassLayout({
  children,
  showHeader = true,
  showBottomNav = true,
  showStyleNavigation = true,
  activeTab,
  onTabChange,
  className = ''
}: SwingCompassLayoutProps) {
  const pathname = usePathname()

  // Determine active tab from pathname if not provided
  const currentActiveTab = activeTab || (() => {
    if (pathname === '/') return 'home'
    if (pathname.startsWith('/search')) return 'search'
    if (pathname.startsWith('/dashboard')) return 'following'
    if (pathname.startsWith('/profile')) return 'profile'
    return 'home'
  })()

  return (
    <div className={`app-container ${className}`}>
      <div className="max-w-md mx-auto bg-background min-h-screen relative">
        {/* Header */}
        {showHeader && (
          <SwingCompassHeader
            currentPath={pathname}
            showStyleNavigation={showStyleNavigation}
          />
        )}

        {/* Main Content */}
        <main className={`content-wrapper ${showHeader ? 'pt-0' : ''} ${showBottomNav ? 'pb-20' : 'pb-6'}`}>
          {children}
        </main>

        {/* Bottom Navigation */}
        {showBottomNav && (
          <BottomNavigationEnhanced
            activeTab={currentActiveTab}
            onTabChange={onTabChange}
          />
        )}
      </div>
    </div>
  )
}