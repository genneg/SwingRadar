'use client'

import { useState } from 'react'

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
}

interface FilterPanelProps {
  filters: Partial<FilterOptions>
  onFiltersChange: (filters: Partial<FilterOptions>) => void
  onApply: () => void
  onReset: () => void
  className?: string
}

export function FilterPanel({
  filters,
  onFiltersChange,
  onApply,
  onReset,
  className
}: FilterPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const updateFilter = (key: keyof FilterOptions, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    })
  }


  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold text-primary">Filters</CardTitle>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="md:hidden p-2 text-white hover:text-primary"
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
          <h3 className="text-base font-semibold text-primary mb-4">Location</h3>
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
          <h3 className="text-base font-semibold text-primary mb-4">Price Range</h3>
          <div className="grid grid-cols-2 gap-4">
            <Input
              type="number"
              label="Min ($)"
              placeholder="0"
              value={filters.priceRange?.min || ''}
              onChange={(e) => updateFilter('priceRange', {
                ...filters.priceRange,
                min: parseInt(e.target.value) || 0
              })}
            />
            <Input
              type="number"
              label="Max ($)"
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
        <div className="flex space-x-4 pt-6 border-t border-primary/30">
          <Button
            variant="primary"
            onClick={onApply}
            className="flex-1 btn-primary"
          >
            Apply Filters
          </Button>
          <Button
            variant="outline"
            onClick={onReset}
            className="flex-1 btn-secondary"
          >
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}