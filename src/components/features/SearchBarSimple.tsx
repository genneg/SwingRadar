'use client'

import { useState } from 'react'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { cn } from '@/lib/utils'

interface SearchBarSimpleProps {
  onSearch?: (query: string) => void
  placeholder?: string
  className?: string
  autoFocus?: boolean
  showFilters?: boolean
  onToggleFilters?: () => void
  filtersActive?: boolean
}

export function SearchBarSimple({ 
  onSearch, 
  placeholder = "Search festivals, teachers, or locations...", 
  className,
  autoFocus = false,
  showFilters = true,
  onToggleFilters,
  filtersActive = false
}: SearchBarSimpleProps) {
  const [query, setQuery] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSearch) {
      onSearch(query.trim())
    }
  }

  const handleClear = () => {
    setQuery('')
    if (onSearch) {
      onSearch('')
    }
  }

  return (
    <div className={cn('w-full', className)}>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
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
        </div>

        <Button type="submit" variant="primary">
          Search
        </Button>

        {showFilters && (
          <Button
            type="button"
            variant={filtersActive ? "primary" : "outline"}
            onClick={onToggleFilters}
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