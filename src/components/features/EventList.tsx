'use client'

import { useState, useEffect } from 'react'

import { Button } from '@/components/ui/Button'
import { Festival } from '@/types'
import { useApi } from '@/hooks/useApi'
import { ListSkeleton, EventCardSkeleton } from '@/components/ui/LoadingStates'
import { SmartError, EmptyState } from '@/components/ui/ErrorStates'
import { NetworkStatus } from '@/components/ui/NetworkStatus'

import { EventCard } from './EventCard'
import { EnhancedEventCard } from './EnhancedEventCard'
import { memo } from 'react'

export type SortOption = 'date' | 'name' | 'location' | 'relevance'
export type ViewMode = 'grid' | 'list'

interface EventListProps {
  events: Festival[]
  loading?: boolean
  hasMore?: boolean
  onLoadMore?: () => void
  onSortChange?: (sort: SortOption) => void
  emptyMessage?: string
  className?: string
  totalCount?: number
  enhanced?: boolean
}

export function EventList({
  events,
  loading = false,
  hasMore = false,
  onLoadMore,
  onSortChange,
  emptyMessage = "No festivals found matching your criteria.",
  className,
  totalCount,
  enhanced = true
}: EventListProps) {
  const [loadingMore, setLoadingMore] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [sortBy, setSortBy] = useState<SortOption>('date')

  const handleLoadMore = async () => {
    if (onLoadMore && !loadingMore) {
      setLoadingMore(true)
      await onLoadMore()
      setLoadingMore(false)
    }
  }

  const handleSortChange = (newSort: SortOption) => {
    setSortBy(newSort)
    if (onSortChange) {
      onSortChange(newSort)
    }
  }

  if (loading && events.length === 0) {
    return (
      <div className={className}>
        <div className="grid grid-cols-1 gap-6">
          {[...Array(8)].map((_, i) => (
            <EventCardSkeleton key={i} />
          ))}
        </div>
      </div>
    )
  }

  if (!loading && events.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-primary mb-3">No festivals found</h3>
        <p className="text-white text-base font-medium max-w-md mx-auto">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className={className} role="main" aria-label="Festival events listing">
      {/* Results Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        {/* Results Count */}
        <div className="flex items-center gap-4">
          <p className="text-white text-base font-medium">
            {totalCount ? (
              <>
                Showing {events.length} of {totalCount} festival{totalCount !== 1 ? 's' : ''}
              </>
            ) : (
              <>
                {events.length} festival{events.length !== 1 ? 's' : ''} found
              </>
            )}
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex items-center border border-gray-300 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded ${
                viewMode === 'grid'
                  ? 'bg-primary/20 text-primary'
                  : 'text-white/60 hover:text-white'
              }`}
              aria-label="Grid view"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded ${
                viewMode === 'list'
                  ? 'bg-primary/20 text-primary'
                  : 'text-white/60 hover:text-white'
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
            className="form-select text-sm"
            aria-label="Sort events by"
          >
            <option value="date">Sort by Date</option>
            <option value="name">Sort by Name</option>
            <option value="location">Sort by Location</option>
            <option value="relevance">Sort by Relevance</option>
          </select>
        </div>
      </div>

      {/* Events Display */}
      <div
        className="space-y-6"
        aria-live="polite"
        aria-label={`${events.length} events displayed in single column view`}
      >
        {events.map((event) => {
          const CardComponent = enhanced ? memo(EnhancedEventCard) : memo(EventCard)
          return (
            <CardComponent
              key={event.id}
              event={event}
              className={viewMode === 'list' ? "max-w-none" : ""}
              enhanced={enhanced}
            />
          )
        })}
      </div>

      {/* Load More */}
      {hasMore && (
        <div className="text-center mt-8">
          <Button
            variant="outline"
            size="lg"
            loading={loadingMore}
            onClick={handleLoadMore}
          >
            {loadingMore ? 'Loading...' : 'Load More Festivals'}
          </Button>
        </div>
      )}

      {/* Loading More Indicator */}
      {loadingMore && (
        <div className="mt-6 space-y-6">
          {[...Array(1)].map((_, i) => (
            <EventCardSkeleton key={`loading-${i}`} />
          ))}
        </div>
      )}
    </div>
  )
}