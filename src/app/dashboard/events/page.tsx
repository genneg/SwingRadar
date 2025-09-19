'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { EventCard } from '@/components/features/EventCard'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Calendar, Clock, MapPin, Plus } from 'lucide-react'

// Types for API responses
interface Event {
  id: string | number
  name: string
  description?: string
  from_date: string
  to_date: string
  city: string
  country: string
  website?: string
  image_url?: string
}

export default function DashboardEventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [savedEvents, setSavedEvents] = useState<Event[]>([])
  const [attendingEvents, setAttendingEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'upcoming' | 'saved' | 'attending'>('upcoming')

  // Fetch user's events from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true)
        // TODO: Replace with actual user events API
        const response = await fetch('/api/events?limit=10')
        const data = await response.json()
        
        if (data.success) {
          const eventsList = data.data.events || []
          setEvents(eventsList)
          // Mock saved and attending events for now
          setSavedEvents(eventsList.slice(0, 2))
          setAttendingEvents(eventsList.slice(2, 4))
        } else {
          setError('Failed to load events')
        }
      } catch (error) {
        setError('Failed to load events')
        console.error('Error fetching events:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchEvents()
  }, [])

  const getCurrentEvents = () => {
    switch (activeTab) {
      case 'saved':
        return savedEvents
      case 'attending':
        return attendingEvents
      default:
        return events
    }
  }

  const transformEventForCard = (event: Event) => {
    return {
      id: event.id.toString(),
      name: event.name,
      description: event.description || '',
      startDate: new Date(event.from_date),
      endDate: new Date(event.to_date),
      venue: {
        id: '1',
        name: `${event.city} Venue`,
        address: `${event.city}, ${event.country}`,
        city: event.city,
        country: event.country,
      },
      teachers: [],
      musicians: [],
      prices: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      city: event.city,
      country: event.country,
      website: event.website,
      image_url: event.image_url,
    }
  }

  return (
    <div className="app-container">
      <div className="max-w-md mx-auto bg-background min-h-screen">
        {/* Header */}
        <div className="p-6 border-b border-border/50">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-playfair text-foreground">My Events</h1>
            <Link href="/search">
              <Button size="sm" className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Find Events
              </Button>
            </Link>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-card rounded-lg p-1">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'upcoming'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'saved'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Saved
            </button>
            <button
              onClick={() => setActiveTab('attending')}
              className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'attending'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Attending
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="p-6 border-b border-border/50">
          <div className="grid grid-cols-3 gap-3">
            <div className="stats-card">
              <Calendar className="w-5 h-5 text-primary mx-auto mb-2" />
              <p className="text-xl font-medium text-primary">{events.length}</p>
              <p className="text-xs text-muted-foreground">Upcoming</p>
            </div>
            <div className="stats-card">
              <Clock className="w-5 h-5 text-primary mx-auto mb-2" />
              <p className="text-xl font-medium text-primary">{savedEvents.length}</p>
              <p className="text-xs text-muted-foreground">Saved</p>
            </div>
            <div className="stats-card">
              <MapPin className="w-5 h-5 text-primary mx-auto mb-2" />
              <p className="text-xl font-medium text-primary">{attendingEvents.length}</p>
              <p className="text-xs text-muted-foreground">Attending</p>
            </div>
          </div>
        </div>

        {/* Events List */}
        <div className="p-6 space-y-4">
          {isLoading && (
            <div className="card p-8 text-center">
              <LoadingSpinner className="mx-auto mb-4" />
              <p className="text-white/80">Loading events...</p>
            </div>
          )}
          
          {error && (
            <div className="card p-4 border-error-600/30 bg-error-900/20">
              <p className="text-error-300 text-sm">{error}</p>
            </div>
          )}
          
          {!isLoading && !error && getCurrentEvents().length === 0 && (
            <div className="card p-8 text-center">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-white/80 mb-2">No events found</p>
              <p className="text-sm text-muted-foreground mb-4">
                {activeTab === 'upcoming' && 'No upcoming events to show'}
                {activeTab === 'saved' && 'You haven\'t saved any events yet'}
                {activeTab === 'attending' && 'You\'re not attending any events yet'}
              </p>
              <Link href="/search">
                <Button size="sm">Browse Events</Button>
              </Link>
            </div>
          )}
          
          {!isLoading && !error && getCurrentEvents().map((event) => (
            <Link key={event.id} href={`/events/${event.id}`}>
              <EventCard event={transformEventForCard(event)} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}