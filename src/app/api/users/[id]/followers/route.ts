import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { 
  apiResponse, 
  apiError, 
  handleApiError,
  validateMethod,
  extractSearchParams,
  validatePagination
} from '@/lib/api/utils'
import type { User } from '@/types'

interface RouteParams {
  params: {
    id: string
  }
}

/**
 * GET /api/users/[id]/followers - Get users who follow this user
 * Query parameters:
 * - page: page number (default: 1)
 * - limit: items per page (default: 20, max: 100)
 * - includeDetails: boolean to include full user details (default: true)
 * - sortBy: createdAt, name (default: createdAt)
 * - sortOrder: asc, desc (default: desc)
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    validateMethod(request, ['GET'])
    
    const session = await getServerSession(authOptions)
    const { id: targetUserId } = params
    
    if (!session?.user?.id) {
      return apiError('Unauthorized', 401)
    }
    
    // Check if target user exists and is accessible
    const targetUser = await getUserById(targetUserId)
    if (!targetUser) {
      return apiError('User not found', 404)
    }
    
    const queryParams = extractSearchParams(request.url)
    
    // Validate pagination
    const { page, limit, skip, take } = validatePagination(queryParams.page, queryParams.limit)
    
    const includeDetails = queryParams.includeDetails !== 'false'
    const sortBy = queryParams.sortBy || 'createdAt'
    const sortOrder = queryParams.sortOrder || 'desc'
    
    // Get followers
    const followers = await getFollowers(targetUserId, skip, take, sortBy, sortOrder, includeDetails)
    const totalCount = await getFollowersCount(targetUserId)
    
    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limit)
    const hasNext = page < totalPages
    const hasPrev = page > 1
    
    // Check if current user is following the target user
    const isFollowing = await checkIfFollowing(session.user.id, targetUserId)
    
    const response = {
      targetUser: {
        id: targetUser.id,
        name: targetUser.name,
        image: targetUser.image
      },
      followers,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages,
        hasNext,
        hasPrev
      },
      filters: {
        includeDetails,
        sortBy,
        sortOrder
      },
      currentUserFollowing: isFollowing
    }
    
    return apiResponse(response, true, 'Followers retrieved successfully')
    
  } catch (error) {
    return handleApiError(error)
  }
}

// Helper functions (mock implementations - replace with actual database calls)

async function getUserById(userId: string): Promise<User | null> {
  // TODO: Replace with actual database query
  const mockUsers: User[] = [
    {
      id: '1',
      email: 'user1@example.com',
      name: 'John Doe',
      image: 'https://example.com/avatar1.jpg',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    },
    {
      id: '2',
      email: 'user2@example.com',
      name: 'Jane Smith',
      image: 'https://example.com/avatar2.jpg',
      createdAt: new Date('2024-01-02'),
      updatedAt: new Date('2024-01-02')
    }
  ]
  
  return mockUsers.find(user => user.id === userId) || null
}

async function getFollowers(
  targetUserId: string,
  skip: number,
  take: number,
  sortBy: string,
  sortOrder: string,
  includeDetails: boolean
): Promise<any[]> {
  // TODO: Replace with actual database query
  // This should query the Following table where targetId = targetUserId and targetType = 'user'
  // and join with User table to get follower details
  
  const mockFollowers = [
    {
      id: 'follow_1',
      userId: '2',
      targetId: targetUserId,
      targetType: 'user',
      createdAt: new Date('2024-01-15T10:30:00.000Z'),
      user: includeDetails ? {
        id: '2',
        name: 'Jane Smith',
        image: 'https://example.com/avatar2.jpg',
        createdAt: new Date('2024-01-02'),
        verified: true
      } : null
    },
    {
      id: 'follow_2',
      userId: '3',
      targetId: targetUserId,
      targetType: 'user',
      createdAt: new Date('2024-01-10T14:20:00.000Z'),
      user: includeDetails ? {
        id: '3',
        name: 'Bob Johnson',
        image: 'https://example.com/avatar3.jpg',
        createdAt: new Date('2024-01-03'),
        verified: false
      } : null
    }
  ]
  
  // Apply sorting
  mockFollowers.sort((a, b) => {
    let comparison = 0
    
    if (sortBy === 'createdAt') {
      comparison = a.createdAt.getTime() - b.createdAt.getTime()
    } else if (sortBy === 'name' && includeDetails) {
      comparison = (a.user?.name || '').localeCompare(b.user?.name || '')
    }
    
    return sortOrder === 'asc' ? comparison : -comparison
  })
  
  // Apply pagination
  return mockFollowers.slice(skip, skip + take).map(follower => ({
    id: follower.id,
    followedAt: follower.createdAt,
    user: follower.user || {
      id: follower.userId,
      name: 'Unknown User'
    }
  }))
}

async function getFollowersCount(targetUserId: string): Promise<number> {
  // TODO: Replace with actual database count query
  return 2
}

async function checkIfFollowing(currentUserId: string, targetUserId: string): Promise<boolean> {
  // TODO: Replace with actual database query
  // Check if currentUserId follows targetUserId
  return false
}