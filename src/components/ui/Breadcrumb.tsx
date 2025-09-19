'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, Home } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BreadcrumbItem {
  label: string
  href: string
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[]
  className?: string
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  const pathname = usePathname()
  
  // Auto-generate breadcrumbs based on pathname if no items provided
  const breadcrumbItems = items || generateBreadcrumbs(pathname)
  
  if (breadcrumbItems.length <= 1) {
    return null // Don't show breadcrumbs for home page or single level
  }

  return (
    <nav 
      className={cn(
        "flex items-center space-x-2 px-4 py-3 text-sm bg-navy-900/50 backdrop-blur-md border-b border-gold-600/20",
        className
      )}
      aria-label="Breadcrumb"
    >
      <ol className="flex items-center space-x-2">
        {breadcrumbItems.map((item, index) => (
          <li key={item.href} className="flex items-center space-x-2">
            {index > 0 && (
              <ChevronRight className="w-4 h-4 text-gold-600/60" />
            )}
            
            {index === 0 ? (
              <Link 
                href={item.href}
                className="flex items-center space-x-1 text-gold-600 hover:text-gold-500 transition-colors duration-200"
              >
                <Home className="w-4 h-4" />
                <span className="font-vintage text-xs tracking-wide uppercase">
                  {item.label}
                </span>
              </Link>
            ) : index === breadcrumbItems.length - 1 ? (
              <span className="font-vintage text-xs tracking-wide uppercase text-cream-200 font-semibold">
                {item.label}
              </span>
            ) : (
              <Link 
                href={item.href}
                className="font-vintage text-xs tracking-wide uppercase text-cream-300 hover:text-gold-600 transition-colors duration-200"
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean)
  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', href: '/' }
  ]
  
  let currentPath = ''
  
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`
    
    // Convert segment to readable label
    const label = formatSegmentLabel(segment, segments, index)
    
    breadcrumbs.push({
      label,
      href: currentPath
    })
  })
  
  return breadcrumbs
}

function formatSegmentLabel(segment: string, segments: string[], index: number): string {
  // Handle special routes
  const routeLabels: Record<string, string> = {
    'search': 'Search',
    'events': 'Events',
    'festivals': 'Festivals', 
    'teachers': 'Teachers',
    'musicians': 'Musicians',
    'dashboard': 'Dashboard',
    'profile': 'Profile',
    'settings': 'Settings',
    'following': 'Following',
    'auth': 'Authentication',
    'signin': 'Sign In',
    'signup': 'Sign Up',
    'about': 'About',
    'contact': 'Contact'
  }
  
  // Check if it's a predefined route
  if (routeLabels[segment]) {
    return routeLabels[segment]
  }
  
  // Handle dynamic routes (IDs, slugs)
  if (segment.match(/^[0-9]+$/) || segment.length > 20) {
    // Look at the previous segment for context
    const prevSegment = index > 0 ? segments[index - 1] : ''
    
    if (prevSegment === 'events' || prevSegment === 'festivals') {
      return 'Festival Details'
    } else if (prevSegment === 'teachers') {
      return 'Teacher Profile'
    } else if (prevSegment === 'musicians') {
      return 'Musician Profile'
    }
    
    return 'Details'
  }
  
  // Default: capitalize and replace hyphens with spaces
  return segment
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

// Preset breadcrumb configurations for common pages
export const BreadcrumbPresets = {
  eventDetails: (eventName: string): BreadcrumbItem[] => [
    { label: 'Home', href: '/' },
    { label: 'Events', href: '/events' },
    { label: eventName, href: '' } // Empty href for current page
  ],
  
  teacherProfile: (teacherName: string): BreadcrumbItem[] => [
    { label: 'Home', href: '/' },
    { label: 'Teachers', href: '/teachers' },
    { label: teacherName, href: '' }
  ],
  
  searchResults: (query?: string): BreadcrumbItem[] => [
    { label: 'Home', href: '/' },
    { label: query ? `Search: "${query}"` : 'Search', href: '' }
  ],
  
  dashboard: (section?: string): BreadcrumbItem[] => {
    const items = [
      { label: 'Home', href: '/' },
      { label: 'Dashboard', href: '/dashboard' }
    ]
    
    if (section) {
      items.push({ label: section, href: '' })
    }
    
    return items
  }
}