'use client'

import { useState, useEffect } from 'react'

import { Input } from '@/components/ui/Input'
import { cn } from '@/lib/utils'

interface LocationFilterProps {
  city?: string
  country?: string
  radius?: number
  onCityChange?: (city: string) => void
  onCountryChange?: (country: string) => void
  onRadiusChange?: (radius: number) => void
  className?: string
  label?: string
}

const popularCities = [
  'New York, USA',
  'London, UK',
  'Paris, France',
  'Berlin, Germany',
  'Amsterdam, Netherlands',
  'Barcelona, Spain',
  'Chicago, USA',
  'Los Angeles, USA',
  'Toronto, Canada',
  'Melbourne, Australia'
]

const popularCountries = [
  'United States',
  'United Kingdom',
  'France',
  'Germany',
  'Netherlands',
  'Spain',
  'Canada',
  'Australia',
  'Italy',
  'Sweden'
]

export function LocationFilter({
  city = '',
  country = '',
  radius = 50,
  onCityChange,
  onCountryChange,
  onRadiusChange,
  className,
  label
}: LocationFilterProps) {
  const [showCitySuggestions, setShowCitySuggestions] = useState(false)
  const [showCountrySuggestions, setShowCountrySuggestions] = useState(false)
  const [cityQuery, setCityQuery] = useState(city)
  const [countryQuery, setCountryQuery] = useState(country)

  useEffect(() => {
    setCityQuery(city)
  }, [city])

  useEffect(() => {
    setCountryQuery(country)
  }, [country])

  const filteredCities = popularCities.filter(c => 
    c.toLowerCase().includes(cityQuery.toLowerCase())
  ).slice(0, 5)

  const filteredCountries = popularCountries.filter(c => 
    c.toLowerCase().includes(countryQuery.toLowerCase())
  ).slice(0, 5)

  const handleCitySelect = (selectedCity: string) => {
    const cityName = selectedCity.split(',')[0].trim()
    setCityQuery(cityName)
    onCityChange?.(cityName)
    setShowCitySuggestions(false)
  }

  const handleCountrySelect = (selectedCountry: string) => {
    setCountryQuery(selectedCountry)
    onCountryChange?.(selectedCountry)
    setShowCountrySuggestions(false)
  }

  return (
    <div className={cn('space-y-4', className)}>
      {label && (
        <h3 className="form-label text-base font-semibold">{label}</h3>
      )}

      {/* City Input with Autocomplete */}
      <div className="relative">
        <Input
          type="text"
          label="City"
          placeholder="e.g. New York, London"
          value={cityQuery}
          onChange={(e) => {
            setCityQuery(e.target.value)
            onCityChange?.(e.target.value)
            setShowCitySuggestions(true)
          }}
          onFocus={() => setShowCitySuggestions(true)}
          onBlur={() => {
            setTimeout(() => setShowCitySuggestions(false), 200)
          }}
        />
        
        {showCitySuggestions && filteredCities.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-navy-900 border border-primary/30 rounded-lg shadow-lg max-h-40 overflow-y-auto">
            {filteredCities.map((city, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleCitySelect(city)}
                className="w-full px-3 py-2 text-left text-base font-medium text-white hover:bg-primary/20 focus:bg-primary/20 focus:outline-none first:rounded-t-lg last:rounded-b-lg"
              >
                {city}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Country Input with Autocomplete */}
      <div className="relative">
        <Input
          type="text"
          label="Country"
          placeholder="e.g. United States, France"
          value={countryQuery}
          onChange={(e) => {
            setCountryQuery(e.target.value)
            onCountryChange?.(e.target.value)
            setShowCountrySuggestions(true)
          }}
          onFocus={() => setShowCountrySuggestions(true)}
          onBlur={() => {
            setTimeout(() => setShowCountrySuggestions(false), 200)
          }}
        />
        
        {showCountrySuggestions && filteredCountries.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-navy-900 border border-primary/30 rounded-lg shadow-lg max-h-40 overflow-y-auto">
            {filteredCountries.map((country, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleCountrySelect(country)}
                className="w-full px-3 py-2 text-left text-base font-medium text-white hover:bg-primary/20 focus:bg-primary/20 focus:outline-none first:rounded-t-lg last:rounded-b-lg"
              >
                {country}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Radius Slider */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <label className="form-label text-base">
            Search Radius
          </label>
          <span className="text-base font-semibold text-primary">
            {radius} km
          </span>
        </div>
        <input
          type="range"
          min="10"
          max="500"
          step="10"
          value={radius}
          onChange={(e) => onRadiusChange?.(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          style={{
            background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${((radius - 10) / 490) * 100}%, #E5E7EB ${((radius - 10) / 490) * 100}%, #E5E7EB 100%)`
          }}
        />
        <div className="flex justify-between text-sm text-white font-medium mt-2">
          <span>10 km</span>
          <span>250 km</span>
          <span>500 km</span>
        </div>
      </div>

      {/* Quick Location Buttons */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-primary">Quick locations:</p>
        <div className="flex flex-wrap gap-1">
          {['Europe', 'North America', 'United States', 'United Kingdom', 'Germany', 'France'].map((location) => (
            <button
              key={location}
              type="button"
              onClick={() => {
                if (location === 'Europe' || location === 'North America') {
                  setCityQuery('')
                  setCountryQuery('')
                  onCityChange?.('')
                  onCountryChange?.('')
                } else {
                  setCityQuery('')
                  setCountryQuery(location)
                  onCityChange?.('')
                  onCountryChange?.(location)
                }
              }}
              className="px-3 py-1.5 text-sm bg-primary/20 hover:bg-primary/30 text-primary rounded-lg transition-colors font-medium"
            >
              {location}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}