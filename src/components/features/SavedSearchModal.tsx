'use client'

import { useState } from 'react'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { SearchFilters, SearchOptions } from '@/hooks/useAdvancedSearch'
import { useSavedSearches, CreateSavedSearchData } from '@/hooks/useSavedSearches'

interface SavedSearchModalProps {
  isOpen: boolean
  onClose: () => void
  currentFilters: SearchFilters
  currentOptions: SearchOptions
  onSearchApplied?: () => void
}

export function SavedSearchModal({
  isOpen,
  onClose,
  currentFilters,
  currentOptions,
  onSearchApplied
}: SavedSearchModalProps) {
  const [activeTab, setActiveTab] = useState<'save' | 'load'>('save')
  const [searchName, setSearchName] = useState('')
  const [alertsEnabled, setAlertsEnabled] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const {
    savedSearches,
    isLoading,
    error,
    loadSavedSearches,
    createSavedSearch,
    deleteSavedSearch,
    applySavedSearch,
  } = useSavedSearches()

  // Load saved searches when modal opens
  const handleModalOpen = () => {
    if (isOpen && savedSearches.length === 0) {
      loadSavedSearches()
    }
  }

  // Save current search
  const handleSaveSearch = async () => {
    if (!searchName.trim()) return

    setIsSaving(true)
    try {
      const searchData: CreateSavedSearchData = {
        name: searchName.trim(),
        query: currentFilters.query,
        filters: currentFilters,
        sortBy: currentOptions.sortBy,
        sortOrder: currentOptions.sortOrder,
        alertsEnabled,
      }

      await createSavedSearch(searchData)
      setSearchName('')
      setAlertsEnabled(false)
      setActiveTab('load')
    } catch (err) {
      console.error('Failed to save search:', err)
    } finally {
      setIsSaving(false)
    }
  }

  // Apply a saved search
  const handleApplySearch = (searchId: string) => {
    const search = savedSearches.find(s => s.id === searchId)
    if (!search) return

    const config = applySavedSearch(search)
    
    // This would typically update the parent component's search state
    // For now, we'll just close the modal and call the callback
    onClose()
    if (onSearchApplied) {
      onSearchApplied()
    }
  }

  // Delete a saved search
  const handleDeleteSearch = async (searchId: string) => {
    if (!confirm('Are you sure you want to delete this saved search?')) return

    try {
      await deleteSavedSearch(searchId)
    } catch (err) {
      console.error('Failed to delete search:', err)
    }
  }

  // Format search description
  const formatSearchDescription = (search: typeof savedSearches[0]) => {
    const parts = []
    
    if (search.query) {
      parts.push(`"${search.query}"`)
    }
    
    if (search.filters?.location?.city) {
      parts.push(`in ${search.filters.location.city}`)
    }
    
    if (search.filters?.teachers?.length) {
      parts.push(`with ${search.filters.teachers.length} teacher(s)`)
    }
    
    if (search.filters?.musicians?.length) {
      parts.push(`with ${search.filters.musicians.length} musician(s)`)
    }
    
    if (search.filters?.eventTypes?.length) {
      parts.push(`${search.filters.eventTypes.join(', ')}`)
    }

    return parts.length > 0 ? parts.join(' • ') : 'All events'
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Saved Searches"
      maxWidth="lg"
      onOpen={handleModalOpen}
    >
      <div className="space-y-6">
        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('save')}
            className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'save'
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Save Current Search
          </button>
          <button
            onClick={() => setActiveTab('load')}
            className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'load'
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            My Saved Searches ({savedSearches.length})
          </button>
        </div>

        {/* Save Tab */}
        {activeTab === 'save' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Save Current Search
              </h3>
              
              {/* Current search preview */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Current Search:</h4>
                <div className="text-sm text-gray-600">
                  {currentFilters.query && (
                    <div>Query: "{currentFilters.query}"</div>
                  )}
                  {currentFilters.location?.city && (
                    <div>Location: {currentFilters.location.city}</div>
                  )}
                  {currentOptions.sortBy && (
                    <div>Sort: {currentOptions.sortBy} ({currentOptions.sortOrder})</div>
                  )}
                  {!currentFilters.query && !currentFilters.location?.city && (
                    <div>All events</div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <Input
                  label="Search Name"
                  placeholder="e.g., 'Beginner festivals in Europe'"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  required
                />
                
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={alertsEnabled}
                    onChange={(e) => setAlertsEnabled(e.target.checked)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700">
                    Send me email alerts for new events matching this search
                  </span>
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleSaveSearch}
                disabled={!searchName.trim() || isSaving}
              >
                {isSaving ? 'Saving...' : 'Save Search'}
              </Button>
            </div>
          </div>
        )}

        {/* Load Tab */}
        {activeTab === 'load' && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">
              My Saved Searches
            </h3>

            {isLoading && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                <p className="text-sm text-gray-500 mt-2">Loading saved searches...</p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {!isLoading && !error && savedSearches.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <p className="mt-2">No saved searches yet</p>
                <p className="text-sm">Save your first search to get started</p>
              </div>
            )}

            {!isLoading && savedSearches.length > 0 && (
              <div className="space-y-3">
                {savedSearches.map((search) => (
                  <div
                    key={search.id}
                    className="bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{search.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {formatSearchDescription(search)}
                        </p>
                        <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                          <span>
                            Created {new Date(search.createdAt).toLocaleDateString()}
                          </span>
                          {search.alertsEnabled && (
                            <span className="inline-flex items-center space-x-1">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                              </svg>
                              <span>Alerts enabled</span>
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleApplySearch(search.id)}
                        >
                          Apply
                        </Button>
                        <button
                          onClick={() => handleDeleteSearch(search.id)}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                          title="Delete search"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  )
}