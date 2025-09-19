import React from 'react'

interface FilterPreset {
  id: string
  name: string
  icon: string
  description: string
  filters: {
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
    tags?: string[]
  }
  popularity: number
}

interface FilterPresetsProps {
  onApplyPreset: (preset: FilterPreset) => void
  currentFilters?: any
  className?: string
}

export function FilterPresets({
  onApplyPreset,
  currentFilters,
  className = ''
}: FilterPresetsProps) {

  // Popular filter presets based on common search patterns
  const popularPresets: FilterPreset[] = [
    {
      id: 'this-weekend',
      name: 'This Weekend',
      icon: '📅',
      description: 'Events happening this weekend',
      popularity: 95,
      filters: {
        dateRange: {
          start: new Date().toISOString().split('T')[0],
          end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        }
      }
    },
    {
      id: 'europe-festivals',
      name: 'Europe',
      icon: '🇪🇺',
      description: 'All European blues festivals',
      popularity: 88,
      filters: {
        location: {
          country: 'Europe',
          radius: 5000
        }
      }
    },
    {
      id: 'beginner-friendly',
      name: 'Beginner Friendly',
      icon: '🌟',
      description: 'Perfect for new dancers',
      popularity: 82,
      filters: {
        tags: ['beginner', 'workshop', 'introduction'],
        priceRange: {
          min: 0,
          max: 150
        }
      }
    },
    {
      id: 'legendary-teachers',
      name: 'Legendary Teachers',
      icon: '👑',
      description: 'Events with world-renowned instructors',
      popularity: 76,
      filters: {
        teachers: ['Vicci & Adamo', 'Damon Stone', 'Sarah Vann', 'Mike Faltesek']
      }
    },
    {
      id: 'live-music',
      name: 'Live Music',
      icon: '🎷',
      description: 'Festivals featuring live bands',
      popularity: 73,
      filters: {
        tags: ['live music', 'band', 'orchestra'],
        musicians: ['Mint Julep Jazz Band', 'Gordon Webster', 'Glenn Crytzer']
      }
    },
    {
      id: 'affordable',
      name: 'Budget Friendly',
      icon: '💰',
      description: 'Great festivals under €100',
      popularity: 69,
      filters: {
        priceRange: {
          min: 0,
          max: 100
        }
      }
    },
    {
      id: 'weekend-workshops',
      name: 'Weekend Workshops',
      icon: '📚',
      description: '2-3 day intensive workshops',
      popularity: 64,
      filters: {
        tags: ['workshop', 'intensive', 'weekend'],
        dateRange: {
          start: new Date().toISOString().split('T')[0],
          end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        }
      }
    },
    {
      id: 'international',
      name: 'International',
      icon: '🌍',
      description: 'Major international festivals',
      popularity: 58,
      filters: {
        tags: ['international', 'festival', 'competition'],
        priceRange: {
          min: 100,
          max: 500
        }
      }
    }
  ]

  // Quick filter buttons for immediate application
  const quickFilters = [
    { label: 'Today', query: '', dateRange: { start: new Date().toISOString().split('T')[0], end: new Date().toISOString().split('T')[0] } },
    { label: 'This Week', query: '', dateRange: { start: new Date().toISOString().split('T')[0], end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] } },
    { label: 'Next Month', query: '', dateRange: { start: new Date().toISOString().split('T')[0], end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] } },
    { label: 'Free Events', priceRange: { min: 0, max: 0 } },
    { label: 'Madrid', location: { city: 'Madrid', country: 'Spain' } },
    { label: 'Berlin', location: { city: 'Berlin', country: 'Germany' } },
    { label: 'London', location: { city: 'London', country: 'UK' } }
  ]

  const handlePresetClick = (preset: FilterPreset) => {
    onApplyPreset(preset)
  }

  const handleQuickFilterClick = (quickFilter: any) => {
    const preset: FilterPreset = {
      id: `quick-${quickFilter.label.toLowerCase().replace(' ', '-')}`,
      name: quickFilter.label,
      icon: '⚡',
      description: `Quick filter for ${quickFilter.label}`,
      popularity: 0,
      filters: quickFilter
    }
    onApplyPreset(preset)
  }

  const getPopularityColor = (popularity: number) => {
    if (popularity >= 80) return 'bg-red-100 text-red-700 border-red-200'
    if (popularity >= 60) return 'bg-orange-100 text-orange-700 border-orange-200'
    return 'bg-blue-100 text-blue-700 border-blue-200'
  }

  return (
    <div className={`filter-presets ${className}`}>
      {/* Quick Filters */}
      <div className="mb-6">
        <h3 className="vintage-text text-sm font-bold text-navy-900 uppercase tracking-wide mb-3 flex items-center">
          <span className="text-gold-600 mr-2">⚡</span>
          Quick Filters
        </h3>
        <div className="flex flex-wrap gap-2">
          {quickFilters.map((filter) => (
            <button
              key={filter.label}
              onClick={() => handleQuickFilterClick(filter)}
              className="px-3 py-1.5 bg-cream-200 hover:bg-cream-300 text-navy-700 rounded-full text-sm font-medium transition-colors vintage-button"
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Popular Search Presets */}
      <div className="mb-6">
        <h3 className="vintage-text text-sm font-bold text-navy-900 uppercase tracking-wide mb-4 flex items-center">
          <span className="text-bordeaux-600 mr-2">🔥</span>
          Popular Searches
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {popularPresets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handlePresetClick(preset)}
              className="vintage-preset-card group p-4 bg-gradient-to-br from-cream-50 to-cream-100 hover:from-cream-100 hover:to-cream-200 border-2 border-gold-400/20 hover:border-gold-400/40 rounded-xl text-left transition-all duration-200 hover:shadow-lg"
            >
              <div className="flex items-start space-x-3">
                {/* Icon */}
                <div className="text-2xl">{preset.icon}</div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="vintage-text font-bold text-navy-900 group-hover:text-bordeaux-700 transition-colors">
                      {preset.name}
                    </h4>

                    {/* Popularity Badge */}
                    <span className={`text-xs px-2 py-1 rounded-full border ${getPopularityColor(preset.popularity)}`}>
                      {preset.popularity}% popular
                    </span>
                  </div>

                  <p className="text-sm text-navy-600 mb-2">
                    {preset.description}
                  </p>

                  {/* Filter Preview */}
                  <div className="flex flex-wrap gap-1">
                    {Object.entries(preset.filters).map(([key, value]) => {
                      if (!value) return null

                      let displayValue = ''
                      if (key === 'dateRange' && value && typeof value === 'object' && 'start' in value) {
                        displayValue = 'Date range'
                      } else if (key === 'location' && value && typeof value === 'object' && 'country' in value) {
                        displayValue = (value as any).country || (value as any).city || 'Location'
                      } else if (key === 'priceRange' && value && typeof value === 'object' && 'min' in value) {
                        const priceValue = value as any
                        displayValue = `€${priceValue.min}-${priceValue.max}`
                      } else if (Array.isArray(value)) {
                        displayValue = `${value.length} ${key}`
                      } else if (typeof value === 'string') {
                        displayValue = value
                      }

                      return (
                        <span
                          key={key}
                          className="text-xs bg-navy-100 text-navy-600 px-2 py-1 rounded-full"
                        >
                          {displayValue}
                        </span>
                      )
                    })}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Save Current Filters */}
      {currentFilters && Object.keys(currentFilters).length > 0 && (
        <div className="p-4 bg-gold-50 border-2 border-gold-300 rounded-xl">
          <h4 className="vintage-text font-bold text-navy-900 mb-2 flex items-center">
            <span className="text-gold-600 mr-2">💾</span>
            Save Current Search
          </h4>
          <p className="text-sm text-navy-600 mb-3">
            Save your current filter combination for quick access later.
          </p>
          <button className="px-4 py-2 bg-gold-600 hover:bg-gold-500 text-navy-900 rounded-lg font-medium transition-colors vintage-button">
            Save as Preset
          </button>
        </div>
      )}
    </div>
  )
}