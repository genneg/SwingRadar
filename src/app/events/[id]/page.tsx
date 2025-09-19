'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { EventDetails } from '@/components/features/EventDetails'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Festival } from '@/types'
import { EventSchema, OrganizationSchema, WebsiteSchema } from '@/components/seo/SchemaMarkup'
import BreadcrumbNavigation from '@/components/ui/BreadcrumbNavigation'

export default function EventDetailPage() {
  const params = useParams()
  const [event, setEvent] = useState<Festival | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/events/${params.id}`)
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Event not found')
          }
          throw new Error('Failed to load event')
        }
        
        const apiResponse = await response.json()
        
        if (!apiResponse.success) {
          throw new Error(apiResponse.error || 'Failed to load event')
        }
        
        const eventData = apiResponse.data
        
        // Convert date strings to Date objects
        const processedEvent: Festival = {
          ...eventData,
          startDate: new Date(eventData.startDate),
          endDate: new Date(eventData.endDate),
          registrationDeadline: eventData.registrationDeadline 
            ? new Date(eventData.registrationDeadline) 
            : undefined,
        }
        
        setEvent(processedEvent)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id) {
      fetchEvent()
    }
  }, [params.id])

  if (isLoading) {
    return (
      <div className="app-container">
        <div className="max-w-md mx-auto bg-background min-h-screen relative flex items-center justify-center">
          <div className="text-center">
            <LoadingSpinner className="mx-auto mb-6" />
            <p className="text-white text-lg font-medium">Loading event details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="app-container">
        <div className="max-w-md mx-auto bg-background min-h-screen relative flex items-center justify-center">
          <div className="text-center">
            <div className="card p-8 border-error-600/30 bg-error-900/20 max-w-md">
              <svg className="w-16 h-16 text-error-400 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" />
              </svg>
              <h2 className="text-2xl font-bold text-error-300 mb-4">
                {error === 'Event not found' ? 'Event Not Found' : 'Error Loading Event'}
              </h2>
              <p className="text-error-200 mb-6 font-medium">{error}</p>
              <a href="/events" className="btn-error inline-flex items-center">
                ← Back to Events
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!event) {
    return null
  }

  return (
    <div className="app-container">
      <div className="max-w-4xl mx-auto bg-background min-h-screen relative">
        <div className="content-wrapper">
          {/* Enhanced Breadcrumb Navigation */}
          {event && (
            <BreadcrumbNavigation
              items={[
                { name: 'Home', url: '/' },
                { name: 'Events', url: '/events' },
                { name: event.name, url: `/events/${event.id}`, current: true }
              ]}
              className="mb-6"
            />
          )}

          {/* Enhanced Schema Markup for SEO */}
          <EventSchema
            event={{
              name: event.name,
              description: event.description,
              startDate: event.startDate.toISOString(),
              endDate: event.endDate.toISOString(),
              location: {
                city: event.city,
                country: event.country,
                address: event.venue?.address,
                name: event.venue?.name
              },
              imageUrl: event.imageUrl || event.image,
              url: `https://blues-festival-finder.vercel.app/events/${event.id}`,
              organizer: {
                name: event.venue?.name || `${event.city} Blues Festival`,
                url: event.website
              },
              offers: event.prices?.map(price => {
                // Handle both string and number amounts safely
                let amount = null
                if (price && typeof price === 'object') {
                  if ('amount' in price) {
                    amount = typeof price.amount === 'string'
                      ? parseFloat(price.amount.replace(/[^0-9.]/g, ''))
                      : price.amount
                  } else if ('price' in price) {
                    amount = typeof price.price === 'string'
                      ? parseFloat(price.price.replace(/[^0-9.]/g, ''))
                      : price.price
                  }
                }
                return {
                  price: amount !== null && !isNaN(amount) ? amount : 0,
                  currency: price.currency || 'EUR',
                  availability: "InStock"
                }
              }),
              performers: [
                ...event.teachers.map(teacher => ({
                  name: teacher.name,
                  type: "Person"
                })),
                ...event.musicians.map(musician => ({
                  name: musician.name,
                  type: "Person"
                }))
              ]
            }}
          />
          <OrganizationSchema />
          <WebsiteSchema />

          <EventDetails event={event} />
        </div>
      </div>
    </div>
  )
}