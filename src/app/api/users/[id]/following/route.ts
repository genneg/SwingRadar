import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { 
  apiResponse, 
  apiError, 
  handleApiError,
  validateMethod,
  extractSearchParams,
  validatePagination,
  validateEnumField
} from '@/lib/api/utils'
import type { Following, Teacher, Musician, Festival } from '@/types'

interface RouteParams {
  params: {
    id: string
  }
}

// Enum for target types
const TargetType = {
  teacher: 'teacher',
  musician: 'musician',
  festival: 'festival'
} as const

/**
 * GET /api/users/[id]/following - Get user's following list
 * Query parameters:
 * - page: page number (default: 1)
 * - limit: items per page (default: 20, max: 100)
 * - type: filter by target type (teacher, musician, festival)
 * - includeDetails: boolean to include full target details (default: true)
 * - sortBy: createdAt, name, upcoming_events (default: createdAt)
 * - sortOrder: asc, desc (default: desc)
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    validateMethod(request, ['GET'])
    
    const session = await getServerSession(authOptions)
    const { id: userId } = params
    
    if (!session?.user?.id) {
      return apiError('Unauthorized', 401)
    }
    
    // Users can view their own following, others can view public following
    const isOwnProfile = session.user.id === userId
    const queryParams = extractSearchParams(request.url)
    
    // Validate pagination
    const { page, limit, skip, take } = validatePagination(queryParams.page, queryParams.limit)
    
    // Validate and extract filters
    const filters: Record<string, any> = {}
    
    if (queryParams.type) {
      filters.targetType = validateEnumField(queryParams.type, TargetType, 'type')
    }
    
    const includeDetails = queryParams.includeDetails !== 'false'
    const sortBy = queryParams.sortBy || 'createdAt'
    const sortOrder = queryParams.sortOrder || 'desc'
    
    // Get following records
    const followingRecords = await getFollowingRecords(userId, filters, skip, take, sortBy, sortOrder)
    const totalCount = await getFollowingCount(userId, filters)
    
    // Get detailed information for each followed entity if requested
    let enrichedFollowing = followingRecords
    if (includeDetails) {
      enrichedFollowing = await enrichFollowingWithDetails(followingRecords)
    }
    
    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limit)
    const hasNext = page < totalPages
    const hasPrev = page > 1
    
    // Group by type for easier frontend consumption
    const groupedFollowing = groupFollowingByType(enrichedFollowing)
    
    const response = {
      following: enrichedFollowing,
      grouped: groupedFollowing,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages,
        hasNext,
        hasPrev
      },
      filters: {
        type: filters.targetType || null,
        includeDetails,
        sortBy,
        sortOrder
      },
      stats: {
        total: totalCount,
        teachers: groupedFollowing.teachers.length,
        musicians: groupedFollowing.musicians.length,
        festivals: groupedFollowing.festivals.length
      }
    }
    
    return apiResponse(response, true, 'Following list retrieved successfully')
    
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * DELETE /api/users/[id]/following - Bulk unfollow (unfollow multiple items)
 * Request body:
 * {
 *   "targets": [
 *     { "targetId": "string", "targetType": "teacher" | "musician" | "festival" }
 *   ]
 * }
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    validateMethod(request, ['DELETE'])
    
    const session = await getServerSession(authOptions)
    const { id: userId } = params
    
    if (!session?.user?.id) {
      return apiError('Unauthorized', 401)
    }
    
    // Users can only manage their own following
    if (session.user.id !== userId) {
      return apiError('Forbidden: You can only manage your own following', 403)
    }
    
    const body = await request.json()
    const { targets } = body
    
    if (!Array.isArray(targets) || targets.length === 0) {
      return apiError('Targets array is required and cannot be empty', 400)
    }
    
    if (targets.length > 50) {
      return apiError('Cannot unfollow more than 50 items at once', 400)
    }
    
    // Validate each target
    const validTargets = targets.map((target, index) => {
      if (!target.targetId || !target.targetType) {
        throw new Error(`Target at index ${index} is missing targetId or targetType`)
      }
      
      if (!Object.values(TargetType).includes(target.targetType)) {
        throw new Error(`Invalid target type at index ${index}: ${target.targetType}`)
      }
      
      return target
    })
    
    // Bulk unfollow
    const results = await bulkUnfollow(userId, validTargets)
    
    return apiResponse({
      unfollowed: results.success,
      failed: results.failed,
      message: `Successfully unfollowed ${results.success.length} items`
    }, true, `Bulk unfollow completed`)
    
  } catch (error) {
    return handleApiError(error)
  }
}

// Helper functions (mock implementations - replace with actual database calls)

async function getFollowingRecords(
  userId: string, 
  filters: Record<string, any>, 
  skip: number, 
  take: number,
  sortBy: string,
  sortOrder: string
): Promise<Following[]> {
  // TODO: Replace with actual database query
  const mockFollowing: Following[] = [
    {
      id: '1',
      userId,
      targetId: '1',
      targetType: 'teacher',
      createdAt: new Date('2024-01-15T10:30:00.000Z')
    },
    {
      id: '2',
      userId,
      targetId: '2',
      targetType: 'musician',
      createdAt: new Date('2024-01-10T14:20:00.000Z')
    },
    {
      id: '3',
      userId,
      targetId: '1',
      targetType: 'festival',
      createdAt: new Date('2024-01-05T09:15:00.000Z')
    }
  ]
  
  // Apply filters
  let filtered = mockFollowing
  if (filters.targetType) {
    filtered = filtered.filter(f => f.targetType === filters.targetType)
  }
  
  // Apply sorting
  filtered.sort((a, b) => {
    let comparison = 0
    if (sortBy === 'createdAt') {
      comparison = a.createdAt.getTime() - b.createdAt.getTime()
    }
    return sortOrder === 'asc' ? comparison : -comparison
  })
  
  // Apply pagination
  return filtered.slice(skip, skip + take)
}

async function getFollowingCount(userId: string, filters: Record<string, any>): Promise<number> {
  // TODO: Replace with actual database count query
  const mockCount = 3
  return mockCount
}

async function enrichFollowingWithDetails(followingRecords: Following[]): Promise<any[]> {
  // TODO: Replace with actual database joins
  const mockTeachers: Teacher[] = [
    {
      id: '1',
      name: 'Alice Johnson',
      bio: 'Experienced blues dance instructor',
      specialties: ['Blues', 'Connection', 'Musicality'],
      website: 'https://alicejohnsonblues.com',
      socialLinks: {
        facebook: 'https://facebook.com/alicejohnsonblues',
        instagram: 'https://instagram.com/alicejohnsonblues'
      },
      followers: [],
      festivals: []
    }
  ]
  
  const mockMusicians: Musician[] = [
    {
      id: '2',
      name: 'Charlie Blues Band',
      bio: 'Traditional blues band with over 20 years of experience',
      genre: ['Blues', 'Traditional Jazz', 'Swing'],
      website: 'https://charliebluesband.com',
      socialLinks: {
        facebook: 'https://facebook.com/charliebluesband',
        spotify: 'https://spotify.com/artist/charliebluesband'
      },
      followers: [],
      festivals: []
    }
  ]
  
  const mockFestivals: Festival[] = [
    {
      id: '1',
      name: 'Blues & Brews Festival 2024',
      description: 'A weekend of blues music and dance',
      startDate: new Date('2024-08-15'),
      endDate: new Date('2024-08-17'),
      registrationDeadline: new Date('2024-08-01'),
      website: 'https://bluesandbrews.com',
      venue: {
        id: '1',
        name: 'City Convention Center',
        address: '123 Main Street',
        city: 'New York',
        country: 'USA',
        latitude: 40.7128,
        longitude: -74.0060
      },
      teachers: [],
      musicians: [],
      prices: [],
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15')
    }
  ]
  
  return followingRecords.map(follow => {
    let target = null
    
    switch (follow.targetType) {
      case 'teacher':
        target = mockTeachers.find(t => t.id === follow.targetId)
        break
      case 'musician':
        target = mockMusicians.find(m => m.id === follow.targetId)
        break
      case 'festival':
        target = mockFestivals.find(f => f.id === follow.targetId)
        break
    }
    
    return {
      id: follow.id,
      targetType: follow.targetType,
      createdAt: follow.createdAt,
      target: target || { id: follow.targetId, name: 'Unknown', deleted: true }
    }
  })
}

function groupFollowingByType(following: any[]): { teachers: any[], musicians: any[], festivals: any[] } {
  return {
    teachers: following.filter(f => f.targetType === 'teacher'),
    musicians: following.filter(f => f.targetType === 'musician'),
    festivals: following.filter(f => f.targetType === 'festival')
  }
}

async function bulkUnfollow(userId: string, targets: any[]): Promise<{ success: any[], failed: any[] }> {
  // TODO: Replace with actual database bulk operations
  const success: any[] = []
  const failed: any[] = []
  
  for (const target of targets) {
    try {
      // Mock unfollow operation
      success.push({
        targetId: target.targetId,
        targetType: target.targetType
      })
    } catch (error) {
      failed.push({
        targetId: target.targetId,
        targetType: target.targetType,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }
  
  return { success, failed }
}