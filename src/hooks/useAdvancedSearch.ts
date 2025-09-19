'use client'

import { useState } from 'react'

export interface SearchFilters {
  query?: string
  location?: {
    city?: string
    country?: string
    latitude?: number
    longitude?: number
    radius?: number
  }
  dateRange?: {
    start?: string
    end?: string
  }
  teachers?: string[]
  musicians?: string[]
  priceRange?: {
    min?: number
    max?: number
  }
  eventTypes?: string[]
  skillLevels?: string[]
  featured?: boolean
}

export interface SearchOptions {
  sortBy?: 'relevance' | 'date' | 'distance' | 'popularity' | 'price'
  sortOrder?: 'asc' | 'desc'
  page?: number
  limit?: number
}

export interface SearchResult {
  events: any[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
  searchMeta: {
    query?: string
    location?: SearchFilters['location']
    sorting: {
      sortBy: string
      sortOrder: string
    }
    filters: any
    totalMatches: number
  }
}

export interface SearchSuggestions {
  events: string[]
  teachers: string[]
  musicians: string[]
  locations: string[]
}

export function useAdvancedSearch() {
  const [filters, setFilters] = useState<SearchFilters>({})
  const [options, setOptions] = useState<SearchOptions>({
    sortBy: 'relevance',
    sortOrder: 'desc',
    page: 1,
    limit: 20
  })
  
  const [results, setResults] = useState<SearchResult | null>(null)
  const [suggestions, setSuggestions] = useState<SearchSuggestions>({
    events: [],
    teachers: [],
    musicians: [],
    locations: []
  })
  
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Debounce search query for suggestions - DISABLED
  // const debouncedQuery = useDebounce(filters.query || '', 300)
  
  // Build search URL parameters
  const buildSearchParams = (
    searchFilters: SearchFilters, 
    searchOptions: SearchOptions
  ): URLSearchParams => {
    const params = new URLSearchParams()
    
    // Add pagination
    if (searchOptions.page) {
params.set('page', searchOptions.page.toString())
}
    if (searchOptions.limit) {
params.set('limit', searchOptions.limit.toString())
}
    
    // Add sorting
    if (searchOptions.sortBy) {
params.set('sortBy', searchOptions.sortBy)
}
    if (searchOptions.sortOrder) {
params.set('sortOrder', searchOptions.sortOrder)
}
    
    // Add text query
    if (searchFilters.query) {
params.set('query', searchFilters.query)
}
    
    // Add location filters
    if (searchFilters.location?.city) {
params.set('city', searchFilters.location.city)
}
    if (searchFilters.location?.country) {
params.set('country', searchFilters.location.country)
}
    if (searchFilters.location?.latitude) {
params.set('latitude', searchFilters.location.latitude.toString())
}
    if (searchFilters.location?.longitude) {
params.set('longitude', searchFilters.location.longitude.toString())
}
    if (searchFilters.location?.radius) {
params.set('radius', searchFilters.location.radius.toString())
}
    
    // Add date range
    if (searchFilters.dateRange?.start) {
params.set('startDate', searchFilters.dateRange.start)
}
    if (searchFilters.dateRange?.end) {
params.set('endDate', searchFilters.dateRange.end)
}
    
    // Add filters
    if (searchFilters.teachers?.length) {
params.set('teachers', searchFilters.teachers.join(','))
}
    if (searchFilters.musicians?.length) {
params.set('musicians', searchFilters.musicians.join(','))
}
    if (searchFilters.eventTypes?.length) {
params.set('eventTypes', searchFilters.eventTypes.join(','))
}
    if (searchFilters.skillLevels?.length) {
params.set('skillLevels', searchFilters.skillLevels.join(','))
}
    
    // Add price range
    if (searchFilters.priceRange?.min !== undefined) {
params.set('priceMin', searchFilters.priceRange.min.toString())
}
    if (searchFilters.priceRange?.max !== undefined) {
params.set('priceMax', searchFilters.priceRange.max.toString())
}
    
    // Add featured filter
    if (searchFilters.featured !== undefined) {
params.set('featured', searchFilters.featured.toString())
}
    
    return params
  }
  
  // Perform search
  const search = async (
    searchFilters: SearchFilters = filters,
    searchOptions: SearchOptions = options
  ) => {
    setIsLoading(true)
    setError(null)
    
    try {
      console.log('Search called with filters:', searchFilters)
      console.log('Current state filters:', filters)
      const params = buildSearchParams(searchFilters, searchOptions)
      console.log('Built params:', params.toString())
      const response = await fetch(`/api/search/events?${params.toString()}`)
      
      if (!response.ok) {
        throw new Error(`Search failed: ${response.statusText}`)
      }
      
      const data = await response.json()
      
      if (!data.success) {
        throw new Error(data.error || 'Search failed')
      }
      
      setResults(data.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed')
      setResults(null)
    } finally {
      setIsLoading(false)
    }
  }
  
  // Get search suggestions
  const getSuggestions = async (query: string) => {
    if (!query || query.length < 2) {
      setSuggestions({ events: [], teachers: [], musicians: [], locations: [] })
      return
    }
    
    setIsLoadingSuggestions(true)
    
    try {
      const params = new URLSearchParams({
        query,
        limit: '8'
      })
      
      const response = await fetch(`/api/search/suggestions?${params.toString()}`)
      
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setSuggestions(data.data)
        }
      }
    } catch (err) {
      console.error('Failed to get suggestions:', err)
    } finally {
      setIsLoadingSuggestions(false)
    }
  }
  
  // Auto-load suggestions DISABLED - suggestions only on manual request
  // useEffect(() => {
  //   getSuggestions(debouncedQuery)
  // }, [debouncedQuery, getSuggestions])
  
  // Update filters
  const updateFilters = (newFilters: Partial<SearchFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
    setOptions(prev => ({ ...prev, page: 1 })) // Reset to first page
  }
  
  // Update options
  const updateOptions = (newOptions: Partial<SearchOptions>) => {
    setOptions(prev => ({ ...prev, ...newOptions }))
  }
  
  // Clear all filters
  const clearFilters = () => {
    setFilters({})
    setOptions({
      sortBy: 'relevance',
      sortOrder: 'desc',
      page: 1,
      limit: 20
    })
    setResults(null)
    setError(null)
  }
  
  // Navigate to page
  const goToPage = (page: number) => {
    setOptions(prev => ({ ...prev, page }))
    search(filters, { ...options, page })
  }
  
  // Check if any filters are active
  const hasActiveFilters = () => {
    return !!(
      filters.query ||
      filters.location?.city ||
      filters.location?.country ||
      filters.location?.latitude ||
      filters.dateRange?.start ||
      filters.dateRange?.end ||
      filters.teachers?.length ||
      filters.musicians?.length ||
      filters.eventTypes?.length ||
      filters.skillLevels?.length ||
      filters.priceRange?.min !== undefined ||
      filters.priceRange?.max !== undefined ||
      filters.featured !== undefined
    )
  }
  
  // Auto-search DISABLED - search only on explicit user action
  // useEffect(() => {
  //   if (hasActiveFilters()) {
  //     const timeoutId = setTimeout(() => {
  //       search()
  //     }, 500) // Debounce search
  //     
  //     return () => clearTimeout(timeoutId)
  //   }
  // }, [filters, options, search, hasActiveFilters])
  
  return {
    // State
    filters,
    options,
    results,
    suggestions,
    isLoading,
    isLoadingSuggestions,
    error,
    
    // Actions
    search,
    getSuggestions,
    updateFilters,
    updateOptions,
    clearFilters,
    goToPage,
    
    // Helpers
    hasActiveFilters: hasActiveFilters(),
    buildSearchParams
  }
}