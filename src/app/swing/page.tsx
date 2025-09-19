import type { Metadata } from 'next'
import Link from 'next/link'
import { generateMetadata } from '@/components/seo/SEOMetadata'
import { EventCard } from '@/components/features/EventCard'
import { Button } from '@/components/ui/Button'
import {
  ArtDecoLoader,
  VintageErrorState,
  VintageSkeleton,
  VintageEventCardSkeleton
} from '@/components/ui/VintageLoadingStates'
import { VintageApiError } from '@/hooks/useVintageApi'
import { DanceStyle, getDanceStyleConfig } from '@/lib/types/dance'

export const metadata: Metadata = generateMetadata({
  title: 'Swing Dance Events - Lindy Hop, East Coast Swing & Charleston Festivals',
  description: 'Discover the best swing dance events worldwide. Find Lindy Hop festivals, East Coast Swing workshops, and Charleston socials. Your precision radar for authentic swing dance culture.',
  keywords: [
    'swing dance events',
    'lindy hop festivals',
    'east coast swing',
    'charleston dance',
    'swing dance workshops',
    'swing dance socials',
    'swing dance competitions',
    'vintage swing events',
    'swing radar',
    'swing dance teachers',
    'swing dance festivals 2025'
  ],
  ogUrl: '/swing'
})

// Types for API responses
interface Festival {
  id: string
  name: string
  city: string
  country: string
  startDate: string
  endDate: string
  imageUrl?: string | null
  image?: string | null
  prices?: Array<{
    amount: number
    currency: string
    type: string
  }>
  venue?: {
    name: string | null
    city: string
    country: string
  } | null
  style: string | null
  dance_styles: string[]
  description?: string
  teachers?: Array<{
    id: string
    name: string
  }>
  musicians?: Array<{
    id: string
    name: string
  }>
  website?: string
}

interface Teacher {
  id: string
  name: string
  bio?: string | null
  specialties?: string[]
  imageUrl?: string | null
}

async function getSwingEvents() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/events?limit=6`, {
      next: { revalidate: 3600 } // Revalidate every hour
    })

    if (!response.ok) {
      throw new Error('Failed to fetch swing events')
    }

    const data = await response.json()

    if (data.success && data.data && data.data.events) {
      // Filter for swing-related events
      const swingEvents = data.data.events.filter((event: any) =>
        event.dance_styles?.includes('swing') ||
        event.style?.toLowerCase().includes('swing') ||
        event.name?.toLowerCase().includes('lindy') ||
        event.name?.toLowerCase().includes('east coast') ||
        event.name?.toLowerCase().includes('charleston')
      )

      return swingEvents.slice(0, 6)
    }

    return []
  } catch (error) {
    console.error('Error fetching swing events:', error)
    return []
  }
}

async function getSwingTeachers() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/teachers?limit=4`, {
      next: { revalidate: 3600 } // Revalidate every hour
    })

    if (!response.ok) {
      throw new Error('Failed to fetch swing teachers')
    }

    const data = await response.json()

    if (data.success && data.data && data.data.teachers) {
      // Filter for swing-related teachers
      const swingTeachers = data.data.teachers.filter((teacher: any) =>
        teacher.specializations?.includes('swing') ||
        teacher.bio?.toLowerCase().includes('swing') ||
        teacher.bio?.toLowerCase().includes('lindy')
      )

      return swingTeachers.slice(0, 4)
    }

    return []
  } catch (error) {
    console.error('Error fetching swing teachers:', error)
    return []
  }
}

export default async function SwingPage() {
  const swingConfig = getDanceStyleConfig('swing')
  const [swingEvents, swingTeachers] = await Promise.all([
    getSwingEvents(),
    getSwingTeachers()
  ])

  return (
    <div className="app-container">
      <div className="max-w-md mx-auto bg-background min-h-screen relative">
        <div className="content-wrapper">
          {/* Hero Section */}
          <div className="hero-section vintage-spotlight relative overflow-hidden rounded-2xl p-6 md:p-8 mb-6">
            <div className="hero-overlay vintage-pattern"></div>

            {/* Art Deco Corner Decorations */}
            <div className="art-deco-corner absolute top-4 left-4 w-6 h-6 z-20"></div>
            <div className="art-deco-corner absolute bottom-4 right-4 w-6 h-6 z-20" style={{transform: 'rotate(180deg)'}}></div>

            <div className="relative z-10 text-center">
              <div className="text-6xl mb-4">{swingConfig.icon}</div>
              <h1 className="font-jazz text-4xl md:text-5xl mb-4 text-gradient-gold leading-tight font-bold">
                {swingConfig.displayName} Dance
              </h1>
              <p className="text-cream-100 text-lg leading-relaxed max-w-2xl mx-auto font-medium">
                The energetic heart of the swing era. From Lindy Hop to East Coast Swing, discover the rhythm that defined a generation and continues to inspire dancers worldwide.
              </p>

              {/* Key Characteristics */}
              <div className="flex flex-wrap justify-center gap-3 mt-6">
                <div className="px-3 py-1 rounded-full bg-emerald-800/50 border border-emerald-400/30 text-emerald-400 text-sm font-medium">
                  🎷 Swing Era
                </div>
                <div className="px-3 py-1 rounded-full bg-emerald-800/50 border border-emerald-400/30 text-emerald-400 text-sm font-medium">
                  💃 Energetic
                </div>
                <div className="px-3 py-1 rounded-full bg-emerald-800/50 border border-emerald-400/30 text-emerald-400 text-sm font-medium">
                  🎵 Jazz Music
                </div>
                <div className="px-3 py-1 rounded-full bg-emerald-800/50 border border-emerald-400/30 text-emerald-400 text-sm font-medium">
                  🤝 Partner Dance
                </div>
              </div>
            </div>
          </div>

          {/* Introduction */}
          <div className="card p-6 mb-6">
            <h2 className="font-jazz text-3xl text-emerald-600 mb-4">
              The Spirit of Swing
            </h2>
            <p className="text-cream-200 leading-relaxed mb-4">
              Swing dance emerged in the late 1920s in Harlem, New York, as African American dancers created new moves to accompany the exciting jazz music of the era. Characterized by its energetic, improvisational nature and emphasis on musicality, swing dance encompasses several styles including Lindy Hop, East Coast Swing, and Charleston.
            </p>
            <p className="text-cream-200 leading-relaxed">
              Whether you're drawn to the acrobatic aerials of Lindy Hop or the accessible rhythms of East Coast Swing, swing dance offers something for every dancer. Our radar system helps you find the perfect swing events and teachers to match your style and skill level.
            </p>
          </div>

          {/* Featured Events */}
          <div className="space-y-8 mb-6">
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="h-px bg-gradient-to-r from-transparent via-emerald-600 to-transparent flex-1"></div>
                <div className="mx-4 w-3 h-3 bg-emerald-600 rounded-full animate-vintage-bounce"></div>
                <div className="h-px bg-gradient-to-r from-transparent via-emerald-600 to-transparent flex-1"></div>
              </div>
              <h3 className="font-jazz text-4xl font-bold text-emerald-600 mb-2">
                Featured Swing Events
              </h3>
              <p className="text-cream-200 text-lg font-medium">Discover the best swing dance festivals and workshops</p>
            </div>

            <div className="space-y-6">
              {swingEvents.length > 0 ? (
                swingEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="vintage-radar-icon w-16 h-16 mx-auto mb-6 relative">
                    <div className="w-16 h-16 bg-gradient-to-b from-emerald-600 to-emerald-700 rounded-full mx-auto relative border-4 border-emerald-500">
                      <div className="absolute inset-2 bg-gradient-to-b from-emerald-400 to-emerald-500 rounded-full opacity-50"></div>
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-8 bg-emerald-300 rounded-full animate-radar-sweep"></div>
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-45 w-1 h-6 bg-emerald-300 rounded-full opacity-60"></div>
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-90 w-1 h-6 bg-emerald-300 rounded-full opacity-40"></div>
                    </div>
                  </div>
                  <h3 className="jazz-font text-xl text-emerald-400 mb-3">
                    Swing Events Loading...
                  </h3>
                  <p className="vintage-text text-cream-200 mb-4">
                    Our swing dance radar is scanning for exciting events and festivals. Check back soon for new discoveries!
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* CTA Section */}
          <div className="card p-6 text-center">
            <h2 className="font-jazz text-2xl text-gradient-emerald mb-4">
              🎷 Ready to Swing?
            </h2>
            <p className="text-cream-200 mb-6">
              Join thousands of swing dancers who use SwingRadar to discover events, connect with teachers, and immerse themselves in swing dance culture.
            </p>
            <div className="space-y-3">
              <Link href="/search?danceStyles=swing">
                <button className="btn-primary w-full">
                  📡 Detect Swing Events
                </button>
              </Link>
              <Link href="/swing-dance-guide">
                <button className="btn-secondary w-full">
                  📖 Learn Swing Dance Styles
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}