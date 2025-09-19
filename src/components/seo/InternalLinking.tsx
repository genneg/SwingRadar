'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface LinkItem {
  href: string
  text: string
  description?: string
  priority?: 'high' | 'medium' | 'low'
  category?: string
}

interface InternalLinkingProps {
  links?: LinkItem[]
  title?: string
  className?: string
  columns?: 2 | 3 | 4
  showDescriptions?: boolean
}

const defaultLinks: LinkItem[] = [
  // High Priority - Core Pages
  {
    href: '/search',
    text: 'Search Festivals',
    description: 'Find blues dance festivals worldwide',
    priority: 'high',
    category: 'search'
  },
  {
    href: '/teachers',
    text: 'Blues Teachers',
    description: 'Connect with master blues dance instructors',
    priority: 'high',
    category: 'people'
  },
  {
    href: '/musicians',
    text: 'Blues Musicians',
    description: 'Discover talented blues musicians and artists',
    priority: 'high',
    category: 'people'
  },
  {
    href: '/locations',
    text: 'Dance Locations',
    description: 'Explore major blues dance scenes worldwide',
    priority: 'high',
    category: 'locations'
  },

  // Medium Priority - Information
  {
    href: '/faq',
    text: 'FAQ',
    description: 'Answers to common blues dance questions',
    priority: 'medium',
    category: 'information'
  },
  {
    href: '/about',
    text: 'About Us',
    description: 'Learn about our mission and community',
    priority: 'medium',
    category: 'information'
  },
  {
    href: '/contact',
    text: 'Contact',
    description: 'Get in touch with our team',
    priority: 'medium',
    category: 'information'
  },

  // Additional Context Links
  {
    href: '/events',
    text: 'All Events',
    description: 'Browse complete list of blues dance events',
    priority: 'low',
    category: 'events'
  }
]

export default function InternalLinking({
  links = defaultLinks,
  title = 'Explore More',
  className = '',
  columns = 3,
  showDescriptions = true
}: InternalLinkingProps) {
  const pathname = usePathname()

  // Filter out current page and sort by priority
  const filteredLinks = links
    .filter(link => link.href !== pathname)
    .sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 }
      return (priorityOrder[b.priority || 'medium'] || 2) - (priorityOrder[a.priority || 'medium'] || 2)
    })

  // Group links by category
  const linksByCategory = filteredLinks.reduce((acc, link) => {
    const category = link.category || 'general'
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(link)
    return acc
  }, {} as Record<string, LinkItem[]>)

  return (
    <div className={`internal-linking ${className}`}>
      <div className="bg-navy-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gold-600/20">
        {title && (
          <h3 className="text-2xl font-bold text-gold-500 mb-6 jazz-font text-center">
            {title}
          </h3>
        )}

        {Object.entries(linksByCategory).map(([category, categoryLinks]) => (
          <div key={category} className="mb-6 last:mb-0">
            <h4 className="text-lg font-semibold text-gold-400 mb-3 capitalize">
              {category}
            </h4>
            <div className={`grid grid-cols-1 md:grid-cols-${columns} gap-4`}>
              {categoryLinks.map((link, index) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group block p-4 rounded-xl border border-gold-600/20 hover:border-gold-600/40 hover:bg-gold-600/5 transition-all duration-300 hover:shadow-lg hover:shadow-gold-600/10"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-2 h-2 bg-gold-600 rounded-full mt-2 group-hover:scale-125 transition-transform duration-300"></div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-cream-100 group-hover:text-gold-400 transition-colors duration-200 mb-1">
                        {link.text}
                      </div>
                      {showDescriptions && link.description && (
                        <div className="text-sm text-cream-300 group-hover:text-cream-200 transition-colors duration-200 line-clamp-2">
                          {link.description}
                        </div>
                      )}
                      <div className="text-xs text-gold-600 mt-2 font-medium">
                        {link.priority === 'high' ? 'Featured' :
                         link.priority === 'medium' ? 'Recommended' : 'Related'}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Component for contextual linking within content
interface ContextualLinksProps {
  currentPath: string
  maxLinks?: number
  className?: string
}

export function ContextualLinks({ currentPath, maxLinks = 4, className = '' }: ContextualLinksProps) {
  // Get relevant links based on current page
  const getRelevantLinks = (): LinkItem[] => {
    if (currentPath.includes('teachers')) {
      return [
        { href: '/musicians', text: 'Blues Musicians', description: 'Discover blues artists', priority: 'high' },
        { href: '/events', text: 'Upcoming Events', description: 'Find festivals with these teachers', priority: 'high' },
        { href: '/locations', text: 'Dance Locations', description: 'Where to learn blues dance', priority: 'medium' }
      ]
    }

    if (currentPath.includes('events') || currentPath.includes('search')) {
      return [
        { href: '/teachers', text: 'Find Teachers', description: 'Learn from the best instructors', priority: 'high' },
        { href: '/musicians', text: 'Live Music', description: 'Musicians at festivals', priority: 'high' },
        { href: '/locations', text: 'Popular Scenes', description: 'Top blues dance locations', priority: 'medium' }
      ]
    }

    if (currentPath.includes('locations')) {
      return [
        { href: '/search', text: 'Search Events', description: 'Festivals in these locations', priority: 'high' },
        { href: '/teachers', text: 'Local Teachers', description: 'Instructors by region', priority: 'high' }
      ]
    }

    return defaultLinks.slice(0, maxLinks)
  }

  const relevantLinks = getRelevantLinks().slice(0, maxLinks)

  return (
    <InternalLinking
      links={relevantLinks}
      title="Related Pages"
      className={className}
      columns={2}
      showDescriptions={true}
    />
  )
}

// Component for footer/internal navigation
export function QuickLinks({ className = '' }: { className?: string }) {
  const quickLinks = defaultLinks.filter(link => link.priority === 'high')

  return (
    <div className={`quick-links ${className}`}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-cream-200 hover:text-gold-400 transition-colors duration-200 text-sm font-medium"
          >
            {link.text}
          </Link>
        ))}
      </div>
    </div>
  )
}