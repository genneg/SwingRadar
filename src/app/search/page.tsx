'use client'

import { useState } from 'react'
import { FilterPanel } from '@/components/features/FilterPanel'
import { MultiStyleFilterPanel } from '@/components/features/MultiStyleFilterPanel'
import { SearchBar } from '@/components/features/SearchBar'
import { EnhancedSearchBar } from '@/components/features/EnhancedSearchBar'
import { FilterPresets } from '@/components/features/FilterPresets'
import { EnhancedEventCard } from '@/components/features/EnhancedEventCard'
import { useAdvancedSearch } from '@/hooks/useAdvancedSearch'
import {
  ArtDecoLoader,
  VintageErrorState,
  VintageSkeleton,
  VintageEventCardSkeleton
} from '@/components/ui/VintageLoadingStates'
import { VintageApiError } from '@/hooks/useVintageApi'

interface FilterOptions {
  dateRange: {
    start: string
    end: string
  }
  location: {
    city: string
    country: string
    radius: number
  }
  teachers: string[]
  musicians: string[]
  priceRange: {
    min: number
    max: number
  }
  danceStyles: string[]
  eventTypes: string[]
  difficultyLevel: string
}

export default function SearchPage() {
  const [showFilters, setShowFilters] = useState(false)
  const [showPresets, setShowPresets] = useState(false)

  const {
    filters,
    results,
    suggestions,
    isLoading,
    error,
    search,
    updateFilters,
    clearFilters,
    goToPage,
    hasActiveFilters
  } = useAdvancedSearch()

  const handleSearch = async (query: string) => {
    updateFilters({ query })
    setTimeout(() => {
      search({ ...filters, query })
    }, 100)
  }

  const handleFiltersChange = (newFilters: Partial<FilterOptions>) => {
    const searchFilters = {
      dateRange: newFilters.dateRange ? {
        start: newFilters.dateRange.start,
        end: newFilters.dateRange.end
      } : undefined,
      location: newFilters.location ? {
        city: newFilters.location.city,
        country: newFilters.location.country,
        radius: newFilters.location.radius
      } : undefined,
      teachers: newFilters.teachers,
      musicians: newFilters.musicians,
      priceRange: newFilters.priceRange,
      danceStyles: newFilters.danceStyles,
      eventTypes: newFilters.eventTypes,
      difficultyLevel: newFilters.difficultyLevel
    }

    updateFilters(searchFilters)
  }

  const handleApplyFilters = () => {
    search()
  }

  const handleResetFilters = () => {
    clearFilters()
  }

  const handleApplyPreset = (preset: any) => {
    updateFilters(preset.filters)
    setShowPresets(false)
    setTimeout(() => {
      search({ ...filters, ...preset.filters })
    }, 100)
  }

  const searchSuggestions = [
    ...suggestions.events,
    ...suggestions.teachers,
    ...suggestions.musicians,
    ...suggestions.locations
  ]

  return (
    <div className="app-container">
      <div className="max-w-md mx-auto bg-background min-h-screen relative">
        <div className="content-wrapper">
          <div className="hero-multi-style rounded-2xl p-8 mb-6">
            <div className="hero-overlay vintage-pattern"></div>
            <div className="relative z-10 text-center">
              <h1 className="font-jazz text-3xl mb-3 text-gradient-gold leading-tight font-bold">
                SwingRadar Search
              </h1>
              <p className="text-white/90 mb-4 leading-relaxed max-w-sm mx-auto font-medium">
                Detect events across all swing dance styles. Track your favorite instructors and musicians worldwide.
              </p>

              <div className="flex flex-wrap justify-center gap-2 mb-4">
                <div className="px-3 py-1 rounded-full bg-navy-800/30 text-amber-400 text-xs border border-amber-400/20">🎺 Blues</div>
                <div className="px-3 py-1 rounded-full bg-emerald-800/30 text-emerald-400 text-xs border border-emerald-400/20">🎷 Swing</div>
                <div className="px-3 py-1 rounded-full bg-orange-800/30 text-amber-400 text-xs border border-amber-400/20">💃 Balboa</div>
                <div className="px-3 py-1 rounded-full bg-teal-800/30 text-teal-400 text-xs border border-teal-400/20">🕺 Shag</div>
                <div className="px-3 py-1 rounded-full bg-purple-800/30 text-purple-400 text-xs border border-purple-400/20">🎹 Boogie</div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <EnhancedSearchBar
              onSearch={handleSearch}
              onToggleFilters={() => setShowFilters(!showFilters)}
              filtersActive={hasActiveFilters}
              searchSuggestions={searchSuggestions}
              value={filters.query || ''}
              className="max-w-full"
            />
          </div>

          {!showFilters && (
            <div className="mb-6">
              <button
                onClick={() => setShowPresets(!showPresets)}
                className="flex items-center space-x-2 px-4 py-2 bg-gold-100 hover:bg-gold-200 text-navy-900 rounded-lg border border-gold-400/30 transition-colors vintage-button"
              >
                <span>🎯</span>
                <span className="font-medium">Popular Searches</span>
                {showPresets ? <span>▼</span> : <span>▶</span>}
              </button>

              {showPresets && (
                <div className="mt-4 p-6 bg-cream-50 border-2 border-gold-400/30 rounded-xl">
                  <FilterPresets
                    onApplyPreset={handleApplyPreset}
                    currentFilters={hasActiveFilters ? filters : undefined}
                  />
                </div>
              )}
            </div>
          )}

          {showFilters && (
            <div className="card p-6 mb-6">
              <MultiStyleFilterPanel
                filters={{
                  dateRange: filters.dateRange,
                  location: filters.location,
                  teachers: filters.teachers || [],
                  musicians: filters.musicians || [],
                  priceRange: filters.priceRange,
                  danceStyles: filters.danceStyles || ['blues'],
                  eventTypes: filters.eventTypes || ['festival'],
                  difficultyLevel: filters.difficultyLevel || 'all',
                }}
                onFiltersChange={handleFiltersChange}
                onApply={handleApplyFilters}
                onReset={handleResetFilters}
              />
            </div>
          )}

          {hasActiveFilters && (
            <div className="card p-4 mb-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gold-600">Active Filters</h3>
                <button
                  onClick={handleResetFilters}
                  className="btn-ghost btn-xs"
                >
                  Clear All
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {filters.query && (
                  <span className="badge-primary">
                    Search: "{filters.query}"
                  </span>
                )}
                {filters.dateRange?.start && (
                  <span className="badge-secondary">
                    From: {filters.dateRange.start}
                  </span>
                )}
                {filters.dateRange?.end && (
                  <span className="badge-secondary">
                    To: {filters.dateRange.end}
                  </span>
                )}
                {filters.location?.city && (
                  <span className="badge-secondary">
                    {filters.location.city}
                  </span>
                )}
                {filters.location?.country && (
                  <span className="badge-secondary">
                    {filters.location.country}
                  </span>
                )}
                {filters.teachers?.map(teacher => (
                  <span key={teacher} className="badge-secondary">
                    Teacher: {teacher}
                  </span>
                ))}
                {filters.musicians?.map(musician => (
                  <span key={musician} className="badge-secondary">
                    Musician: {musician}
                  </span>
                ))}
                {filters.danceStyles?.map(style => (
                  <span key={style} className="badge-secondary">
                    Style: {style}
                  </span>
                ))}
                {filters.eventTypes?.map(type => (
                  <span key={type} className="badge-secondary">
                    Type: {type}
                  </span>
                ))}
                {filters.difficultyLevel && (
                  <span key="difficulty" className="badge-secondary">
                    Level: {filters.difficultyLevel}
                  </span>
                )}
              </div>
            </div>
          )}

          <div className="card p-6">
            {error && (
              <VintageErrorState
                error={error}
                onRetry={() => search()}
                retryText="Search Again"
                className="mb-6"
              />
            )}

            {isLoading ? (
              <ArtDecoLoader
                text="Searching swing dance events worldwide..."
                size="lg"
                className="py-8"
              />
            ) : results ? (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gold-600">
                    Search Results
                    {filters.query && (
                      <span className="text-white/60 font-normal ml-2">
                        for "{filters.query}"
                      </span>
                    )}
                  </h2>
                  <span className="text-sm text-white/60">
                    Found {results.pagination.total} events
                  </span>
                </div>

                {results.events.length > 0 ? (
                  <>
                    <div className="space-y-6">
                      {results.events.map((event) => (
                        <EnhancedEventCard
                          key={event.id}
                          event={event}
                          showDistance={!!event.distance}
                          highlightQuery={filters.query}
                          enhanced={true}
                          className="vintage-card"
                        />
                      ))}
                    </div>

                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-gold-600/20">
                      <span className="text-sm text-white/60">
                        Showing {((results.pagination.page - 1) * results.pagination.limit) + 1}-{Math.min(results.pagination.page * results.pagination.limit, results.pagination.total)} of {results.pagination.total} results
                      </span>
                      <div className="flex space-x-2">
                        <button
                          disabled={!results.pagination.hasPrev}
                          onClick={() => goToPage(results.pagination.page - 1)}
                          className="btn-secondary btn-sm"
                        >
                          Previous
                        </button>
                        <button
                          disabled={!results.pagination.hasNext}
                          onClick={() => goToPage(results.pagination.page + 1)}
                          className="btn-secondary btn-sm"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <div className="vintage-radar-icon w-16 h-16 mx-auto mb-6 relative">
                      <div className="w-16 h-16 bg-gradient-to-b from-green-600 to-green-700 rounded-full mx-auto relative border-4 border-green-500">
                        <div className="absolute inset-2 bg-gradient-to-b from-green-400 to-green-500 rounded-full opacity-50"></div>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-8 bg-green-300 rounded-full animate-radar-sweep"></div>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-45 w-1 h-6 bg-green-300 rounded-full opacity-60"></div>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-90 w-1 h-6 bg-green-300 rounded-full opacity-40"></div>
                        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-xs text-green-300 font-bold">📡</div>
                      </div>
                    </div>
                    <h3 className="font-jazz text-xl text-green-400 mb-3">
                      No Targets Detected
                    </h3>
                    <p className="text-cream-200 mb-4">
                      Our radar couldn't detect events matching your criteria. Try exploring different dance styles or locations.
                    </p>
                    <div className="flex flex-wrap justify-center gap-2 mt-4">
                      <button
                        onClick={() => handleSearch('Blues')}
                        className="filter-style-indicator style-blues text-xs"
                      >
                        🎺 Try Blues
                      </button>
                      <button
                        onClick={() => handleSearch('Swing')}
                        className="filter-style-indicator style-swing text-xs"
                      >
                        🎷 Try Swing
                      </button>
                      <button
                        onClick={() => handleSearch('Europe')}
                        className="filter-style-indicator text-xs"
                      >
                        🌍 Try Europe
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : hasActiveFilters ? (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gold-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <h3 className="text-lg font-medium text-gold-600 mb-2">
                  Ready to Search
                </h3>
                <p className="text-white/80 mb-4">
                  Click "Apply Filters" to search with your current settings.
                </p>
                <button onClick={search} className="btn-primary">
                  Search Now
                </button>
              </div>
            ) : (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gold-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <h3 className="text-lg font-medium text-gold-600 mb-2">
                  Start Your Search
                </h3>
                <p className="text-white/80 mb-4">
                  Search for events, instructors, musicians, or locations across all swing dance styles.
                </p>

                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gold-400 mb-2 font-medium">🎭 By Dance Style:</p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {[
                        { name: 'Blues', icon: '🎺', class: 'style-blues' },
                        { name: 'Swing', icon: '🎷', class: 'style-swing' },
                        { name: 'Balboa', icon: '💃', class: 'style-balboa' },
                        { name: 'Shag', icon: '🕺', class: 'style-shag' },
                        { name: 'Boogie Woogie', icon: '🎹', class: 'style-boogie' }
                      ].map((style) => (
                        <button
                          key={style.name}
                          onClick={() => handleSearch(style.name)}
                          className={`filter-style-indicator ${style.class} text-xs`}
                        >
                          {style.icon} {style.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-gold-400 mb-2 font-medium">🔥 Popular Searches:</p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {['This Weekend', 'Europe', 'Beginner Friendly', 'Workshops'].map((suggestion) => (
                        <button
                          key={suggestion}
                          onClick={() => handleSearch(suggestion)}
                          className="btn-secondary btn-sm"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}