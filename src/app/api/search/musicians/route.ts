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
import type { Musician } from '@/types'

/**
 * GET /api/search/musicians - Advanced search for musicians
 * Query parameters:
 * - q: search query (required)
 * - page: page number (default: 1)
 * - limit: items per page (default: 10, max: 50)
 * - genre: comma-separated list of genres
 * - location: city or country filter
 * - hasUpcomingEvents: boolean to filter musicians with upcoming events
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
    
    // Filter by genres
    if (params.genre) {
      const genreArray = params.genre.split(',').map(g => g.trim())
      where.genre = {
        hasSome: genreArray
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
    
    // TODO: Replace with actual Prisma query
    const mockMusicians: Musician[] = [
      {
        id: '1',
        name: 'Charlie Blues Band',
        bio: 'Traditional blues band with over 20 years of experience performing at dance events worldwide',
        genre: ['Blues', 'Traditional Jazz', 'Swing'],
        website: 'https://charliebluesband.com',
        socialLinks: {
          facebook: 'https://facebook.com/charliebluesband',
          instagram: 'https://instagram.com/charliebluesband',
          spotify: 'https://spotify.com/artist/charliebluesband'
        },
        followers: [],
        festivals: []
      },
      {
        id: '2',
        name: 'Diana Jazz Quartet',
        bio: 'Contemporary jazz ensemble specializing in blues-influenced improvisation',
        genre: ['Jazz', 'Blues', 'Contemporary'],
        website: 'https://dianajazzquartet.com',
        socialLinks: {
          facebook: 'https://facebook.com/dianajazzquartet',
          youtube: 'https://youtube.com/dianajazzquartet',
          spotify: 'https://spotify.com/artist/dianajazzquartet'
        },
        followers: [],
        festivals: []
      },
      {
        id: '3',
        name: 'Eddie "The Voice" Thompson',
        bio: 'Soulful blues vocalist known for his powerful performances and audience engagement',
        genre: ['Blues', 'Soul', 'R&B'],
        website: 'https://eddiethevoice.com',
        socialLinks: {
          facebook: 'https://facebook.com/eddiethevoice',
          instagram: 'https://instagram.com/eddiethevoice',
          spotify: 'https://spotify.com/artist/eddiethevoice'
        },
        followers: [],
        festivals: []
      },
      {
        id: '4',
        name: 'Frank\'s Blues Collective',
        bio: 'Innovative blues collective blending traditional and modern elements',
        genre: ['Blues', 'Modern Jazz', 'Fusion'],
        website: 'https://franksbluescollective.com',
        socialLinks: {
          instagram: 'https://instagram.com/franksbluescollective',
          spotify: 'https://spotify.com/artist/franksbluescollective'
        },
        followers: [],
        festivals: []
      }
    ]
    
    // Apply search filtering (mock implementation)
    let filteredMusicians = mockMusicians.filter(musician => {
      const searchTerm = searchQuery.toLowerCase()
      return musician.name.toLowerCase().includes(searchTerm) ||
             musician.bio?.toLowerCase().includes(searchTerm) ||
             musician.genre?.some(genre => 
               genre.toLowerCase().includes(searchTerm)
             )
    })
    
    // Apply additional filters
    if (params.genre) {
      const genreArray = params.genre.split(',').map(g => g.trim())
      filteredMusicians = filteredMusicians.filter(musician =>
        genreArray.some(genre =>
          musician.genre?.some(musicianGenre =>
            musicianGenre.toLowerCase().includes(genre.toLowerCase())
          )
        )
      )
    }
    
    // Apply sorting
    const sortBy = params.sortBy || 'relevance'
    const sortOrder = params.sortOrder || 'desc'
    
    filteredMusicians.sort((a, b) => {
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
    const paginatedMusicians = filteredMusicians.slice(skip, skip + take)
    
    // Calculate pagination metadata
    const total = filteredMusicians.length
    const totalPages = Math.ceil(total / limit)
    const hasNext = page < totalPages
    const hasPrev = page > 1
    
    const response = {
      musicians: paginatedMusicians,
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
        genre: params.genre?.split(',').map(g => g.trim()) || [],
        location: params.location || null,
        hasUpcomingEvents: params.hasUpcomingEvents === 'true',
        sortBy,
        sortOrder
      }
    }
    
    return apiResponse(response, true, `Found ${total} musicians matching "${searchQuery}"`)
    
  } catch (error) {
    return handleApiError(error)
  }
}