// SwingRadar Multi-Style Platform Types

// Re-export all dance-related types
export * from './dance'

// Re-export all API-related types
export * from './api'

// Legacy type aliases for backward compatibility
export type {
  MultiStyleEvent as Festival,
  MultiStyleEvent as Event,
  MultiStyleTeacher as Teacher,
  MultiStyleMusician as Musician,
  MultiStyleUserPreferences as UserPreferences,
  MultiStyleSearchFilters as SearchFilters
} from './dance'