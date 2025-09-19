// Date utility functions for handling both Date objects and date strings

/**
 * Ensures we have a proper Date object from either a Date or string
 */
export function ensureDate(date: Date | string): Date {
  if (date instanceof Date) {
    return date
  }
  if (typeof date === 'string') {
    const parsed = new Date(date)
    if (isNaN(parsed.getTime())) {
      throw new Error(`Invalid date string: ${date}`)
    }
    return parsed
  }
  throw new Error('Invalid date format - must be Date object or valid date string')
}

/**
 * Safely format a date with fallback for invalid dates
 */
export function formatDate(
  date: Date | string, 
  options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  },
  fallback: string = 'Date TBD'
): string {
  try {
    const dateObj = ensureDate(date)
    return dateObj.toLocaleDateString('en-US', options)
  } catch {
    return fallback
  }
}

/**
 * Format date with long format (includes weekday)
 */
export function formatLongDate(date: Date | string, fallback: string = 'Date TBD'): string {
  return formatDate(date, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }, fallback)
}

/**
 * Format time from date
 */
export function formatTime(date: Date | string, fallback: string = 'Time TBD'): string {
  try {
    const dateObj = ensureDate(date)
    return dateObj.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return fallback
  }
}

/**
 * Get relative date description (Today, Tomorrow, In X days, etc.)
 */
export function getRelativeDate(date: Date | string, fallback: string = 'Date TBD'): string {
  try {
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(today.getDate() + 1)
    
    const eventDate = ensureDate(date)
    eventDate.setHours(0, 0, 0, 0)
    today.setHours(0, 0, 0, 0)
    tomorrow.setHours(0, 0, 0, 0)
    
    if (eventDate.getTime() === today.getTime()) {
      return 'Today'
    } else if (eventDate.getTime() === tomorrow.getTime()) {
      return 'Tomorrow'
    }
    
    const diffTime = eventDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays > 0 && diffDays <= 7) {
      return `In ${diffDays} day${diffDays > 1 ? 's' : ''}`
    }
    
    if (diffDays < 0) {
      const absDays = Math.abs(diffDays)
      if (absDays === 1) {
        return 'Yesterday'
      } else if (absDays <= 7) {
        return `${absDays} day${absDays > 1 ? 's' : ''} ago`
      }
    }
    
    return formatDate(date)
  } catch {
    return fallback
  }
}

/**
 * Format date range (e.g., "Mar 15-17, 2024" or "Mar 15 - Apr 2, 2024")
 */
export function formatDateRange(
  start: Date | string, 
  end: Date | string, 
  fallback: string = 'Dates TBD'
): string {
  try {
    const startDate = ensureDate(start)
    const endDate = ensureDate(end)
    
    // Same month and year
    if (startDate.getMonth() === endDate.getMonth() && 
        startDate.getFullYear() === endDate.getFullYear()) {
      return `${startDate.toLocaleDateString('en-US', { month: 'short' })} ${startDate.getDate()}-${endDate.getDate()}, ${startDate.getFullYear()}`
    }
    
    // Same year, different months
    if (startDate.getFullYear() === endDate.getFullYear()) {
      return `${formatDate(startDate, { month: 'short', day: 'numeric' })} - ${formatDate(endDate, { month: 'short', day: 'numeric' })}, ${startDate.getFullYear()}`
    }
    
    // Different years
    return `${formatDate(startDate)} - ${formatDate(endDate)}`
  } catch {
    return fallback
  }
}

/**
 * Calculate duration between two dates
 */
export function getEventDuration(
  start: Date | string, 
  end: Date | string, 
  fallback: string = 'Duration TBD'
): string {
  try {
    const startDate = ensureDate(start)
    const endDate = ensureDate(end)
    const diffTime = endDate.getTime() - startDate.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays === 1 ? '1 day' : `${diffDays} days`
  } catch {
    return fallback
  }
}

/**
 * Check if registration deadline is urgent (within 7 days)
 */
export function isRegistrationUrgent(deadline: Date | string | null | undefined): boolean {
  if (!deadline) return false
  try {
    const today = new Date()
    const deadlineDate = ensureDate(deadline)
    const diffTime = deadlineDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 7 && diffDays > 0
  } catch {
    return false
  }
}

/**
 * Check if registration is closed
 */
export function isRegistrationClosed(deadline: Date | string | null | undefined): boolean {
  if (!deadline) return false
  try {
    const today = new Date()
    const deadlineDate = ensureDate(deadline)
    return today > deadlineDate
  } catch {
    return false
  }
}

/**
 * Get days until a specific date
 */
export function getDaysUntil(date: Date | string): number | null {
  try {
    const today = new Date()
    const targetDate = ensureDate(date)
    const diffTime = targetDate.getTime() - today.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  } catch {
    return null
  }
}