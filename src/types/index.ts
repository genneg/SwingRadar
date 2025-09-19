// Core types for Blues Dance Festival Finder - Updated to match database schema

export interface User {
  id: string
  email: string
  name: string
  image?: string
  createdAt: Date
  updatedAt: Date
}

export interface Festival {
  id: number | string // Support both for compatibility
  name: string
  description?: string
  startDate: Date | string
  endDate: Date | string
  registrationDeadline?: Date | string
  website?: string
  image?: string
  imageUrl?: string  // Added to match InternalEvent from adapter
  venue?: Venue | null
  teachers: Teacher[]
  musicians: Musician[]
  prices?: Price[]
  createdAt: Date | string
  updatedAt: Date | string
  // Database-specific fields
  from_date?: Date | string
  to_date?: Date | string
  city?: string
  country?: string
  style?: string
  image_url?: string
}

// Alias for Event
export interface Event extends Festival {}

export interface Venue {
  id: number | string
  name?: string | null
  address?: string | null
  type?: string | null
  // Support legacy fields for compatibility
  city?: string
  country?: string
  latitude?: number
  longitude?: number
}

export interface Teacher {
  id: number | string
  name: string
  bio?: string | null
  website?: string | null
  image_url?: string | null
  specialties?: string[] // Made optional for compatibility
  socialLinks?: SocialLinks
  followers?: User[] // Made optional for compatibility
  festivals?: Festival[] // Made optional for compatibility
  // Optional fields for backward compatibility
  ai_bio_summary?: string | null
  ai_relevance_score?: number | null
}

export interface Musician {
  id: number | string
  name: string
  slug?: string
  bio?: string | null
  avatar?: string | null
  verified?: boolean | null
  instruments?: string[]
  yearsActive?: number | null
  website?: string | null
  email?: string | null
  followerCount?: number | null
  eventCount?: number | null
  createdAt?: Date | string | null
  updatedAt?: Date | string | null
  image_url?: string | null
  // Legacy fields for compatibility
  genre?: string[]
  socialLinks?: SocialLinks
  followers?: User[]
  festivals?: Festival[]
}

export interface Price {
  id: string
  category: string
  amount: number
  currency: string
  description?: string
}

export interface SocialLinks {
  facebook?: string
  instagram?: string
  youtube?: string
  spotify?: string
}

export interface Following {
  id: string
  userId: string
  targetId: string
  targetType: 'teacher' | 'musician' | 'festival'
  createdAt: Date
}

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
}

export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
  error?: string
  details?: any
  timestamp: string
}