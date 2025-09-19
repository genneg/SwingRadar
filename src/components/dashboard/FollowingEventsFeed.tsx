'use client'

import { useState, useEffect } from 'react'
import { Calendar, MapPin, Users, Music, Clock, Bell, Filter, ChevronRight, Star } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { EventCard } from '@/components/features/EventCard'

interface FollowingEvent {
  id: string
  name: string
  date: string
  location: string
  venue: string
  description: string
  teachers: Array<{
    id: string
    name: string
    avatar?: string
    verified: boolean
  }>
  musicians: Array<{
    id: string
    name: string
    avatar?: string
    verified: boolean
  }>
  image?: string
  price?: string
  registrationDeadline?: string
  website?: string
  followingReason: 'teacher' | 'musician' | 'both'
  priority: 'high' | 'medium' | 'low'
  isNew: boolean
  registrationStatus: 'open' | 'closing-soon' | 'closed'
}

interface FollowingEventsFeedProps {
  limit?: number
  showHeader?: boolean
  compact?: boolean
}

export function FollowingEventsFeed({ 
  limit = 10, 
  showHeader = true, 
  compact = false 
}: FollowingEventsFeedProps) {
  const [events, setEvents] = useState<FollowingEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'teacher' | 'musician'>('all')
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all')

  useEffect(() => {
    fetchFollowingEvents()
  }, [])

  const fetchFollowingEvents = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/users/me/dashboard/events?category=following')
      
      if (!response.ok) {
        throw new Error('Failed to fetch following events')
      }
      
      const data = await response.json()
      
      if (data.success) {
        const transformedEvents: FollowingEvent[] = data.data.map((event: any) => ({
          id: event.id,
          name: event.name,
          date: event.date,
          location: event.location,
          venue: event.venue,
          description: event.description,
          teachers: event.teachers.map((name: string) => ({
            id: `teacher-${name.toLowerCase().replace(/\s+/g, '-')}`,
            name,
            avatar: `/api/placeholder/40/40`,
            verified: Math.random() > 0.5
          })),
          musicians: event.musicians.map((name: string) => ({
            id: `musician-${name.toLowerCase().replace(/\s+/g, '-')}`,
            name,
            avatar: `/api/placeholder/40/40`,
            verified: Math.random() > 0.5
          })),
          image: event.image,
          price: event.price,
          registrationDeadline: event.registrationDeadline,
          website: event.website,
          followingReason: event.isFollowingTeacher && event.isFollowingMusician ? 'both' : 
                         event.isFollowingTeacher ? 'teacher' : 'musician',
          priority: event.priority,
          isNew: event.daysUntilEvent <= 30,
          registrationStatus: event.isRegistrationOpen ? 
            (event.daysUntilDeadline <= 3 ? 'closing-soon' : 'open') : 'closed'
        }))
        
        setEvents(transformedEvents)
      } else {
        setError(data.error || 'Failed to load following events')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const filteredEvents = events.filter(event => {
    // Filter by following reason
    if (filter !== 'all') {
      if (filter === 'teacher' && !event.followingReason.includes('teacher')) return false
      if (filter === 'musician' && !event.followingReason.includes('musician')) return false
    }
    
    // Filter by priority
    if (priorityFilter !== 'all' && event.priority !== priorityFilter) return false
    
    return true
  }).slice(0, limit)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const diffTime = date.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Tomorrow'
    if (diffDays <= 7) return `In ${diffDays} days`
    
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    })
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getRegistrationStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-green-100 text-green-800'
      case 'closing-soon': return 'bg-yellow-100 text-yellow-800'
      case 'closed': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
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
          <Button onClick={fetchFollowingEvents} variant="outline">
            Try Again
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      {showHeader && (
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Following Events</h2>
            <p className="text-sm text-gray-600">
              Events from teachers and musicians you follow
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm"
            >
              <option value="all">All</option>
              <option value="teacher">Teachers</option>
              <option value="musician">Musicians</option>
            </select>
            
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as any)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm"
            >
              <option value="all">All Priority</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {filteredEvents.map((event) => (
          <div key={event.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-start space-x-4">
              {/* Event Image/Icon */}
              <div className="flex-shrink-0">
                {event.image ? (
                  <img
                    src={event.image}
                    alt={event.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-8 h-8 text-blue-600" />
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
                        {formatDate(event.date)}
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
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {event.description}
                      </p>
                    )}

                    {/* Following Reason */}
                    <div className="flex items-center space-x-2 mb-3">
                      {event.followingReason.includes('teacher') && (
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4 text-blue-600" />
                          <span className="text-sm text-blue-600">Following teacher</span>
                        </div>
                      )}
                      {event.followingReason.includes('musician') && (
                        <div className="flex items-center space-x-1">
                          <Music className="w-4 h-4 text-purple-600" />
                          <span className="text-sm text-purple-600">Following musician</span>
                        </div>
                      )}
                    </div>

                    {/* Teachers and Musicians */}
                    <div className="space-y-2 mb-3">
                      {event.teachers.length > 0 && (
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4 text-gray-400" />
                          <div className="flex items-center space-x-2">
                            {event.teachers.slice(0, 3).map((teacher) => (
                              <div key={teacher.id} className="flex items-center space-x-1">
                                <Avatar name={teacher.name} image={teacher.avatar} size="xs" />
                                <span className="text-sm text-gray-700">{teacher.name}</span>
                                {teacher.verified && (
                                  <div className="w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center">
                                    <div className="w-1 h-1 bg-white rounded-full"></div>
                                  </div>
                                )}
                              </div>
                            ))}
                            {event.teachers.length > 3 && (
                              <span className="text-sm text-gray-500">
                                +{event.teachers.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {event.musicians.length > 0 && (
                        <div className="flex items-center space-x-2">
                          <Music className="w-4 h-4 text-gray-400" />
                          <div className="flex items-center space-x-2">
                            {event.musicians.slice(0, 3).map((musician) => (
                              <div key={musician.id} className="flex items-center space-x-1">
                                <Avatar name={musician.name} image={musician.avatar} size="xs" />
                                <span className="text-sm text-gray-700">{musician.name}</span>
                                {musician.verified && (
                                  <div className="w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center">
                                    <div className="w-1 h-1 bg-white rounded-full"></div>
                                  </div>
                                )}
                              </div>
                            ))}
                            {event.musicians.length > 3 && (
                              <span className="text-sm text-gray-500">
                                +{event.musicians.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Status Badges */}
                    <div className="flex items-center space-x-2">
                      <Badge className={`text-xs ${getPriorityColor(event.priority)}`}>
                        {event.priority} priority
                      </Badge>
                      
                      <Badge className={`text-xs ${getRegistrationStatusColor(event.registrationStatus)}`}>
                        {event.registrationStatus === 'open' && 'Registration open'}
                        {event.registrationStatus === 'closing-soon' && 'Closing soon'}
                        {event.registrationStatus === 'closed' && 'Registration closed'}
                      </Badge>
                      
                      {event.isNew && (
                        <Badge className="bg-blue-100 text-blue-800 text-xs">
                          New
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-2 ml-4">
                    {event.website && (
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
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 mb-2">No events from people you follow</p>
          <p className="text-sm text-gray-400 mb-4">
            Follow teachers and musicians to see their events here
          </p>
          <Button variant="outline" asChild>
            <a href="/profile/following">
              Manage Following
            </a>
          </Button>
        </div>
      )}

      {filteredEvents.length > 0 && filteredEvents.length >= limit && (
        <div className="text-center pt-4 border-t border-gray-200">
          <Button variant="outline" asChild>
            <a href="/events?filter=following">
              View All Following Events
            </a>
          </Button>
        </div>
      )}
    </Card>
  )
}