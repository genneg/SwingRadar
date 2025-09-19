import { NextRequest } from 'next/server'
import { z } from 'zod'

import { db } from '@/lib/database'

// Mark route as dynamic with short caching
export const dynamic = 'force-dynamic'
export const revalidate = 60 // Cache for 60 seconds

// Optimized search schema
const searchSchema = z.object({
  page: z.string().optional().default('1'),
  limit: z.string().optional().default('20'),
  query: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  sortBy: z
    .enum(['relevance', 'date', 'distance', 'popularity', 'price'])
    .optional()
    .default('relevance'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
})

export async function GET(request: NextRequest) {
  try {
    // Ensure database connection is healthy
    await db.$connect()

    const url = new URL(request.url)

    // Parse parameters
    const page = Math.max(parseInt(url.searchParams.get('page') || '1'), 1)
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '20'), 100)
    const query = url.searchParams.get('query')?.trim() || ''
    const city = url.searchParams.get('city')?.trim() || ''
    const country = url.searchParams.get('country')?.trim() || ''
    const sortBy = url.searchParams.get('sortBy') || 'relevance'
    const sortOrder = url.searchParams.get('sortOrder') || 'desc'

    const skip = (page - 1) * limit

    // Use optimized raw query for better performance
    if (query || city || country) {
      // Use the optimized search function
      const searchResults = await db.$queryRaw<Array<{
        total_count: bigint
        id: number
        name: string
        description: string | null
        short_desc: string | null
        from_date: Date
        to_date: Date
        city: string | null
        country: string | null
        website: string | null
        style: string | null
        image_url: string | null
        ai_quality_score: number | null
        ai_completeness_score: number | null
        extraction_method: string | null
        created_at: Date
        updated_at: Date
        search_rank: number
      }>>`
        SELECT * FROM search_events_optimized(
          ${query || null}::text,
          ${city || null}::text, 
          ${country || null}::text,
          ${limit}::integer,
          ${skip}::integer,
          ${sortBy}::text,
          ${sortOrder}::text
        )
      `

      const total = searchResults.length > 0 ? Number(searchResults[0].total_count) : 0
      
      // Transform results
      const transformedEvents = await Promise.all(
        searchResults.map(async (event) => {
          // Get related data efficiently
          const [venues, prices] = await Promise.all([
            db.venue.findMany({
              where: {
                event_venues: {
                  some: {
                    event_id: event.id
                  }
                }
              },
              select: {
                name: true,
                address: true,
              },
              take: 1
            }),
            db.event_Price.findMany({
              where: { event_id: event.id },
              select: {
                amount: true,
                currency: true,
                type: true,
              },
              take: 1
            })
          ])

          const primaryVenue = venues[0]

          return {
            id: event.id.toString(),
            name: event.name,
            description: event.description,
            shortDesc: event.short_desc,
            startDate: event.from_date,
            endDate: event.to_date,
            country: event.country,
            city: event.city,
            website: event.website,
            style: event.style,
            imageUrl: event.image_url?.startsWith('/uploads/')
              ? `https://tqvvseagpkmdnsiuwabv.supabase.co/storage/v1/object/public/bluesbucket/${event.image_url.replace('/uploads/', '')}`
              : event.image_url,
            aiQualityScore: event.ai_quality_score,
            aiCompletenessScore: event.ai_completeness_score,
            extractionMethod: event.extraction_method,
            createdAt: event.created_at,
            updatedAt: event.updated_at,
            searchRank: event.search_rank,
            venue: primaryVenue
              ? {
                  name: primaryVenue.name,
                  address: primaryVenue.address,
                  city: event.city,
                  country: event.country,
                }
              : null,
            pricing:
              prices?.map(price => ({
                price: Number(price.amount),
                currency: price.currency,
                type: price.type,
              })) || [],
          }
        })
      )

      const totalPages = Math.ceil(total / limit)

      return Response.json({
        data: {
          events: transformedEvents,
          pagination: {
            page,
            limit,
            total,
            totalPages,
            hasNext: page < totalPages,
            hasPrev: page > 1,
          },
          searchMeta: {
            query,
            location: { city, country },
            sorting: { sortBy, sortOrder },
            filters: { city, country },
            totalMatches: total,
            searchType: 'optimized'
          },
        },
        success: true,
        timestamp: new Date().toISOString(),
      })
    } else {
      // For no search criteria, return recent events efficiently
      const [total, events] = await Promise.all([
        db.event.count(),
        db.event.findMany({
          take: limit,
          skip: skip,
          select: {
            id: true,
            name: true,
            description: true,
            short_desc: true,
            from_date: true,
            to_date: true,
            country: true,
            city: true,
            website: true,
            style: true,
            image_url: true,
            ai_quality_score: true,
            ai_completeness_score: true,
            extraction_method: true,
            created_at: true,
            updated_at: true,
          },
          orderBy: { from_date: 'asc' },
        })
      ])

      const transformedEvents = events.map(event => ({
        id: event.id.toString(),
        name: event.name,
        description: event.description,
        shortDesc: event.short_desc,
        startDate: event.from_date,
        endDate: event.to_date,
        country: event.country,
        city: event.city,
        website: event.website,
        style: event.style,
        imageUrl: event.image_url?.startsWith('/uploads/')
          ? `https://tqvvseagpkmdnsiuwabv.supabase.co/storage/v1/object/public/bluesbucket/${event.image_url.replace('/uploads/', '')}`
          : event.image_url,
        aiQualityScore: event.ai_quality_score,
        aiCompletenessScore: event.ai_completeness_score,
        extractionMethod: event.extraction_method,
        createdAt: event.created_at,
        updatedAt: event.updated_at,
        venue: null,
        pricing: [],
      }))

      const totalPages = Math.ceil(total / limit)

      return Response.json({
        data: {
          events: transformedEvents,
          pagination: {
            page,
            limit,
            total,
            totalPages,
            hasNext: page < totalPages,
            hasPrev: page > 1,
          },
          searchMeta: {
            query: '',
            sorting: { sortBy: 'date', sortOrder: 'asc' },
            filters: {},
            totalMatches: total,
            searchType: 'listing'
          },
        },
        success: true,
        timestamp: new Date().toISOString(),
      })
    }
  } catch (error) {
    console.error('Optimized search events error:', error)

    // Handle specific errors
    if (error instanceof Error) {
      if (error.message.includes('search_events_optimized') && error.message.includes('does not exist')) {
        return Response.json(
          {
            success: false,
            error: 'Database optimization not yet applied. Please run the optimization script.',
            fallback: 'Using standard search endpoint',
          },
          { status: 503 }
        )
      }

      if (error.message.includes('connection pool') || error.message.includes('timeout')) {
        return Response.json(
          {
            success: false,
            error: 'Database is temporarily unavailable. Please try again in a moment.',
          },
          { status: 503 }
        )
      }
    }

    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Search failed',
        searchType: 'optimized'
      },
      { status: 500 }
    )
  } finally {
    // Don't disconnect in serverless environments
    if (process.env.NODE_ENV === 'development') {
      await db.$disconnect().catch(() => {}) 
    }
  }
}