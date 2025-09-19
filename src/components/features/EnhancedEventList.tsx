'use client'

import { useState, useEffect, useMemo } from 'react'
import { Button } from '@/components/ui/Button'
import { Festival, SearchFilters } from '@/types'
import { useApi, usePaginatedApi } from '@/hooks/useApi'
import { useOfflineData } from '@/hooks/useOffline'
import { EventCardSkeleton } from '@/components/ui/LoadingStates'
import { SmartError, EmptyState } from '@/components/ui/ErrorStates'
import { NetworkStatus } from '@/components/ui/NetworkStatus'
import { EventCard } from './EventCard'

export type SortOption = 'date' | 'name' | 'location' | 'relevance'
export type ViewMode = 'grid' | 'list'

interface EnhancedEventListProps {
  filters?: SearchFilters
  className?: string
  pageSize?: number
  enableOffline?: boolean
  autoRefresh?: boolean
}

export function EnhancedEventList({
  filters = {},
  className,
  pageSize = 12,
  enableOffline = true,
  autoRefresh = true
}: EnhancedEventListProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [sortBy, setSortBy] = useState<SortOption>('date')
  const [retryCount, setRetryCount] = useState(0)

  // Build API endpoint with filters
  const endpoint = useMemo(() => {
    const params = new URLSearchParams()
    
    // Add filters to params
    if (filters.query) params.append('q', filters.query)
    if (filters.dateRange?.start) params.append('startDate', filters.dateRange.start)
    if (filters.dateRange?.end) params.append('endDate', filters.dateRange.end)
    if (filters.location?.city) params.append('city', filters.location.city)
    if (filters.location?.country) params.append('country', filters.location.country)
    if (filters.teachers?.length) params.append('teachers', filters.teachers.join(','))
    if (filters.musicians?.length) params.append('musicians', filters.musicians.join(','))
    if (filters.priceRange?.min) params.append('minPrice', filters.priceRange.min.toString())
    if (filters.priceRange?.max) params.append('maxPrice', filters.priceRange.max.toString())
    
    // Add sort parameter
    params.append('sort', sortBy)
    
    return `/events${params.toString() ? `?${params.toString()}` : ''}`
  }, [filters, sortBy])

  // Use offline-first data fetching if enabled
  const offlineData = useOfflineData(
    `events-${endpoint}`,
    () => fetch(endpoint).then(res => res.json()),
    { maxAge: 5 * 60 * 1000 } // 5 minutes cache
  )

  // Use paginated API for load more functionality
  const paginatedApi = usePaginatedApi<Festival>(
    endpoint,
    {
      pageSize,
      onError: (error) => {
        console.error('Event list error:', error)
        setRetryCount(prev => prev + 1)
      }
    }
  )

  // Choose data source based on offline preference
  const {
    data: events,
    loading,
    error,
    hasMore,
    loadMore,
    refresh
  } = enableOffline ? {
    data: offlineData.data?.events || [],
    loading: offlineData.loading,
    error: offlineData.error,
    hasMore: false,
    loadMore: () => {},
    refresh: offlineData.refresh
  } : {
    data: paginatedApi.data || [],
    loading: paginatedApi.loading,
    error: paginatedApi.error,
    hasMore: paginatedApi.hasMore,
    loadMore: paginatedApi.loadMore,
    refresh: paginatedApi.refresh
  }

  // Auto-refresh when filters change
  useEffect(() => {
    if (autoRefresh) {
      refresh()
    }
  }, [filters, sortBy, autoRefresh, refresh])

  const handleSortChange = (newSort: SortOption) => {
    setSortBy(newSort)
  }

  const handleRetry = () => {
    setRetryCount(0)
    refresh()
  }

  // Loading state
  if (loading && events.length === 0) {
    return (
      <div className={className}>
        <div className="flex items-center justify-between mb-6">
          <div className="h-6 bg-gray-200 rounded w-48 animate-pulse" />
          <div className="flex items-center gap-3">
            <div className="h-8 bg-gray-200 rounded w-32 animate-pulse" />
            <div className="h-8 bg-gray-200 rounded w-24 animate-pulse" />
          </div>
        </div>
        <div className="space-y-6">
          {Array.from({ length: 1 }).map((_, i) => (
            <EventCardSkeleton key={i} />
          ))}
        </div>
      </div>
    )
  }

  // Error state
  if (error && events.length === 0) {
    return (
      <div className={className}>
        <SmartError 
          error={error} 
          retry={handleRetry}
          className="my-8"
        />
        <div className="flex justify-center mt-4">
          <NetworkStatus />
        </div>
      </div>
    )
  }

  // Empty state
  if (!loading && events.length === 0) {
    return (
      <div className={className}>
        <EmptyState
          title="No festivals found"
          message="Try adjusting your search criteria or filters to find more events."
          action={handleRetry}
          actionText="Refresh"
          className="my-8"
        />
        <div className="flex justify-center mt-4">
          <NetworkStatus />
        </div>
      </div>
    )
  }

  return (
    <div className={className} role="main" aria-label="Festival events listing">
      {/* Results Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        {/* Results Count */}
        <div className="flex items-center gap-4">
          <p className="text-gray-600">
            {events.length} festival{events.length !== 1 ? 's' : ''} found
            {enableOffline && offlineData.isFromCache && (
              <span className="ml-2 text-xs text-yellow-600 bg-yellow-100 px-2 py-1 rounded">
                Cached
              </span>
            )}
          </p>
          <NetworkStatus showLabel={false} />
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex items-center border border-gray-300 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded transition-colors ${
                viewMode === 'grid'
                  ? 'bg-primary-100 text-primary-600'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
              aria-label="Grid view"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded transition-colors ${
                viewMode === 'list'
                  ? 'bg-primary-100 text-primary-600'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
              aria-label="List view"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          {/* Sort Options */}
          <select 
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value as SortOption)}
            className="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
            aria-label="Sort events by"
          >
            <option value="date">Sort by Date</option>
            <option value="name">Sort by Name</option>
            <option value="location">Sort by Location</option>
            <option value="relevance">Sort by Relevance</option>
          </select>

          {/* Refresh Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleRetry}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </Button>
        </div>
      </div>

      {/* Error Banner */}
      {error && events.length > 0 && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <p className="text-sm text-yellow-800">
              {error} (showing {enableOffline && offlineData.isFromCache ? 'cached' : 'partial'} results)
            </p>
          </div>
        </div>
      )}

      {/* Events Display */}
      <div
        className="space-y-6"
        aria-live="polite"
        aria-label={`${events.length} events displayed in single column view`}
      >
        {events.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            className="max-w-none"
          />
        ))}
      </div>

      {/* Load More */}
      {hasMore && !enableOffline && (
        <div className="text-center mt-8">
          <Button
            variant="outline"
            size="lg"
            loading={loading}
            onClick={loadMore}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Load More Festivals'}
          </Button>
        </div>
      )}

      {/* Loading More Indicator */}
      {loading && events.length > 0 && (
        <div className="mt-6 space-y-6">
          {Array.from({ length: 1 }).map((_, i) => (
            <EventCardSkeleton key={`loading-${i}`} />
          ))}
        </div>
      )}

      {/* Retry indicators */}
      {retryCount > 0 && (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">
            Retry attempt {retryCount}/3
          </p>
        </div>
      )}
    </div>
  )
}