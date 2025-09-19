import { NextRequest } from 'next/server'
import { z } from 'zod'

import { db } from '@festival-scout/database'

import { apiResponse, apiError, handleApiError } from '@/lib/api/utils'

// Schema for creating a new price
const createPriceSchema = z.object({
  type: z.string().min(1, 'Price type is required').max(100, 'Price type too long'),
  amount: z.number().positive('Amount must be positive'),
  currency: z.string().default('EUR'),
  deadline: z.string().datetime().optional(),
  description: z.string().optional(),
  available: z.boolean().default(true)
})

// Schema for updating a price
const updatePriceSchema = createPriceSchema.partial()

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const numericId = parseInt(id, 10)
    
    if (isNaN(numericId)) {
      return apiError('Invalid event ID. Must be a number.', 400)
    }
    
    // Fetch all prices for the event
    const prices = await db.event_prices.findMany({
      where: { event_id: numericId },
      orderBy: { created_at: 'desc' }
    })
    
    return apiResponse(prices)
    
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const numericId = parseInt(id, 10)
    
    if (isNaN(numericId)) {
      return apiError('Invalid event ID. Must be a number.', 400)
    }
    
    // Check if event exists
    const event = await db.event.findUnique({
      where: { id: numericId }
    })
    
    if (!event) {
      return apiError('Event not found', 404)
    }
    
    const body = await request.json()
    const validatedData = createPriceSchema.parse(body)
    
    // Create new price
    const newPrice = await db.event_prices.create({
      data: {
        event_id: numericId,
        type: validatedData.type,
        amount: validatedData.amount,
        currency: validatedData.currency,
        deadline: validatedData.deadline ? new Date(validatedData.deadline) : null,
        description: validatedData.description,
        available: validatedData.available
      }
    })
    
    return apiResponse(newPrice)
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return apiError('Invalid data provided', 400)
    }
    return handleApiError(error)
  }
}