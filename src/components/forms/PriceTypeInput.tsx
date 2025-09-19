'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/Input'
import { FormLabel } from '@/components/ui/Form'
import { Badge } from '@/components/ui/Badge'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface PriceTypeInputProps {
  value: string
  onChange: (value: string) => void
  label?: string
  placeholder?: string
  required?: boolean
  className?: string
}

// Common price types for quick selection
const COMMON_PRICE_TYPES = [
  'Early Bird',
  'Regular',
  'Late Registration',
  'Student',
  'Local',
  'VIP',
  'Full Pass',
  'Weekend Pass',
  'Day Pass',
  'Beginner Full Pass',
  'Intermediate Pass',
  'Advanced Pass',
  'Competition Entry',
  'Workshop Only',
  'Dance Only',
  'Accommodation Package',
  'Donation'
]

export function PriceTypeInput({
  value,
  onChange,
  label = 'Price Type',
  placeholder = 'Enter price type (e.g., Beginner Full Pass)',
  required = false,
  className = ''
}: PriceTypeInputProps) {
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([])
  const [usedTypes, setUsedTypes] = useState<string[]>([])

  // Load used price types from the database
  useEffect(() => {
    loadUsedPriceTypes()
  }, [])

  // Filter suggestions based on input value
  useEffect(() => {
    if (!value) {
      setFilteredSuggestions(COMMON_PRICE_TYPES.slice(0, 8))
    } else {
      const filtered = [...COMMON_PRICE_TYPES, ...usedTypes]
        .filter(type => 
          type.toLowerCase().includes(value.toLowerCase()) && 
          type.toLowerCase() !== value.toLowerCase()
        )
        .slice(0, 6)
      setFilteredSuggestions(filtered)
    }
  }, [value, usedTypes])

  const loadUsedPriceTypes = async () => {
    try {
      const response = await fetch('/api/price-types?includeUsed=true')
      const data = await response.json()
      if (data.success) {
        setUsedTypes(data.data.used || [])
      }
    } catch (error) {
      console.error('Failed to load used price types:', error)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion)
    setShowSuggestions(false)
  }

  const handleInputFocus = () => {
    setShowSuggestions(true)
  }

  const handleInputBlur = () => {
    // Delay hiding suggestions to allow for clicking
    setTimeout(() => setShowSuggestions(false), 150)
  }

  return (
    <div className={`relative ${className}`}>
      <FormLabel htmlFor="priceType" required={required}>
        {label}
      </FormLabel>
      <div className="relative">
        <Input
          id="priceType"
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder={placeholder}
          required={required}
          className="pr-8"
        />
        <button
          type="button"
          onClick={() => setShowSuggestions(!showSuggestions)}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          {showSuggestions ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {filteredSuggestions.length > 0 ? (
            <div className="p-2">
              <div className="space-y-1">
                {filteredSuggestions.map((suggestion, index) => (
                  <button
                    key={`${suggestion}-${index}`}
                    type="button"
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded-md transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
              
              {/* Quick badges for common types */}
              {!value && (
                <div className="mt-3 pt-2 border-t border-gray-100">
                  <p className="text-xs text-gray-500 mb-2">Popular types:</p>
                  <div className="flex flex-wrap gap-1">
                    {COMMON_PRICE_TYPES.slice(0, 6).map(type => (
                      <Badge
                        key={type}
                        variant="neutral"
                        className="cursor-pointer hover:bg-primary hover:text-white text-xs"
                        onClick={() => handleSuggestionClick(type)}
                      >
                        {type}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 text-sm text-gray-500 text-center">
              {value ? (
                <>
                  No matching suggestions.
                  <br />
                  <span className="text-xs">Press Enter to use "{value}"</span>
                </>
              ) : (
                'Start typing to see suggestions...'
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}