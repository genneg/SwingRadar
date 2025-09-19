import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'

import { db } from '@festival-scout/database'
import { authOptions } from '@/lib/auth/config'

import { 
  apiResponse, 
  apiError, 
  handleApiError, 
  validatePagination, 
  calculatePaginationMeta 
} from '@/lib/api/utils'

// Validation schemas
const markAsReadSchema = z.object({
  notificationIds: z.array(z.string()).optional(),
  all: z.boolean().optional(),
})

// Get user notifications
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

    // Users can only access their own notifications
    if (session.user.id !== id) {
      return apiError('Forbidden: You can only access your own notifications', 403)
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const { page, limit, skip, take } = validatePagination(
      searchParams.get('page') || '1',
      searchParams.get('limit') || '20'
    )
    
    const unreadOnly = searchParams.get('unread') === 'true'
    const type = searchParams.get('type') // Filter by notification type

    // Build where clause
    const where: any = { user_id: parseInt(id) }
    
    if (unreadOnly) {
      where.read = false
    }
    
    if (type) {
      where.type = type
    }

    // Get notifications with pagination
    const [notifications, total] = await Promise.all([
      db.userNotification.findMany({
        where,
        skip,
        take,
        orderBy: { created_at: 'desc' },
        select: {
          id: true,
          type: true,
          title: true,
          message: true,
          read: true,
          created_at: true,
        }
      }),
      db.userNotification.count({ where })
    ])

    const paginationMeta = calculatePaginationMeta(total, page, limit)

    return apiResponse({
      notifications,
      pagination: paginationMeta,
      summary: {
        total,
        unread: unreadOnly ? total : await db.userNotification.count({ 
          where: { user_id: parseInt(id), read: false } 
        }),
      }
    })

  } catch (error) {
    return handleApiError(error)
  }
}

// Mark notifications as read
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

    // Users can only update their own notifications
    if (session.user.id !== id) {
      return apiError('Forbidden: You can only update your own notifications', 403)
    }

    const body = await request.json()
    const { notificationIds, all } = markAsReadSchema.parse(body)

    if (all) {
      // Mark all notifications as read
      const updated = await db.userNotification.updateMany({
        where: { user_id: parseInt(id), read: false },
        data: { read: true },
      })

      return apiResponse({
        message: 'All notifications marked as read',
        updated: updated.count,
      })
    } else if (notificationIds && notificationIds.length > 0) {
      // Mark specific notifications as read
      const updated = await db.userNotification.updateMany({
        where: { 
          user_id: parseInt(id), 
          id: { in: notificationIds.map(id => parseInt(id)) },
          read: false 
        },
        data: { read: true },
      })

      return apiResponse({
        message: 'Notifications marked as read',
        updated: updated.count,
      })
    } else {
      return apiError('Please provide either notificationIds or set all to true', 400)
    }

  } catch (error) {
    if (error instanceof z.ZodError) {
      return apiError('Invalid request: ' + error.issues.map(e => e.message).join(', '))
    }

    return handleApiError(error)
  }
}

// Delete notifications
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

    // Users can only delete their own notifications
    if (session.user.id !== id) {
      return apiError('Forbidden: You can only delete your own notifications', 403)
    }

    const body = await request.json()
    const { notificationIds, all } = markAsReadSchema.parse(body)

    if (all) {
      // Delete all notifications
      const deleted = await db.userNotification.deleteMany({
        where: { user_id: parseInt(id) },
      })

      return apiResponse({
        message: 'All notifications deleted',
        deleted: deleted.count,
      })
    } else if (notificationIds && notificationIds.length > 0) {
      // Delete specific notifications
      const deleted = await db.userNotification.deleteMany({
        where: { 
          user_id: parseInt(id), 
          id: { in: notificationIds.map(id => parseInt(id)) }
        },
      })

      return apiResponse({
        message: 'Notifications deleted',
        deleted: deleted.count,
      })
    } else {
      return apiError('Please provide either notificationIds or set all to true', 400)
    }

  } catch (error) {
    if (error instanceof z.ZodError) {
      return apiError('Invalid request: ' + error.issues.map(e => e.message).join(', '))
    }

    return handleApiError(error)
  }
}