'use client'

import { useState } from 'react'
import { DanceStyle, EventType, DifficultyLevel, getDanceStyleConfig, getAllDanceStyles } from '@/lib/types/dance'

interface MultiStyleFiltersProps {
  onFiltersChange: (filters: MultiStyleFilters) => void
  initialFilters?: Partial<MultiStyleFilters>
  className?: string
}

export interface MultiStyleFilters {
  danceStyles: DanceStyle[]
  eventTypes: EventType[]
  difficultyLevel?: DifficultyLevel
  dateRange?: {
    start: string
    end: string
  }
  location?: {
    city: string
    country: string
    radius: number
  }
  teachers?: string[]
  musicians?: string[]
  priceRange?: {
    min: number
    max: number
  }
  hasLodging?: boolean
  hasCompetitions?: boolean
}

export function MultiStyleFilters({ onFiltersChange, initialFilters = {}, className = '' }: MultiStyleFiltersProps) {
  const [filters, setFilters] = useState<MultiStyleFilters>({
    danceStyles: initialFilters.danceStyles || [],
    eventTypes: initialFilters.eventTypes || [],
    difficultyLevel: initialFilters.difficultyLevel,
    dateRange: initialFilters.dateRange,
    location: initialFilters.location,
    teachers: initialFilters.teachers || [],
    musicians: initialFilters.musicians || [],
    priceRange: initialFilters.priceRange,
    hasLodging: initialFilters.hasLodging || false,
    hasCompetitions: initialFilters.hasCompetitions || false
  })

  const [showAdvanced, setShowAdvanced] = useState(false)

  const updateFilters = (newFilters: Partial<MultiStyleFilters>) => {
    const updatedFilters = { ...filters, ...newFilters }
    setFilters(updatedFilters)
    onFiltersChange(updatedFilters)
  }

  const toggleDanceStyle = (style: DanceStyle) => {
    const newStyles = filters.danceStyles.includes(style)
      ? filters.danceStyles.filter(s => s !== style)
      : [...filters.danceStyles, style]
    updateFilters({ danceStyles: newStyles })
  }

  const toggleEventType = (type: EventType) => {
    const newTypes = filters.eventTypes.includes(type)
      ? filters.eventTypes.filter(t => t !== type)
      : [...filters.eventTypes, type]
    updateFilters({ eventTypes: newTypes })
  }

  const clearAllFilters = () => {
    const clearedFilters: MultiStyleFilters = {
      danceStyles: [],
      eventTypes: [],
      difficultyLevel: undefined,
      dateRange: undefined,
      location: undefined,
      teachers: [],
      musicians: [],
      priceRange: undefined,
      hasLodging: false,
      hasCompetitions: false
    }
    setFilters(clearedFilters)
    onFiltersChange(clearedFilters)
  }

  return (
    <div className={`card p-6 space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-jazz text-xl text-gradient-gold font-bold">Filter Events</h3>
        <button
          onClick={clearAllFilters}
          className="btn-ghost btn-sm text-cream-200 hover:text-gold-400"
        >
          Clear All
        </button>
      </div>

      {/* Dance Styles Filter */}
      <div>
        <label className="block text-sm font-medium text-gold-400 mb-3">
          🎭 Dance Styles
        </label>
        <div className="grid grid-cols-2 gap-2">
          {getAllDanceStyles().map((style) => {
            const config = getDanceStyleConfig(style)
            const isSelected = filters.danceStyles.includes(style)

            return (
              <button
                key={style}
                onClick={() => toggleDanceStyle(style)}
                className={`${isSelected ? 'filter-style-indicator active' : 'filter-style-indicator'} style-${style} text-sm p-3 rounded-lg border transition-all duration-300 text-left`}
              >
                <div className="flex items-center space-x-2">
                  <span>{config.icon}</span>
                  <span className="font-medium">{config.displayName}</span>
                </div>
              </button>
            )
          })}
        </div>

        {filters.danceStyles.length > 0 && (
          <div className="mt-2 text-xs text-cream-300">
            Selected: {filters.danceStyles.length} style{filters.danceStyles.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* Event Types Filter */}
      <div>
        <label className="block text-sm font-medium text-gold-400 mb-3">
          📅 Event Types
        </label>
        <div className="flex flex-wrap gap-2">
          {['workshop', 'social', 'competition', 'festival', 'masterclass', 'intensive'].map((type) => {
            const isSelected = filters.eventTypes.includes(type as EventType)
            const typeIcons: Record<EventType, string> = {
              workshop: '🎓',
              social: '💃',
              competition: '🏆',
              festival: '🎪',
              masterclass: '👑',
              intensive: '⚡'
            }

            return (
              <button
                key={type}
                onClick={() => toggleEventType(type as EventType)}
                className={`px-3 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  isSelected
                    ? 'bg-gold-600 text-navy-900 border-gold-400'
                    : 'bg-navy-800/30 text-cream-200 border-gold-600/30 hover:bg-gold-600/20 hover:text-gold-400'
                } border`}
              >
                <span className="mr-1">{typeIcons[type as EventType]}</span>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            )
          })}
        </div>
      </div>

      {/* Difficulty Level Filter */}
      <div>
        <label className="block text-sm font-medium text-gold-400 mb-3">
          📊 Difficulty Level
        </label>
        <div className="flex flex-wrap gap-2">
          {['beginner', 'intermediate', 'advanced', 'all'].map((level) => {
            const isSelected = filters.difficultyLevel === level
            const levelIcons = {
              beginner: '🌱',
              intermediate: '🎯',
              advanced: '🏅',
              all: '🌟'
            }

            return (
              <button
                key={level}
                onClick={() => updateFilters({ difficultyLevel: level as DifficultyLevel })}
                className={`px-3 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  isSelected
                    ? 'bg-copper-600 text-cream-100 border-copper-400'
                    : 'bg-navy-800/30 text-cream-200 border-copper-600/30 hover:bg-copper-600/20 hover:text-copper-400'
                } border`}
              >
                <span className="mr-1">{levelIcons[level as keyof typeof levelIcons]}</span>
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </button>
            )
          })}
        </div>
      </div>

      {/* Advanced Filters Toggle */}
      <div className="border-t border-gold-600/20 pt-4">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center space-x-2 text-gold-400 hover:text-gold-300 transition-colors"
        >
          <span>⚙️</span>
          <span className="font-medium">Advanced Filters</span>
          <span className="text-xs">{showAdvanced ? '▲' : '▼'}</span>
        </button>

        {showAdvanced && (
          <div className="mt-4 space-y-4">
            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-gold-400 mb-2">
                📅 Date Range
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-cream-300 mb-1">From</label>
                  <input
                    type="date"
                    value={filters.dateRange?.start || ''}
                    onChange={(e) => updateFilters({
                      dateRange: {
                        start: e.target.value,
                        end: filters.dateRange?.end || ''
                      }
                    })}
                    className="form-input text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-cream-300 mb-1">To</label>
                  <input
                    type="date"
                    value={filters.dateRange?.end || ''}
                    onChange={(e) => updateFilters({
                      dateRange: {
                        start: filters.dateRange?.start || '',
                        end: e.target.value
                      }
                    })}
                    className="form-input text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gold-400 mb-2">
                💰 Price Range (€)
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-cream-300 mb-1">Min</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={filters.priceRange?.min || ''}
                    onChange={(e) => updateFilters({
                      priceRange: {
                        min: Number(e.target.value),
                        max: filters.priceRange?.max || 0
                      }
                    })}
                    className="form-input text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-cream-300 mb-1">Max</label>
                  <input
                    type="number"
                    placeholder="999"
                    value={filters.priceRange?.max || ''}
                    onChange={(e) => updateFilters({
                      priceRange: {
                        min: filters.priceRange?.min || 0,
                        max: Number(e.target.value)
                      }
                    })}
                    className="form-input text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Additional Options */}
            <div>
              <label className="block text-sm font-medium text-gold-400 mb-3">
                🏨 Additional Features
              </label>
              <div className="space-y-3">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={filters.hasLodging}
                    onChange={(e) => updateFilters({ hasLodging: e.target.checked })}
                    className="form-checkbox"
                  />
                  <span className="text-cream-200">🏨 Accommodation Available</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={filters.hasCompetitions}
                    onChange={(e) => updateFilters({ hasCompetitions: e.target.checked })}
                    className="form-checkbox"
                  />
                  <span className="text-cream-200">🏆 Competitions & Contests</span>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Apply Button */}
      <div className="border-t border-gold-600/20 pt-4">
        <button
          onClick={() => onFiltersChange(filters)}
          className="btn-primary w-full"
        >
          🧭 Apply Filters
        </button>
      </div>
    </div>
  )
}