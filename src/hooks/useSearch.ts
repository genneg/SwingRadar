'use client'

import { useState, useCallback } from 'react'

import { useDebounce } from './useDebounce'

// TODO: Replace with actual types from @festival-scout/types
interface SearchFilters {
  query?: string
  dateRange?: {
    start: string
    end: string
  }
  location?: {
    city?: string
    country?: string
    radius?: number
  }
  teachers?: string[]
  musicians?: string[]
  priceRange?: {
    min: number
    max: number
  }
}

interface SearchState {
  results: any[]
  loading: boolean
  error: string | null
  hasMore: boolean
  total: number
}

/**
 * Custom hook for search functionality
 */
export function useSearch() {
  const [filters, setFilters] = useState<SearchFilters>({})
  const [searchState, setSearchState] = useState<SearchState>({
    results: [],
    loading: false,
    error: null,
    hasMore: false,
    total: 0
  })

  // Debounce search query to avoid excessive API calls
  const debouncedQuery = useDebounce(filters.query || '', 300)

  const search = useCallback(async (newFilters?: Partial<SearchFilters>, page = 1) => {
    const searchFilters = newFilters ? { ...filters, ...newFilters } : filters
    
    setSearchState(prev => ({ 
      ...prev, 
      loading: true, 
      error: null,
      results: page === 1 ? [] : prev.results
    }))

    try {
      // TODO: Replace with actual API call
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12',
        ...(searchFilters.query && { q: searchFilters.query }),
        ...(searchFilters.location?.city && { city: searchFilters.location.city }),
        ...(searchFilters.location?.country && { country: searchFilters.location.country }),
        ...(searchFilters.dateRange?.start && { startDate: searchFilters.dateRange.start }),
        ...(searchFilters.dateRange?.end && { endDate: searchFilters.dateRange.end }),
        ...(searchFilters.teachers?.length && { teachers: searchFilters.teachers.join(',') }),
        ...(searchFilters.musicians?.length && { musicians: searchFilters.musicians.join(',') }),
        ...(searchFilters.priceRange?.min && { minPrice: searchFilters.priceRange.min.toString() }),
        ...(searchFilters.priceRange?.max && { maxPrice: searchFilters.priceRange.max.toString() })
      })

      const response = await fetch(`/api/events/search?${params}`)
      
      if (!response.ok) {
        throw new Error('Search failed')
      }

      const data = await response.json()
      
      setSearchState(prev => ({
        results: page === 1 ? data.events : [...prev.results, ...data.events],
        loading: false,
        error: null,
        hasMore: data.hasMore,
        total: data.total
      }))

      if (newFilters) {
        setFilters(searchFilters)
      }

    } catch (error) {
      setSearchState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Search failed'
      }))
    }
  }, [filters])

  const loadMore = useCallback(() => {
    const currentPage = Math.ceil(searchState.results.length / 12) + 1
    search(undefined, currentPage)
  }, [search, searchState.results.length])

  const clearSearch = useCallback(() => {
    setFilters({})
    setSearchState({
      results: [],
      loading: false,
      error: null,
      hasMore: false,
      total: 0
    })
  }, [])

  const updateFilters = useCallback((newFilters: Partial<SearchFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }, [])

  return {
    filters,
    searchState,
    debouncedQuery,
    search,
    loadMore,
    clearSearch,
    updateFilters
  }
}