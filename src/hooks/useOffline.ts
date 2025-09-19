'use client'

import { useState, useEffect, useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'

/**
 * Offline cache entry
 */
interface OfflineCacheEntry<T> {
  data: T
  timestamp: number
  expiresAt: number
}

/**
 * Offline configuration
 */
interface OfflineConfig {
  maxAge?: number // Cache expiration in milliseconds
  maxEntries?: number // Maximum number of cache entries
  storageKey?: string // LocalStorage key prefix
}

/**
 * Hook for managing offline functionality
 */
export function useOffline<T>(config: OfflineConfig = {}) {
  const {
    maxAge = 24 * 60 * 60 * 1000, // 24 hours
    maxEntries = 100,
    storageKey = 'offline-cache'
  } = config

  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  )
  const [cache, setCache] = useLocalStorage<Record<string, OfflineCacheEntry<T>>>(
    storageKey,
    {}
  )

  // Listen to online/offline events
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  /**
   * Check if cache entry is valid
   */
  const isCacheValid = useCallback((entry: OfflineCacheEntry<T>): boolean => {
    return Date.now() < entry.expiresAt
  }, [])

  /**
   * Get data from cache
   */
  const getFromCache = useCallback((key: string): T | null => {
    const entry = cache[key]
    if (!entry) return null

    if (isCacheValid(entry)) {
      return entry.data
    }

    // Remove expired entry
    const newCache = { ...cache }
    delete newCache[key]
    setCache(newCache)
    return null
  }, [cache, isCacheValid, setCache])

  /**
   * Save data to cache
   */
  const saveToCache = useCallback((key: string, data: T): void => {
    const now = Date.now()
    const entry: OfflineCacheEntry<T> = {
      data,
      timestamp: now,
      expiresAt: now + maxAge
    }

    let newCache = { ...cache, [key]: entry }

    // Remove expired entries
    Object.keys(newCache).forEach(k => {
      if (!isCacheValid(newCache[k])) {
        delete newCache[k]
      }
    })

    // Limit cache size
    const cacheKeys = Object.keys(newCache)
    if (cacheKeys.length > maxEntries) {
      // Remove oldest entries
      const sortedKeys = cacheKeys.sort((a, b) => 
        newCache[a].timestamp - newCache[b].timestamp
      )
      const keysToRemove = sortedKeys.slice(0, cacheKeys.length - maxEntries)
      keysToRemove.forEach(k => delete newCache[k])
    }

    setCache(newCache)
  }, [cache, maxAge, maxEntries, isCacheValid, setCache])

  /**
   * Clear all cache entries
   */
  const clearCache = useCallback(() => {
    setCache({})
  }, [setCache])

  /**
   * Clear expired cache entries
   */
  const clearExpiredCache = useCallback(() => {
    const newCache = { ...cache }
    let hasExpired = false

    Object.keys(newCache).forEach(key => {
      if (!isCacheValid(newCache[key])) {
        delete newCache[key]
        hasExpired = true
      }
    })

    if (hasExpired) {
      setCache(newCache)
    }
  }, [cache, isCacheValid, setCache])

  /**
   * Get cache statistics
   */
  const getCacheStats = useCallback(() => {
    const entries = Object.values(cache)
    const validEntries = entries.filter(isCacheValid)
    const expiredEntries = entries.filter(entry => !isCacheValid(entry))

    return {
      totalEntries: entries.length,
      validEntries: validEntries.length,
      expiredEntries: expiredEntries.length,
      cacheSize: JSON.stringify(cache).length,
      oldestEntry: entries.reduce((oldest, entry) => 
        !oldest || entry.timestamp < oldest.timestamp ? entry : oldest
      , null as OfflineCacheEntry<T> | null)
    }
  }, [cache, isCacheValid])

  return {
    isOnline,
    isOffline: !isOnline,
    cache,
    getFromCache,
    saveToCache,
    clearCache,
    clearExpiredCache,
    getCacheStats
  }
}

/**
 * Hook for offline-first data fetching
 */
export function useOfflineData<T>(
  key: string,
  fetcher: () => Promise<T>,
  config: OfflineConfig = {}
) {
  const {
    isOnline,
    getFromCache,
    saveToCache
  } = useOffline<T>(config)

  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isFromCache, setIsFromCache] = useState(false)

  const fetchData = useCallback(async (forceRefresh = false) => {
    setLoading(true)
    setError(null)

    try {
      // Try to get from cache first
      if (!forceRefresh) {
        const cachedData = getFromCache(key)
        if (cachedData) {
          setData(cachedData)
          setIsFromCache(true)
          setLoading(false)
          
          // If online, fetch fresh data in the background
          if (isOnline) {
            try {
              const freshData = await fetcher()
              setData(freshData)
              setIsFromCache(false)
              saveToCache(key, freshData)
            } catch (err) {
              // Keep cached data if fresh fetch fails
              console.warn('Background fetch failed, using cached data', err)
            }
          }
          return cachedData
        }
      }

      // If no cached data or force refresh, fetch from network
      if (isOnline) {
        const freshData = await fetcher()
        setData(freshData)
        setIsFromCache(false)
        saveToCache(key, freshData)
        return freshData
      } else {
        throw new Error('No cached data available and device is offline')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      
      // Try to fallback to cached data if available
      const cachedData = getFromCache(key)
      if (cachedData) {
        setData(cachedData)
        setIsFromCache(true)
        setError(`${errorMessage} (showing cached data)`)
      }
    } finally {
      setLoading(false)
    }
  }, [key, fetcher, isOnline, getFromCache, saveToCache])

  const refresh = useCallback(() => {
    return fetchData(true)
  }, [fetchData])

  // Auto-fetch on mount
  useEffect(() => {
    fetchData()
  }, [fetchData])

  return {
    data,
    loading,
    error,
    isFromCache,
    refresh,
    refetch: fetchData
  }
}

/**
 * Hook for offline queue management
 */
export function useOfflineQueue<T>(
  storageKey: string = 'offline-queue'
) {
  const [queue, setQueue] = useLocalStorage<T[]>(storageKey, [])
  const [processing, setProcessing] = useState(false)

  const addToQueue = useCallback((item: T) => {
    setQueue(prev => [...prev, item])
  }, [setQueue])

  const removeFromQueue = useCallback((index: number) => {
    setQueue(prev => prev.filter((_, i) => i !== index))
  }, [setQueue])

  const clearQueue = useCallback(() => {
    setQueue([])
  }, [setQueue])

  const processQueue = useCallback(async (
    processor: (item: T) => Promise<boolean>
  ) => {
    if (processing || queue.length === 0) return

    setProcessing(true)
    const failedItems: T[] = []

    for (let i = 0; i < queue.length; i++) {
      try {
        const success = await processor(queue[i])
        if (!success) {
          failedItems.push(queue[i])
        }
      } catch (error) {
        console.error('Failed to process queue item:', error)
        failedItems.push(queue[i])
      }
    }

    // Update queue with failed items
    setQueue(failedItems)
    setProcessing(false)
  }, [queue, processing, setQueue])

  return {
    queue,
    queueSize: queue.length,
    processing,
    addToQueue,
    removeFromQueue,
    clearQueue,
    processQueue
  }
}

/**
 * Hook for offline form submissions
 */
export function useOfflineForm<T>(
  submitFn: (data: T) => Promise<void>,
  options: {
    onSuccess?: () => void
    onError?: (error: string) => void
    storageKey?: string
  } = {}
) {
  const { onSuccess, onError, storageKey = 'offline-forms' } = options
  const { isOnline } = useOffline()
  const { addToQueue, processQueue } = useOfflineQueue<T>(storageKey)

  const [submitting, setSubmitting] = useState(false)

  const submit = useCallback(async (data: T) => {
    setSubmitting(true)

    try {
      if (isOnline) {
        await submitFn(data)
        onSuccess?.()
      } else {
        addToQueue(data)
        onSuccess?.()
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Submission failed'
      
      if (!isOnline) {
        addToQueue(data)
        onSuccess?.()
      } else {
        onError?.(errorMessage)
      }
    } finally {
      setSubmitting(false)
    }
  }, [isOnline, submitFn, addToQueue, onSuccess, onError])

  const processPendingSubmissions = useCallback(async () => {
    if (isOnline) {
      await processQueue(async (data) => {
        try {
          await submitFn(data)
          return true
        } catch (error) {
          console.error('Failed to process pending submission:', error)
          return false
        }
      })
    }
  }, [isOnline, processQueue, submitFn])

  // Process pending submissions when coming back online
  useEffect(() => {
    if (isOnline) {
      processPendingSubmissions()
    }
  }, [isOnline, processPendingSubmissions])

  return {
    submit,
    submitting,
    processPendingSubmissions
  }
}

export default useOffline