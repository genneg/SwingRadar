'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { cn } from '@/lib/utils'

interface BreadcrumbItem {
  label: string
  href?: string
  current?: boolean
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[]
  className?: string
  showHome?: boolean
}

export function Breadcrumb({ items, className, showHome = true }: BreadcrumbProps) {
  const pathname = usePathname()
  
  // Auto-generate breadcrumbs from pathname if no items provided
  const breadcrumbItems = items || generateBreadcrumbItems(pathname)
  
  if (breadcrumbItems.length <= 1 && pathname === '/') {
    return null // Don't show breadcrumbs on homepage
  }

  return (
    <nav className={cn('flex', className)} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-4">
        {showHome && (
          <li>
            <div>
              <Link href="/" className="text-gray-400 hover:text-gray-500 transition-colors">
                <svg className="h-5 w-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M9.293 2.293a1 1 0 011.414 0l7 7A1 1 0 0117 11h-1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-3a1 1 0 00-1-1H9a1 1 0 00-1 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-6H3a1 1 0 01-.707-1.707l7-7z" clipRule="evenodd" />
                </svg>
                <span className="sr-only">Home</span>
              </Link>
            </div>
          </li>
        )}
        
        {breadcrumbItems.map((item, index) => (
          <li key={item.href || item.label}>
            <div className="flex items-center">
              {(showHome || index > 0) && (
                <svg
                  className="h-5 w-5 flex-shrink-0 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              )}
              
              {item.href && !item.current ? (
                <Link
                  href={item.href}
                  className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={cn(
                    'ml-4 text-sm font-medium',
                    item.current ? 'text-gray-900' : 'text-gray-500'
                  )}
                  aria-current={item.current ? 'page' : undefined}
                >
                  {item.label}
                </span>
              )}
            </div>
          </li>
        ))}
      </ol>
    </nav>
  )
}

// Helper function to generate breadcrumbs from pathname
function generateBreadcrumbItems(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean)
  const items: BreadcrumbItem[] = []
  
  let currentPath = ''
  
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`
    const isLast = index === segments.length - 1
    
    // Map common paths to readable labels
    const label = getSegmentLabel(segment, currentPath)
    
    items.push({
      label,
      href: isLast ? undefined : currentPath,
      current: isLast
    })
  })
  
  return items
}

// Map URL segments to readable labels
function getSegmentLabel(segment: string, fullPath: string): string {
  // Handle dynamic routes and IDs
  if (segment.length > 20 || /^[a-f0-9-]{36}$/.test(segment)) {
    // Probably an ID, try to get a more meaningful label
    if (fullPath.includes('/events/')) return 'Event Details'
    if (fullPath.includes('/teachers/')) return 'Teacher Profile'
    if (fullPath.includes('/musicians/')) return 'Musician Profile'
    return 'Details'
  }
  
  // Common path mappings
  const pathMappings: Record<string, string> = {
    'events': 'Events',
    'teachers': 'Teachers',
    'musicians': 'Musicians',
    'search': 'Search',
    'dashboard': 'Dashboard',
    'profile': 'Profile',
    'settings': 'Settings',
    'following': 'Following',
    'about': 'About',
    'contact': 'Contact',
    'auth': 'Authentication',
    'signin': 'Sign In',
    'signup': 'Sign Up',
    'help': 'Help Center'
  }
  
  return pathMappings[segment] || capitalize(segment)
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).replace(/[-_]/g, ' ')
}

// Pre-built breadcrumb configurations for common pages
export const commonBreadcrumbs = {
  events: [
    { label: 'Events', href: '/events' }
  ],
  eventDetails: (eventName?: string) => [
    { label: 'Events', href: '/events' },
    { label: eventName || 'Event Details', current: true }
  ],
  teacherProfile: (teacherName?: string) => [
    { label: 'Search', href: '/search' },
    { label: teacherName || 'Teacher Profile', current: true }
  ],
  musicianProfile: (musicianName?: string) => [
    { label: 'Search', href: '/search' },
    { label: musicianName || 'Musician Profile', current: true }
  ],
  dashboard: [
    { label: 'Dashboard', current: true }
  ],
  dashboardEvents: [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'My Events', current: true }
  ],
  dashboardFollowing: [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Following', current: true }
  ],
  profile: [
    { label: 'Profile', current: true }
  ],
  profileSettings: [
    { label: 'Profile', href: '/profile' },
    { label: 'Settings', current: true }
  ],
  search: [
    { label: 'Search', current: true }
  ],
  about: [
    { label: 'About', current: true }
  ],
  contact: [
    { label: 'Contact', current: true }
  ]
}

// Example usage with custom items:
// <Breadcrumb items={commonBreadcrumbs.eventDetails("Blues Weekend Berlin")} />

// Example usage with auto-generation:
// <Breadcrumb /> // Will auto-generate based on current pathname