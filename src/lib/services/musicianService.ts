/**
 * Musician Service - Handles all musician-related operations
 * 
 * This service provides a clean interface for working with musicians,
 * handling the complexity of the external database structure internally.
 */

import { db } from '@/lib/database'

export interface InternalMusician {
  id: string
  name: string
  slug: string
  bio: string | null
  avatar: string | null
  verified: boolean
  instruments: string[]
  yearsActive: number | null
  website: string | null
  email: string | null
  followerCount: number
  eventCount: number
  imageUrl: string | null
  genres: string[]
  upcomingEvents: number
}

export interface MusicianFilters {
  search?: string
  instruments?: string[]
  verified?: boolean
  limit?: number
  offset?: number
}

export interface MusicianSearchResult {
  musicians: InternalMusician[]
  total: number
  hasMore: boolean
}

/**
 * Transforms external musician to internal format
 */
function transformMusicianToInternal(musician: any): InternalMusician {
  // Transform image URL from /uploads/ to /api/uploads/
  const transformImageUrl = (url: string | null): string | null => {
    if (!url) return null
    if (url.startsWith('/uploads/')) {
      return `/api${url}`
    }
    return url
  }

  return {
    id: musician.id.toString(),
    name: musician.name,
    slug: musician.slug,
    bio: musician.bio,
    avatar: transformImageUrl(musician.avatar),
    verified: musician.verified || false,
    instruments: musician.instruments || [],
    yearsActive: musician.yearsActive,
    website: musician.website,
    email: musician.email,
    followerCount: musician.followerCount || 0,
    eventCount: musician.eventCount || 0,
    imageUrl: transformImageUrl(musician.image_url),
    genres: ['Blues', 'Jazz'], // Default genres - could be enhanced with real data
    upcomingEvents: musician._count?.event_musicians || 0
  }
}

/**
 * Gets musicians with filtering and pagination
 */
export async function getMusicians(filters: MusicianFilters = {}): Promise<MusicianSearchResult> {
  try {
    const whereClause: any = {}
    
    // Add search functionality if provided
    if (filters.search) {
      whereClause.OR = [
        {
          name: {
            contains: filters.search,
            mode: 'insensitive'
          }
        },
        {
          bio: {
            contains: filters.search,
            mode: 'insensitive'
          }
        }
      ]
    }
    
    // Add instruments filter
    if (filters.instruments && filters.instruments.length > 0) {
      whereClause.instruments = {
        hasSome: filters.instruments
      }
    }
    
    // Add verified filter
    if (filters.verified !== undefined) {
      whereClause.verified = filters.verified
    }
    
    const query = {
      where: whereClause,
      include: {
        _count: {
          select: {
            event_musicians: true
          }
        }
      },
      take: filters.limit || 20,
      skip: filters.offset || 0,
      orderBy: [
        { verified: 'desc' as const },
        { followerCount: 'desc' as const },
        { name: 'asc' as const }
      ]
    }
    
    // Get musicians and total count
    const [musicians, total] = await Promise.all([
      db.musician.findMany(query),
      db.musician.count({ where: whereClause })
    ])
    
    const transformedMusicians = musicians.map(transformMusicianToInternal)
    
    return {
      musicians: transformedMusicians,
      total,
      hasMore: (filters.offset || 0) + musicians.length < total
    }
  } catch (error) {
    console.error('Error fetching musicians:', error)
    throw new Error('Failed to fetch musicians')
  }
}

/**
 * Gets a single musician by ID
 */
export async function getMusicianById(id: string): Promise<InternalMusician | null> {
  try {
    const musician = await db.musician.findUnique({
      where: { id: parseInt(id) },
      include: {
        _count: {
          select: {
            event_musicians: true
          }
        }
      }
    })
    
    if (!musician) {
      return null
    }
    
    return transformMusicianToInternal(musician)
  } catch (error) {
    console.error('Error fetching musician by ID:', error)
    throw new Error('Failed to fetch musician')
  }
}

/**
 * Gets musician by slug
 */
export async function getMusicianBySlug(slug: string): Promise<InternalMusician | null> {
  try {
    const musician = await db.musician.findUnique({
      where: { slug },
      include: {
        _count: {
          select: {
            event_musicians: true
          }
        }
      }
    })
    
    if (!musician) {
      return null
    }
    
    return transformMusicianToInternal(musician)
  } catch (error) {
    console.error('Error fetching musician by slug:', error)
    throw new Error('Failed to fetch musician')
  }
}

/**
 * Gets popular musicians (by follower count)
 */
export async function getPopularMusicians(limit: number = 10): Promise<InternalMusician[]> {
  try {
    const musicians = await db.musician.findMany({
      include: {
        _count: {
          select: {
            event_musicians: true
          }
        }
      },
      orderBy: [
        { verified: 'desc' },
        { followerCount: 'desc' },
        { eventCount: 'desc' }
      ],
      take: limit
    })
    
    return musicians.map(transformMusicianToInternal)
  } catch (error) {
    console.error('Error fetching popular musicians:', error)
    throw new Error('Failed to fetch popular musicians')
  }
}

/**
 * Gets verified musicians
 */
export async function getVerifiedMusicians(limit: number = 10): Promise<InternalMusician[]> {
  const result = await getMusicians({
    verified: true,
    limit
  })
  
  return result.musicians
}

/**
 * Searches musicians by text query
 */
export async function searchMusicians(query: string, filters: Omit<MusicianFilters, 'search'> = {}): Promise<MusicianSearchResult> {
  return getMusicians({
    ...filters,
    search: query
  })
}

/**
 * Gets musician statistics
 */
export async function getMusicianStats() {
  try {
    const [
      totalMusicians,
      verifiedMusicians,
      totalFollowers
    ] = await Promise.all([
      db.musician.count(),
      db.musician.count({ where: { verified: true } }),
      db.musician.aggregate({
        _sum: {
          followerCount: true
        }
      })
    ])
    
    return {
      totalMusicians,
      verifiedMusicians,
      totalFollowers: totalFollowers._sum.followerCount || 0
    }
  } catch (error) {
    console.error('Error fetching musician stats:', error)
    throw new Error('Failed to fetch musician statistics')
  }
}

/**
 * Gets musicians by instrument
 */
export async function getMusiciansByInstrument(instrument: string, limit: number = 20): Promise<InternalMusician[]> {
  const result = await getMusicians({
    instruments: [instrument],
    limit
  })
  
  return result.musicians
}