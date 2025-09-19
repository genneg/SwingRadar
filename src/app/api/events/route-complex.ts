import { NextRequest } from 'next/server'
import { z } from 'zod'

// Force dynamic runtime
export const dynamic = 'force-dynamic'

import { 
  apiResponse, 
  apiError, 
  validatePagination, 
  calculatePaginationMeta,
  handleApiError,
  extractSearchParams
} from '@/lib/api/utils'

import { getEvents } from '@/lib/services/eventService'

// Request validation schema
const eventsQuerySchema = z.object({
  page: z.string().optional().default('1'),
  limit: z.string().optional().default('10'),
  search: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  style: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const params = extractSearchParams(request.url)
    const validatedParams = eventsQuerySchema.parse(params)
    const { page, limit } = validatePagination(validatedParams.page, validatedParams.limit)
    
    // Build filters for the event service
    const filters = {
      search: validatedParams.search,
      city: validatedParams.city,
      country: validatedParams.country,
      style: validatedParams.style,
      dateFrom: validatedParams.startDate ? new Date(validatedParams.startDate) : undefined,
      dateTo: validatedParams.endDate ? new Date(validatedParams.endDate) : undefined,
      limit,
      offset: (page - 1) * limit
    }
    
    // Get events from database using the event service
    const result = await getEvents(filters)
    
    const paginationMeta = calculatePaginationMeta(result.total, page, limit)
    
    return apiResponse({
      events: result.events,
      pagination: paginationMeta
    })
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return apiError('Invalid query parameters: ' + error.issues.map((e: any) => e.message).join(', '))
    }
    
    return handleApiError(error)
  }
}