'use client'

import { useState, useEffect } from 'react'
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  Music, 
  Star, 
  AlertCircle,
  ChevronRight,
  Filter,
  Sort
} from 'lucide-react'

import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

interface UpcomingEvent {
  id: string
  name: string
  date: string
  location: string
  venue: string
  teachers: string[]
  musicians: string[]
  image?: string
  price?: string
  registrationDeadline?: string
  website?: string
  priority: 'high' | 'medium' | 'low'
  category: string
  isRegistrationOpen: boolean
  daysUntilEvent: number
  daysUntilDeadline?: number
  isFollowingTeacher: boolean
  isFollowingMusician: boolean
  estimatedAttendance?: number
  difficulty?: 'beginner' | 'intermediate' | 'advanced' | 'all-levels'
}

interface UpcomingEventsWidgetProps {
  limit?: number
  showHeader?: boolean
  compact?: boolean
  showFilters?: boolean
}

export function UpcomingEventsWidget({
  limit = 8,
  showHeader = true,
  compact = false,
  showFilters = false
}: UpcomingEventsWidgetProps) {
  const [events, setEvents] = useState<UpcomingEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<'date' | 'priority' | 'location'>('date')
  const [filterBy, setFilterBy] = useState<'all' | 'following' | 'nearby'>('all')

  useEffect(() => {
    fetchUpcomingEvents()
  }, [])

  const fetchUpcomingEvents = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/users/me/dashboard/events?category=upcoming')
      
      if (!response.ok) {
        throw new Error('Failed to fetch upcoming events')
      }
      
      const data = await response.json()
      
      if (data.success) {
        const transformedEvents: UpcomingEvent[] = data.data.map((event: any) => ({
          id: event.id,
          name: event.name,
          date: event.date,
          location: event.location,
          venue: event.venue,
          teachers: event.teachers,
          musicians: event.musicians,
          image: event.image,
          price: event.price,
          registrationDeadline: event.registrationDeadline,
          website: event.website,
          priority: event.priority,
          category: event.category,
          isRegistrationOpen: event.isRegistrationOpen,
          daysUntilEvent: event.daysUntilEvent,
          daysUntilDeadline: event.daysUntilDeadline,
          isFollowingTeacher: event.isFollowingTeacher,
          isFollowingMusician: event.isFollowingMusician,
          estimatedAttendance: Math.floor(Math.random() * 200) + 50,
          difficulty: ['beginner', 'intermediate', 'advanced', 'all-levels'][Math.floor(Math.random() * 4)] as any
        }))
        
        setEvents(transformedEvents)
      } else {
        setError(data.error || 'Failed to load upcoming events')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const getSortedAndFilteredEvents = () => {
    let filteredEvents = [...events]

    // Apply filters
    if (filterBy === 'following') {
      filteredEvents = filteredEvents.filter(event => 
        event.isFollowingTeacher || event.isFollowingMusician
      )
    } else if (filterBy === 'nearby') {
      // Mock nearby filter - in real app, this would use user's location
      filteredEvents = filteredEvents.filter(event => 
        event.location.includes('Portland') || event.location.includes('Seattle')
      )
    }

    // Apply sorting
    filteredEvents.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return a.daysUntilEvent - b.daysUntilEvent
        case 'priority':
          const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 }
          return priorityOrder[b.priority] - priorityOrder[a.priority]
        case 'location':
          return a.location.localeCompare(b.location)
        default:
          return 0
      }
    })

    return filteredEvents.slice(0, limit)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatDaysUntil = (days: number) => {
    if (days === 0) return 'Today'
    if (days === 1) return 'Tomorrow'
    if (days <= 7) return `${days} days`
    if (days <= 30) return `${Math.ceil(days / 7)} weeks`
    return `${Math.ceil(days / 30)} months`
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'advanced': return 'bg-red-100 text-red-800'
      case 'all-levels': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getRegistrationUrgency = (event: UpcomingEvent) => {
    if (!event.isRegistrationOpen) {
      return { status: 'closed', color: 'bg-red-100 text-red-800', text: 'Registration closed' }
    }
    
    if (event.daysUntilDeadline) {
      if (event.daysUntilDeadline <= 1) {
        return { status: 'urgent', color: 'bg-red-100 text-red-800', text: 'Deadline today!' }
      } else if (event.daysUntilDeadline <= 3) {
        return { status: 'soon', color: 'bg-yellow-100 text-yellow-800', text: `${event.daysUntilDeadline} days left` }
      } else if (event.daysUntilDeadline <= 7) {
        return { status: 'week', color: 'bg-yellow-100 text-yellow-800', text: `${event.daysUntilDeadline} days left` }
      }
    }
    
    return { status: 'open', color: 'bg-green-100 text-green-800', text: 'Registration open' }
  }

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex justify-center items-center py-8">
          <LoadingSpinner />
        </div>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchUpcomingEvents} variant="outline">
            Try Again
          </Button>
        </div>
      </Card>
    )
  }

  const displayEvents = getSortedAndFilteredEvents()

  return (
    <Card className="p-6">
      {showHeader && (
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Upcoming Events</h2>
            <p className="text-sm text-gray-600">
              Blues dance events happening soon
            </p>
          </div>
          
          {showFilters && (
            <div className="flex items-center space-x-2">
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value as any)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">All Events</option>
                <option value="following">Following</option>
                <option value="nearby">Nearby</option>
              </select>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm"
              >
                <option value="date">By Date</option>
                <option value="priority">By Priority</option>
                <option value="location">By Location</option>
              </select>
            </div>
          )}
        </div>
      )}

      <div className="space-y-4">
        {displayEvents.map((event) => {
          const registrationUrgency = getRegistrationUrgency(event)
          
          return (
            <div key={event.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start space-x-4">
                {/* Event Image/Date */}
                <div className="flex-shrink-0">
                  {event.image && !compact ? (
                    <img
                      src={event.image}
                      alt={event.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-blue-100 rounded-lg flex flex-col items-center justify-center">
                      <div className="text-lg font-bold text-blue-600">
                        {new Date(event.date).getDate()}
                      </div>
                      <div className="text-xs text-blue-600">
                        {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Event Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{event.name}</h3>
                      
                      <div className="flex items-center text-sm text-gray-500 space-x-4 mb-2">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {formatDaysUntil(event.daysUntilEvent)}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {event.location}
                        </div>
                        {event.price && (
                          <div className="font-medium text-gray-900">
                            {event.price}
                          </div>
                        )}
                      </div>

                      {!compact && (
                        <div className="flex items-center text-sm text-gray-500 space-x-4 mb-3">
                          {event.teachers.length > 0 && (
                            <div className="flex items-center">
                              <Users className="w-4 h-4 mr-1" />
                              {event.teachers.slice(0, 2).join(', ')}
                              {event.teachers.length > 2 && ` +${event.teachers.length - 2} more`}
                            </div>
                          )}
                          {event.musicians.length > 0 && (
                            <div className="flex items-center">
                              <Music className="w-4 h-4 mr-1" />
                              {event.musicians.slice(0, 2).join(', ')}
                              {event.musicians.length > 2 && ` +${event.musicians.length - 2} more`}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Status Badges */}
                      <div className="flex items-center space-x-2 flex-wrap">
                        <Badge className={`text-xs ${registrationUrgency.color}`}>
                          {registrationUrgency.text}
                        </Badge>
                        
                        <Badge className={`text-xs ${getPriorityColor(event.priority)}`}>
                          {event.priority}
                        </Badge>
                        
                        {event.difficulty && (
                          <Badge className={`text-xs ${getDifficultyColor(event.difficulty)}`}>
                            {event.difficulty}
                          </Badge>
                        )}
                        
                        {event.isFollowingTeacher && (
                          <Badge className="bg-blue-100 text-blue-800 text-xs">
                            Following teacher
                          </Badge>
                        )}
                        
                        {event.isFollowingMusician && (
                          <Badge className="bg-purple-100 text-purple-800 text-xs">
                            Following musician
                          </Badge>
                        )}
                      </div>

                      {/* Additional Info */}
                      {!compact && event.estimatedAttendance && (
                        <div className="mt-2 text-xs text-gray-500">
                          ~{event.estimatedAttendance} expected attendees
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-2 ml-4">
                      {event.website && event.isRegistrationOpen && (
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                        >
                          <a href={event.website} target="_blank" rel="noopener noreferrer">
                            Register
                          </a>
                        </Button>
                      )}
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        asChild
                      >
                        <a href={`/events/${event.id}`}>
                          <ChevronRight className="w-4 h-4" />
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {displayEvents.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 mb-2">No upcoming events</p>
          <p className="text-sm text-gray-400 mb-4">
            Check back later for new events or browse all events
          </p>
          <Button variant="outline" asChild>
            <a href="/events">
              Browse All Events
            </a>
          </Button>
        </div>
      )}

      {displayEvents.length > 0 && displayEvents.length >= limit && (
        <div className="text-center pt-4 border-t border-gray-200">
          <Button variant="outline" asChild>
            <a href="/events">
              View All Events
            </a>
          </Button>
        </div>
      )}
    </Card>
  )
}