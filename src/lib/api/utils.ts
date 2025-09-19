import { NextResponse } from 'next/server'
import type { ApiResponse } from '@/types'

/**
 * Creates a standardized API success response
 */
export function apiResponse<T>(
  data: T, 
  success: boolean = true, 
  message?: string,
  status: number = 200
): NextResponse<ApiResponse<T>> {
  return NextResponse.json({
    data,
    success,
    message,
    timestamp: new Date().toISOString(),
  }, { status })
}

/**
 * Creates a standardized API error response
 */
export function apiError(
  message: string, 
  status: number = 400,
  details?: any
): NextResponse<ApiResponse<null>> {
  return NextResponse.json({
    data: null,
    success: false,
    error: message,
    details,
    timestamp: new Date().toISOString(),
  }, { status })
}

/**
 * Validates pagination parameters
 */
export function validatePagination(page?: string, limit?: string) {
  const pageNum = parseInt(page || '1', 10)
  const limitNum = Math.min(parseInt(limit || '10', 10), 100) // Max 100 items per page
  
  if (isNaN(pageNum) || pageNum < 1) {
    throw new Error('Page must be a positive number')
  }
  
  if (isNaN(limitNum) || limitNum < 1) {
    throw new Error('Limit must be a positive number')
  }
  
  const skip = (pageNum - 1) * limitNum
  
  return {
    page: pageNum,
    limit: limitNum,
    skip,
    take: limitNum,
  }
}

/**
 * Calculates pagination metadata
 */
export function calculatePaginationMeta(
  total: number,
  page: number,
  limit: number
) {
  const totalPages = Math.ceil(total / limit)
  const hasNext = page < totalPages
  const hasPrev = page > 1
  
  return {
    page,
    limit,
    total,
    totalPages,
    hasNext,
    hasPrev,
  }
}

/**
 * Validates date parameters
 */
export function validateDate(dateString: string, fieldName: string): Date {
  const date = new Date(dateString)
  
  if (isNaN(date.getTime())) {
    throw new Error(`Invalid ${fieldName} format. Use ISO 8601 format (YYYY-MM-DD or YYYY-MM-DDTHH:mm:ssZ)`)
  }
  
  return date
}

/**
 * Validates array of IDs (comma-separated)
 */
export function validateIds(idsString: string): string[] {
  return idsString
    .split(',')
    .map(id => id.trim())
    .filter(id => id.length > 0)
}

/**
 * Builds search conditions for text fields
 */
export function buildTextSearchConditions(
  searchTerm: string,
  fields: string[]
): Array<Record<string, any>> {
  return fields.map(field => ({
    [field]: {
      contains: searchTerm,
      mode: 'insensitive'
    }
  }))
}

/**
 * Builds date range where clause
 */
export function buildDateRangeWhere(
  startDate?: string,
  endDate?: string,
  startField: string = 'startDate',
  endField: string = 'endDate'
): Record<string, any> {
  const where: Record<string, any> = {}
  
  if (startDate) {
    where[startField] = { gte: validateDate(startDate, 'startDate') }
  }
  
  if (endDate) {
    where[endField] = { lte: validateDate(endDate, 'endDate') }
  }
  
  return where
}

/**
 * Handles common API errors
 */
export function handleApiError(error: unknown): NextResponse<ApiResponse<null>> {
  console.error('API Error:', error)
  
  if (error instanceof Error) {
    // Check for specific error types
    if (error.message.includes('Invalid') || error.message.includes('must be')) {
      return apiError(error.message, 400)
    }
    
    if (error.message.includes('not found')) {
      return apiError(error.message, 404)
    }
    
    return apiError(error.message, 500)
  }
  
  return apiError('Internal server error', 500)
}

/**
 * Validates request method
 */
export function validateMethod(
  request: Request,
  allowedMethods: string[]
): void {
  if (!allowedMethods.includes(request.method)) {
    throw new Error(`Method ${request.method} not allowed`)
  }
}

/**
 * Extracts and validates search parameters
 */
export function extractSearchParams(url: string): Record<string, string> {
  const { searchParams } = new URL(url)
  return Object.fromEntries(searchParams)
}

/**
 * Checks if a value is a valid enum value
 */
export function isValidEnum<T extends Record<string, string>>(
  value: string,
  enumObject: T
): value is T[keyof T] {
  return Object.values(enumObject).includes(value as T[keyof T])
}

/**
 * Validates enum field
 */
export function validateEnumField<T extends Record<string, string>>(
  value: string,
  enumObject: T,
  fieldName: string
): T[keyof T] {
  if (!isValidEnum(value, enumObject)) {
    throw new Error(`Invalid ${fieldName}. Must be one of: ${Object.values(enumObject).join(', ')}`)
  }
  return value as T[keyof T]
}

/**
 * Sanitizes string input
 */
export function sanitizeString(input: string): string {
  return input.trim().replace(/[<>]/g, '')
}

/**
 * Validates boolean parameter
 */
export function validateBoolean(value: string): boolean {
  const lowercaseValue = value.toLowerCase()
  if (lowercaseValue === 'true') return true
  if (lowercaseValue === 'false') return false
  throw new Error('Boolean value must be "true" or "false"')
}

/**
 * Validates user ID parameter
 */
export function validateUserId(userId: string): string {
  if (!userId || userId.trim().length === 0) {
    throw new Error('User ID is required')
  }
  return userId.trim()
}

/**
 * Rate limiting helper (placeholder for future implementation)
 */
export async function checkRateLimit(
  identifier: string,
  limit: number = 100,
  window: number = 60000 // 1 minute
): Promise<boolean> {
  // TODO: Implement with Redis or similar
  return true
}