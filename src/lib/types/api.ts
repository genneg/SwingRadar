// API Response Types for SwingRadar Multi-Style Platform

import { MultiStyleEvent, MultiStyleTeacher, MultiStyleMusician, MultiStyleSearchFilters, DanceStyle, EventType, DifficultyLevel } from './dance'

/**
 * Base API response structure
 */
export interface ApiResponse<T = unknown> {
  success: boolean
  data: T
  message?: string
  error?: string
  meta?: {
    total?: number
    page?: number
    limit?: number
    totalPages?: number
  }
}

/**
 * Error response structure
 */
export interface ApiError {
  success: false
  error: string
  message?: string
  statusCode?: number
}

/**
 * Paginated response structure
 */
export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

/**
 * Events API responses
 */
export interface EventsResponse {
  events: MultiStyleEvent[]
  total: number
  filters?: MultiStyleSearchFilters
  searchType?: 'basic' | 'advanced' | 'optimized'
}

export interface EventResponse {
  event: MultiStyleEvent
}

/**
 * Teachers API responses
 */
export interface TeachersResponse {
  teachers: MultiStyleTeacher[]
  total: number
  filters?: {
    specializations?: DanceStyle[]
    experience_level?: string
    country?: string
    search?: string
  }
}

export interface TeacherResponse {
  teacher: MultiStyleTeacher
  upcomingEvents?: MultiStyleEvent[]
  stats?: {
    totalEvents: number
    followerCount: number
    averageRating?: number
  }
}

/**
 * Musicians API responses
 */
export interface MusiciansResponse {
  musicians: MultiStyleMusician[]
  total: number
  filters?: {
    music_genres?: string[]
    instruments?: string[]
    country?: string
    search?: string
  }
}

export interface MusicianResponse {
  musician: MultiStyleMusician
  upcomingEvents?: MultiStyleEvent[]
  stats?: {
    totalEvents: number
    followerCount: number
    averageRating?: number
  }
}

/**
 * Search API request/response types
 */
export interface SearchRequest extends MultiStyleSearchFilters {
  page?: number
  limit?: number
  sort?: 'date' | 'name' | 'relevance' | 'popularity'
  order?: 'asc' | 'desc'
}

export interface SearchResponse {
  events: MultiStyleEvent[]
  teachers: MultiStyleTeacher[]
  musicians: MultiStyleMusician[]
  total: number
  breakdown: {
    events: number
    teachers: number
    musicians: number
  }
  suggestions?: string[]
  filters: MultiStyleSearchFilters
}

/**
 * Stats and analytics types
 */
export interface PlatformStats {
  totalEvents: number
  totalTeachers: number
  totalMusicians: number
  totalUsers: number
  eventsByStyle: Record<DanceStyle, number>
  eventsByType: Record<EventType, number>
  eventsByCountry: Record<string, number>
  upcomingEvents: number
  growth: {
    eventsThisMonth: number
    teachersThisMonth: number
    musiciansThisMonth: number
  }
}

/**
 * User following/tracking types
 */
export interface FollowingStats {
  followedTeachers: number
  followedMusicians: number
  followedEvents: number
  notifications: number
}

export interface NotificationResponse {
  notifications: Array<{
    id: number
    type: 'event' | 'teacher' | 'musician' | 'system'
    title: string
    message: string
    read: boolean
    created_at: string
    related_id?: number
    dance_styles?: DanceStyle[]
  }>
  unreadCount: number
}

/**
 * Filter suggestions and auto-complete
 */
export interface FilterSuggestions {
  locations: Array<{
    city: string
    country: string
    eventCount: number
  }>
  teachers: Array<{
    id: number
    name: string
    specializations: DanceStyle[]
    eventCount: number
  }>
  musicians: Array<{
    id: number
    name: string
    genres: string[]
    eventCount: number
  }>
  styles: Array<{
    style: DanceStyle
    eventCount: number
    teacherCount: number
  }>
}

/**
 * Style-specific statistics
 */
export interface StyleStats {
  style: DanceStyle
  totalEvents: number
  totalTeachers: number
  totalMusicians: number
  popularCountries: string[]
  averageEventDuration: number
  upcomingEvents: number
  growthRate: number
}

/**
 * Export API wrapper types
 */
export type ApiEventResponse = ApiResponse<EventsResponse>
export type ApiTeacherResponse = ApiResponse<TeachersResponse>
export type ApiMusicianResponse = ApiResponse<MusiciansResponse>
export type ApiSearchResponse = ApiResponse<SearchResponse>
export type ApiStatsResponse = ApiResponse<PlatformStats>
export type ApiNotificationResponse = ApiResponse<NotificationResponse>
export type ApiFilterSuggestionsResponse = ApiResponse<FilterSuggestions>

/**
 * Utility type for API endpoints
 */
export type ApiEndpoint =
  | '/api/events'
  | '/api/events/[id]'
  | '/api/teachers'
  | '/api/teachers/[id]'
  | '/api/musicians'
  | '/api/musicians/[id]'
  | '/api/search'
  | '/api/search/events'
  | '/api/search/teachers'
  | '/api/search/musicians'
  | '/api/stats'
  | '/api/notifications'
  | '/api/filters/suggestions'
  | '/api/user/following'