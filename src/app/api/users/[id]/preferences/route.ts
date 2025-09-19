import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'

import { db } from '@festival-scout/database'
import { authOptions } from '@/lib/auth/config'

import { apiResponse, apiError, handleApiError } from '@/lib/api/utils'

// Validation schema for user preferences
const preferencesSchema = z.object({
  // Notification settings
  email_notifications: z.boolean().optional(),
  push_notifications: z.boolean().optional(),
  new_event_notifications: z.boolean().optional(),
  deadlineReminders: z.boolean().optional(),
  weeklyDigest: z.boolean().optional(),
  followingUpdates: z.boolean().optional(),
  
  // Location preferences
  defaultCountry: z.string().max(100).optional().nullable(),
  defaultCity: z.string().max(100).optional().nullable(),
  searchRadius: z.number().int().min(1).max(1000).optional().nullable(),
  
  // UI preferences
  theme: z.enum(['light', 'dark', 'auto']).optional(),
  language: z.string().length(2).optional(), // ISO 639-1 codes
  timezone: z.string().max(50).optional().nullable(),
})

// Get user preferences
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

    // Users can only access their own preferences
    if (session.user.id !== id) {
      return apiError('Forbidden: You can only access your own preferences', 403)
    }

    // Get or create user preferences
    let preferences = await db.userPreferences.findUnique({
      where: { user_id: parseInt(id) },
      select: {
        id: true,
        email_notifications: true,
        push_notifications: true,
        new_event_notifications: true,
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
    })

    // Create default preferences if they don't exist
    if (!preferences) {
      preferences = await db.userPreferences.create({
        data: {
          user_id: parseInt(id),
          email_notifications: true,
          push_notifications: true,
          new_event_notifications: true,
          deadlineReminders: true,
          weeklyDigest: true,
          followingUpdates: true,
          theme: 'light',
          language: 'en',
          searchRadius: 100,
        },
        select: {
          id: true,
          email_notifications: true,
          push_notifications: true,
          new_event_notifications: true,
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
      })
    }

    return apiResponse(preferences)

  } catch (error) {
    return handleApiError(error)
  }
}

// Update user preferences
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

    // Users can only update their own preferences
    if (session.user.id !== id) {
      return apiError('Forbidden: You can only update your own preferences', 403)
    }

    const body = await request.json()
    const updateData = preferencesSchema.parse(body)

    // Check if preferences exist
    const existingPreferences = await db.userPreferences.findUnique({
      where: { user_id: parseInt(id) }
    })

    let updatedPreferences

    if (existingPreferences) {
      // Update existing preferences
      updatedPreferences = await db.userPreferences.update({
        where: { user_id: parseInt(id) },
        data: updateData,
        select: {
          id: true,
          email_notifications: true,
          push_notifications: true,
          new_event_notifications: true,
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
      })
    } else {
      // Create new preferences with defaults merged with update data
      updatedPreferences = await db.userPreferences.create({
        data: {
          user_id: parseInt(id),
          email_notifications: true,
          push_notifications: true,
          new_event_notifications: true,
          deadlineReminders: true,
          weeklyDigest: true,
          followingUpdates: true,
          theme: 'light',
          language: 'en',
          searchRadius: 100,
          ...updateData,
        },
        select: {
          id: true,
          email_notifications: true,
          push_notifications: true,
          new_event_notifications: true,
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
      })
    }

    return apiResponse(updatedPreferences)

  } catch (error) {
    if (error instanceof z.ZodError) {
      return apiError('Invalid preferences: ' + error.issues.map(e => e.message).join(', '))
    }

    return handleApiError(error)
  }
}

// Reset preferences to defaults
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

    // Users can only reset their own preferences
    if (session.user.id !== id) {
      return apiError('Forbidden: You can only reset your own preferences', 403)
    }

    // Reset to default preferences
    const defaultPreferences = await db.userPreferences.upsert({
      where: { user_id: parseInt(id) },
      update: {
        email_notifications: true,
        push_notifications: true,
        new_event_notifications: true,
        deadlineReminders: true,
        weeklyDigest: true,
        followingUpdates: true,
        defaultCountry: null,
        defaultCity: null,
        searchRadius: 100,
        theme: 'light',
        language: 'en',
        timezone: null,
      },
      create: {
        user_id: parseInt(id),
        email_notifications: true,
        push_notifications: true,
        new_event_notifications: true,
        deadlineReminders: true,
        weeklyDigest: true,
        followingUpdates: true,
        theme: 'light',
        language: 'en',
        searchRadius: 100,
      },
      select: {
        id: true,
        email_notifications: true,
        push_notifications: true,
        new_event_notifications: true,
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
    })

    return apiResponse(defaultPreferences)

  } catch (error) {
    return handleApiError(error)
  }
}