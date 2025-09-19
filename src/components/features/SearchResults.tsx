'use client'

import { useState } from 'react'

import { Button } from '@/components/ui/Button'
import { EventCard } from './EventCard'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { SavedSearchModal } from './SavedSearchModal'
import { SearchResult } from '@/hooks/useAdvancedSearch'

interface SearchResultsProps {
  results: SearchResult | null
  isLoading: boolean
  error: string | null
  onLoadMore?: () => void
  onSaveSearch?: () => void
  currentFilters: any
  currentOptions: any
  searchQuery?: string
  enableHighlighting?: boolean
}

export function SearchResults({
  results,
  isLoading,
  error,
  onLoadMore,
  onSaveSearch,
  currentFilters,
  currentOptions,
  searchQuery,
  enableHighlighting = true
}: SearchResultsProps) {
  const [showSavedSearchModal, setShowSavedSearchModal] = useState(false)

  // Highlight search terms in text
  const highlightText = (text: string, query?: string) => {
    if (!enableHighlighting || !query || !text) return text

    const parts = text.split(new RegExp(`(${query})`, 'gi'))
    return (
      <>
        {parts.map((part, index) => 
          part.toLowerCase() === query.toLowerCase() ? (
            <mark key={index} className="bg-yellow-200 text-gray-900 font-medium">{part}</mark>
          ) : (
            part
          )
        )}
      </>
    )
  }

  // Format search metadata for display
  const getSearchSummary = () => {
    if (!results) return null

    const { searchMeta } = results
    const parts = []

    if (searchMeta.query) {
      parts.push(`"${searchMeta.query}"`)
    }

    if (searchMeta.location?.latitude && searchMeta.location?.longitude) {
      parts.push(`within ${searchMeta.location.radius}km`)
    }

    if (searchMeta.filters.teachers?.length) {
      parts.push(`with ${searchMeta.filters.teachers.length} selected teacher(s)`)
    }

    if (searchMeta.filters.musicians?.length) {
      parts.push(`with ${searchMeta.filters.musicians.length} selected musician(s)`)
    }

    if (searchMeta.filters.eventTypes?.length) {
      parts.push(`type: ${searchMeta.filters.eventTypes.join(', ')}`)
    }

    if (searchMeta.filters.dateRange?.start || searchMeta.filters.dateRange?.end) {
      const start = searchMeta.filters.dateRange.start
      const end = searchMeta.filters.dateRange.end
      if (start && end) {
        parts.push(`from ${new Date(start).toLocaleDateString()} to ${new Date(end).toLocaleDateString()}`)
      } else if (start) {
        parts.push(`from ${new Date(start).toLocaleDateString()}`)
      } else if (end) {
        parts.push(`until ${new Date(end).toLocaleDateString()}`)
      }
    }

    if (searchMeta.filters.priceRange?.min || searchMeta.filters.priceRange?.max) {
      const min = searchMeta.filters.priceRange.min
      const max = searchMeta.filters.priceRange.max
      if (min !== undefined && max !== undefined) {
        parts.push(`$${min} - $${max}`)
      } else if (min !== undefined) {
        parts.push(`from $${min}`)
      } else if (max !== undefined) {
        parts.push(`up to $${max}`)
      }
    }

    return parts.join(' • ')
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <svg className="mx-auto h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <h3 className="mt-2 text-lg font-medium text-red-900">Search Error</h3>
        <p className="mt-1 text-sm text-red-600">{error}</p>
        <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    )
  }

  if (isLoading && !results) {
    return (
      <div className="text-center py-12">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-gray-600">Searching for events...</p>
      </div>
    )
  }

  if (!results || !results.events.length) {
    return (
      <div className="text-center py-12">
        <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <h3 className="mt-4 text-lg font-medium text-gray-900">No events found</h3>
        <p className="mt-2 text-gray-600">
          Try adjusting your search criteria or removing some filters
        </p>
        <div className="mt-6 space-x-4">
          <Button variant="outline" onClick={() => window.location.reload()}>
            Clear All Filters
          </Button>
          <Button variant="primary" onClick={onSaveSearch}>
            Get Notified When Events Match
          </Button>
        </div>
      </div>
    )
  }

  const searchSummary = getSearchSummary()
  const hasMoreResults = results.pagination.hasNext

  return (
    <div className="space-y-6">
      {/* Search Results Header */}
      <div className="bg-white border-b border-gray-200 pb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Search Results
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              {results.searchMeta.totalMatches.toLocaleString()} event{results.searchMeta.totalMatches !== 1 ? 's' : ''} found
              {searchSummary && (
                <span> • {searchSummary}</span>
              )}
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Sort Options */}
            <select 
              className="text-sm border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              defaultValue={`${results.searchMeta.sorting.sortBy}-${results.searchMeta.sorting.sortOrder}`}
            >
              <option value="relevance-desc">Most Relevant</option>
              <option value="date-asc">Date (Earliest First)</option>
              <option value="date-desc">Date (Latest First)</option>
              <option value="popularity-desc">Most Popular</option>
              <option value="distance-asc">Nearest First</option>
            </select>

            {/* Save Search Button */}
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowSavedSearchModal(true)}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              Save Search
            </Button>
          </div>
        </div>

        {/* Active Filters Display */}
        {(currentFilters.query || Object.keys(currentFilters).length > 1) && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-sm text-gray-500">Active filters:</span>
            
            {currentFilters.query && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800">
                Search: "{currentFilters.query}"
                <button className="ml-2 text-primary-600 hover:text-primary-800">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            )}

            {currentFilters.location?.city && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                Location: {currentFilters.location.city}
                <button className="ml-2 text-blue-600 hover:text-blue-800">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            )}

            {currentFilters.teachers?.length > 0 && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                Teachers: {currentFilters.teachers.length}
                <button className="ml-2 text-green-600 hover:text-green-800">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            )}

            {/* Clear all filters button */}
            <button className="text-sm text-gray-500 hover:text-gray-700 underline">
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Search Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.events.map((event) => (
          <EventCard
            key={event.id}
            event={{
              ...event,
              // Apply highlighting to event names and descriptions
              name: enableHighlighting ? highlightText(event.name, searchQuery) : event.name,
              description: enableHighlighting ? highlightText(event.description || '', searchQuery) : event.description,
            }}
            showDistance={!!results.searchMeta.location}
            highlightQuery={enableHighlighting ? searchQuery : undefined}
          />
        ))}
      </div>

      {/* Load More / Pagination */}
      {hasMoreResults && (
        <div className="text-center py-8">
          <Button
            variant="outline"
            onClick={onLoadMore}
            disabled={isLoading}
            className="px-8"
          >
            {isLoading ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Loading more...
              </>
            ) : (
              <>
                Load More Events
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </>
            )}
          </Button>
          
          <p className="mt-2 text-sm text-gray-500">
            Showing {results.events.length} of {results.searchMeta.totalMatches.toLocaleString()} events
          </p>
        </div>
      )}

      {/* Results Summary */}
      <div className="bg-gray-50 rounded-lg p-4 text-center">
        <p className="text-sm text-gray-600">
          Found {results.searchMeta.totalMatches.toLocaleString()} events
          {results.searchMeta.location && (
            <> within {results.searchMeta.location.radius}km of your location</>
          )}
          {searchSummary && (
            <> matching your search criteria</>
          )}
        </p>
        {!hasMoreResults && results.events.length > 0 && (
          <p className="text-xs text-gray-500 mt-1">
            You've seen all results. Try broadening your search for more events.
          </p>
        )}
      </div>

      {/* Saved Search Modal */}
      <SavedSearchModal
        isOpen={showSavedSearchModal}
        onClose={() => setShowSavedSearchModal(false)}
        currentFilters={currentFilters}
        currentOptions={currentOptions}
        onSearchApplied={() => {
          // Handle applying a saved search
          console.log('Saved search applied')
        }}
      />
    </div>
  )
}