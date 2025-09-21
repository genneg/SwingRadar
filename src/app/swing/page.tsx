'use client'

import { Suspense, useEffect, useState } from 'react'
import { EventCard } from '@/components/features/EventCard'
import { Button } from '@/components/ui/Button'
import {
  ArtDecoLoader,
  VintageErrorState,
  VintageSkeleton,
  VintageEventCardSkeleton
} from '@/components/ui/VintageLoadingStates'
import { VintageApiError } from '@/hooks/useVintageApi'

interface SwingEvent {
  id: string
  name: string
  from_date: string
  to_date: string
  city: string
  country: string
  style?: string | null
  description?: string | null
  image_url?: string | null
  difficulty_level?: string | null
  event_types?: string[]
}

interface Teacher {
  id: string
  name: string
  bio?: string | null
  specialties?: string[]
  imageUrl?: string | null
}

function SwingEvents({ events }: { events: SwingEvent[] }) {
  if (!events || events.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">No swing events found at the moment.</p>
        <Button href="/events">View All Events</Button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <EventCard
          key={event.id}
          id={event.id}
          name={event.name}
          startDate={event.from_date}
          endDate={event.to_date}
          city={event.city}
          country={event.country}
          style={event.style}
          description={event.description}
          imageUrl={event.image_url}
          difficultyLevel={event.difficulty_level}
          eventTypes={event.event_types}
        />
      ))}
    </div>
  )
}

function SwingTeachers({ teachers }: { teachers: Teacher[] }) {
  if (!teachers || teachers.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">No swing teachers found at the moment.</p>
        <Button href="/teachers">View All Teachers</Button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {teachers.map((teacher) => (
        <div key={teacher.id} className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
          {teacher.imageUrl && (
            <img
              src={teacher.imageUrl}
              alt={teacher.name}
              className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
            />
          )}
          <h3 className="text-xl font-semibold mb-2">{teacher.name}</h3>
          <p className="text-gray-600 text-sm mb-4">{teacher.bio}</p>
          {teacher.specialties && teacher.specialties.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2">
              {teacher.specialties.map((specialty, index) => (
                <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  {specialty}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center py-12">
      <ArtDecoLoader />
    </div>
  )
}

export default function SwingPage() {
  const [swingEvents, setSwingEvents] = useState<SwingEvent[]>([])
  const [swingTeachers, setSwingTeachers] = useState<Teacher[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        setError(null)

        // Fetch events
        const eventsResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'https://swingradar.vercel.app'}/api/events?limit=6`)
        if (eventsResponse.ok) {
          const eventsData = await eventsResponse.json()
          if (eventsData.success && eventsData.data?.events) {
            const filteredEvents = eventsData.data.events
              .filter((event: any) =>
                event.dance_styles?.includes('swing') ||
                event.style?.toLowerCase().includes('swing') ||
                event.name?.toLowerCase().includes('lindy') ||
                event.name?.toLowerCase().includes('east coast') ||
                event.name?.toLowerCase().includes('charleston')
              )
              .slice(0, 6)
            setSwingEvents(filteredEvents)
          }
        }

        // Fetch teachers
        const teachersResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'https://swingradar.vercel.app'}/api/teachers?limit=4`)
        if (teachersResponse.ok) {
          const teachersData = await teachersResponse.json()
          if (teachersData.success && teachersData.data?.teachers) {
            const filteredTeachers = teachersData.data.teachers
              .filter((teacher: any) =>
                teacher.specializations?.includes('swing') ||
                teacher.bio?.toLowerCase().includes('swing') ||
                teacher.bio?.toLowerCase().includes('lindy')
              )
              .slice(0, 4)
            setSwingTeachers(filteredTeachers)
          }
        }
      } catch (err) {
        console.error('Error fetching data:', err)
        setError('Failed to load swing events and teachers')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
              Swing Dance Events
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover the best swing dance festivals, workshops, and socials worldwide
            </p>
          </div>
          <LoadingSpinner />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
              Swing Dance Events
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover the best swing dance festivals, workshops, and socials worldwide
            </p>
          </div>
          <VintageErrorState
            title="Unable to Load Events"
            message="We're having trouble loading our swing events. Please check back later."
            onRetry={() => window.location.reload()}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            Swing Dance Events
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover the best swing dance festivals, workshops, and socials worldwide
          </p>
        </div>

        <section className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Upcoming Swing Events</h2>
            <Button href="/events" variant="outline">
              View All Events
            </Button>
          </div>
          <Suspense fallback={<LoadingSpinner />}>
            <SwingEvents events={swingEvents} />
          </Suspense>
        </section>

        <section>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Swing Dance Teachers</h2>
            <Button href="/teachers" variant="outline">
              View All Teachers
            </Button>
          </div>
          <Suspense fallback={<LoadingSpinner />}>
            <SwingTeachers teachers={swingTeachers} />
          </Suspense>
        </section>
      </div>
    </div>
  )
}