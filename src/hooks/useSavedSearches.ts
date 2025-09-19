'use client'

import { useState, useCallback } from 'react'
import { useSession } from 'next-auth/react'

import { SearchFilters, SearchOptions } from './useAdvancedSearch'

export interface SavedSearch {
  id: string
  name: string
  query?: string
  filters?: SearchFilters
  sortBy?: SearchOptions['sortBy']
  sortOrder?: SearchOptions['sortOrder']
  alertsEnabled: boolean
  createdAt: string
  updatedAt: string
  alertCount?: number
}

export interface CreateSavedSearchData {
  name: string
  query?: string
  filters?: SearchFilters
  sortBy?: SearchOptions['sortBy']
  sortOrder?: SearchOptions['sortOrder']
  alertsEnabled?: boolean
}

export function useSavedSearches() {
  const { data: session } = useSession()
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load saved searches
  const loadSavedSearches = useCallback(async () => {
    if (!session?.user?.id) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/users/${session.user.id}/saved-searches`)
      
      if (!response.ok) {
        throw new Error(`Failed to load saved searches: ${response.statusText}`)
      }

      const data = await response.json()
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to load saved searches')
      }

      setSavedSearches(data.data.savedSearches)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load saved searches')
    } finally {
      setIsLoading(false)
    }
  }, [session?.user?.id])

  // Create a new saved search
  const createSavedSearch = useCallback(async (searchData: CreateSavedSearchData) => {
    if (!session?.user?.id) {
      throw new Error('Authentication required')
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/users/${session.user.id}/saved-searches`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Failed to create saved search: ${response.statusText}`)
      }

      const data = await response.json()
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to create saved search')
      }

      const newSearch = data.data
      setSavedSearches(prev => [newSearch, ...prev])
      
      return newSearch
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create saved search')
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [session?.user?.id])

  // Update a saved search
  const updateSavedSearch = useCallback(async (
    searchId: string, 
    updateData: Partial<CreateSavedSearchData>
  ) => {
    if (!session?.user?.id) {
      throw new Error('Authentication required')
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/users/${session.user.id}/saved-searches`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ searchId, ...updateData }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Failed to update saved search: ${response.statusText}`)
      }

      const data = await response.json()
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to update saved search')
      }

      const updatedSearch = data.data
      setSavedSearches(prev => 
        prev.map(search => search.id === searchId ? updatedSearch : search)
      )
      
      return updatedSearch
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update saved search')
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [session?.user?.id])

  // Delete a saved search
  const deleteSavedSearch = useCallback(async (searchId: string) => {
    if (!session?.user?.id) {
      throw new Error('Authentication required')
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(
        `/api/users/${session.user.id}/saved-searches?searchId=${searchId}`,
        {
          method: 'DELETE',
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Failed to delete saved search: ${response.statusText}`)
      }

      const data = await response.json()
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to delete saved search')
      }

      setSavedSearches(prev => prev.filter(search => search.id !== searchId))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete saved search')
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [session?.user?.id])

  // Apply a saved search (returns the search configuration)
  const applySavedSearch = useCallback((savedSearch: SavedSearch) => {
    return {
      filters: savedSearch.filters || {},
      options: {
        sortBy: savedSearch.sortBy || 'relevance',
        sortOrder: savedSearch.sortOrder || 'desc',
        page: 1,
        limit: 20,
      },
      query: savedSearch.query,
    }
  }, [])

  // Check if current search matches any saved search
  const findMatchingSavedSearch = useCallback((
    filters: SearchFilters,
    options: SearchOptions
  ) => {
    return savedSearches.find(search => {
      // Compare query
      if (search.query !== (filters.query || '')) return false
      
      // Compare key filters (simplified comparison)
      const searchFilters = search.filters || {}
      
      if (searchFilters.location?.city !== filters.location?.city) return false
      if (searchFilters.location?.country !== filters.location?.country) return false
      if (search.sortBy !== options.sortBy) return false
      if (search.sortOrder !== options.sortOrder) return false
      
      return true
    })
  }, [savedSearches])

  return {
    savedSearches,
    isLoading,
    error,
    loadSavedSearches,
    createSavedSearch,
    updateSavedSearch,
    deleteSavedSearch,
    applySavedSearch,
    findMatchingSavedSearch,
  }
}