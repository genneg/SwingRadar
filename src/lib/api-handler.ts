import {
  ApiError,
  ApiResponse,
  ApiResult,
  ApiSuccess,
  ApiFailure,
  ApiErrorType,
  RequestOptions,
  RetryOptions,
  ApiHandlerConfig,
  LoadingState,
  ApiCache
} from '@/types/api'

/**
 * Custom API Error class with vintage jazz club theming
 */
export class VintageApiError extends Error implements ApiError {
  name: ApiErrorType
  status?: number
  code?: string
  details?: Record<string, any>
  timestamp: Date
  requestId?: string

  constructor(
    type: ApiErrorType,
    message: string,
    status?: number,
    details?: Record<string, any>
  ) {
    super(message)
    this.name = type
    this.status = status
    this.details = details
    this.timestamp = new Date()
    this.requestId = Math.random().toString(36).substring(2, 15)
  }

  static fromResponse(response: Response, message?: string): VintageApiError {
    const status = response.status
    let type: ApiErrorType = 'UnknownError'
    let defaultMessage = 'The jazz club encountered an unexpected issue'

    if (status >= 400 && status < 500) {
      switch (status) {
        case 401:
          type = 'AuthenticationError'
          defaultMessage = 'Your backstage pass has expired'
          break
        case 403:
          type = 'AuthorizationError'
          defaultMessage = 'This area is VIP only'
          break
        case 404:
          type = 'NotFoundError'
          defaultMessage = 'This performance has left the building'
          break
        case 429:
          type = 'RateLimitError'
          defaultMessage = 'Hold your horses, the band needs a break'
          break
        default:
          type = 'ValidationError'
          defaultMessage = 'The rhythm seems off on this request'
      }
    } else if (status >= 500) {
      type = 'ServerError'
      defaultMessage = 'The sound system is having technical difficulties'
    }

    return new VintageApiError(type, message || defaultMessage, status)
  }

  static timeout(message?: string): VintageApiError {
    return new VintageApiError(
      'TimeoutError',
      message || 'The performance is taking longer than expected'
    )
  }

  static network(message?: string): VintageApiError {
    return new VintageApiError(
      'NetworkError',
      message || 'Lost connection to the jazz club'
    )
  }
}

/**
 * Simple in-memory cache with TTL support
 */
class SimpleApiCache implements ApiCache {
  private cache = new Map<string, { data: any; expires: number }>()

  get<T>(key: string): T | null {
    const item = this.cache.get(key)
    if (!item) return null

    if (Date.now() > item.expires) {
      this.cache.delete(key)
      return null
    }

    return item.data as T
  }

  set<T>(key: string, data: T, ttl: number = 5 * 60 * 1000): void {
    this.cache.set(key, {
      data,
      expires: Date.now() + ttl
    })
  }

  delete(key: string): void {
    this.cache.delete(key)
  }

  clear(): void {
    this.cache.clear()
  }

  has(key: string): boolean {
    const item = this.cache.get(key)
    if (!item) return false

    if (Date.now() > item.expires) {
      this.cache.delete(key)
      return false
    }

    return true
  }
}

/**
 * Vintage API Handler with jazz club theming and robust error handling
 */
export class VintageApiHandler {
  private config: ApiHandlerConfig
  private cache: ApiCache

  constructor(config?: Partial<ApiHandlerConfig>) {
    this.config = {
      baseURL: process.env.NEXT_PUBLIC_API_URL || '',
      timeout: 30000, // 30 seconds default
      defaultRetries: {
        maxRetries: 3,
        initialDelay: 1000,
        maxDelay: 10000,
        backoffMultiplier: 2,
        retryableErrors: ['NetworkError', 'TimeoutError', 'ServerError']
      },
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'VintageBluesApp'
      },
      interceptors: {},
      ...config
    }
    this.cache = new SimpleApiCache()
  }

  /**
   * Create timeout promise that rejects after specified time
   */
  private createTimeoutPromise(timeout: number): Promise<never> {
    return new Promise((_, reject) => {
      setTimeout(() => {
        reject(VintageApiError.timeout())
      }, timeout)
    })
  }

  /**
   * Sleep utility for retry delays
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  /**
   * Calculate exponential backoff delay
   */
  private calculateRetryDelay(attempt: number, options: RetryOptions): number {
    const delay = options.initialDelay * Math.pow(options.backoffMultiplier, attempt - 1)
    return Math.min(delay, options.maxDelay)
  }

  /**
   * Check if error is retryable
   */
  private isRetryableError(error: ApiError, options: RetryOptions): boolean {
    return options.retryableErrors.includes(error.name)
  }

  /**
   * Execute request with timeout
   */
  private async executeRequest(
    url: string,
    options: RequestOptions
  ): Promise<Response> {
    const timeout = options.timeout || this.config.timeout

    try {
      const response = await Promise.race([
        fetch(url, {
          ...options,
          headers: {
            ...this.config.headers,
            ...options.headers
          }
        }),
        this.createTimeoutPromise(timeout)
      ])

      if (!response.ok) {
        throw VintageApiError.fromResponse(response)
      }

      return response
    } catch (error) {
      if (error instanceof VintageApiError) {
        throw error
      }

      // Handle network errors
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw VintageApiError.network()
      }

      throw new VintageApiError('UnknownError', error.message || 'Something went wrong in the jazz club')
    }
  }

  /**
   * Execute request with retry logic
   */
  private async executeWithRetry<T>(
    url: string,
    options: RequestOptions,
    retryOptions: RetryOptions
  ): Promise<ApiResult<T>> {
    let lastError: ApiError | null = null

    for (let attempt = 1; attempt <= retryOptions.maxRetries + 1; attempt++) {
      try {
        const response = await this.executeRequest(url, options)
        const data = await response.json()

        return {
          success: true,
          data,
          message: 'The performance was a success!'
        } as ApiSuccess<T>

      } catch (error) {
        const apiError = error instanceof VintageApiError
          ? error
          : new VintageApiError('UnknownError', error.message)

        lastError = apiError

        // Don't retry if it's the last attempt or error is not retryable
        if (attempt > retryOptions.maxRetries || !this.isRetryableError(apiError, retryOptions)) {
          break
        }

        // Wait before retrying
        const delay = this.calculateRetryDelay(attempt, retryOptions)
        await this.sleep(delay)
      }
    }

    return {
      success: false,
      error: lastError!,
      message: 'The show must go on, but this performance didn\'t make it'
    } as ApiFailure
  }

  /**
   * Main request method
   */
  async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<ApiResult<T>> {
    const url = `${this.config.baseURL}${endpoint}`
    const cacheKey = `${options.method || 'GET'}:${url}:${JSON.stringify(options.body || {})}`

    // Check cache for GET requests
    if ((!options.method || options.method === 'GET') && !options.skipCache) {
      const cached = this.cache.get<T>(cacheKey)
      if (cached) {
        return {
          success: true,
          data: cached,
          message: 'Encore performance from cache!'
        } as ApiSuccess<T>
      }
    }

    // Apply request interceptor
    if (this.config.interceptors.request) {
      options = this.config.interceptors.request(options)
    }

    // Skip retry if explicitly requested
    if (options.skipRetry) {
      try {
        const response = await this.executeRequest(url, options)
        const data = await response.json()
        return {
          success: true,
          data,
          message: 'Solo performance completed!'
        } as ApiSuccess<T>
      } catch (error) {
        const apiError = error instanceof VintageApiError
          ? error
          : new VintageApiError('UnknownError', error.message)

        return {
          success: false,
          error: apiError,
          message: 'Solo performance hit a wrong note'
        } as ApiFailure
      }
    }

    // Execute with retry
    const retryOptions = {
      ...this.config.defaultRetries,
      ...options.retries
    }

    const result = await this.executeWithRetry<T>(url, options, retryOptions)

    // Cache successful GET responses
    if (result.success && (!options.method || options.method === 'GET') && !options.skipCache) {
      this.cache.set(cacheKey, result.data, 5 * 60 * 1000) // 5 minutes TTL
    }

    return result
  }

  /**
   * Convenience methods for different HTTP verbs
   */
  async get<T>(endpoint: string, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<ApiResult<T>> {
    return this.request<T>(endpoint, { ...options, method: 'GET' })
  }

  async post<T>(endpoint: string, body?: any, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<ApiResult<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined
    })
  }

  async put<T>(endpoint: string, body?: any, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<ApiResult<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined
    })
  }

  async delete<T>(endpoint: string, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<ApiResult<T>> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' })
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear()
  }

  /**
   * Get cache stats
   */
  getCacheStats(): { size: number } {
    return { size: (this.cache as any).cache?.size || 0 }
  }
}

/**
 * Default API handler instance
 */
export const apiHandler = new VintageApiHandler()

/**
 * Loading state manager for components
 */
export class LoadingStateManager {
  private state: LoadingState = {
    isLoading: false,
    isError: false,
    error: null,
    isRetrying: false,
    retryCount: 0
  }

  private listeners: Array<(state: LoadingState) => void> = []

  constructor() {}

  subscribe(listener: (state: LoadingState) => void): () => void {
    this.listeners.push(listener)
    return () => {
      const index = this.listeners.indexOf(listener)
      if (index > -1) {
        this.listeners.splice(index, 1)
      }
    }
  }

  private notify(): void {
    this.listeners.forEach(listener => listener({ ...this.state }))
  }

  setLoading(isLoading: boolean): void {
    this.state.isLoading = isLoading
    if (isLoading) {
      this.state.isError = false
      this.state.error = null
    }
    this.notify()
  }

  setError(error: ApiError | null): void {
    this.state.isError = error !== null
    this.state.error = error
    this.state.isLoading = false
    this.state.isRetrying = false
    this.notify()
  }

  setRetrying(isRetrying: boolean): void {
    this.state.isRetrying = isRetrying
    if (isRetrying) {
      this.state.retryCount += 1
      this.state.isError = false
    }
    this.notify()
  }

  reset(): void {
    this.state = {
      isLoading: false,
      isError: false,
      error: null,
      isRetrying: false,
      retryCount: 0
    }
    this.notify()
  }

  getState(): LoadingState {
    return { ...this.state }
  }
}

/**
 * Utility functions for common API operations
 */
export const apiUtils = {
  /**
   * Check if error is a specific type
   */
  isErrorType(error: unknown, type: ApiErrorType): boolean {
    return error instanceof VintageApiError && error.name === type
  },

  /**
   * Extract error message with fallback
   */
  getErrorMessage(error: unknown, fallback = 'The jazz club is experiencing technical difficulties'): string {
    if (error instanceof VintageApiError) {
      return error.message
    }
    if (error instanceof Error) {
      return error.message
    }
    return fallback
  },

  /**
   * Check if error is retryable
   */
  isRetryableError(error: unknown): boolean {
    if (!(error instanceof VintageApiError)) return false
    return ['NetworkError', 'TimeoutError', 'ServerError'].includes(error.name)
  },

  /**
   * Format error for user display
   */
  formatErrorForUser(error: unknown): string {
    if (error instanceof VintageApiError) {
      switch (error.name) {
        case 'NetworkError':
          return 'Connection lost to the blues club. Check your internet connection.'
        case 'TimeoutError':
          return 'The performance is taking longer than expected. Please try again.'
        case 'ServerError':
          return 'The sound system is having issues. Our tech crew is on it!'
        case 'AuthenticationError':
          return 'Your backstage pass has expired. Please sign in again.'
        case 'AuthorizationError':
          return 'This area is VIP only. You need additional permissions.'
        case 'NotFoundError':
          return 'This performance has left the building.'
        case 'RateLimitError':
          return 'Slow down there, partner. Too many requests too fast.'
        default:
          return error.message
      }
    }
    return 'Something unexpected happened at the jazz club.'
  }
}

export default apiHandler