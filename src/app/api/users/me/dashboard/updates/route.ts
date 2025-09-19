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
 * GET /api/users/me/dashboard/updates - Get following updates for dashboard
 * Query parameters:
 * - limit: number of updates to return (default: 10)
 * - type: filter by update type (teacher, musician, festival)
 * - new_only: only return new/unread updates (default: false)
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
    const limit = parseInt(queryParams.limit || '10')
    const type = queryParams.type
    const newOnly = queryParams.new_only === 'true'
    
    // Get following updates
    const updates = await getFollowingUpdates(userId, {
      limit,
      type,
      newOnly
    })
    
    return apiResponse(updates, true, 'Following updates retrieved successfully')
    
  } catch (error) {
    return handleApiError(error)
  }
}

// Helper function to get following updates
async function getFollowingUpdates(userId: string, options: {
  limit?: number
  type?: string
  newOnly?: boolean
}) {
  // TODO: Replace with actual database queries
  
  // Mock following updates data
  const mockUpdates = [
    {
      id: 'update-1',
      type: 'teacher',
      name: 'Sarah Johnson',
      avatar: '/api/placeholder/40/40',
      action: 'is teaching at Blues Weekend Workshop',
      eventName: 'Blues Weekend Workshop',
      eventId: 'event-1',
      timestamp: '2 hours ago',
      isNew: true,
      details: {
        location: 'Portland, OR',
        date: '2024-08-15',
        registrationUrl: 'https://bluesweekend.com/register'
      }
    },
    {
      id: 'update-2',
      type: 'musician',
      name: 'Mike Anderson',
      avatar: '/api/placeholder/40/40',
      action: 'is performing at Summer Blues Festival',
      eventName: 'Summer Blues Festival',
      eventId: 'event-2',
      timestamp: '4 hours ago',
      isNew: true,
      details: {
        location: 'Austin, TX',
        date: '2024-08-22',
        setTime: '8:00 PM'
      }
    },
    {
      id: 'update-3',
      type: 'teacher',
      name: 'Lisa Chen',
      avatar: '/api/placeholder/40/40',
      action: 'added a new workshop session',
      eventName: 'Blues Connection Workshop',
      eventId: 'event-3',
      timestamp: '1 day ago',
      isNew: false,
      details: {
        location: 'Seattle, WA',
        date: '2024-08-29',
        sessionType: 'Advanced Connection'
      }
    },
    {
      id: 'update-4',
      type: 'musician',
      name: 'David Wilson',
      avatar: '/api/placeholder/40/40',
      action: 'released a new album',
      eventName: null,
      eventId: null,
      timestamp: '2 days ago',
      isNew: false,
      details: {
        albumName: 'Midnight Blues',
        releaseDate: '2024-08-01',
        streamingUrl: 'https://music.example.com/album'
      }
    },
    {
      id: 'update-5',
      type: 'festival',
      name: 'Blues & Brews Festival',
      avatar: '/api/placeholder/40/40',
      action: 'announced lineup for 2024',
      eventName: 'Blues & Brews Festival 2024',
      eventId: 'event-5',
      timestamp: '3 days ago',
      isNew: false,
      details: {
        location: 'Denver, CO',
        date: '2024-09-15',
        headliners: ['Blues Brothers Revival', 'Denver Blues Society']
      }
    },
    {
      id: 'update-6',
      type: 'teacher',
      name: 'Emma Thompson',
      avatar: '/api/placeholder/40/40',
      action: 'is offering private lessons',
      eventName: null,
      eventId: null,
      timestamp: '5 days ago',
      isNew: false,
      details: {
        location: 'Seattle, WA',
        availability: 'Weekends',
        contactEmail: 'emma@example.com'
      }
    },
    {
      id: 'update-7',
      type: 'musician',
      name: 'Charlie Blues Band',
      avatar: '/api/placeholder/40/40',
      action: 'is touring the West Coast',
      eventName: null,
      eventId: null,
      timestamp: '1 week ago',
      isNew: false,
      details: {
        tourDates: ['2024-08-20', '2024-08-25', '2024-08-30'],
        cities: ['Portland', 'Seattle', 'San Francisco']
      }
    }
  ]
  
  // Filter by type
  let filteredUpdates = mockUpdates
  if (options.type) {
    filteredUpdates = mockUpdates.filter(update => update.type === options.type)
  }
  
  // Filter by new only
  if (options.newOnly) {
    filteredUpdates = filteredUpdates.filter(update => update.isNew)
  }
  
  // Sort by timestamp (newest first)
  filteredUpdates.sort((a, b) => {
    const timestampA = parseTimestamp(a.timestamp)
    const timestampB = parseTimestamp(b.timestamp)
    return timestampB.getTime() - timestampA.getTime()
  })
  
  // Apply limit
  if (options.limit) {
    filteredUpdates = filteredUpdates.slice(0, options.limit)
  }
  
  return filteredUpdates
}

// Helper function to parse relative timestamps
function parseTimestamp(timestamp: string): Date {
  const now = new Date()
  
  if (timestamp.includes('hour')) {
    const hours = parseInt(timestamp.match(/\d+/)?.[0] || '0')
    return new Date(now.getTime() - hours * 60 * 60 * 1000)
  }
  
  if (timestamp.includes('day')) {
    const days = parseInt(timestamp.match(/\d+/)?.[0] || '0')
    return new Date(now.getTime() - days * 24 * 60 * 60 * 1000)
  }
  
  if (timestamp.includes('week')) {
    const weeks = parseInt(timestamp.match(/\d+/)?.[0] || '0')
    return new Date(now.getTime() - weeks * 7 * 24 * 60 * 60 * 1000)
  }
  
  return now
}

// Helper function to get updates by type
async function getUpdatesByType(userId: string, type: string) {
  // TODO: Implement actual database queries based on type
  switch (type) {
    case 'teacher':
      return getTeacherUpdates(userId)
    case 'musician':
      return getMusicianUpdates(userId)
    case 'festival':
      return getFestivalUpdates(userId)
    default:
      return []
  }
}

async function getTeacherUpdates(userId: string) {
  // TODO: Get updates from teachers the user follows
  return []
}

async function getMusicianUpdates(userId: string) {
  // TODO: Get updates from musicians the user follows
  return []
}

async function getFestivalUpdates(userId: string) {
  // TODO: Get updates from festivals the user follows
  return []
}

// Helper function to mark updates as read
async function markUpdatesAsRead(userId: string, updateIds: string[]) {
  // TODO: Implement marking updates as read in database
  return { success: true, markedCount: updateIds.length }
}