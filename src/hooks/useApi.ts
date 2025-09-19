'use client'

import { useState, useCallback, useEffect } from 'react'
import { apiClient, handleApiError, ApiError, NetworkError, TimeoutError } from '@/lib/api/client'
import type { ApiResponse } from '@/types'

/**
 * API request state
 */
interface ApiState<T> {
  data: T | null
  loading: boolean
  error: string | null
  status: 'idle' | 'loading' | 'success' | 'error'
  lastFetch: number | null
}

/**
 * Options for API requests
 */
interface UseApiOptions {
  immediate?: boolean
  onSuccess?: (data: any) => void
  onError?: (error: string) => void
  staleTime?: number
  retries?: number
  retryDelay?: number
}

/**
 * Enhanced API hook with loading states, error handling, and retry logic
 */
export function useApi<T>(
  endpoint: string,
  options: UseApiOptions = {}
) {
  const {
    immediate = false,
    onSuccess,
    onError,
    staleTime = 5 * 60 * 1000, // 5 minutes
    retries = 3,
    retryDelay = 1000
  } = options

  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
    status: 'idle',
    lastFetch: null
  })

  const [abortController, setAbortController] = useState<AbortController | null>(null)

  const execute = useCallback(async (
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' = 'GET',
    data?: any,
    customEndpoint?: string
  ) => {
    const currentEndpoint = customEndpoint || endpoint

    // Cancel previous request if still pending
    if (abortController) {
      abortController.abort()
    }

    const newAbortController = new AbortController()
    setAbortController(newAbortController)

    setState(prev => ({
      ...prev,
      loading: true,
      error: null,
      status: 'loading'
    }))

    try {
      let response: ApiResponse<T>

      const requestOptions = {
        signal: newAbortController.signal,
        retries,
        retryDelay
      }

      switch (method) {
        case 'GET':
          response = await apiClient.get<T>(currentEndpoint, requestOptions)
          break
        case 'POST':
          response = await apiClient.post<T>(currentEndpoint, data, requestOptions)
          break
        case 'PUT':
          response = await apiClient.put<T>(currentEndpoint, data, requestOptions)
          break
        case 'DELETE':
          response = await apiClient.delete<T>(currentEndpoint, requestOptions)
          break
        case 'PATCH':
          response = await apiClient.patch<T>(currentEndpoint, data, requestOptions)
          break
        default:
          throw new Error(`Unsupported HTTP method: ${method}`)
      }

      if (!newAbortController.signal.aborted) {
        setState({
          data: response.data,
          loading: false,
          error: null,
          status: 'success',
          lastFetch: Date.now()
        })

        onSuccess?.(response.data)
      }

      return response.data
    } catch (error) {
      if (!newAbortController.signal.aborted) {
        const errorMessage = handleApiError(error)
        
        setState({
          data: null,
          loading: false,
          error: errorMessage,
          status: 'error',
          lastFetch: null
        })

        onError?.(errorMessage)
      }

      throw error
    } finally {
      if (abortController === newAbortController) {
        setAbortController(null)
      }
    }
  }, [endpoint, abortController, onSuccess, onError, retries, retryDelay])

  const get = useCallback((customEndpoint?: string) => {
    return execute('GET', undefined, customEndpoint)
  }, [execute])

  const post = useCallback((data: any, customEndpoint?: string) => {
    return execute('POST', data, customEndpoint)
  }, [execute])

  const put = useCallback((data: any, customEndpoint?: string) => {
    return execute('PUT', data, customEndpoint)
  }, [execute])

  const patch = useCallback((data: any, customEndpoint?: string) => {
    return execute('PATCH', data, customEndpoint)
  }, [execute])

  const del = useCallback((customEndpoint?: string) => {
    return execute('DELETE', undefined, customEndpoint)
  }, [execute])

  const refresh = useCallback(() => {
    return get()
  }, [get])

  const reset = useCallback(() => {
    if (abortController) {
      abortController.abort()
    }
    
    setState({
      data: null,
      loading: false,
      error: null,
      status: 'idle',
      lastFetch: null
    })
  }, [abortController])

  // Check if data is stale
  const isStale = useCallback(() => {
    if (!state.lastFetch) return true
    return Date.now() - state.lastFetch > staleTime
  }, [state.lastFetch, staleTime])

  // Auto-fetch on mount if immediate is true
  useEffect(() => {
    if (immediate && endpoint) {
      get()
    }
  }, [immediate, endpoint, get])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortController) {
        abortController.abort()
      }
    }
  }, [abortController])

  return {
    ...state,
    execute,
    get,
    post,
    put,
    patch,
    delete: del,
    refresh,
    reset,
    isStale: isStale(),
    cancel: () => {
      if (abortController) {
        abortController.abort()
      }
    }
  }
}

/**
 * Hook for making multiple API requests with loading states
 */
export function useBatchApi<T extends Record<string, any>>(
  requests: Record<keyof T, string>,
  options: UseApiOptions = {}
) {
  const [states, setStates] = useState<Record<keyof T, ApiState<any>>>(() => {
    const initialState: Record<keyof T, ApiState<any>> = {} as any
    
    Object.keys(requests).forEach(key => {
      initialState[key as keyof T] = {
        data: null,
        loading: false,
        error: null,
        status: 'idle',
        lastFetch: null
      }
    })
    
    return initialState
  })

  const executeAll = useCallback(async () => {
    const keys = Object.keys(requests) as (keyof T)[]
    
    // Set all to loading
    setStates(prev => {
      const newStates = { ...prev }
      keys.forEach(key => {
        newStates[key] = {
          ...newStates[key],
          loading: true,
          error: null,
          status: 'loading'
        }
      })
      return newStates
    })

    // Execute all requests
    const results = await Promise.allSettled(
      keys.map(key => apiClient.get(requests[key]))
    )

    // Update states based on results
    setStates(prev => {
      const newStates = { ...prev }
      
      results.forEach((result, index) => {
        const key = keys[index]
        
        if (result.status === 'fulfilled') {
          newStates[key] = {
            data: result.value.data,
            loading: false,
            error: null,
            status: 'success',
            lastFetch: Date.now()
          }
        } else {
          newStates[key] = {
            data: null,
            loading: false,
            error: handleApiError(result.reason),
            status: 'error',
            lastFetch: null
          }
        }
      })
      
      return newStates
    })

    return results
  }, [requests])

  const isLoading = Object.values(states).some(state => state.loading)
  const hasError = Object.values(states).some(state => state.error)
  const isSuccess = Object.values(states).every(state => state.status === 'success')

  return {
    states,
    executeAll,
    isLoading,
    hasError,
    isSuccess
  }
}

/**
 * Hook for paginated API requests
 */
export function usePaginatedApi<T>(
  endpoint: string,
  options: UseApiOptions & { pageSize?: number } = {}
) {
  const { pageSize = 10, ...apiOptions } = options
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [allData, setAllData] = useState<T[]>([])

  const api = useApi<{
    data: T[]
    pagination: {
      page: number
      limit: number
      total: number
      totalPages: number
      hasNext: boolean
      hasPrev: boolean
    }
  }>(endpoint, apiOptions)

  const loadPage = useCallback(async (pageNumber: number) => {
    try {
      const response = await api.get(`${endpoint}?page=${pageNumber}&limit=${pageSize}`)
      
      if (response && response.data) {
        if (pageNumber === 1) {
          setAllData(response.data)
        } else {
          setAllData(prev => [...prev, ...response.data])
        }
        
        setHasMore(response.pagination.hasNext)
        setPage(pageNumber)
      }
    } catch (error) {
      console.error('Error loading page:', error)
    }
  }, [api, endpoint, pageSize])

  const loadMore = useCallback(() => {
    if (!api.loading && hasMore) {
      loadPage(page + 1)
    }
  }, [api.loading, hasMore, page, loadPage])

  const reset = useCallback(() => {
    setPage(1)
    setHasMore(true)
    setAllData([])
    api.reset()
  }, [api])

  return {
    data: allData,
    loading: api.loading,
    error: api.error,
    hasMore,
    page,
    loadPage,
    loadMore,
    reset,
    refresh: () => loadPage(1)
  }
}

/**
 * Hook for optimistic updates
 */
export function useOptimisticApi<T>(
  endpoint: string,
  options: UseApiOptions = {}
) {
  const api = useApi<T>(endpoint, options)
  const [optimisticData, setOptimisticData] = useState<T | null>(null)

  const updateOptimistic = useCallback((newData: T) => {
    setOptimisticData(newData)
  }, [])

  const clearOptimistic = useCallback(() => {
    setOptimisticData(null)
  }, [])

  const mutate = useCallback(async (
    method: 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    data?: any,
    optimisticUpdate?: T
  ) => {
    // Apply optimistic update
    if (optimisticUpdate) {
      updateOptimistic(optimisticUpdate)
    }

    try {
      const result = await api.execute(method, data)
      clearOptimistic()
      return result
    } catch (error) {
      clearOptimistic()
      throw error
    }
  }, [api, updateOptimistic, clearOptimistic])

  return {
    ...api,
    data: optimisticData || api.data,
    mutate,
    updateOptimistic,
    clearOptimistic
  }
}

export default useApi