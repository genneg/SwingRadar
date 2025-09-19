import type { ApiResponse } from '@/types'

/**
 * Configuration for API requests
 */
interface ApiConfig {
  baseURL?: string
  timeout?: number
  retries?: number
  retryDelay?: number
}

/**
 * Request options for API calls
 */
interface RequestOptions extends RequestInit {
  timeout?: number
  retries?: number
  retryDelay?: number
}

/**
 * API Error class for structured error handling
 */
export class ApiError extends Error {
  public readonly status: number
  public readonly details?: any
  public readonly timestamp: string

  constructor(message: string, status: number, details?: any) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.details = details
    this.timestamp = new Date().toISOString()
  }
}

/**
 * Network Error class for connection issues
 */
export class NetworkError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'NetworkError'
  }
}

/**
 * Timeout Error class for request timeouts
 */
export class TimeoutError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'TimeoutError'
  }
}

/**
 * Utility function to wait for a specified amount of time
 */
const wait = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms))

/**
 * Exponential backoff delay calculation
 */
const calculateRetryDelay = (attempt: number, baseDelay: number): number => {
  return Math.min(baseDelay * Math.pow(2, attempt), 10000) // Max 10 seconds
}

/**
 * Check if error is retryable
 */
const isRetryableError = (error: any): boolean => {
  if (error instanceof NetworkError) return true
  if (error instanceof TimeoutError) return true
  if (error instanceof ApiError) {
    // Retry on 5xx errors and some 4xx errors
    return error.status >= 500 || error.status === 429 || error.status === 408
  }
  return false
}

/**
 * Enhanced fetch with timeout support
 */
const fetchWithTimeout = (url: string, options: RequestOptions = {}): Promise<Response> => {
  const { timeout = 10000, ...fetchOptions } = options
  
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new TimeoutError(`Request timed out after ${timeout}ms`))
    }, timeout)

    fetch(url, fetchOptions)
      .then(response => {
        clearTimeout(timeoutId)
        resolve(response)
      })
      .catch(error => {
        clearTimeout(timeoutId)
        if (error.name === 'AbortError') {
          reject(new TimeoutError('Request was aborted'))
        } else {
          reject(new NetworkError(`Network error: ${error.message}`))
        }
      })
  })
}

/**
 * API Client class with retry logic and error handling
 */
class ApiClient {
  private config: Required<ApiConfig>

  constructor(config: ApiConfig = {}) {
    this.config = {
      baseURL: config.baseURL || '',
      timeout: config.timeout || 10000,
      retries: config.retries || 3,
      retryDelay: config.retryDelay || 1000
    }
  }

  /**
   * Make an API request with automatic retry logic
   */
  async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const {
      retries = this.config.retries,
      retryDelay = this.config.retryDelay,
      timeout = this.config.timeout,
      ...requestOptions
    } = options

    const url = `${this.config.baseURL}${endpoint}`
    let lastError: Error

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response = await fetchWithTimeout(url, {
          ...requestOptions,
          timeout,
          headers: {
            'Content-Type': 'application/json',
            ...requestOptions.headers
          }
        })

        // Parse response
        const data = await response.json()

        // Check if response is ok
        if (!response.ok) {
          throw new ApiError(
            data.error || `HTTP ${response.status}`,
            response.status,
            data.details
          )
        }

        return data as ApiResponse<T>
      } catch (error) {
        lastError = error as Error
        
        // Don't retry on last attempt or non-retryable errors
        if (attempt === retries || !isRetryableError(error)) {
          break
        }

        // Wait before retrying
        await wait(calculateRetryDelay(attempt, retryDelay))
      }
    }

    throw lastError!
  }

  /**
   * GET request helper
   */
  async get<T>(endpoint: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'GET' })
  }

  /**
   * POST request helper
   */
  async post<T>(endpoint: string, data?: any, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined
    })
  }

  /**
   * PUT request helper
   */
  async put<T>(endpoint: string, data?: any, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined
    })
  }

  /**
   * DELETE request helper
   */
  async delete<T>(endpoint: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' })
  }

  /**
   * PATCH request helper
   */
  async patch<T>(endpoint: string, data?: any, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined
    })
  }
}

// Create default API client instance
export const apiClient = new ApiClient({
  baseURL: '/api',
  timeout: 10000,
  retries: 3,
  retryDelay: 1000
})

/**
 * Utility function to handle API errors consistently
 */
export const handleApiError = (error: unknown): string => {
  if (error instanceof ApiError) {
    return error.message
  }
  
  if (error instanceof NetworkError) {
    return 'Network error. Please check your connection and try again.'
  }
  
  if (error instanceof TimeoutError) {
    return 'Request timed out. Please try again.'
  }
  
  return 'An unexpected error occurred. Please try again.'
}

/**
 * Utility function to check if an error is retryable
 */
export const isRetryable = (error: unknown): boolean => {
  return isRetryableError(error)
}

/**
 * Build query string from object
 */
export const buildQueryString = (params: Record<string, any>): string => {
  const searchParams = new URLSearchParams()
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        searchParams.append(key, value.join(','))
      } else {
        searchParams.append(key, String(value))
      }
    }
  })
  
  return searchParams.toString()
}

/**
 * Create API endpoint with query parameters
 */
export const createEndpoint = (path: string, params?: Record<string, any>): string => {
  if (!params) return path
  
  const queryString = buildQueryString(params)
  return queryString ? `${path}?${queryString}` : path
}

export default apiClient