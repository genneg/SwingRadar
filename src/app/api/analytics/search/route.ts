import { NextRequest } from 'next/server'
import { z } from 'zod'

import { 
  apiResponse, 
  apiError, 
  handleApiError 
} from '@/lib/api/utils'

// Search analytics schema
const searchAnalyticsSchema = z.object({
  query: z.string().min(1).max(500),
  timestamp: z.string().datetime(),
  userId: z.string().optional(),
  sessionId: z.string().optional(),
  source: z.string().optional().default('search_bar'),
  resultCount: z.number().optional(),
  clickedResult: z.boolean().optional(),
  clickedResultIndex: z.number().optional(),
  clickedResultType: z.enum(['event', 'teacher', 'musician', 'location']).optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = searchAnalyticsSchema.parse(body)
    
    // For now, just log the analytics data
    // In a real application, you would save this to a database
    // or send it to an analytics service like Google Analytics, Mixpanel, etc.
    console.log('Search Analytics:', {
      query: validatedData.query,
      timestamp: validatedData.timestamp,
      userId: validatedData.userId,
      sessionId: validatedData.sessionId,
      source: validatedData.source,
      resultCount: validatedData.resultCount,
      clickedResult: validatedData.clickedResult,
      clickedResultIndex: validatedData.clickedResultIndex,
      clickedResultType: validatedData.clickedResultType,
      userAgent: request.headers.get('user-agent'),
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
      referer: request.headers.get('referer'),
    })
    
    // TODO: Save to database
    // await db.searchAnalytics.create({
    //   data: {
    //     query: validatedData.query,
    //     timestamp: new Date(validatedData.timestamp),
    //     userId: validatedData.userId,
    //     sessionId: validatedData.sessionId,
    //     source: validatedData.source,
    //     resultCount: validatedData.resultCount,
    //     clickedResult: validatedData.clickedResult,
    //     clickedResultIndex: validatedData.clickedResultIndex,
    //     clickedResultType: validatedData.clickedResultType,
    //     userAgent: request.headers.get('user-agent'),
    //     ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
    //   }
    // })
    
    return apiResponse({ success: true })
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return apiError('Invalid analytics data: ' + error.issues.map((e: any) => e.message).join(', '))
    }
    
    return handleApiError(error)
  }
}