import { NextRequest } from 'next/server'

// Force dynamic runtime
export const dynamic = 'force-dynamic'

import { 
  apiResponse, 
  apiError, 
  validatePagination, 
  buildTextSearchConditions,
  extractSearchParams,
  handleApiError,
  validateMethod
} from '@/lib/api/utils'
import type { Teacher } from '@/types'

/**
 * GET /api/search/teachers - Advanced search for teachers
 * Query parameters:
 * - q: search query (required)
 * - page: page number (default: 1)
 * - limit: items per page (default: 10, max: 50)
 * - specialties: comma-separated list of specialties
 * - location: city or country filter
 * - hasUpcomingEvents: boolean to filter teachers with upcoming events
 * - sortBy: name, relevance, upcoming_events (default: relevance)
 * - sortOrder: asc, desc (default: desc)
 */
export async function GET(request: NextRequest) {
  try {
    validateMethod(request, ['GET'])
    
    const params = extractSearchParams(request.url)
    
    // Validate required search query
    if (!params.q || params.q.trim().length < 2) {
      return apiError('Search query must be at least 2 characters long', 400)
    }
    
    const { page, limit, skip, take } = validatePagination(params.page, params.limit)
    const searchQuery = params.q.trim()
    
    // Build search conditions
    const where: Record<string, any> = {}
    
    // Text search across name and bio
    const searchConditions = buildTextSearchConditions(
      searchQuery,
      ['name', 'bio']
    )
    where.OR = searchConditions
    
    // Filter by specialties
    if (params.specialties) {
      const specialtiesArray = params.specialties.split(',').map(s => s.trim())
      where.specialties = {
        hasSome: specialtiesArray
      }
    }
    
    // Filter by location (search in associated festival venues)
    if (params.location) {
      where.festivals = {
        some: {
          venue: {
            OR: [
              { city: { contains: params.location, mode: 'insensitive' } },
              { country: { contains: params.location, mode: 'insensitive' } }
            ]
          }
        }
      }
    }
    
    // Filter teachers with upcoming events
    if (params.hasUpcomingEvents === 'true') {
      where.festivals = {
        some: {
          startDate: {
            gte: new Date()
          }
        }
      }
    }
    
    // TODO: Replace with actual Prisma query
    const mockTeachers: Teacher[] = [
      {
        id: '1',
        name: 'Alice Johnson',
        bio: 'Experienced blues dance instructor specializing in authentic connection and musicality',
        specialties: ['Blues', 'Connection', 'Musicality'],
        website: 'https://alicejohnsonblues.com',
        socialLinks: {
          facebook: 'https://facebook.com/alicejohnsonblues',
          instagram: 'https://instagram.com/alicejohnsonblues'
        },
        followers: [],
        festivals: []
      },
      {
        id: '2',
        name: 'Bob Smith',
        bio: 'Award-winning blues dancer and teacher with 15 years of experience',
        specialties: ['Blues', 'Solo Jazz', 'Performance'],
        website: 'https://bobsmithblues.com',
        socialLinks: {
          facebook: 'https://facebook.com/bobsmithblues',
          youtube: 'https://youtube.com/bobsmithblues'
        },
        followers: [],
        festivals: []
      },
      {
        id: '3',
        name: 'Carol Williams',
        bio: 'Contemporary blues teacher focusing on improvisation and creativity',
        specialties: ['Blues', 'Improvisation', 'Creative Movement'],
        website: 'https://carolwilliamsblues.com',
        socialLinks: {
          instagram: 'https://instagram.com/carolwilliamsblues'
        },
        followers: [],
        festivals: []
      }
    ]
    
    // Apply search filtering (mock implementation)
    let filteredTeachers = mockTeachers.filter(teacher => {
      const searchTerm = searchQuery.toLowerCase()
      return teacher.name.toLowerCase().includes(searchTerm) ||
             teacher.bio?.toLowerCase().includes(searchTerm) ||
             teacher.specialties?.some(specialty => 
               specialty.toLowerCase().includes(searchTerm)
             )
    })
    
    // Apply additional filters
    if (params.specialties) {
      const specialtiesArray = params.specialties.split(',').map(s => s.trim())
      filteredTeachers = filteredTeachers.filter(teacher =>
        specialtiesArray.some(specialty =>
          teacher.specialties?.some(teacherSpecialty =>
            teacherSpecialty.toLowerCase().includes(specialty.toLowerCase())
          )
        )
      )
    }
    
    // Apply sorting
    const sortBy = params.sortBy || 'relevance'
    const sortOrder = params.sortOrder || 'desc'
    
    filteredTeachers.sort((a, b) => {
      let comparison = 0
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name)
          break
        case 'relevance':
          // Simple relevance scoring based on search term position
          const aScore = a.name.toLowerCase().indexOf(searchQuery.toLowerCase())
          const bScore = b.name.toLowerCase().indexOf(searchQuery.toLowerCase())
          comparison = aScore - bScore
          break
        case 'upcoming_events':
          // TODO: Implement based on actual upcoming events count
          comparison = 0
          break
        default:
          comparison = 0
      }
      
      return sortOrder === 'asc' ? comparison : -comparison
    })
    
    // Apply pagination
    const paginatedTeachers = filteredTeachers.slice(skip, skip + take)
    
    // Calculate pagination metadata
    const total = filteredTeachers.length
    const totalPages = Math.ceil(total / limit)
    const hasNext = page < totalPages
    const hasPrev = page > 1
    
    const response = {
      teachers: paginatedTeachers,
      searchQuery,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext,
        hasPrev
      },
      filters: {
        specialties: params.specialties?.split(',').map(s => s.trim()) || [],
        location: params.location || null,
        hasUpcomingEvents: params.hasUpcomingEvents === 'true',
        sortBy,
        sortOrder
      }
    }
    
    return apiResponse(response, true, `Found ${total} teachers matching "${searchQuery}"`)
    
  } catch (error) {
    return handleApiError(error)
  }
}