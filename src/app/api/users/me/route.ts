import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'

// Force dynamic runtime
export const dynamic = 'force-dynamic'

import { db } from '@festival-scout/database'
import { authOptions } from '@/lib/auth/config'

import { apiResponse, apiError, handleApiError } from '@/lib/api/utils'

// Get current user profile
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return apiError('Unauthorized', 401)
    }

    // Get current user with all their data
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        verified: true,
        createdAt: true,
        updatedAt: true,
        preferences: {
          select: {
            id: true,
            emailNotifications: true,
            pushNotifications: true,
            newEventNotifications: true,
            deadlineReminders: true,
            weeklyDigest: true,
            followingUpdates: true,
            defaultCountry: true,
            defaultCity: true,
            searchRadius: true,
            theme: true,
            language: true,
            timezone: true,
            createdAt: true,
            updatedAt: true,
          }
        },
        _count: {
          select: {
            following: true,
            savedEvents: true,
            eventReviews: true,
            createdEvents: true,
            notifications: {
              where: { read: false }
            }
          }
        },
        // Recent activity
        savedEvents: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          select: {
            createdAt: true,
            event: {
              select: {
                id: true,
                name: true,
                slug: true,
                startDate: true,
                imageUrl: true,
                venue: {
                  select: {
                    city: true,
                    country: true,
                  }
                }
              }
            }
          }
        },
        following: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          select: {
            targetType: true,
            targetId: true,
            createdAt: true,
          }
        },
        eventReviews: {
          take: 5,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            rating: true,
            review: true,
            createdAt: true,
            event: {
              select: {
                id: true,
                name: true,
                slug: true,
              }
            }
          }
        },
        notifications: {
          where: { read: false },
          take: 10,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            type: true,
            title: true,
            message: true,
            data: true,
            read: true,
            createdAt: true,
          }
        }
      }
    })

    if (!user) {
      return apiError('User not found', 404)
    }

    // Get following details (teachers and musicians)
    const followingDetails = await Promise.all(
      user.following.map(async (follow) => {
        if (follow.targetType === 'TEACHER') {
          const teacher = await db.teacher.findUnique({
            where: { id: follow.targetId },
            select: {
              id: true,
              name: true,
              slug: true,
              avatar: true,
              verified: true,
            }
          })
          return {
            type: 'teacher',
            ...teacher,
            followedAt: follow.createdAt,
          }
        } else if (follow.targetType === 'MUSICIAN') {
          const musician = await db.musician.findUnique({
            where: { id: follow.targetId },
            select: {
              id: true,
              name: true,
              slug: true,
              avatar: true,
              verified: true,
            }
          })
          return {
            type: 'musician',
            ...musician,
            followedAt: follow.createdAt,
          }
        }
        return null
      })
    )

    // Transform data for response
    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      verified: user.verified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      preferences: user.preferences,
      stats: {
        following: user._count.following,
        savedEvents: user._count.savedEvents,
        reviews: user._count.eventReviews,
        createdEvents: user._count.createdEvents,
        unreadNotifications: user._count.notifications,
      },
      recentActivity: {
        savedEvents: user.savedEvents.map(save => ({
          createdAt: save.createdAt,
          event: save.event,
        })),
        following: followingDetails.filter(Boolean),
        reviews: user.eventReviews,
      },
      notifications: user.notifications,
    }

    return apiResponse(userData)

  } catch (error) {
    return handleApiError(error)
  }
}

// Update current user profile (convenience endpoint)
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return apiError('Unauthorized', 401)
    }

    // Redirect to the specific user endpoint
    const url = new URL(request.url)
    const newUrl = url.origin + `/api/users/${session.user.id}`
    
    return Response.redirect(newUrl, 307) // Temporary redirect with method preservation

  } catch (error) {
    return handleApiError(error)
  }
}