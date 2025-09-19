'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import {
  ApiResult,
  ApiError,
  RequestOptions,
  LoadingState,
  SearchEventsParams,
  SearchEventsResponse,
  Event,
  Teacher,
  Musician
} from '@/types/api'
import { apiHandler, LoadingStateManager, apiUtils, VintageApiError } from '@/lib/api-handler'

/**
 * Hook for managing loading states with vintage theming
 */
export function useLoadingState(initialState?: Partial<LoadingState>) {
  const managerRef = useRef<LoadingStateManager>()

  if (!managerRef.current) {
    managerRef.current = new LoadingStateManager()
  }

  const [state, setState] = useState<LoadingState>({
    isLoading: false,
    isError: false,
    error: null,
    isRetrying: false,
    retryCount: 0,
    ...initialState
  })

  useEffect(() => {
    const unsubscribe = managerRef.current!.subscribe(setState)
    return unsubscribe
  }, [])

  const setLoading = useCallback((isLoading: boolean) => {
    managerRef.current!.setLoading(isLoading)
  }, [])

  const setError = useCallback((error: ApiError | null) => {
    managerRef.current!.setError(error)
  }, [])

  const setRetrying = useCallback((isRetrying: boolean) => {
    managerRef.current!.setRetrying(isRetrying)
  }, [])

  const reset = useCallback(() => {
    managerRef.current!.reset()
  }, [])

  return {
    ...state,
    setLoading,
    setError,
    setRetrying,
    reset,
    // Utility methods
    isIdle: !state.isLoading && !state.isError && !state.isRetrying,
    hasError: state.isError && state.error !== null,
    errorMessage: state.error ? apiUtils.getErrorMessage(state.error) : null,
    userFriendlyError: state.error ? apiUtils.formatErrorForUser(state.error) : null,
    canRetry: state.error ? apiUtils.isRetryableError(state.error) : false
  }
}

/**
 * Generic API call hook with automatic loading and error handling
 */
export function useApiCall<T>(
  endpoint: string,
  options?: RequestOptions,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null)
  const loadingState = useLoadingState()
  const abortControllerRef = useRef<AbortController>()

  const executeCall = useCallback(async (customOptions?: RequestOptions) => {
    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    abortControllerRef.current = new AbortController()

    const mergedOptions = {
      ...options,
      ...customOptions,
      signal: abortControllerRef.current.signal
    }

    loadingState.setLoading(true)

    try {
      const result = await apiHandler.request<T>(endpoint, mergedOptions)

      if (result.success) {
        setData(result.data)
        loadingState.reset()
      } else {
        loadingState.setError(result.error!)
      }

      return result
    } catch (error) {
      const apiError = error instanceof VintageApiError
        ? error
        : new VintageApiError('UnknownError', apiUtils.getErrorMessage(error))

      loadingState.setError(apiError)
      return { success: false, error: apiError } as ApiResult<T>
    }
  }, [endpoint, options, loadingState])

  const retry = useCallback(() => {
    if (loadingState.canRetry) {
      loadingState.setRetrying(true)
      executeCall()
    }
  }, [executeCall, loadingState])

  // Auto-execute on mount and dependency changes
  useEffect(() => {
    executeCall()

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, dependencies)

  return {
    data,
    ...loadingState,
    execute: executeCall,
    retry,
    refresh: () => executeCall({ skipCache: true })
  }
}

/**
 * Hook specifically for retryable requests with exponential backoff
 */
export function useRetryableRequest<T>(
  endpoint: string,
  options?: RequestOptions & {
    maxRetries?: number
    autoRetry?: boolean
    retryDelay?: number
  }
) {
  const {
    maxRetries = 3,
    autoRetry = false,
    retryDelay = 1000,
    ...requestOptions
  } = options || {}

  const [data, setData] = useState<T | null>(null)
  const loadingState = useLoadingState()
  const retryTimeoutRef = useRef<NodeJS.Timeout>()

  const executeRequest = useCallback(async (attempt = 1): Promise<ApiResult<T>> => {
    if (attempt > 1) {
      loadingState.setRetrying(true)
    } else {
      loadingState.setLoading(true)
    }

    try {
      const result = await apiHandler.request<T>(endpoint, {
        ...requestOptions,
        retries: {
          maxRetries: 0, // Handle retries manually for better control
          ...requestOptions.retries
        }
      })

      if (result.success) {
        setData(result.data)
        loadingState.reset()
        return result
      } else {
        // Check if we should retry
        if (attempt <= maxRetries && apiUtils.isRetryableError(result.error)) {
          const delay = retryDelay * Math.pow(2, attempt - 1) // Exponential backoff

          if (autoRetry) {
            retryTimeoutRef.current = setTimeout(() => {
              executeRequest(attempt + 1)
            }, delay)
          } else {
            loadingState.setError(result.error!)
          }
        } else {
          loadingState.setError(result.error!)
        }

        return result
      }
    } catch (error) {
      const apiError = error instanceof VintageApiError
        ? error
        : new VintageApiError('UnknownError', apiUtils.getErrorMessage(error))

      if (attempt <= maxRetries && apiUtils.isRetryableError(apiError)) {
        const delay = retryDelay * Math.pow(2, attempt - 1)

        if (autoRetry) {
          retryTimeoutRef.current = setTimeout(() => {
            executeRequest(attempt + 1)
          }, delay)
        } else {
          loadingState.setError(apiError)
        }
      } else {
        loadingState.setError(apiError)
      }

      return { success: false, error: apiError } as ApiResult<T>
    }
  }, [endpoint, requestOptions, maxRetries, autoRetry, retryDelay, loadingState])

  const manualRetry = useCallback(() => {
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current)
    }
    executeRequest()
  }, [executeRequest])

  const cancel = useCallback(() => {
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current)
      loadingState.reset()
    }
  }, [loadingState])

  useEffect(() => {
    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current)
      }
    }
  }, [])

  return {
    data,
    ...loadingState,
    execute: executeRequest,
    retry: manualRetry,
    cancel,
    refresh: () => executeRequest(1)
  }
}

/**
 * Hook for searching events with debouncing and caching
 */
export function useEventSearch(
  params?: SearchEventsParams,
  options?: {
    debounceMs?: number
    autoSearch?: boolean
    cacheResults?: boolean
  }
) {
  const {
    debounceMs = 300,
    autoSearch = true,
    cacheResults = true
  } = options || {}

  const [searchParams, setSearchParams] = useState<SearchEventsParams>(params || {})
  const [debouncedParams, setDebouncedParams] = useState(searchParams)
  const debounceTimeoutRef = useRef<NodeJS.Timeout>()

  // Debounce search parameters
  useEffect(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current)
    }

    debounceTimeoutRef.current = setTimeout(() => {
      setDebouncedParams(searchParams)
    }, debounceMs)

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current)
      }
    }
  }, [searchParams, debounceMs])

  // Build query string
  const queryString = new URLSearchParams()
  Object.entries(debouncedParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        value.forEach(v => queryString.append(key, v.toString()))
      } else {
        queryString.append(key, value.toString())
      }
    }
  })

  const endpoint = `/api/search/events?${queryString.toString()}`

  const apiCall = useApiCall<SearchEventsResponse>(
    endpoint,
    {
      skipCache: !cacheResults,
      timeout: 15000 // 15s timeout for search
    },
    autoSearch ? [endpoint] : [] // Only auto-execute if autoSearch is true
  )

  const search = useCallback((newParams: Partial<SearchEventsParams>) => {
    setSearchParams(prev => ({ ...prev, ...newParams }))
  }, [])

  const clearSearch = useCallback(() => {
    setSearchParams({})
  }, [])

  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current)
      }
    }
  }, [])

  return {
    ...apiCall,
    searchParams,
    search,
    clearSearch,
    events: apiCall.data?.events || [],
    total: apiCall.data?.total || 0,
    hasMore: apiCall.data?.hasMore || false,
    isEmpty: !apiCall.isLoading && (apiCall.data?.events?.length || 0) === 0
  }
}

/**
 * Hook for fetching teacher data
 */
export function useTeacher(teacherId: string | null) {
  return useApiCall<Teacher>(
    teacherId ? `/api/teachers/${teacherId}` : '',
    {},
    [teacherId]
  )
}

/**
 * Hook for fetching musician data
 */
export function useMusician(musicianId: string | null) {
  return useApiCall<Musician>(
    musicianId ? `/api/musicians/${musicianId}` : '',
    {},
    [musicianId]
  )
}

/**
 * Hook for fetching event details
 */
export function useEvent(eventId: string | null) {
  return useApiCall<Event>(
    eventId ? `/api/events/${eventId}` : '',
    {},
    [eventId]
  )
}

/**
 * Hook for health check and connection status
 */
export function useApiHealth() {
  const [isOnline, setIsOnline] = useState(true)
  const healthCheck = useRetryableRequest<{ status: string; timestamp: string }>(
    '/api/health',
    {
      timeout: 5000,
      maxRetries: 2,
      autoRetry: true,
      retryDelay: 2000
    }
  )

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      healthCheck.execute()
    }

    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Initial check
    setIsOnline(navigator.onLine)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [healthCheck])

  return {
    ...healthCheck,
    isOnline,
    isConnected: healthCheck.data?.status === 'ok' && isOnline,
    lastCheck: healthCheck.data?.timestamp
  }
}

/**
 * Export commonly used API utilities
 */
export { apiUtils, VintageApiError }
export type { ApiError, ApiResult, LoadingState } from '@/types/api'