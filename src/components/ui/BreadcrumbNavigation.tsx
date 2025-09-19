'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BreadcrumbSchema } from '@/components/seo/SchemaMarkup'

interface BreadcrumbItem {
  name: string
  url: string
  current?: boolean
}

interface BreadcrumbNavigationProps {
  items?: BreadcrumbItem[]
  className?: string
  showHome?: boolean
  separator?: string
}

export default function BreadcrumbNavigation({
  items: propItems,
  className = '',
  showHome = true,
  separator = '/'
}: BreadcrumbNavigationProps) {
  const pathname = usePathname()

  // Generate breadcrumb items from pathname if not provided
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const segments = pathname.split('/').filter(Boolean)
    const breadcrumbs: BreadcrumbItem[] = []

    if (showHome) {
      breadcrumbs.push({
        name: 'Home',
        url: '/'
      })
    }

    segments.forEach((segment, index) => {
      const url = `/${segments.slice(0, index + 1).join('/')}`
      const name = formatSegmentName(segment)

      breadcrumbs.push({
        name,
        url,
        current: index === segments.length - 1
      })
    })

    return breadcrumbs
  }

  const items = propItems || generateBreadcrumbs()

  // Prepare items for schema
  const schemaItems = items.map(item => ({
    name: item.name,
    url: item.url
  }))

  return (
    <>
      <BreadcrumbSchema items={schemaItems} />

      <nav
        aria-label="Breadcrumb"
        className={`flex items-center space-x-2 text-sm ${className}`}
      >
        {items.map((item, index) => (
          <div key={item.url} className="flex items-center">
            {index > 0 && (
              <span className="mx-2 text-gold-600" aria-hidden="true">
                {separator}
              </span>
            )}

            {item.current ? (
              <span
                className="text-gold-500 font-semibold"
                aria-current="page"
              >
                {item.name}
              </span>
            ) : (
              <Link
                href={item.url}
                className="text-cream-200 hover:text-gold-500 transition-colors duration-200 font-medium"
              >
                {item.name}
              </Link>
            )}
          </div>
        ))}
      </nav>
    </>
  )
}

function formatSegmentName(segment: string): string {
  // Convert URL segments to readable names
  const nameMap: Record<string, string> = {
    'search': 'Search',
    'events': 'Events',
    'teachers': 'Teachers',
    'musicians': 'Musicians',
    'locations': 'Locations',
    'about': 'About',
    'contact': 'Contact',
    'faq': 'FAQ',
    'blog': 'Blog',
    'privacy': 'Privacy Policy',
    'terms': 'Terms of Service'
  }

  // Handle dynamic routes (IDs)
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(segment)) {
    return 'Details'
  }

  // Handle numbers (likely IDs)
  if (/^\d+$/.test(segment)) {
    return 'Details'
  }

  // Return mapped name or formatted segment
  return nameMap[segment.toLowerCase()] ||
    segment.charAt(0).toUpperCase() + segment.slice(1).replace(/[-_]/g, ' ')
}

// Helper hook for breadcrumb generation
export function useBreadcrumbs() {
  const pathname = usePathname()

  const generateBreadcrumbs = () => {
    const segments = pathname.split('/').filter(Boolean)
    const breadcrumbs: BreadcrumbItem[] = []

    breadcrumbs.push({
      name: 'Home',
      url: '/'
    })

    segments.forEach((segment, index) => {
      const url = `/${segments.slice(0, index + 1).join('/')}`
      const name = formatSegmentName(segment)

      breadcrumbs.push({
        name,
        url,
        current: index === segments.length - 1
      })
    })

    return breadcrumbs
  }

  return {
    breadcrumbs: generateBreadcrumbs(),
    pathname
  }
}