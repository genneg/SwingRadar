'use client'

import { useState, useEffect } from 'react'
import { SearchBarSimple } from '@/components/features/SearchBarSimple'
import { FilterPanel } from '@/components/features/FilterPanel'
import { EventList } from '@/components/features/EventList'
import { useAdvancedSearch } from '@/hooks/useAdvancedSearch'
import {
  ArtDecoLoader,
  VintageErrorState,
  InlineJazzLoading
} from '@/components/ui/VintageLoadingStates'
import { VintageApiError } from '@/hooks/useVintageApi'

export default function EventsPage() {
  const { 
    filters, 
    results, 
    isLoading, 
    error, 
    updateFilters, 
    search 
  } = useAdvancedSearch()

  const [showFilters, setShowFilters] = useState(false)

  // Perform initial search when component mounts
  useEffect(() => {
    search()
  }, [])

  const handleFiltersChange = (newFilters: any) => {
    updateFilters(newFilters)
  }

  return (
    <div className="app-container">
      <div className="max-w-md mx-auto bg-background min-h-screen relative">
        {/* Header Section */}
        <div className="content-wrapper">
          <div className="hero-section rounded-2xl p-12 mb-12">
            <div className="hero-overlay"></div>
            <div className="relative z-10 text-center">
              <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl mb-6 text-white leading-tight font-bold">
                Blues Dance Festivals
              </h1>
              <p className="text-white text-lg mb-8 leading-relaxed max-w-md mx-auto font-medium">
                Discover amazing blues dance festivals happening around the world
              </p>
              
              <SearchBarSimple
                onSearch={(query) => updateFilters({ query })}
                onToggleFilters={() => setShowFilters(!showFilters)}
                filtersActive={showFilters}
                className="max-w-full"
              />
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="card p-6 mb-12">
              <FilterPanel
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onApply={() => search()}
                onReset={() => {
                  updateFilters({})
                  search()
                }}
              />
            </div>
          )}

          {/* Events List */}
          <div className="space-y-6">
            {error && (
              <VintageErrorState
                error={new VintageApiError('ServerError', 'The event orchestra is out of tune')}
                onRetry={() => search()}
                retryText="Start the Concert"
                className="mb-6"
              />
            )}

            {isLoading && !results && (
              <ArtDecoLoader
                text="Loading amazing blues events..."
                size="lg"
                className="py-12"
              />
            )}

            {results && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <p className="text-white text-base font-medium">
                    {results.searchMeta.totalMatches} events found
                  </p>
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="btn-ghost btn-sm flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                    </svg>
                    <span>Filters</span>
                  </button>
                </div>

                <EventList events={results.events} enhanced={true} />

                {results.pagination.hasNext && (
                  <div className="text-center mt-6">
                    <button
                      onClick={() => {
                        // Load more events
                        // This would typically call search with next page
                      }}
                      className="btn-primary"
                    >
                      Load More Events
                    </button>
                  </div>
                )}
              </div>
            )}

            {!isLoading && results && results.events.length === 0 && (
              <div className="text-center py-12">
                <div className="vintage-calendar-icon w-16 h-16 mx-auto mb-6 relative">
                  <div className="w-12 h-14 bg-gradient-to-b from-gold-600 to-gold-700 rounded-lg mx-auto relative">
                    <div className="absolute inset-1 bg-gradient-to-b from-gold-400 to-gold-500 rounded-lg"></div>
                    <div className="absolute top-1 left-2 w-2 h-2 bg-navy-900 rounded-sm opacity-30"></div>
                    <div className="absolute top-1 right-2 w-2 h-2 bg-navy-900 rounded-sm opacity-30"></div>
                    <div className="absolute top-4 left-1.5 w-3 h-0.5 bg-navy-900 opacity-20"></div>
                    <div className="absolute top-6 left-1.5 w-3 h-0.5 bg-navy-900 opacity-20"></div>
                    <div className="absolute top-8 left-1.5 w-3 h-0.5 bg-navy-900 opacity-20"></div>
                  </div>
                  <div className="absolute -top-1 left-3 w-1 h-3 bg-copper-600 rounded-t-full"></div>
                  <div className="absolute -top-1 right-3 w-1 h-3 bg-copper-600 rounded-t-full"></div>
                </div>
                <h3 className="jazz-font text-2xl text-gold-400 mb-3">
                  Calendar is Empty
                </h3>
                <p className="vintage-text text-cream-200 mb-4">
                  No events match your current search. Try adjusting your filters or exploring different dates.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}