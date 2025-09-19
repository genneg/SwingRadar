'use client'

import { useEffect, useState } from 'react'
import { Calendar, MapPin, ExternalLink } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/Button'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

interface SavedEventsTabProps {
  userId: string
}

interface SavedEvent {
  createdAt: string
  event: {
    id: string
    name: string
    slug: string
    startDate: string
    imageUrl: string | null
    venue?: {
      city: string
      country: string
    }
  }
}

export function SavedEventsTab({ userId }: SavedEventsTabProps) {
  const [savedEvents, setSavedEvents] = useState<SavedEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSavedEvents = async () => {
      try {
        const response = await fetch(`/api/users/me`)
        const data = await response.json()
        
        if (data.success) {
          setSavedEvents(data.data.recentActivity.savedEvents || [])
        } else {
          setError(data.error || 'Failed to load saved events')
        }
      } catch (error) {
        setError('An error occurred while loading saved events')
      } finally {
        setLoading(false)
      }
    }

    fetchSavedEvents()
  }, [userId])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">{error}</p>
      </div>
    )
  }

  if (savedEvents.length === 0) {
    return (
      <div className="text-center py-8">
        <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">No saved events yet</p>
        <p className="text-sm text-gray-400 mt-2">
          Save events you're interested in to see them here
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">
          Saved Events ({savedEvents.length})
        </h3>
      </div>

      <div className="grid gap-4">
        {savedEvents.map((savedEvent) => (
          <div
            key={savedEvent.event.id}
            className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {/* Event Image */}
            <div className="flex-shrink-0 w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
              {savedEvent.event.imageUrl ? (
                <img
                  src={savedEvent.event.imageUrl}
                  alt={savedEvent.event.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <Calendar className="w-6 h-6" />
                </div>
              )}
            </div>

            {/* Event Details */}
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-gray-900 truncate">
                {savedEvent.event.name}
              </h4>
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <Calendar className="w-4 h-4 mr-1" />
                {formatDate(savedEvent.event.startDate)}
              </div>
              {savedEvent.event.venue && (
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <MapPin className="w-4 h-4 mr-1" />
                  {savedEvent.event.venue.city}, {savedEvent.event.venue.country}
                </div>
              )}
              <p className="text-xs text-gray-400 mt-1">
                Saved on {formatDate(savedEvent.createdAt)}
              </p>
            </div>

            {/* Actions */}
            <div className="flex-shrink-0">
              <Link href={`/events/${savedEvent.event.slug}`}>
                <Button size="sm" variant="outline">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}