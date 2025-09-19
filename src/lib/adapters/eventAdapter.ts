/**
 * Event Adapter - Transforms external database Event structure to internal format
 * 
 * This adapter handles the mapping between the external database structure
 * (with from_date, to_date, etc.) and our internal application format
 * (with startDate, endDate, etc.)
 */

import { Event as ExternalEvent, event_prices, ExternalEventVenue } from '../../../packages/database/src/index'

// Internal event interface that matches our application expectations
export interface InternalEvent {
  id: string
  name: string | null
  description: string | null
  startDate: Date
  endDate: Date
  country: string | null
  city: string | null
  website: string | null
  style: string | null
  imageUrl: string | null
  aiQualityScore: number | null
  aiCompletenessScore: number | null
  extractionMethod: string | null
  createdAt: Date
  updatedAt: Date
  venue?: {
    name: string | null
    address: string | null
    city: string | null
    country: string | null
  } | null
  pricing?: Array<{
    price: number | null
    currency: string | null
    type: string | null
  }>
}

// Type for external event with relations
export type ExternalEventWithRelations = ExternalEvent & {
  venues?: ExternalEventVenue[]
  event_prices?: event_prices[]
}

/**
 * Transforms external event to internal format
 */
export function transformExternalEventToInternal(
  externalEvent: ExternalEventWithRelations
): InternalEvent {
  // Transform image URL from /uploads/ to /api/uploads/ and add fallback
  const transformImageUrl = (url: string | null): string | null => {
    if (!url) {
      // Provide fallback images for events without images
      const fallbackImages = [
        'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1514533212835-32ac976e79a4?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=300&fit=crop'
      ]
      // Use event ID to consistently select same fallback image
      const imageIndex = parseInt(externalEvent.id.toString()) % fallbackImages.length
      return fallbackImages[imageIndex]
    }
    if (url.startsWith('/uploads/')) {
      return `/api${url}`
    }
    return url
  }

  return {
    id: externalEvent.id.toString(),
    name: externalEvent.name,
    description: externalEvent.description,
    startDate: externalEvent.from_date,
    endDate: externalEvent.to_date,
    country: externalEvent.country,
    city: externalEvent.city,
    website: externalEvent.website,
    style: externalEvent.style,
    imageUrl: transformImageUrl(externalEvent.image_url),
    aiQualityScore: externalEvent.ai_quality_score,
    aiCompletenessScore: externalEvent.ai_completeness_score,
    extractionMethod: externalEvent.extraction_method,
    createdAt: externalEvent.created_at || new Date(),
    updatedAt: externalEvent.updated_at || new Date(),
    venue: {
      name: externalEvent.venues?.[0]?.name || null,
      address: externalEvent.venues?.[0]?.address || null,
      city: externalEvent.city,
      country: externalEvent.country,
    },
    pricing: externalEvent.event_prices?.map(p => ({
      price: p.amount ? Number(p.amount) : null,
      currency: p.currency,
      type: p.type,
    })) || []
  }
}

/**
 * Transforms multiple external events to internal format
 */
export function transformExternalEventsToInternal(
  externalEvents: ExternalEventWithRelations[]
): InternalEvent[] {
  return externalEvents.map(transformExternalEventToInternal)
}

/**
 * Creates a search query for external events that matches our internal expectations
 */
export function createExternalEventQuery(filters?: {
  country?: string
  city?: string
  style?: string
  dateFrom?: Date
  dateTo?: Date
  limit?: number
  offset?: number
}) {
  const where: any = {}
  
  if (filters?.country) {
    where.country = {
      contains: filters.country,
      mode: 'insensitive'
    }
  }
  
  if (filters?.city) {
    where.city = {
      contains: filters.city,
      mode: 'insensitive'
    }
  }
  
  if (filters?.style) {
    where.style = {
      contains: filters.style,
      mode: 'insensitive'
    }
  }
  
  if (filters?.dateFrom || filters?.dateTo) {
    where.from_date = {}
    if (filters.dateFrom) {
      where.from_date.gte = filters.dateFrom
    }
    if (filters.dateTo) {
      where.from_date.lte = filters.dateTo
    }
  }
  
  return {
    where,
    include: {
      venues: true,
      event_prices: true,
    },
    take: filters?.limit || 100,
    skip: filters?.offset || 0,
    orderBy: {
      from_date: 'asc' as const
    }
  }
}

/**
 * Helper function to format event dates for display
 */
export function formatEventDateRange(event: InternalEvent): string {
  const start = event.startDate.toLocaleDateString()
  const end = event.endDate.toLocaleDateString()
  
  if (start === end) {
    return start
  }
  
  return `${start} - ${end}`
}

/**
 * Helper function to get event location string
 */
export function getEventLocationString(event: InternalEvent): string {
  const parts = [event.city, event.country].filter(Boolean)
  return parts.join(', ') || 'Location TBD'
}

/**
 * Helper function to check if event is upcoming
 */
export function isEventUpcoming(event: InternalEvent): boolean {
  return event.startDate > new Date()
}

/**
 * Helper function to check if event is currently happening
 */
export function isEventCurrent(event: InternalEvent): boolean {
  const now = new Date()
  return event.startDate <= now && event.endDate >= now
}

/**
 * Helper function to get event status
 */
export function getEventStatus(event: InternalEvent): 'upcoming' | 'current' | 'past' {
  const now = new Date()
  
  if (event.endDate < now) {
    return 'past'
  }
  
  if (event.startDate <= now && event.endDate >= now) {
    return 'current'
  }
  
  return 'upcoming'
}