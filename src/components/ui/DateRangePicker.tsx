'use client'

import { useState } from 'react'

import { cn } from '@/lib/utils'

interface DateRangePickerProps {
  startDate?: string
  endDate?: string
  onStartDateChange?: (date: string) => void
  onEndDateChange?: (date: string) => void
  className?: string
  label?: string
  error?: string
}

export function DateRangePicker({
  startDate = '',
  endDate = '',
  onStartDateChange,
  onEndDateChange,
  className,
  label,
  error
}: DateRangePickerProps) {
  const [localStartDate, setLocalStartDate] = useState(startDate)
  const [localEndDate, setLocalEndDate] = useState(endDate)

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value
    setLocalStartDate(newDate)
    onStartDateChange?.(newDate)
  }

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value
    setLocalEndDate(newDate)
    onEndDateChange?.(newDate)
  }

  const getMinEndDate = () => {
    return localStartDate || new Date().toISOString().split('T')[0]
  }

  const getMinStartDate = () => {
    return new Date().toISOString().split('T')[0]
  }

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <label className="form-label text-base font-semibold">
          {label}
        </label>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <div>
          <label className="form-label text-sm mb-2">
            From
          </label>
          <input
            type="date"
            value={localStartDate}
            onChange={handleStartDateChange}
            min={getMinStartDate()}
            max={localEndDate}
            className={cn(
              'form-input',
              error && 'border-error-500 focus:ring-error-500'
            )}
          />
        </div>
        
        <div>
          <label className="form-label text-sm mb-2">
            To
          </label>
          <input
            type="date"
            value={localEndDate}
            onChange={handleEndDateChange}
            min={getMinEndDate()}
            className={cn(
              'form-input',
              error && 'border-error-500 focus:ring-error-500'
            )}
          />
        </div>
      </div>

      {error && (
        <p className="form-error">{error}</p>
      )}

      {/* Quick Date Range Buttons */}
      <div className="flex flex-wrap gap-1 mt-2">
        <button
          type="button"
          onClick={() => {
            const today = new Date()
            const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
            const startStr = today.toISOString().split('T')[0]
            const endStr = nextWeek.toISOString().split('T')[0]
            setLocalStartDate(startStr)
            setLocalEndDate(endStr)
            onStartDateChange?.(startStr)
            onEndDateChange?.(endStr)
          }}
          className="px-3 py-1.5 text-sm bg-primary/20 hover:bg-primary/30 text-primary rounded-lg transition-colors font-medium"
        >
          Next Week
        </button>
        <button
          type="button"
          onClick={() => {
            const today = new Date()
            const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate())
            const startStr = today.toISOString().split('T')[0]
            const endStr = nextMonth.toISOString().split('T')[0]
            setLocalStartDate(startStr)
            setLocalEndDate(endStr)
            onStartDateChange?.(startStr)
            onEndDateChange?.(endStr)
          }}
          className="px-3 py-1.5 text-sm bg-primary/20 hover:bg-primary/30 text-primary rounded-lg transition-colors font-medium"
        >
          Next Month
        </button>
        <button
          type="button"
          onClick={() => {
            const today = new Date()
            const nextThreeMonths = new Date(today.getFullYear(), today.getMonth() + 3, today.getDate())
            const startStr = today.toISOString().split('T')[0]
            const endStr = nextThreeMonths.toISOString().split('T')[0]
            setLocalStartDate(startStr)
            setLocalEndDate(endStr)
            onStartDateChange?.(startStr)
            onEndDateChange?.(endStr)
          }}
          className="px-3 py-1.5 text-sm bg-primary/20 hover:bg-primary/30 text-primary rounded-lg transition-colors font-medium"
        >
          Next 3 Months
        </button>
        <button
          type="button"
          onClick={() => {
            setLocalStartDate('')
            setLocalEndDate('')
            onStartDateChange?.('')
            onEndDateChange?.('')
          }}
          className="px-3 py-1.5 text-sm bg-error-600/20 hover:bg-error-600/30 text-error-300 rounded-lg transition-colors font-medium"
        >
          Clear
        </button>
      </div>
    </div>
  )
}