/**
 * Event Service - Handles all event-related operations
 * 
 * This service provides a clean interface for working with events,
 * handling the complexity of the external database structure internally.
 */

import { db } from '../../../packages/database/src/index'
import { 
  transformExternalEventToInternal,
  transformExternalEventsToInternal,
  createExternalEventQuery,
  InternalEvent
} from '@/lib/adapters/eventAdapter'

export interface EventFilters {
  country?: string
  city?: string
  style?: string
  dateFrom?: Date
  dateTo?: Date
  search?: string
  limit?: number
  offset?: number
}

export interface EventSearchResult {
  events: InternalEvent[]
  total: number
  hasMore: boolean
}

/**
 * Gets events with filtering and pagination
 */
export async function getEvents(filters: EventFilters = {}): Promise<EventSearchResult> {
  try {
    const query = createExternalEventQuery(filters)
    
    // Add search functionality if provided
    if (filters.search) {
      query.where.OR = [
        {
          name: {
            contains: filters.search,
            mode: 'insensitive'
          }
        },
        {
          description: {
            contains: filters.search,
            mode: 'insensitive'
          }
        },
        {
          city: {
            contains: filters.search,
            mode: 'insensitive'
          }
        },
        {
          country: {
            contains: filters.search,
            mode: 'insensitive'
          }
        }
      ]
    }
    
    // Get events and total count
    const [events, total] = await Promise.all([
      db.event.findMany(query),
      db.event.count({ where: query.where })
    ])
    
    const transformedEvents = transformExternalEventsToInternal(events)
    
    return {
      events: transformedEvents,
      total,
      hasMore: (filters.offset || 0) + events.length < total
    }
  } catch (error) {
    console.error('Error fetching events:', error)
    throw new Error('Failed to fetch events')
  }
}

/**
 * Gets a single event by ID
 */
export async function getEventById(id: string): Promise<InternalEvent | null> {
  try {
    const event = await db.event.findUnique({
      where: { id: parseInt(id) },
      include: {
        venues: true,
        event_prices: true,
      }
    })
    
    if (!event) {
      return null
    }
    
    return transformExternalEventToInternal(event)
  } catch (error) {
    console.error('Error fetching event by ID:', error)
    throw new Error('Failed to fetch event')
  }
}

/**
 * Gets upcoming events (next 30 days by default)
 */
export async function getUpcomingEvents(limit: number = 10): Promise<InternalEvent[]> {
  const now = new Date()
  const thirtyDaysFromNow = new Date()
  thirtyDaysFromNow.setDate(now.getDate() + 30)
  
  const result = await getEvents({
    dateFrom: now,
    dateTo: thirtyDaysFromNow,
    limit
  })
  
  return result.events
}

/**
 * Gets events by country
 */
export async function getEventsByCountry(country: string, limit: number = 20): Promise<InternalEvent[]> {
  const result = await getEvents({
    country,
    limit
  })
  
  return result.events
}

/**
 * Gets events by style
 */
export async function getEventsByStyle(style: string, limit: number = 20): Promise<InternalEvent[]> {
  const result = await getEvents({
    style,
    limit
  })
  
  return result.events
}

/**
 * Searches events by text query
 */
export async function searchEvents(query: string, filters: Omit<EventFilters, 'search'> = {}): Promise<EventSearchResult> {
  return getEvents({
    ...filters,
    search: query
  })
}

/**
 * Gets event statistics
 */
export async function getEventStats() {
  try {
    const [
      totalEvents,
      upcomingEvents,
      countsByCountry,
      countsByStyle
    ] = await Promise.all([
      db.event.count(),
      db.event.count({
        where: {
          from_date: {
            gte: new Date()
          }
        }
      }),
      db.event.groupBy({
        by: ['country'],
        _count: {
          country: true
        },
        where: {
          country: {
            not: null as any
          }
        },
        orderBy: {
          _count: {
            country: 'desc'
          }
        },
        take: 10
      }),
      db.event.groupBy({
        by: ['style'],
        _count: {
          style: true
        },
        where: {
          style: {
            not: null
          }
        },
        orderBy: {
          _count: {
            style: 'desc'
          }
        },
        take: 10
      })
    ])
    
    return {
      totalEvents,
      upcomingEvents,
      topCountries: countsByCountry.map(item => ({
        country: item.country,
        count: (item._count as any)?.country || 0
      })),
      topStyles: countsByStyle.map(item => ({
        style: item.style,
        count: (item._count as any)?.style || 0
      }))
    }
  } catch (error) {
    console.error('Error fetching event stats:', error)
    throw new Error('Failed to fetch event statistics')
  }
}

/**
 * Gets events for a specific date range
 */
export async function getEventsInDateRange(
  startDate: Date, 
  endDate: Date, 
  limit: number = 50
): Promise<InternalEvent[]> {
  const result = await getEvents({
    dateFrom: startDate,
    dateTo: endDate,
    limit
  })
  
  return result.events
}

/**
 * Gets events near a specific location (by city/country)
 */
export async function getEventsNearLocation(
  city?: string, 
  country?: string, 
  limit: number = 20
): Promise<InternalEvent[]> {
  const result = await getEvents({
    city,
    country,
    limit
  })
  
  return result.events
}