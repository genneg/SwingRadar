/**
 * Teacher Service - Handles all teacher-related operations
 * 
 * This service provides a clean interface for working with teachers,
 * handling the complexity of the external database structure internally.
 */

import { db } from '../../../packages/database/src/index'

export interface InternalTeacher {
  id: string
  name: string
  bio: string | null
  website: string | null
  imageUrl: string | null
  aiRelevanceScore: number | null
  specialties: string[]
  upcomingEvents: number
  totalEvents: number
}

export interface TeacherFilters {
  search?: string
  limit?: number
  offset?: number
}

export interface TeacherSearchResult {
  teachers: InternalTeacher[]
  total: number
  hasMore: boolean
}

/**
 * Transforms external teacher to internal format
 */
function transformTeacherToInternal(teacher: any): InternalTeacher {
  // Transform image URL from /uploads/ to /api/uploads/
  const transformImageUrl = (url: string | null): string | null => {
    if (!url) return null
    if (url.startsWith('/uploads/')) {
      return `/api${url}`
    }
    return url
  }

  return {
    id: teacher.id.toString(),
    name: teacher.name,
    bio: teacher.bio,
    website: teacher.website,
    imageUrl: transformImageUrl(teacher.image_url),
    aiRelevanceScore: teacher.ai_relevance_score,
    specialties: ['Blues', 'Connection'], // Default specialties - could be enhanced
    upcomingEvents: teacher._count?.event_teachers || 0,
    totalEvents: teacher._count?.event_teachers || 0
  }
}

/**
 * Gets teachers with filtering and pagination
 */
export async function getTeachers(filters: TeacherFilters = {}): Promise<TeacherSearchResult> {
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
    
    const query = {
      where: whereClause,
      include: {
        _count: {
          select: {
            event_teachers: true
          }
        }
      },
      take: filters.limit || 20,
      skip: filters.offset || 0,
      orderBy: {
        name: 'asc' as const
      }
    }
    
    // Get teachers and total count
    const [teachers, total] = await Promise.all([
      db.teacher.findMany(query),
      db.teacher.count({ where: whereClause })
    ])
    
    const transformedTeachers = teachers.map(transformTeacherToInternal)
    
    return {
      teachers: transformedTeachers,
      total,
      hasMore: (filters.offset || 0) + teachers.length < total
    }
  } catch (error) {
    console.error('Error fetching teachers:', error)
    throw new Error('Failed to fetch teachers')
  }
}

/**
 * Gets a single teacher by ID
 */
export async function getTeacherById(id: string): Promise<InternalTeacher | null> {
  try {
    const teacher = await db.teacher.findUnique({
      where: { id: parseInt(id) },
      include: {
        _count: {
          select: {
            event_teachers: true
          }
        }
      }
    })
    
    if (!teacher) {
      return null
    }
    
    return transformTeacherToInternal(teacher)
  } catch (error) {
    console.error('Error fetching teacher by ID:', error)
    throw new Error('Failed to fetch teacher')
  }
}

/**
 * Gets a single teacher by ID with events
 */
export async function getTeacherByIdWithEvents(id: string): Promise<InternalTeacher & { events: any[] } | null> {
  try {
    const teacher = await db.teacher.findUnique({
      where: { id: parseInt(id) },
      include: {
        _count: {
          select: {
            event_teachers: true
          }
        },
        event_teachers: {
          include: {
            events: {
              include: {
                venues: true,
                event_prices: true
              }
            }
          }
        }
      }
    })
    
    if (!teacher) {
      return null
    }
    
    const baseTeacher = transformTeacherToInternal(teacher)
    
    // Transform events to match Festival interface
    const events = teacher.event_teachers?.map((et: any) => {
      const event = et.events
      const primaryVenue = event.venues?.[0]
      
      return {
        id: event.id.toString(),
        name: event.name,
        description: event.description,
        startDate: event.from_date,
        endDate: event.to_date,
        registrationDeadline: null, // Not available in current schema
        website: event.website,
        image: event.image_url?.startsWith('/uploads/') ? `/api${event.image_url}` : event.image_url,
        venue: {
          id: primaryVenue?.id?.toString() || '1',
          name: primaryVenue?.name || 'Venue TBD',
          address: primaryVenue?.address || '',
          city: event.city,
          country: event.country,
          latitude: 0,
          longitude: 0
        },
        teachers: [{ id: teacher.id.toString(), name: teacher.name }],
        musicians: [],
        prices: event.event_prices?.map((price: any) => ({
          id: price.id.toString(),
          category: price.type,
          amount: Number(price.amount),
          currency: price.currency,
          description: price.description
        })) || [],
        createdAt: event.created_at || new Date(),
        updatedAt: event.updated_at || new Date()
      }
    }) || []
    
    return {
      ...baseTeacher,
      events
    }
  } catch (error) {
    console.error('Error fetching teacher with events:', error)
    throw new Error('Failed to fetch teacher with events')
  }
}

/**
 * Gets popular teachers (by event count)
 */
export async function getPopularTeachers(limit: number = 10): Promise<InternalTeacher[]> {
  try {
    const teachers = await db.teacher.findMany({
      include: {
        _count: {
          select: {
            event_teachers: true
          }
        }
      },
      orderBy: {
        event_teachers: {
          _count: 'desc'
        }
      },
      take: limit
    })
    
    return teachers.map(transformTeacherToInternal)
  } catch (error) {
    console.error('Error fetching popular teachers:', error)
    throw new Error('Failed to fetch popular teachers')
  }
}

/**
 * Searches teachers by text query
 */
export async function searchTeachers(query: string, filters: Omit<TeacherFilters, 'search'> = {}): Promise<TeacherSearchResult> {
  return getTeachers({
    ...filters,
    search: query
  })
}

/**
 * Gets teacher statistics
 */
export async function getTeacherStats() {
  try {
    const totalTeachers = await db.teacher.count()
    
    return {
      totalTeachers,
      activeTeachers: totalTeachers // Could be enhanced with actual activity check
    }
  } catch (error) {
    console.error('Error fetching teacher stats:', error)
    throw new Error('Failed to fetch teacher statistics')
  }
}