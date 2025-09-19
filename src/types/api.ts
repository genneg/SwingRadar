// API Error Types and Interfaces

export type ApiErrorType =
  | 'NetworkError'
  | 'TimeoutError'
  | 'ServerError'
  | 'ValidationError'
  | 'AuthenticationError'
  | 'AuthorizationError'
  | 'NotFoundError'
  | 'RateLimitError'
  | 'UnknownError'

export interface ApiError extends Error {
  name: ApiErrorType
  message: string
  status?: number
  code?: string
  details?: Record<string, any>
  timestamp: Date
  requestId?: string
}

export interface ApiResponse<T = any> {
  data?: T
  error?: ApiError
  success: boolean
  message?: string
  meta?: {
    page?: number
    limit?: number
    total?: number
    hasMore?: boolean
  }
}

export interface RetryOptions {
  maxRetries: number
  initialDelay: number
  maxDelay: number
  backoffMultiplier: number
  retryableErrors: ApiErrorType[]
}

export interface RequestOptions extends RequestInit {
  timeout?: number
  retries?: Partial<RetryOptions>
  skipRetry?: boolean
  skipCache?: boolean
}

export interface LoadingState {
  isLoading: boolean
  isError: boolean
  error: ApiError | null
  isRetrying: boolean
  retryCount: number
}

export interface ApiHandlerConfig {
  baseURL?: string
  timeout: number
  defaultRetries: RetryOptions
  headers: Record<string, string>
  interceptors: {
    request?: (options: RequestOptions) => RequestOptions
    response?: (response: Response) => Response
    error?: (error: ApiError) => ApiError
  }
}

// Utility types for API responses
export type ApiSuccess<T> = ApiResponse<T> & { success: true; data: T }
export type ApiFailure = ApiResponse<never> & { success: false; error: ApiError }
export type ApiResult<T> = ApiSuccess<T> | ApiFailure

// Event-specific API types
export interface SearchEventsParams {
  query?: string
  location?: string
  dateFrom?: string
  dateTo?: string
  teachers?: string[]
  musicians?: string[]
  styles?: string[]
  priceMin?: number
  priceMax?: number
  page?: number
  limit?: number
}

export interface Event {
  id: string
  name: string
  description?: string
  from_date: string
  to_date: string
  city: string
  country: string
  website?: string
  style?: string
  image_url?: string
  teachers?: Array<{ id: string; name: string }>
  musicians?: Array<{ id: string; name: string }>
  venue?: {
    name: string
    address?: string
  }
  prices?: Array<{
    type: string
    amount: number
    currency: string
  }>
}

export interface SearchEventsResponse {
  events: Event[]
  total: number
  page: number
  limit: number
  hasMore: boolean
  searchType?: string
}

// Teacher/Musician API types
export interface Teacher {
  id: string
  name: string
  bio?: string
  specialties: string[]
  photo?: string
  website?: string
  social?: {
    instagram?: string
    facebook?: string
  }
  upcomingEvents?: Event[]
  followerCount?: number
}

export interface Musician {
  id: string
  name: string
  bio?: string
  genres: string[]
  photo?: string
  website?: string
  social?: {
    instagram?: string
    facebook?: string
    spotify?: string
  }
  upcomingEvents?: Event[]
  followerCount?: number
}

export interface ApiCache {
  get<T>(key: string): T | null
  set<T>(key: string, data: T, ttl?: number): void
  delete(key: string): void
  clear(): void
  has(key: string): boolean
}