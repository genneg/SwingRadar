'use client'

import { useState, useEffect } from 'react'
import { DanceStyle, DANCE_STYLE_CONFIGS, getDanceStyleConfig } from '@/lib/types/dance'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { DateRangePicker } from '@/components/ui/DateRangePicker'
import { TeacherMusicianFilter } from '@/components/ui/TeacherMusicianFilter'

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
  danceStyles: DanceStyle[]
  eventTypes: string[]
  difficultyLevel: string
}

interface MultiStyleFilterPanelProps {
  filters: Partial<FilterOptions>
  onFiltersChange: (filters: Partial<FilterOptions>) => void
  onApply: () => void
  onReset: () => void
  className?: string
}

export function MultiStyleFilterPanel({
  filters,
  onFiltersChange,
  onApply,
  onReset,
  className
}: MultiStyleFilterPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [selectedStyles, setSelectedStyles] = useState<DanceStyle[]>(filters.danceStyles || ['blues'])

  const updateFilter = (key: keyof FilterOptions, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    })
  }

  // Handle dance style selection
  const handleStyleToggle = (style: DanceStyle) => {
    const newStyles = selectedStyles.includes(style)
      ? selectedStyles.filter(s => s !== style)
      : [...selectedStyles, style]

    setSelectedStyles(newStyles)
    updateFilter('danceStyles', newStyles)
  }

  // Handle event type selection
  const handleEventTypeToggle = (eventType: string) => {
    const currentTypes = filters.eventTypes || []
    const newTypes = currentTypes.includes(eventType)
      ? currentTypes.filter(t => t !== eventType)
      : [...currentTypes, eventType]

    updateFilter('eventTypes', newTypes)
  }

  // Quick style presets
  const stylePresets = [
    { name: 'All Styles', styles: ['blues', 'swing', 'balboa', 'shag', 'boogie'] as DanceStyle[] },
    { name: 'Blues Focus', styles: ['blues'] as DanceStyle[] },
    { name: 'Swing Focus', styles: ['swing'] as DanceStyle[] },
    { name: 'Vintage Collection', styles: ['blues', 'swing'] as DanceStyle[] },
    { name: 'West Coast', styles: ['balboa', 'shag'] as DanceStyle[] },
  ]

  const applyStylePreset = (preset: DanceStyle[]) => {
    setSelectedStyles(preset)
    updateFilter('danceStyles', preset)
  }

  const EVENT_TYPES = [
    { id: 'festival', label: '🎭 Festival', icon: '🎭' },
    { id: 'workshop', label: '🏫 Workshop', icon: '🏫' },
    { id: 'social', label: '💃 Social', icon: '💃' },
    { id: 'competition', label: '🏆 Competition', icon: '🏆' },
    { id: 'masterclass', label: '🎓 Masterclass', icon: '🎓' },
    { id: 'intensive', label: '🔥 Intensive', icon: '🔥' },
  ]

  const DIFFICULTY_LEVELS = [
    { value: 'beginner', label: '🌱 Beginner', color: 'text-green-400' },
    { value: 'intermediate', label: '🌿 Intermediate', color: 'text-amber-400' },
    { value: 'advanced', label: '🔥 Advanced', color: 'text-red-400' },
    { value: 'all', label: '⭐ All Levels', color: 'text-gold-400' },
  ]

  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold text-gold-600">
            📡 Multi-Style Radar Detection
          </CardTitle>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="md:hidden p-2 text-white hover:text-gold-400"
          >
            <svg
              className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </CardHeader>

      <CardContent className={`space-y-8 ${!isExpanded ? 'hidden md:block' : ''}`}>
        {/* Style Presets */}
        <div>
          <h3 className="text-base font-semibold text-gold-600 mb-4">Quick Style Presets</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {stylePresets.map((preset, index) => (
              <button
                key={index}
                onClick={() => applyStylePreset(preset.styles)}
                className="px-3 py-2 rounded-lg bg-navy-800/50 border border-gold-600/30 text-cream-200 text-sm hover:bg-gold-600/20 transition-all duration-300"
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        {/* Dance Styles */}
        <div>
          <h3 className="text-base font-semibold text-gold-600 mb-4">Detection Range - Dance Styles</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {Object.entries(DANCE_STYLE_CONFIGS).map(([styleKey, config]) => (
              <button
                key={styleKey}
                onClick={() => handleStyleToggle(styleKey as DanceStyle)}
                className={`p-3 rounded-lg border-2 transition-all duration-300 flex flex-col items-center space-y-2 ${
                  selectedStyles.includes(styleKey as DanceStyle)
                    ? 'border-gold-600 bg-gold-600/20 shadow-gold-lg'
                    : 'border-gold-600/30 bg-navy-800/50 hover:border-gold-600/60'
                }`}
              >
                <span className="text-2xl">{config.icon}</span>
                <span className="text-sm font-medium text-cream-200">{config.displayName}</span>
                <span className="text-xs text-cream-300">{config.description}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Event Types */}
        <div>
          <h3 className="text-base font-semibold text-gold-600 mb-4">Event Types</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {EVENT_TYPES.map((eventType) => (
              <button
                key={eventType.id}
                onClick={() => handleEventTypeToggle(eventType.id)}
                className={`px-3 py-2 rounded-lg text-sm transition-all duration-300 ${
                  filters.eventTypes?.includes(eventType.id)
                    ? 'bg-gold-600 text-navy-900 font-semibold'
                    : 'bg-navy-800/50 border border-gold-600/30 text-cream-200 hover:bg-gold-600/20'
                }`}
              >
                <span className="mr-2">{eventType.icon}</span>
                {eventType.label}
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty Level */}
        <div>
          <h3 className="text-base font-semibold text-gold-600 mb-4">Difficulty Level</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {DIFFICULTY_LEVELS.map((level) => (
              <button
                key={level.value}
                onClick={() => updateFilter('difficultyLevel', level.value)}
                className={`px-3 py-2 rounded-lg text-sm transition-all duration-300 ${
                  filters.difficultyLevel === level.value
                    ? 'bg-gold-600 text-navy-900 font-semibold'
                    : 'bg-navy-800/50 border border-gold-600/30 text-cream-200 hover:bg-gold-600/20'
                }`}
              >
                <span className={level.color}>{level.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Date Range */}
        <DateRangePicker
          label="Date Range"
          startDate={filters.dateRange?.start || ''}
          endDate={filters.dateRange?.end || ''}
          onStartDateChange={(start) => updateFilter('dateRange', {
            ...filters.dateRange,
            start
          })}
          onEndDateChange={(end) => updateFilter('dateRange', {
            ...filters.dateRange,
            end
          })}
        />

        {/* Location */}
        <div>
          <h3 className="text-base font-semibold text-gold-600 mb-4">Location Detection</h3>
          <Input
            type="text"
            placeholder="e.g. London, UK or Paris, France"
            value={filters.location?.city || ''}
            onChange={(e) => updateFilter('location', {
              city: e.target.value,
              country: '',
              radius: 50
            })}
          />
        </div>

        {/* Price Range */}
        <div>
          <h3 className="text-base font-semibold text-gold-600 mb-4">Price Range</h3>
          <div className="grid grid-cols-2 gap-4">
            <Input
              type="number"
              label="Min (€)"
              placeholder="0"
              value={filters.priceRange?.min || ''}
              onChange={(e) => updateFilter('priceRange', {
                ...filters.priceRange,
                min: parseInt(e.target.value) || 0
              })}
            />
            <Input
              type="number"
              label="Max (€)"
              placeholder="1000"
              value={filters.priceRange?.max || ''}
              onChange={(e) => updateFilter('priceRange', {
                ...filters.priceRange,
                max: parseInt(e.target.value) || 1000
              })}
            />
          </div>
        </div>

        {/* Teachers and Musicians */}
        <TeacherMusicianFilter
          selectedTeachers={filters.teachers || []}
          selectedMusicians={filters.musicians || []}
          onTeachersChange={(teachers) => updateFilter('teachers', teachers)}
          onMusiciansChange={(musicians) => updateFilter('musicians', musicians)}
        />

        {/* Action Buttons */}
        <div className="flex space-x-4 pt-6 border-t border-gold-600/30">
          <Button
            variant="primary"
            onClick={onApply}
            className="flex-1 btn-primary"
          >
            📡 Start Detection
          </Button>
          <Button
            variant="outline"
            onClick={onReset}
            className="flex-1 btn-secondary"
          >
            Reset Radar
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}