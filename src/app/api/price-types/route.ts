import { NextRequest } from 'next/server'

// Force dynamic runtime
export const dynamic = 'force-dynamic'

import { db } from '@festival-scout/database'

import { apiResponse, handleApiError } from '@/lib/api/utils'

// Common price types - these will be suggested to users
const COMMON_PRICE_TYPES = [
  'Early Bird',
  'Regular',
  'Late Registration',
  'Student',
  'Local',
  'VIP',
  'Full Pass',
  'Weekend Pass',
  'Day Pass',
  'Beginner Full Pass',
  'Intermediate Pass',
  'Advanced Pass',
  'Competition Entry',
  'Workshop Only',
  'Dance Only',
  'Accommodation Package',
  'Donation'
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const includeUsed = searchParams.get('includeUsed') === 'true'
    
    let result = {
      common: COMMON_PRICE_TYPES,
      used: [] as string[]
    }
    
    if (includeUsed) {
      // Get price types that have been used in the database
      const usedTypes = await db.event_prices.findMany({
        select: { type: true },
        distinct: ['type'],
        orderBy: { type: 'asc' }
      })
      
      // Extract unique types and filter out common ones to avoid duplicates
      const uniqueUsedTypes = usedTypes
        .map(p => p.type)
        .filter(type => !COMMON_PRICE_TYPES.includes(type))
      
      result.used = uniqueUsedTypes
    }
    
    return apiResponse(result)
    
  } catch (error) {
    return handleApiError(error)
  }
}