import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { 
  apiResponse, 
  apiError, 
  handleApiError,
  validateMethod,
  extractSearchParams,
  validateIds
} from '@/lib/api/utils'

interface RouteParams {
  params: {
    id: string
  }
}

/**
 * GET /api/users/[id]/following-status - Check following status for multiple targets
 * Query parameters:
 * - targets: comma-separated list of target IDs
 * - type: target type (teacher, musician, festival) - required if targets is provided
 * - targetId: single target ID (alternative to targets)
 * - targetType: single target type (alternative to type)
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    validateMethod(request, ['GET'])
    
    const session = await getServerSession(authOptions)
    const { id: userId } = params
    
    if (!session?.user?.id) {
      return apiError('Unauthorized', 401)
    }
    
    // Users can only check their own following status
    if (session.user.id !== userId) {
      return apiError('Forbidden: You can only check your own following status', 403)
    }
    
    const queryParams = extractSearchParams(request.url)
    
    // Handle single target check
    if (queryParams.targetId && queryParams.targetType) {
      const isFollowing = await checkSingleFollowingStatus(
        userId,
        queryParams.targetId,
        queryParams.targetType
      )
      
      return apiResponse({
        targetId: queryParams.targetId,
        targetType: queryParams.targetType,
        isFollowing,
        followedAt: isFollowing ? new Date().toISOString() : null
      }, true, 'Following status retrieved successfully')
    }
    
    // Handle multiple targets check
    if (queryParams.targets && queryParams.type) {
      const targetIds = validateIds(queryParams.targets)
      const targetType = queryParams.type
      
      if (targetIds.length === 0) {
        return apiError('At least one target ID is required', 400)
      }
      
      if (targetIds.length > 100) {
        return apiError('Cannot check more than 100 targets at once', 400)
      }
      
      if (!['teacher', 'musician', 'festival'].includes(targetType)) {
        return apiError('Invalid target type. Must be teacher, musician, or festival', 400)
      }
      
      const followingStatuses = await checkMultipleFollowingStatus(
        userId,
        targetIds,
        targetType
      )
      
      return apiResponse({
        userId,
        targetType,
        statuses: followingStatuses,
        summary: {
          total: targetIds.length,
          following: followingStatuses.filter(s => s.isFollowing).length,
          notFollowing: followingStatuses.filter(s => !s.isFollowing).length
        }
      }, true, 'Following statuses retrieved successfully')
    }
    
    return apiError('Either (targetId and targetType) or (targets and type) parameters are required', 400)
    
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * POST /api/users/[id]/following-status - Batch check following status
 * Request body:
 * {
 *   "targets": [
 *     { "targetId": "string", "targetType": "teacher" | "musician" | "festival" }
 *   ]
 * }
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    validateMethod(request, ['POST'])
    
    const session = await getServerSession(authOptions)
    const { id: userId } = params
    
    if (!session?.user?.id) {
      return apiError('Unauthorized', 401)
    }
    
    // Users can only check their own following status
    if (session.user.id !== userId) {
      return apiError('Forbidden: You can only check your own following status', 403)
    }
    
    const body = await request.json()
    const { targets } = body
    
    if (!Array.isArray(targets) || targets.length === 0) {
      return apiError('Targets array is required and cannot be empty', 400)
    }
    
    if (targets.length > 100) {
      return apiError('Cannot check more than 100 targets at once', 400)
    }
    
    // Validate each target
    const validTargets = targets.map((target, index) => {
      if (!target.targetId || !target.targetType) {
        throw new Error(`Target at index ${index} is missing targetId or targetType`)
      }
      
      if (!['teacher', 'musician', 'festival'].includes(target.targetType)) {
        throw new Error(`Invalid target type at index ${index}: ${target.targetType}`)
      }
      
      return target
    })
    
    // Batch check following status
    const followingStatuses = await batchCheckFollowingStatus(userId, validTargets)
    
    // Group by target type for easier consumption
    const groupedStatuses = groupStatusesByType(followingStatuses)
    
    return apiResponse({
      userId,
      statuses: followingStatuses,
      grouped: groupedStatuses,
      summary: {
        total: validTargets.length,
        following: followingStatuses.filter(s => s.isFollowing).length,
        notFollowing: followingStatuses.filter(s => !s.isFollowing).length,
        byType: {
          teachers: groupedStatuses.teachers.length,
          musicians: groupedStatuses.musicians.length,
          festivals: groupedStatuses.festivals.length
        }
      }
    }, true, 'Batch following statuses retrieved successfully')
    
  } catch (error) {
    return handleApiError(error)
  }
}

// Helper functions (mock implementations - replace with actual database calls)

async function checkSingleFollowingStatus(
  userId: string,
  targetId: string,
  targetType: string
): Promise<boolean> {
  // TODO: Replace with actual database query
  // Check if a follow record exists for this user and target
  return false
}

async function checkMultipleFollowingStatus(
  userId: string,
  targetIds: string[],
  targetType: string
): Promise<Array<{ targetId: string; isFollowing: boolean; followedAt: string | null }>> {
  // TODO: Replace with actual database query
  // Use a single query to check all targets at once for efficiency
  
  return targetIds.map(targetId => ({
    targetId,
    isFollowing: false, // Mock implementation
    followedAt: null
  }))
}

async function batchCheckFollowingStatus(
  userId: string,
  targets: Array<{ targetId: string; targetType: string }>
): Promise<Array<{ targetId: string; targetType: string; isFollowing: boolean; followedAt: string | null }>> {
  // TODO: Replace with actual database query
  // Group targets by type and make efficient queries
  
  return targets.map(target => ({
    targetId: target.targetId,
    targetType: target.targetType,
    isFollowing: false, // Mock implementation
    followedAt: null
  }))
}

function groupStatusesByType(statuses: Array<{ targetId: string; targetType: string; isFollowing: boolean; followedAt: string | null }>) {
  return {
    teachers: statuses.filter(s => s.targetType === 'teacher'),
    musicians: statuses.filter(s => s.targetType === 'musician'),
    festivals: statuses.filter(s => s.targetType === 'festival')
  }
}