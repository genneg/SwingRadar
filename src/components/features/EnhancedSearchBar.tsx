import React, { useState, useRef, useEffect } from 'react'
import { useDebounce } from '@/hooks/useDebounce'

interface SearchSuggestion {
  id: string
  text: string
  type: 'event' | 'teacher' | 'musician' | 'location' | 'history'
  icon: string
  count?: number
}

interface EnhancedSearchBarProps {
  onSearch: (query: string) => void
  onToggleFilters?: () => void
  filtersActive?: boolean
  searchSuggestions?: string[]
  className?: string
  placeholder?: string
  value?: string
  autoFocus?: boolean
}

export function EnhancedSearchBar({
  onSearch,
  onToggleFilters,
  filtersActive = false,
  searchSuggestions = [],
  className = '',
  placeholder = 'Search festivals, teachers, musicians, or locations...',
  value = '',
  autoFocus = false
}: EnhancedSearchBarProps) {
  const [searchQuery, setSearchQuery] = useState(value)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1)
  const [searchHistory, setSearchHistory] = useState<string[]>([])

  const searchInputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  // Debounce search queries for performance
  const debouncedSearchQuery = useDebounce(searchQuery, 300)

  // Load search history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('blues-search-history')
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory).slice(0, 5)) // Keep last 5 searches
    }
  }, [])

  // Auto-suggestions based on current query
  const getSmartSuggestions = (query: string): SearchSuggestion[] => {
    if (!query.trim()) {
      // Show recent searches when no query
      return searchHistory.map(search => ({
        id: `history-${search}`,
        text: search,
        type: 'history' as const,
        icon: '🕒'
      }))
    }

    const suggestions: SearchSuggestion[] = []

    // Popular festivals
    const festivals = [
      'Blues Festival Madrid', 'ESpanish Blues', 'Blues Fever Vienna',
      'Boulevard Blues Belgium', 'Feel the Blues Metz', 'Lazy Blues Stuttgart'
    ].filter(f => f.toLowerCase().includes(query.toLowerCase()))

    festivals.forEach(festival => {
      suggestions.push({
        id: `event-${festival}`,
        text: festival,
        type: 'event',
        icon: '🎭',
        count: Math.floor(Math.random() * 500) + 100
      })
    })

    // Popular teachers
    const teachers = [
      'Vicci & Adamo', 'Damon Stone', 'Sarah Vann', 'Mike Faltesek',
      'Nils & Bianca', 'Patrick & Natasha', 'Bobby White'
    ].filter(t => t.toLowerCase().includes(query.toLowerCase()))

    teachers.forEach(teacher => {
      suggestions.push({
        id: `teacher-${teacher}`,
        text: teacher,
        type: 'teacher',
        icon: '👨‍🏫',
        count: Math.floor(Math.random() * 20) + 5
      })
    })

    // Popular musicians
    const musicians = [
      'Meschiya Lake', 'Gordon Webster', 'Jonathan Stout',
      'Mint Julep Jazz Band', 'Glenn Crytzer'
    ].filter(m => m.toLowerCase().includes(query.toLowerCase()))

    musicians.forEach(musician => {
      suggestions.push({
        id: `musician-${musician}`,
        text: musician,
        type: 'musician',
        icon: '🎷',
        count: Math.floor(Math.random() * 15) + 3
      })
    })

    // Popular locations
    const locations = [
      'Madrid, Spain', 'Vienna, Austria', 'Berlin, Germany',
      'London, UK', 'Paris, France', 'Barcelona, Spain'
    ].filter(l => l.toLowerCase().includes(query.toLowerCase()))

    locations.forEach(location => {
      suggestions.push({
        id: `location-${location}`,
        text: location,
        type: 'location',
        icon: '📍',
        count: Math.floor(Math.random() * 50) + 10
      })
    })

    return suggestions.slice(0, 8) // Limit to 8 suggestions
  }

  const suggestions = getSmartSuggestions(searchQuery)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setSearchQuery(newValue)
    setShowSuggestions(true)
    setActiveSuggestionIndex(-1)
  }

  const handleInputFocus = () => {
    setShowSuggestions(true)
  }

  const handleInputBlur = () => {
    // Delay hiding to allow click on suggestions
    setTimeout(() => {
      setShowSuggestions(false)
      setActiveSuggestionIndex(-1)
    }, 150)
  }

  const saveToHistory = (query: string) => {
    if (!query.trim()) return

    const newHistory = [
      query,
      ...searchHistory.filter(item => item !== query)
    ].slice(0, 5)

    setSearchHistory(newHistory)
    localStorage.setItem('blues-search-history', JSON.stringify(newHistory))
  }

  const handleSearch = (query: string = searchQuery) => {
    if (query.trim()) {
      saveToHistory(query.trim())
      onSearch(query.trim())
      setShowSuggestions(false)
    }
  }

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setSearchQuery(suggestion.text)
    handleSearch(suggestion.text)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setActiveSuggestionIndex(prev =>
          prev < suggestions.length - 1 ? prev + 1 : 0
        )
        break

      case 'ArrowUp':
        e.preventDefault()
        setActiveSuggestionIndex(prev =>
          prev > 0 ? prev - 1 : suggestions.length - 1
        )
        break

      case 'Enter':
        e.preventDefault()
        if (activeSuggestionIndex >= 0 && suggestions[activeSuggestionIndex]) {
          handleSuggestionClick(suggestions[activeSuggestionIndex])
        } else {
          handleSearch()
        }
        break

      case 'Escape':
        setShowSuggestions(false)
        setActiveSuggestionIndex(-1)
        break
    }
  }

  const clearSearch = () => {
    setSearchQuery('')
    setShowSuggestions(false)
    searchInputRef.current?.focus()
  }

  const getSuggestionTypeColor = (type: SearchSuggestion['type']) => {
    switch (type) {
      case 'event': return 'border-gold-400/30 bg-gold-50'
      case 'teacher': return 'border-bordeaux-400/30 bg-bordeaux-50'
      case 'musician': return 'border-navy-400/30 bg-navy-50'
      case 'location': return 'border-copper-400/30 bg-copper-50'
      case 'history': return 'border-cream-400/30 bg-cream-100'
      default: return 'border-cream-400/30 bg-cream-50'
    }
  }

  return (
    <div className={`relative ${className}`}>
      {/* Enhanced Search Input */}
      <div className="relative">
        <div className="vintage-search-container flex items-center bg-cream-50 border-2 border-gold-400/30 rounded-xl hover:border-gold-400/50 focus-within:border-gold-500 focus-within:bg-cream-100 transition-all duration-200">
          {/* Search Icon */}
          <div className="pl-4 text-navy-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Input Field */}
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            autoFocus={autoFocus}
            className="flex-1 px-4 py-3 bg-transparent text-navy-900 placeholder-navy-500 focus:outline-none vintage-text font-medium"
          />

          {/* Clear Button */}
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="p-2 text-navy-400 hover:text-navy-600 transition-colors"
              type="button"
              aria-label="Clear search"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Search Button */}
        <button
          onClick={() => handleSearch()}
          className="absolute right-2 top-2 bottom-2 px-6 bg-gold-600 hover:bg-gold-500 text-navy-900 rounded-lg font-bold transition-colors vintage-button"
          type="button"
        >
          Search
        </button>
      </div>

      {/* Filter Toggle Button */}
      {onToggleFilters && (
        <button
          onClick={onToggleFilters}
          className={`mt-3 flex items-center space-x-2 px-4 py-2 rounded-lg border-2 transition-all vintage-button ${
            filtersActive
              ? 'border-bordeaux-400 bg-bordeaux-50 text-bordeaux-700'
              : 'border-cream-400 bg-cream-50 text-navy-700 hover:bg-cream-100'
          }`}
          type="button"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
          </svg>
          <span className="font-medium">Filters</span>
          {filtersActive && <span className="text-xs bg-bordeaux-600 text-cream-200 px-2 py-1 rounded-full">Active</span>}
        </button>
      )}

      {/* Smart Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-2 bg-cream-50 border-2 border-gold-400/30 rounded-xl shadow-xl overflow-hidden"
        >
          <div className="p-3 bg-gold-100 border-b border-gold-400/30">
            <h3 className="vintage-text text-sm font-bold text-navy-900">
              {searchQuery ? 'Suggestions' : 'Recent Searches'}
            </h3>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {suggestions.map((suggestion, index) => (
              <button
                key={suggestion.id}
                onClick={() => handleSuggestionClick(suggestion)}
                className={`w-full text-left px-4 py-3 flex items-center space-x-3 hover:bg-cream-200 transition-colors border-l-4 ${
                  index === activeSuggestionIndex ? 'bg-cream-200' : ''
                } ${getSuggestionTypeColor(suggestion.type)}`}
                type="button"
              >
                {/* Icon */}
                <span className="text-lg">{suggestion.icon}</span>

                {/* Content */}
                <div className="flex-1">
                  <div className="vintage-text font-medium text-navy-900">
                    {suggestion.text}
                  </div>
                  <div className="text-xs text-navy-600 capitalize">
                    {suggestion.type === 'history' ? 'Recent search' : suggestion.type}
                    {suggestion.count && ` • ${suggestion.count} results`}
                  </div>
                </div>

                {/* Quick Action */}
                <div className="text-navy-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            ))}
          </div>

          {/* Footer with tips */}
          <div className="p-3 bg-cream-100 border-t border-cream-300 text-xs text-navy-600">
            <div className="flex items-center justify-between">
              <span>💡 Use ↑↓ to navigate, Enter to select</span>
              <span>ESC to close</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}