import { NextRequest } from 'next/server'

import { db } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '10'), 100)
    const page = Math.max(parseInt(url.searchParams.get('page') || '1'), 1)
    const skip = (page - 1) * limit

    // Direct database query
    const [teachers, total] = await Promise.all([
      db.teacher.findMany({
        take: limit,
        skip: skip,
        include: {
          _count: {
            select: {
              event_teachers: true,
            },
          },
        },
        orderBy: {
          name: 'asc',
        },
      }),
      db.teacher.count(),
    ])

    // Transform to expected format
    const transformedTeachers = teachers.map(teacher => ({
      id: teacher.id.toString(),
      name: teacher.name,
      bio: teacher.bio,
      website: teacher.website,
      imageUrl: teacher.image_url?.startsWith('/uploads/')
        ? `https://tqvvseagpkmdnsiuwabv.supabase.co/storage/v1/object/public/bluesbucket/${teacher.image_url.replace('/uploads/', '')}`
        : teacher.image_url,
      aiRelevanceScore: teacher.ai_relevance_score,
      specialties: ['Blues', 'Connection'],
      upcomingEvents: teacher._count?.event_teachers || 0,
      totalEvents: teacher._count?.event_teachers || 0,
    }))

    const totalPages = Math.ceil(total / limit)

    return Response.json({
      data: {
        teachers: transformedTeachers,
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
      message: 'Teachers retrieved successfully',
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Teachers API error:', error)
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/teachers - Create a new teacher (for future admin functionality)
 */
export async function POST(request: NextRequest) {
  try {
    validateMethod(request, ['POST'])

    // TODO: Implement authentication check for admin users
    // TODO: Implement teacher creation with Prisma

    return apiError('Teacher creation not implemented yet', 501)
  } catch (error) {
    return handleApiError(error)
  }
}
