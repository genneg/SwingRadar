// Dance Style Types for SwingRadar Multi-Style Platform

/**
 * Core dance styles supported by the platform
 */
export type DanceStyle = 'blues' | 'swing' | 'balboa' | 'shag' | 'boogie'

/**
 * Event types supported by the platform
 */
export type EventType = 'workshop' | 'social' | 'competition' | 'festival' | 'masterclass' | 'intensive'

/**
 * Difficulty levels for events and user experience
 */
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced' | 'all'

/**
 * Experience levels for teachers and users per dance style
 */
export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert'

/**
 * Music genres for musicians
 */
export type MusicGenre = 'blues' | 'swing' | 'balboa' | 'shag' | 'boogie' | 'jazz' | 'rhythm-and-blues' | 'big-band'

/**
 * Performance types for musicians
 */
export type PerformanceType = 'live' | 'dj' | 'recorded' | 'band' | 'solo' | 'duo' | 'trio'

/**
 * Enhanced Event interface with multi-style support
 */
export interface MultiStyleEvent {
  id: number
  name: string
  from_date: string
  to_date: string
  country: string
  city: string
  website?: string
  style?: string // Legacy field - maintained for backward compatibility
  dance_styles: DanceStyle[] // New multi-style support
  primary_style: DanceStyle // Primary dance style
  difficulty_level: DifficultyLevel
  event_types: EventType[]
  description?: string
  ai_quality_score?: number
  ai_completeness_score?: number
  extraction_method?: string
  image_url?: string
  created_at?: string
  updated_at?: string
  // Relations
  teachers?: MultiStyleTeacher[]
  musicians?: MultiStyleMusician[]
  venues?: EventVenue[]
  prices?: EventPrice[]
}

/**
 * Enhanced Teacher interface with multi-style support
 */
export interface MultiStyleTeacher {
  id: number
  name: string
  bio?: string
  website?: string
  ai_bio_summary?: string
  ai_relevance_score?: number
  image_url?: string
  specializations: DanceStyle[] // Dance styles they teach
  experience_levels?: Record<DanceStyle, ExperienceLevel> // Experience per style
  teaching_since?: number // Year started teaching
  credentials: string[] // Certifications, achievements
  preferred_events: EventType[] // Types of events they prefer
  created_at?: string
  updated_at?: string
}

/**
 * Enhanced Musician interface with multi-style support
 */
export interface MultiStyleMusician {
  id: number
  name: string
  slug: string
  bio?: string
  avatar?: string
  verified?: boolean
  instruments: string[]
  music_genres: MusicGenre[] // Music genres they play
  primary_genre: MusicGenre // Primary music genre
  performance_types: PerformanceType[] // Types of performances
  yearsActive?: number
  website?: string
  email?: string
  followerCount?: number
  eventCount?: number
  image_url?: string
  createdAt?: string
  updatedAt?: string
}

/**
 * User Preferences with multi-style support
 */
export interface MultiStyleUserPreferences {
  id: number
  user_id: number
  email_notifications: boolean
  push_notifications: boolean
  new_event_notifications: boolean
  deadlineReminders: boolean
  weeklyDigest: boolean
  followingUpdates: boolean
  theme: string
  language: string
  defaultCountry?: string
  defaultCity?: string
  searchRadius?: number
  timezone?: string
  preferred_dance_styles: DanceStyle[] // User's preferred dance styles
  experience_level: DifficultyLevel // Overall experience level
  preferred_event_types: EventType[] // Preferred event types
  skill_levels?: Record<DanceStyle, ExperienceLevel> // Per-style skill levels
  created_at: string
  updated_at: string
}

/**
 * Event venue information
 */
export interface EventVenue {
  id: number
  event_id?: number
  name?: string
  address?: string
  type?: string
}

/**
 * Event pricing information
 */
export interface EventPrice {
  id: number
  event_id?: number
  type: string
  amount: number
  currency?: string
  deadline?: string
  description?: string
  available?: boolean
}

/**
 * Search filters for multi-style events
 */
export interface MultiStyleSearchFilters {
  query?: string
  dance_styles?: DanceStyle[]
  primary_style?: DanceStyle
  event_types?: EventType[]
  difficulty_level?: DifficultyLevel
  country?: string
  city?: string
  date_from?: string
  date_to?: string
  teachers?: string[]
  musicians?: string[]
  price_min?: number
  price_max?: number
  has_lodging?: boolean
  has_competitions?: boolean
}

/**
 * Style-specific configuration for UI theming
 */
export interface DanceStyleConfig {
  name: string
  displayName: string
  primaryColor: string
  secondaryColor: string
  accentColor: string
  icon: string
  description: string
  difficulty: DifficultyLevel[]
  commonEventTypes: EventType[]
}

/**
 * Dance style configurations for UI and branding
 */
export const DANCE_STYLE_CONFIGS: Record<DanceStyle, DanceStyleConfig> = {
  blues: {
    name: 'blues',
    displayName: 'Blues',
    primaryColor: '#1e3a8a', // navy-800
    secondaryColor: '#fbbf24', // amber-400
    accentColor: '#d97706', // amber-600
    icon: '🎺',
    description: 'Intimate partner dance with African American roots, emphasizing connection and musical interpretation',
    difficulty: ['beginner', 'intermediate', 'advanced'],
    commonEventTypes: ['workshop', 'social', 'festival']
  },
  swing: {
    name: 'swing',
    displayName: 'Swing',
    primaryColor: '#065f46', // emerald-800
    secondaryColor: '#10b981', // emerald-500
    accentColor: '#059669', // emerald-600
    icon: '🎷',
    description: 'Energetic dance style from the swing era, including Lindy Hop and Charleston',
    difficulty: ['beginner', 'intermediate', 'advanced'],
    commonEventTypes: ['workshop', 'social', 'competition', 'festival']
  },
  balboa: {
    name: 'balboa',
    displayName: 'Balboa',
    primaryColor: '#7c2d12', // orange-800
    secondaryColor: '#f59e0b', // amber-500
    accentColor: '#d97706', // amber-600
    icon: '💃',
    description: 'Elegant partner dance from California, perfect for faster tempos and crowded floors',
    difficulty: ['intermediate', 'advanced'],
    commonEventTypes: ['workshop', 'social', 'festival', 'masterclass']
  },
  shag: {
    name: 'shag',
    displayName: 'Shag',
    primaryColor: '#0f766e', // teal-700
    secondaryColor: '#14b8a6', // teal-500
    accentColor: '#0d9488', // teal-600
    icon: '🕺',
    description: 'Fast-paced partner dance from the Carolinas, known for its distinctive footwork',
    difficulty: ['intermediate', 'advanced'],
    commonEventTypes: ['workshop', 'social', 'competition']
  },
  boogie: {
    name: 'boogie',
    displayName: 'Boogie Woogie',
    primaryColor: '#6b21a8', // purple-800
    secondaryColor: '#a855f7', // purple-500
    accentColor: '#9333ea', // purple-600
    icon: '🎹',
    description: 'Energetic dance style to boogie-woogie music, emphasizing rhythm and improvisation',
    difficulty: ['beginner', 'intermediate', 'advanced'],
    commonEventTypes: ['workshop', 'social', 'festival']
  }
}

/**
 * Helper function to get style configuration
 */
export function getDanceStyleConfig(style: DanceStyle): DanceStyleConfig {
  return DANCE_STYLE_CONFIGS[style]
}

/**
 * Helper function to get all dance styles
 */
export function getAllDanceStyles(): DanceStyle[] {
  return Object.keys(DANCE_STYLE_CONFIGS) as DanceStyle[]
}

/**
 * Helper function to format dance style for display
 */
export function formatDanceStyle(style: DanceStyle): string {
  return DANCE_STYLE_CONFIGS[style]?.displayName || style
}

/**
 * Helper function to get style icon
 */
export function getDanceStyleIcon(style: DanceStyle): string {
  return DANCE_STYLE_CONFIGS[style]?.icon || '💃'
}