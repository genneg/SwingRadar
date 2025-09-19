import { NextRequest } from 'next/server'

import { db } from '@/lib/database'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '10'), 100)
    const page = Math.max(parseInt(url.searchParams.get('page') || '1'), 1)
    const skip = (page - 1) * limit

    // Direct database query
    const [events, total] = await Promise.all([
      db.event.findMany({
        take: limit,
        skip: skip,
        include: {
          venues: true,
          event_prices: true,
        },
        orderBy: {
          from_date: 'asc',
        },
      }),
      db.event.count(),
    ])

    // Transform to expected format
    const transformedEvents = events.map(event => {
      const primaryVenue = event.venues?.[0]

      return {
        id: event.id.toString(),
        name: event.name,
        description: event.description,
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
        venue: primaryVenue
          ? {
              name: primaryVenue.name,
              address: primaryVenue.address,
              city: event.city,
              country: event.country,
            }
          : null,
        pricing:
          event.event_prices?.map(price => ({
            price: Number(price.amount),
            currency: price.currency,
            type: price.type,
          })) || [],
      }
    })

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
      },
      success: true,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Events API error:', error)
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
