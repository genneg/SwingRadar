import { NextRequest } from 'next/server'
import { z } from 'zod'

import { db } from '@/lib/database'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    if (!id) {
      return Response.json(
        {
          success: false,
          error: 'Teacher ID is required',
        },
        { status: 400 }
      )
    }

    // Parse ID as integer
    const numericId = parseInt(id, 10)

    if (isNaN(numericId)) {
      return Response.json(
        {
          success: false,
          error: 'Invalid teacher ID. Must be a number.',
        },
        { status: 400 }
      )
    }

    // Fetch teacher with full details
    const teacher = await db.teacher.findUnique({
      where: {
        id: numericId,
      },
      include: {
        event_teachers: {
          include: {
            events: {
              select: {
                id: true,
                name: true,
                from_date: true,
                to_date: true,
                city: true,
                country: true,
                image_url: true,
              },
            },
          },
        },
      },
    })

    if (!teacher) {
      return Response.json(
        {
          success: false,
          error: 'Teacher not found',
        },
        { status: 404 }
      )
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

    // Transform to expected format
    const transformedTeacher = {
      id: teacher.id.toString(),
      name: teacher.name,
      bio: teacher.bio,
      specialties: ['Blues', 'Connection'], // Default specialties
      website: teacher.website,
      imageUrl: transformImageUrl(teacher.image_url),
      socialLinks: {},
      followers: [],
      festivals:
        teacher.event_teachers?.map((et: any) => ({
          id: et.events.id.toString(),
          name: et.events.name,
          startDate: et.events.from_date,
          endDate: et.events.to_date,
          city: et.events.city,
          country: et.events.country,
          image: transformImageUrl(et.events.image_url),
        })) || [],
      stats: {
        totalEvents: teacher.event_teachers?.length || 0,
        upcomingEvents:
          teacher.event_teachers?.filter((et: any) => new Date(et.events.from_date) > new Date())
            .length || 0,
        totalFollowers: 0,
      },
    }

    return Response.json({
      data: transformedTeacher,
      success: true,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Teacher API error:', error)
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch teacher',
      },
      { status: 500 }
    )
  }
}
