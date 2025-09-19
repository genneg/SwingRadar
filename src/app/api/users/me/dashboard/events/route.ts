import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'

// Force dynamic runtime
export const dynamic = 'force-dynamic'

import { authOptions } from '@/lib/auth/config'
import { 
  apiResponse, 
  apiError, 
  handleApiError,
  validateMethod,
  extractSearchParams
} from '@/lib/api/utils'

/**
 * GET /api/users/me/dashboard/events - Get personalized events for dashboard
 * Query parameters:
 * - category: filter by category (upcoming, following, recommended, saved)
 * - limit: number of events to return (default: 20)
 * - priority: filter by priority (high, medium, low)
 */
export async function GET(request: NextRequest) {
  try {
    validateMethod(request, ['GET'])
    
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return apiError('Unauthorized', 401)
    }
    
    const userId = session.user.id
    const queryParams = extractSearchParams(request.url)
    
    // Parse query parameters
    const category = queryParams.category || 'all'
    const limit = parseInt(queryParams.limit || '20')
    const priority = queryParams.priority
    
    // Get personalized events
    const events = await getPersonalizedEvents(userId, {
      category,
      limit,
      priority
    })
    
    return apiResponse(events, true, 'Personalized events retrieved successfully')
    
  } catch (error) {
    return handleApiError(error)
  }
}

// Helper function to get personalized events
async function getPersonalizedEvents(userId: string, options: {
  category?: string
  limit?: number
  priority?: string
}) {
  // TODO: Replace with actual database queries
  
  // Mock personalized events data
  const mockEvents = [
    {
      id: 'event-1',
      name: 'Blues Weekend Workshop',
      date: '2024-08-15',
      location: 'Portland, OR',
      venue: 'Crystal Ballroom',
      teachers: ['Sarah Johnson', 'Mike Anderson'],
      musicians: ['Charlie Blues Band'],
      image: '/api/placeholder/300/200',
      price: '$85',
      registrationDeadline: '2024-08-10',
      isFollowingTeacher: true,
      isFollowingMusician: false,
      priority: 'high',
      category: 'following',
      description: 'A comprehensive blues dance workshop featuring top instructors',
      website: 'https://bluesweekend.com',
      tags: ['weekend', 'workshop', 'blues', 'social']
    },
    {
      id: 'event-2',
      name: 'Summer Blues Festival',
      date: '2024-08-22',
      location: 'Austin, TX',
      venue: 'Austin Convention Center',
      teachers: ['Lisa Chen', 'David Wilson'],
      musicians: ['Texas Blues Collective', 'Midnight Movers'],
      image: '/api/placeholder/300/200',
      price: '$120',
      registrationDeadline: '2024-08-18',
      isFollowingTeacher: false,
      isFollowingMusician: true,
      priority: 'medium',
      category: 'upcoming',
      description: 'The biggest blues festival in Texas with live music and dancing',
      website: 'https://summerbluesfest.com',
      tags: ['festival', 'live-music', 'texas', 'weekend']
    },
    {
      id: 'event-3',
      name: 'Blues Connection Workshop',
      date: '2024-08-29',
      location: 'Seattle, WA',
      venue: 'Dance Studio Northwest',
      teachers: ['Emma Thompson', 'Robert Martinez'],
      musicians: ['Seattle Blues Society'],
      image: '/api/placeholder/300/200',
      price: '$75',
      registrationDeadline: '2024-08-25',
      isFollowingTeacher: true,
      isFollowingMusician: false,
      priority: 'high',
      category: 'following',
      description: 'Focus on connection and musicality in blues dance',
      website: 'https://bluesconnection.com',
      tags: ['workshop', 'connection', 'musicality', 'seattle']
    },
    {
      id: 'event-4',
      name: 'Swing & Blues Fusion',
      date: '2024-09-05',
      location: 'San Francisco, CA',
      venue: 'The Fillmore',
      teachers: ['Jazz Masters Collective'],
      musicians: ['Bay Area Blues Band'],
      image: '/api/placeholder/300/200',
      price: '$95',
      registrationDeadline: '2024-09-01',
      isFollowingTeacher: false,
      isFollowingMusician: false,
      priority: 'medium',
      category: 'recommended',
      description: 'Explore the fusion between swing and blues dancing',
      website: 'https://swingbluesfusion.com',
      tags: ['fusion', 'swing', 'blues', 'san-francisco']
    },
    {
      id: 'event-5',
      name: 'Vintage Blues Night',
      date: '2024-09-12',
      location: 'Chicago, IL',
      venue: 'Green Mill Cocktail Lounge',
      teachers: ['Chicago Blues Masters'],
      musicians: ['Vintage Blues Revival'],
      image: '/api/placeholder/300/200',
      price: '$60',
      registrationDeadline: '2024-09-08',
      isFollowingTeacher: false,
      isFollowingMusician: true,
      priority: 'low',
      category: 'recommended',
      description: 'A night of vintage blues music and authentic dance styles',
      website: 'https://vintagebluesnight.com',
      tags: ['vintage', 'chicago', 'authentic', 'nightlife']
    }
  ]
  
  // Filter by category
  let filteredEvents = mockEvents
  if (options.category && options.category !== 'all') {
    filteredEvents = mockEvents.filter(event => event.category === options.category)
  }
  
  // Filter by priority
  if (options.priority) {
    filteredEvents = filteredEvents.filter(event => event.priority === options.priority)
  }
  
  // Sort by priority and date
  filteredEvents.sort((a, b) => {
    const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 }
    const priorityDiff = priorityOrder[b.priority as keyof typeof priorityOrder] - priorityOrder[a.priority as keyof typeof priorityOrder]
    
    if (priorityDiff !== 0) return priorityDiff
    
    return new Date(a.date).getTime() - new Date(b.date).getTime()
  })
  
  // Apply limit
  if (options.limit) {
    filteredEvents = filteredEvents.slice(0, options.limit)
  }
  
  // Add computed fields
  const eventsWithComputedFields = filteredEvents.map(event => ({
    ...event,
    daysUntilEvent: Math.ceil((new Date(event.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)),
    daysUntilDeadline: event.registrationDeadline 
      ? Math.ceil((new Date(event.registrationDeadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
      : null,
    isRegistrationOpen: event.registrationDeadline 
      ? new Date(event.registrationDeadline) > new Date()
      : true
  }))
  
  return eventsWithComputedFields
}

// Helper function to get events by category
async function getEventsByCategory(userId: string, category: string) {
  // TODO: Implement actual database queries based on category
  switch (category) {
    case 'following':
      return getFollowingEvents(userId)
    case 'upcoming':
      return getUpcomingEvents(userId)
    case 'recommended':
      return getRecommendedEvents(userId)
    case 'saved':
      return getSavedEvents(userId)
    default:
      return []
  }
}

async function getFollowingEvents(userId: string) {
  // TODO: Get events where user follows teachers/musicians
  return []
}

async function getUpcomingEvents(userId: string) {
  // TODO: Get upcoming events in user's area or interests
  return []
}

async function getRecommendedEvents(userId: string) {
  // TODO: Get recommended events based on user's preferences and behavior
  return []
}

async function getSavedEvents(userId: string) {
  // TODO: Get events user has saved
  return []
}