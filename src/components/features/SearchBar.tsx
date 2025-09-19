'use client'

import { useState, useEffect, useRef } from 'react'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { cn } from '@/lib/utils'
import { useAdvancedSearch } from '@/hooks/useAdvancedSearch'
import { SuggestionItem, SuggestionGroup } from './SearchSuggestions'

interface SearchBarProps {
  onSearch?: (query: string) => void
  placeholder?: string
  className?: string
  autoFocus?: boolean
  showFilters?: boolean
  onToggleFilters?: () => void
  filtersActive?: boolean
  enableSuggestions?: boolean
  enableHighlighting?: boolean
  onSuggestionSelect?: (suggestion: string, type: 'event' | 'teacher' | 'musician' | 'location') => void
}

export function SearchBar({ 
  onSearch, 
  placeholder = "Search festivals, teachers, or locations...", 
  className,
  autoFocus = false,
  showFilters = true,
  onToggleFilters,
  filtersActive = false,
  enableSuggestions = true,
  enableHighlighting = true,
  onSuggestionSelect
}: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  
  const inputRef = useRef<HTMLInputElement>(null)
  
  const { 
    suggestions, 
    updateFilters
  } = useAdvancedSearch()
  
  // Since suggestions are disabled, isLoadingSuggestions is always false
  const isLoadingSuggestions = false

  // Fetch suggestions DISABLED - causes performance issues
  // useEffect(() => {
  //   if (debouncedQuery.length >= 2) {
  //     suggestionsApi.get(`/search/suggestions?query=${encodeURIComponent(debouncedQuery)}`)
  //   }
  // }, [debouncedQuery, suggestionsApi])

  // Load recent searches from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('festivalscout_recent_searches')
    if (stored) {
      try {
        setRecentSearches(JSON.parse(stored))
      } catch (e) {
        console.error('Failed to parse recent searches:', e)
      }
    }
  }, [])

  // Track search analytics
  const trackSearchAnalytics = (query: string) => {
    // Send analytics event
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'search', {
        search_term: query,
        event_category: 'engagement'
      })
    }
    
    // Optional: Send to custom analytics endpoint
    fetch('/api/analytics/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, timestamp: new Date().toISOString() })
    }).catch(() => {}) // Silently fail for analytics
  }

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return

    const totalSuggestions = getTotalSuggestions()
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedSuggestionIndex(prev => 
          prev < totalSuggestions - 1 ? prev + 1 : prev
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedSuggestionIndex(prev => prev > 0 ? prev - 1 : prev)
        break
      case 'Enter':
        e.preventDefault()
        if (selectedSuggestionIndex >= 0) {
          const suggestion = getSuggestionByIndex(selectedSuggestionIndex)
          if (suggestion) {
            handleSuggestionClick(suggestion.text, suggestion.type)
          }
        } else {
          handleSubmit(e)
        }
        break
      case 'Escape':
        setShowSuggestions(false)
        setSelectedSuggestionIndex(-1)
        inputRef.current?.blur()
        break
    }
  }

  // Get total number of suggestions
  const getTotalSuggestions = () => {
    if (!query) return recentSearches.length
    return suggestions.events.length + suggestions.teachers.length + 
           suggestions.musicians.length + suggestions.locations.length
  }

  // Get suggestion by index
  const getSuggestionByIndex = (index: number) => {
    if (!query) {
      if (index < recentSearches.length) {
        return { text: recentSearches[index], type: 'recent' as const }
      }
      return null
    }
    
    let currentIndex = 0
    const types = ['events', 'teachers', 'musicians', 'locations'] as const
    
    for (const type of types) {
      const items = suggestions[type]
      if (index < currentIndex + items.length) {
        return { 
          text: items[index - currentIndex], 
          type: type.slice(0, -1) as 'event' | 'teacher' | 'musician' | 'location'
        }
      }
      currentIndex += items.length
    }
    
    return null
  }

  // Get starting index for suggestion group
  const getStartIndex = (type: string) => {
    if (!query) return 0
    
    let index = 0
    const order = ['events', 'teachers', 'musicians', 'locations']
    
    for (const t of order) {
      if (t === type) break
      index += suggestions[t as keyof typeof suggestions].length
    }
    
    return index
  }

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: string, type: string) => {
    setQuery(suggestion)
    setShowSuggestions(false)
    setSelectedSuggestionIndex(-1)
    
    // Track analytics
    trackSearchAnalytics(suggestion)
    
    // Save to recent searches if not already there
    if (type !== 'recent') {
      const updatedRecent = [suggestion, ...recentSearches.filter(s => s !== suggestion)].slice(0, 5)
      setRecentSearches(updatedRecent)
      localStorage.setItem('festivalscout_recent_searches', JSON.stringify(updatedRecent))
    }
    
    // Callback for parent component
    if (onSuggestionSelect) {
      onSuggestionSelect(suggestion, type as any)
    }
    
    // Perform search
    if (onSearch) {
      onSearch(suggestion)
    }
    updateFilters({ query: suggestion })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedQuery = query.trim()
    if (trimmedQuery) {
      // Save to recent searches
      const updatedRecent = [trimmedQuery, ...recentSearches.filter(s => s !== trimmedQuery)].slice(0, 5)
      setRecentSearches(updatedRecent)
      localStorage.setItem('festivalscout_recent_searches', JSON.stringify(updatedRecent))
      
      // Track search analytics
      trackSearchAnalytics(trimmedQuery)
      
      // Perform search
      if (onSearch) {
        onSearch(trimmedQuery)
      }
      updateFilters({ query: trimmedQuery })
      setShowSuggestions(false)
    }
  }

  const handleClear = () => {
    setQuery('')
    setSelectedSuggestionIndex(-1)
    // Don't trigger search automatically - user must click search button
    // if (onSearch) {
    //   onSearch('')
    // }
    // updateFilters({ query: undefined })
  }

  return (
    <div className={cn('w-full', className)}>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setSelectedSuggestionIndex(-1)
              if (enableSuggestions) {
                setShowSuggestions(true)
              }
            }}
            onFocus={() => {
              if (enableSuggestions) {
                setShowSuggestions(true)
              }
            }}
            onBlur={() => {
              setTimeout(() => setShowSuggestions(false), 200)
            }}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            autoFocus={autoFocus}
            className="pl-10 pr-10"
          />
          
          {/* Search Icon */}
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Clear Button */}
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}

          {/* Search Suggestions */}
          {enableSuggestions && showSuggestions && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-96 overflow-y-auto">
              {isLoadingSuggestions && (
                <div className="px-3 py-2 text-sm text-gray-500 flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-primary-600"></div>
                  <span>Searching...</span>
                </div>
              )}
              
              {/* Recent Searches */}
              {!query && recentSearches.length > 0 && (
                <div className="border-b border-gray-100">
                  <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide">Recent Searches</div>
                  {recentSearches.map((recent, index) => (
                    <SuggestionItem
                      key={`recent-${index}`}
                      text={recent}
                      type="recent"
                      icon="clock"
                      isSelected={selectedSuggestionIndex === index}
                      onClick={() => handleSuggestionClick(recent, 'recent')}
                      highlightQuery={query}
                      enableHighlighting={enableHighlighting}
                    />
                  ))}
                </div>
              )}
              
              {/* Live Suggestions */}
              {query.length >= 2 && (
                <>
                  {suggestions.events.length > 0 && (
                    <SuggestionGroup
                      title="Events"
                      items={suggestions.events}
                      type="event"
                      icon="calendar"
                      startIndex={getStartIndex('events')}
                      selectedIndex={selectedSuggestionIndex}
                      onItemClick={handleSuggestionClick}
                      highlightQuery={query}
                      enableHighlighting={enableHighlighting}
                    />
                  )}
                  
                  {suggestions.teachers.length > 0 && (
                    <SuggestionGroup
                      title="Teachers"
                      items={suggestions.teachers}
                      type="teacher"
                      icon="user"
                      startIndex={getStartIndex('teachers')}
                      selectedIndex={selectedSuggestionIndex}
                      onItemClick={handleSuggestionClick}
                      highlightQuery={query}
                      enableHighlighting={enableHighlighting}
                    />
                  )}
                  
                  {suggestions.musicians.length > 0 && (
                    <SuggestionGroup
                      title="Musicians"
                      items={suggestions.musicians}
                      type="musician"
                      icon="music"
                      startIndex={getStartIndex('musicians')}
                      selectedIndex={selectedSuggestionIndex}
                      onItemClick={handleSuggestionClick}
                      highlightQuery={query}
                      enableHighlighting={enableHighlighting}
                    />
                  )}
                  
                  {suggestions.locations.length > 0 && (
                    <SuggestionGroup
                      title="Locations"
                      items={suggestions.locations}
                      type="location"
                      icon="location"
                      startIndex={getStartIndex('locations')}
                      selectedIndex={selectedSuggestionIndex}
                      onItemClick={handleSuggestionClick}
                      highlightQuery={query}
                      enableHighlighting={enableHighlighting}
                    />
                  )}
                  
                  {/* No results */}
                  {!isLoadingSuggestions && 
                   suggestions.events.length === 0 && 
                   suggestions.teachers.length === 0 && 
                   suggestions.musicians.length === 0 && 
                   suggestions.locations.length === 0 && (
                    <div className="px-3 py-4 text-sm text-gray-500 text-center">
                      No suggestions found for "{query}"
                    </div>
                  )}
                </>
              )}
              
              {/* Search tip for short queries */}
              {query.length > 0 && query.length < 2 && (
                <div className="px-3 py-2 text-xs text-gray-500">
                  Type at least 2 characters to see suggestions
                </div>
              )}
            </div>
          )}
        </div>

        <Button type="submit" variant="primary">
          Search
        </Button>

        {showFilters && (
          <Button
            type="button"
            variant={filtersActive ? "primary" : "outline"}
            onClick={onToggleFilters || (() => setShowAdvanced(!showAdvanced))}
            className="flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
            </svg>
            <span>Filters</span>
            {filtersActive && (
              <span className="ml-1 px-1.5 py-0.5 text-xs bg-white bg-opacity-20 rounded-full">
                Active
              </span>
            )}
          </Button>
        )}
      </form>

      {/* Advanced Search Panel */}
      {showAdvanced && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Advanced Search</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Date Range */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Date Range
              </label>
              <div className="flex space-x-2">
                <Input
                  type="date"
                  placeholder="From"
                  className="text-sm"
                />
                <Input
                  type="date"
                  placeholder="To"
                  className="text-sm"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Location
              </label>
              <Input
                type="text"
                placeholder="City, Country"
                className="text-sm"
              />
            </div>

            {/* Teachers */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Teachers
              </label>
              <Input
                type="text"
                placeholder="Teacher names"
                className="text-sm"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 mt-4">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowAdvanced(false)}
            >
              Cancel
            </Button>
            <Button variant="primary" size="sm">
              Apply Filters
            </Button>
          </div>
        </div>
      )}

      {/* Quick Filter Tags */}
      <div className="flex flex-wrap gap-2 mt-3">
        <span className="text-xs text-gray-500">Quick filters:</span>
        {['This Weekend', 'Next Month', 'Europe', 'North America', 'Beginner Friendly'].map((filter) => (
          <button
            key={filter}
            className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
            onClick={() => {
              setQuery(filter)
              if (onSearch) {
                onSearch(filter)
              }
            }}
          >
            {filter}
          </button>
        ))}
      </div>
    </div>
  )
}