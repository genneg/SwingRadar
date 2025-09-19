// Library utilities barrel exports

// Utils (general utilities)
export { cn, generateSlug, truncateText, debounce, isValidEmail } from './utils'

// DateUtils (prefer dateUtils for date functions)
export { 
  ensureDate,
  formatDate, 
  formatLongDate,
  formatTime,
  getRelativeDate,
  formatDateRange, 
  getEventDuration,
  isRegistrationUrgent,
  isRegistrationClosed,
  getDaysUntil
} from './dateUtils'

// Auth
export * from './auth'

// Database
export * from './database'

// Validation
export * from './validation'