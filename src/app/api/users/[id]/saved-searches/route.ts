import { NextRequest } from 'next/server'
import { z } from 'zod'
import { getServerSession } from 'next-auth'

import { authOptions } from '@/lib/auth/config'
import { db } from '@festival-scout/database'
import { 
  apiResponse, 
  apiError, 
  handleApiError,
  validateUserId 
} from '@/lib/api/utils'

// Saved search schema
const savedSearchSchema = z.object({
  name: z.string().min(1).max(100),
  query: z.string().optional(),
  filters: z.object({
    location: z.object({
      city: z.string().optional(),
      country: z.string().optional(),
      latitude: z.number().optional(),
      longitude: z.number().optional(),
      radius: z.number().optional(),
    }).optional(),
    dateRange: z.object({
      start: z.string().optional(),
      end: z.string().optional(),
    }).optional(),
    teachers: z.array(z.string()).optional(),
    musicians: z.array(z.string()).optional(),
    eventTypes: z.array(z.string()).optional(),
    skillLevels: z.array(z.string()).optional(),
    priceRange: z.object({
      min: z.number().optional(),
      max: z.number().optional(),
    }).optional(),
    featured: z.boolean().optional(),
  }).optional(),
  sortBy: z.enum(['relevance', 'date', 'distance', 'popularity', 'price']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  alertsEnabled: z.boolean().optional().default(false),
})

interface RequestContext {
  params: { id: string }
}

export async function GET(request: NextRequest, context: RequestContext) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return apiError('Authentication required', 401)
    }

    const userId = validateUserId(context.params.id, session.user.id)
    
    const savedSearches = await db.savedSearch.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        name: true,
        query: true,
        filters: true,
        sortBy: true,
        sortOrder: true,
        alertsEnabled: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            alerts: true
          }
        }
      }
    })

    return apiResponse({
      savedSearches: savedSearches.map(search => ({
        ...search,
        alertCount: search._count.alerts
      }))
    })

  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(request: NextRequest, context: RequestContext) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return apiError('Authentication required', 401)
    }

    const userId = validateUserId(context.params.id, session.user.id)
    const body = await request.json()
    const validatedData = savedSearchSchema.parse(body)

    // Check if user already has a saved search with this name
    const existingSearch = await db.savedSearch.findFirst({
      where: {
        userId,
        name: validatedData.name
      }
    })

    if (existingSearch) {
      return apiError('A saved search with this name already exists', 409)
    }

    // Check saved search limit (e.g., max 10 per user)
    const savedSearchCount = await db.savedSearch.count({
      where: { userId }
    })

    if (savedSearchCount >= 10) {
      return apiError('Maximum number of saved searches reached (10)', 400)
    }

    const savedSearch = await db.savedSearch.create({
      data: {
        userId,
        name: validatedData.name,
        query: validatedData.query,
        filters: validatedData.filters as any,
        sortBy: validatedData.sortBy,
        sortOrder: validatedData.sortOrder,
        alertsEnabled: validatedData.alertsEnabled,
      },
      select: {
        id: true,
        name: true,
        query: true,
        filters: true,
        sortBy: true,
        sortOrder: true,
        alertsEnabled: true,
        createdAt: true,
        updatedAt: true,
      }
    })

    return apiResponse(savedSearch, 201)

  } catch (error) {
    if (error instanceof z.ZodError) {
      return apiError('Invalid saved search data: ' + error.issues.map((e: any) => e.message).join(', '))
    }
    
    return handleApiError(error)
  }
}

export async function PUT(request: NextRequest, context: RequestContext) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return apiError('Authentication required', 401)
    }

    const userId = validateUserId(context.params.id, session.user.id)
    const body = await request.json()
    const { searchId, ...updateData } = body
    
    if (!searchId) {
      return apiError('Search ID is required', 400)
    }

    const validatedData = savedSearchSchema.partial().parse(updateData)

    // Check if the saved search exists and belongs to the user
    const existingSearch = await db.savedSearch.findFirst({
      where: {
        id: searchId,
        userId
      }
    })

    if (!existingSearch) {
      return apiError('Saved search not found', 404)
    }

    // Check for name conflicts if name is being updated
    if (validatedData.name && validatedData.name !== existingSearch.name) {
      const nameConflict = await db.savedSearch.findFirst({
        where: {
          userId,
          name: validatedData.name,
          id: { not: searchId }
        }
      })

      if (nameConflict) {
        return apiError('A saved search with this name already exists', 409)
      }
    }

    const updatedSearch = await db.savedSearch.update({
      where: { id: searchId },
      data: {
        ...validatedData,
        filters: validatedData.filters as any,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        name: true,
        query: true,
        filters: true,
        sortBy: true,
        sortOrder: true,
        alertsEnabled: true,
        createdAt: true,
        updatedAt: true,
      }
    })

    return apiResponse(updatedSearch)

  } catch (error) {
    if (error instanceof z.ZodError) {
      return apiError('Invalid update data: ' + error.issues.map((e: any) => e.message).join(', '))
    }
    
    return handleApiError(error)
  }
}

export async function DELETE(request: NextRequest, context: RequestContext) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return apiError('Authentication required', 401)
    }

    const userId = validateUserId(context.params.id, session.user.id)
    const { searchParams } = new URL(request.url)
    const searchId = searchParams.get('searchId')
    
    if (!searchId) {
      return apiError('Search ID is required', 400)
    }

    // Check if the saved search exists and belongs to the user
    const existingSearch = await db.savedSearch.findFirst({
      where: {
        id: searchId,
        userId
      }
    })

    if (!existingSearch) {
      return apiError('Saved search not found', 404)
    }

    await db.savedSearch.delete({
      where: { id: searchId }
    })

    return apiResponse({ success: true })

  } catch (error) {
    return handleApiError(error)
  }
}