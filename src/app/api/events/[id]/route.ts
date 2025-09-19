import { NextRequest } from 'next/server'
import { z } from 'zod'

import { apiError, apiResponse, handleApiError } from '@/lib/api/utils'
import { db } from '@/lib/database'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    if (!id) {
      return apiError('Event ID is required', 400)
    }

    // Validate ID format (CUID or UUID)
    const idSchema = z.string().min(1)
    const validatedId = idSchema.parse(id)

    // Parse ID as integer (the Event model uses integer IDs)
    const numericId = parseInt(validatedId, 10)

    if (isNaN(numericId)) {
      return apiError('Invalid event ID. Must be a number.', 400)
    }

    // Fetch event with full details
    const event = await db.event.findUnique({
      where: {
        id: numericId,
      },
      include: {
        venues: {
          select: {
            id: true,
            name: true,
            address: true,
            type: true,
          },
        },
        event_teachers: {
          include: {
            teachers: {
              select: {
                id: true,
                name: true,
                bio: true,
                website: true,
                image_url: true,
              },
            },
          },
        },
        event_musicians: {
          include: {
            musicians: {
              select: {
                id: true,
                name: true,
                slug: true,
                bio: true,
                avatar: true,
                verified: true,
                instruments: true,
                website: true,
                email: true,
                followerCount: true,
                eventCount: true,
                image_url: true,
              },
            },
          },
        },
        event_prices: {
          select: {
            id: true,
            type: true,
            amount: true,
            currency: true,
            description: true,
          },
        },
      },
    })

    if (!event) {
      return apiError('Event not found', 404)
    }

    // Transform image URL to Supabase Storage URL
    const transformImageUrl = (url: string | null): string | null => {
      if (!url) {
        return null
      }
      // If it's already a full URL, return as is
      if (url.startsWith('http')) {
        return url
      }
      // Transform local uploads path to Supabase Storage URL
      if (url.startsWith('/uploads/')) {
        const relativePath = url.replace('/uploads/', '')
        return `https://tqvvseagpkmdnsiuwabv.supabase.co/storage/v1/object/public/bluesbucket/${relativePath}`
      }
      return url
    }

    // Transform data to match EventDetails component expectations
    const primaryVenue = event.venues?.[0]

    const transformedEvent = {
      id: event.id,
      name: event.name,
      description: event.description,
      startDate: event.from_date,
      endDate: event.to_date,
      country: event.country,
      city: event.city,
      website: event.website,
      style: event.style,
      image: transformImageUrl(event.image_url),
      imageUrl: transformImageUrl(event.image_url),
      aiQualityScore: event.ai_quality_score,
      aiCompletenessScore: event.ai_completeness_score,
      extractionMethod: event.extraction_method,
      // Create venue object that EventDetails expects
      venue: {
        id: primaryVenue?.id?.toString() || '1',
        name: primaryVenue?.name || 'Venue TBD',
        address: primaryVenue?.address || '',
        city: event.city,
        country: event.country,
        latitude: 0, // TODO: Add coordinates when available
        longitude: 0,
      },
      venues: event.venues || [], // Keep original venues array as well
      teachers:
        event.event_teachers?.map((et: any) => ({
          id: et.teachers.id.toString(),
          name: et.teachers.name,
          bio: et.teachers.bio,
          website: et.teachers.website,
          image_url: transformImageUrl(et.teachers.image_url),
          specialties: ['Blues', 'Connection'], // Default specialties from teacherService
          role: et.role,
        })) || [],
      musicians:
        event.event_musicians?.map((em: any) => ({
          id: em.musicians.id.toString(),
          name: em.musicians.name,
          bio: em.musicians.bio,
          website: em.musicians.website,
          image_url: transformImageUrl(em.musicians.image_url),
          genre: ['Blues', 'Jazz'], // Default genres from musicianService
          role: em.role,
          setTimes: em.set_times,
        })) || [],
      prices:
        event.event_prices?.map((price: any) => ({
          id: price.id.toString(),
          category: price.type,
          amount: Number(price.amount),
          currency: price.currency,
          description: price.description,
        })) || [],
      createdAt: event.created_at,
      updatedAt: event.updated_at,
    }

    return apiResponse(transformedEvent)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return apiError('Invalid event ID format')
    }

    return handleApiError(error)
  }
}
