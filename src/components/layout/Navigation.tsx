'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { cn } from '@/lib/utils'

export interface NavItem {
  href: string
  label: string
  icon?: React.ReactNode
}

interface NavigationProps {
  items: NavItem[]
  orientation?: 'horizontal' | 'vertical'
  className?: string
}

export function Navigation({ items, orientation = 'horizontal', className }: NavigationProps) {
  const pathname = usePathname()

  const baseStyles = orientation === 'horizontal' 
    ? 'flex items-center space-x-6' 
    : 'flex flex-col space-y-2'

  return (
    <nav className={cn(baseStyles, className)}>
      {items.map((item) => {
        const isActive = pathname === item.href
        
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center space-x-2 text-sm font-medium transition-colors',
              orientation === 'horizontal' 
                ? 'hover:text-primary-600' 
                : 'px-3 py-2 rounded-lg hover:bg-gray-100',
              isActive 
                ? orientation === 'horizontal' 
                  ? 'text-primary-600 border-b-2 border-primary-600' 
                  : 'bg-primary-50 text-primary-600'
                : 'text-gray-600'
            )}
          >
            {item.icon && (
              <span className="w-4 h-4">{item.icon}</span>
            )}
            <span>{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}

// Common navigation configurations
export const mainNavItems: NavItem[] = [
  { href: '/', label: 'Home' },
  { href: '/events', label: 'Events' },
  { href: '/search', label: 'Search' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' }
]

export const dashboardNavItems: NavItem[] = [
  { 
    href: '/dashboard', 
    label: 'Dashboard',
    icon: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    )
  },
  { 
    href: '/dashboard/events', 
    label: 'My Events',
    icon: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    )
  },
  { 
    href: '/dashboard/following', 
    label: 'Following',
    icon: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    )
  },
  { 
    href: '/dashboard/settings', 
    label: 'Settings',
    icon: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )
  }
]