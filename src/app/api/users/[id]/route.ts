import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import bcrypt from 'bcryptjs'

import { db } from '@festival-scout/database'
import { authOptions } from '@/lib/auth/config'

import { apiResponse, apiError, handleApiError } from '@/lib/api/utils'

// Validation schemas
const updateUserSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long').optional(),
  email: z.string().email('Invalid email format').optional(),
  avatar: z.string().url('Invalid avatar URL').optional(),
  bio: z.string().max(500, 'Bio too long').optional(),
})

const updatePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(1, 'Password confirmation is required'),
}).refine(
  (data) => data.newPassword === data.confirmPassword,
  {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  }
)

// Get user profile
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    const { id } = params

    if (!session?.user?.id) {
      return apiError('Unauthorized', 401)
    }

    // Users can only access their own profile or public profiles
    const isOwnProfile = session.user.id === id
    
    // Find user with appropriate fields based on privacy
    const user = await db.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: isOwnProfile, // Only show email to profile owner
        avatar: true,
        verified: true,
        createdAt: true,
        updatedAt: true,
        preferences: isOwnProfile ? {
          select: {
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
          }
        } : false,
        // Public statistics
        _count: {
          select: {
            following: true,
            savedEvents: true,
            eventReviews: true,
            createdEvents: true,
          }
        },
        // Recent activity (limited)
        savedEvents: {
          take: 5,
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
              }
            }
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
        }
      }
    })

    if (!user) {
      return apiError('User not found', 404)
    }

    // Transform data for response
    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      verified: user.verified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      preferences: user.preferences || null,
      stats: {
        following: user._count.following,
        savedEvents: user._count.savedEvents,
        reviews: user._count.eventReviews,
        createdEvents: user._count.createdEvents,
      },
      recentActivity: {
        savedEvents: user.savedEvents.map(save => ({
          createdAt: save.createdAt,
          event: save.event,
        })),
        reviews: user.eventReviews,
      }
    }

    return apiResponse(userData)

  } catch (error) {
    return handleApiError(error)
  }
}

// Update user profile
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    const { id } = params

    if (!session?.user?.id) {
      return apiError('Unauthorized', 401)
    }

    // Users can only update their own profile
    if (session.user.id !== id) {
      return apiError('Forbidden: You can only update your own profile', 403)
    }

    const body = await request.json()
    
    // Check if this is a password update
    if (body.currentPassword) {
      const passwordData = updatePasswordSchema.parse(body)
      
      // Get current user with password
      const currentUser = await db.user.findUnique({
        where: { id },
        include: {
          accounts: {
            where: { provider: 'credentials' },
            select: { password: true }
          }
        }
      })

      if (!currentUser) {
        return apiError('User not found', 404)
      }

      // Check if user has a password (might be OAuth only)
      const passwordAccount = currentUser.accounts.find(acc => acc.password)
      if (!passwordAccount?.password) {
        return apiError('No password set. Please use social login.', 400)
      }

      // Verify current password
      const isValidPassword = await bcrypt.compare(
        passwordData.currentPassword,
        passwordAccount.password
      )

      if (!isValidPassword) {
        return apiError('Current password is incorrect', 400)
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(passwordData.newPassword, 10)

      // Update password
      await db.account.update({
        where: {
          provider_providerAccountId: {
            provider: 'credentials',
            providerAccountId: id, // Use user ID as provider account ID for credentials
          }
        },
        data: {
          password: hashedPassword
        }
      })

      return apiResponse({ message: 'Password updated successfully' })
    }

    // Regular profile update
    const updateData = updateUserSchema.parse(body)

    // Check if email is being changed and if it's already taken
    if (updateData.email) {
      const existingUser = await db.user.findUnique({
        where: { email: updateData.email }
      })

      if (existingUser && existingUser.id !== id) {
        return apiError('Email already taken', 400)
      }
    }

    // Update user
    const updatedUser = await db.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        verified: true,
        createdAt: true,
        updatedAt: true,
      }
    })

    return apiResponse(updatedUser)

  } catch (error) {
    if (error instanceof z.ZodError) {
      return apiError('Invalid input: ' + error.issues.map(e => e.message).join(', '))
    }

    return handleApiError(error)
  }
}

// Delete user account
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    const { id } = params

    if (!session?.user?.id) {
      return apiError('Unauthorized', 401)
    }

    // Users can only delete their own profile
    if (session.user.id !== id) {
      return apiError('Forbidden: You can only delete your own profile', 403)
    }

    // Get confirmation from request body
    const body = await request.json()
    const { confirmation } = body

    if (confirmation !== 'DELETE') {
      return apiError('Please confirm deletion by sending { "confirmation": "DELETE" }', 400)
    }

    // Start transaction for data cleanup
    await db.$transaction(async (tx) => {
      // Delete related data first (due to foreign key constraints)
      await tx.following.deleteMany({ where: { userId: id } })
      await tx.eventSave.deleteMany({ where: { userId: id } })
      await tx.eventAttendance.deleteMany({ where: { userId: id } })
      await tx.eventReview.deleteMany({ where: { userId: id } })
      await tx.notification.deleteMany({ where: { userId: id } })
      
      // Delete user preferences
      await tx.userPreferences.deleteMany({ where: { userId: id } })
      
      // Delete auth-related records
      await tx.session.deleteMany({ where: { userId: id } })
      await tx.account.deleteMany({ where: { userId: id } })
      
      // Finally delete the user
      await tx.user.delete({ where: { id } })
    })

    return apiResponse({ 
      message: 'Account deleted successfully',
      deletedAt: new Date().toISOString()
    })

  } catch (error) {
    return handleApiError(error)
  }
}