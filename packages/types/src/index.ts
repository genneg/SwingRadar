// Shared TypeScript types and interfaces

// Core Entity Types
export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  preferences?: UserPreferences
  createdAt: Date
  updatedAt: Date
}

export interface UserPreferences {
  notifications: {
    email: boolean
    push: boolean
    newEvents: boolean
    deadlines: boolean
    weeklyDigest: boolean
  }
  location?: {
    country: string
    city: string
    radius: number // in km
  }
}

export interface Event {
  id: string
  name: string
  description: string
  startDate: Date
  endDate: Date
  registrationDeadline?: Date
  venue: Venue
  teachers: Teacher[]
  musicians: Musician[]
  prices: EventPrice[]
  tags: string[]
  website?: string
  registrationUrl?: string
  createdAt: Date
  updatedAt: Date
}

export interface Venue {
  id: string
  name: string
  address: string
  city: string
  country: string
  latitude: number
  longitude: number
  website?: string
}

export interface Teacher {
  id: string
  name: string
  bio?: string
  avatar?: string
  specialties: string[]
  website?: string
  socialMedia: SocialMediaLinks
  followerCount: number
}

export interface Musician {
  id: string
  name: string
  bio?: string
  avatar?: string
  genre: string[]
  website?: string
  socialMedia: SocialMediaLinks
  followerCount: number
}

export interface EventPrice {
  type: 'early_bird' | 'regular' | 'late' | 'student' | 'local'
  amount: number
  currency: string
  deadline?: Date
  description?: string
}

export interface SocialMediaLinks {
  facebook?: string
  instagram?: string
  youtube?: string
  website?: string
}

// API Response Types
export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
  error?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Search and Filter Types
export interface SearchFilters {
  query?: string
  dateRange?: {
    start: Date
    end: Date
  }
  location?: {
    city?: string
    country?: string
    radius?: number
    coordinates?: {
      lat: number
      lng: number
    }
  }
  teachers?: string[]
  musicians?: string[]
  priceRange?: {
    min: number
    max: number
  }
  tags?: string[]
}

export interface SortOptions {
  field: 'date' | 'name' | 'price' | 'distance' | 'relevance'
  direction: 'asc' | 'desc'
}

// Following System Types
export interface Following {
  id: string
  userId: string
  targetType: 'teacher' | 'musician' | 'event' | 'venue'
  targetId: string
  createdAt: Date
}

// Notification Types
export interface Notification {
  id: string
  userId: string
  type: 'new_event' | 'deadline_reminder' | 'followed_update'
  title: string
  message: string
  read: boolean
  data?: Record<string, any>
  createdAt: Date
}