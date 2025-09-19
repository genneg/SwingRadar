import { NextRequest } from 'next/server'
import { 
  apiResponse, 
  apiError, 
  validatePagination, 
  buildTextSearchConditions,
  extractSearchParams,
  handleApiError,
  validateMethod
} from '@/lib/api/utils'
import type { Musician } from '@/types'
import { getMusicians } from '@/lib/services/musicianService'

/**
 * GET /api/musicians - Get list of musicians with optional filtering
 * Query parameters:
 * - page: page number (default: 1)
 * - limit: items per page (default: 10, max: 100)
 * - search: search term for name and bio
 * - genre: comma-separated list of genres
 * - hasUpcomingEvents: boolean to filter musicians with upcoming events
 */
export async function GET(request: NextRequest) {
  try {
    validateMethod(request, ['GET'])
    
    const params = extractSearchParams(request.url)
    const { page, limit, skip, take } = validatePagination(params.page, params.limit)
    
    // Build search conditions
    const where: Record<string, any> = {}
    
    // Text search across name and bio
    if (params.search) {
      const searchConditions = buildTextSearchConditions(
        params.search,
        ['name', 'bio']
      )
      where.OR = searchConditions
    }
    
    // Filter by genres
    if (params.genre) {
      const genreArray = params.genre.split(',').map(g => g.trim())
      where.genre = {
        hasSome: genreArray
      }
    }
    
    // Filter musicians with upcoming events
    if (params.hasUpcomingEvents === 'true') {
      where.festivals = {
        some: {
          startDate: {
            gte: new Date()
          }
        }
      }
    }
    
    // Get musicians from database using the musician service
    const filters = {
      search: params.search,
      limit: take,
      offset: skip
    }
    
    const result = await getMusicians(filters)
    
    // Calculate pagination metadata
    const totalPages = Math.ceil(result.total / limit)
    const hasNext = page < totalPages
    const hasPrev = page > 1
    
    const response = {
      musicians: result.musicians,
      pagination: {
        page,
        limit,
        total: result.total,
        totalPages,
        hasNext,
        hasPrev
      }
    }
    
    return apiResponse(response, true, 'Musicians retrieved successfully')
    
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * POST /api/musicians - Create a new musician (for future admin functionality)
 */
export async function POST(request: NextRequest) {
  try {
    validateMethod(request, ['POST'])
    
    // TODO: Implement authentication check for admin users
    // TODO: Implement musician creation with Prisma
    
    return apiError('Musician creation not implemented yet', 501)
    
  } catch (error) {
    return handleApiError(error)
  }
}