import { NextRequest } from 'next/server'
import { z } from 'zod'

import { db } from '@festival-scout/database'

import { apiResponse, apiError, handleApiError } from '@/lib/api/utils'

// Schema for updating a price
const updatePriceSchema = z.object({
  type: z.string().min(1, 'Price type is required').max(100, 'Price type too long').optional(),
  amount: z.number().positive('Amount must be positive').optional(),
  currency: z.string().optional(),
  deadline: z.string().datetime().optional().nullable(),
  description: z.string().optional().nullable(),
  available: z.boolean().optional()
})

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; priceId: string } }
) {
  try {
    const { id, priceId } = params
    const numericId = parseInt(id, 10)
    const numericPriceId = parseInt(priceId, 10)
    
    if (isNaN(numericId) || isNaN(numericPriceId)) {
      return apiError('Invalid ID. Must be a number.', 400)
    }
    
    // Check if price exists and belongs to the event
    const existingPrice = await db.event_prices.findFirst({
      where: { 
        id: numericPriceId,
        event_id: numericId 
      }
    })
    
    if (!existingPrice) {
      return apiError('Price not found for this event', 404)
    }
    
    const body = await request.json()
    const validatedData = updatePriceSchema.parse(body)
    
    // Prepare update data
    const updateData: any = {}
    
    if (validatedData.type !== undefined) updateData.type = validatedData.type
    if (validatedData.amount !== undefined) updateData.amount = validatedData.amount
    if (validatedData.currency !== undefined) updateData.currency = validatedData.currency
    if (validatedData.deadline !== undefined) {
      updateData.deadline = validatedData.deadline ? new Date(validatedData.deadline) : null
    }
    if (validatedData.description !== undefined) updateData.description = validatedData.description
    if (validatedData.available !== undefined) updateData.available = validatedData.available
    
    updateData.updated_at = new Date()
    
    // Update price
    const updatedPrice = await db.event_prices.update({
      where: { id: numericPriceId },
      data: updateData
    })
    
    return apiResponse(updatedPrice)
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return apiError('Invalid data provided', 400)
    }
    return handleApiError(error)
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; priceId: string } }
) {
  try {
    const { id, priceId } = params
    const numericId = parseInt(id, 10)
    const numericPriceId = parseInt(priceId, 10)
    
    if (isNaN(numericId) || isNaN(numericPriceId)) {
      return apiError('Invalid ID. Must be a number.', 400)
    }
    
    // Check if price exists and belongs to the event
    const existingPrice = await db.event_prices.findFirst({
      where: { 
        id: numericPriceId,
        event_id: numericId 
      }
    })
    
    if (!existingPrice) {
      return apiError('Price not found for this event', 404)
    }
    
    // Delete price
    await db.event_prices.delete({
      where: { id: numericPriceId }
    })
    
    return apiResponse({ message: 'Price deleted successfully' })
    
  } catch (error) {
    return handleApiError(error)
  }
}