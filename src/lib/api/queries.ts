import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query'
import { apiClient, handleApiError, createEndpoint } from './client'
import type { Event, Teacher, Musician, User, SearchFilters } from '@/types'

/**
 * Query keys for consistent cache management
 */
export const queryKeys = {
  // Events
  events: ['events'] as const,
  event: (id: string) => ['events', id] as const,
  eventSearch: (filters: SearchFilters) => ['events', 'search', filters] as const,
  
  // Teachers
  teachers: ['teachers'] as const,
  teacher: (id: string) => ['teachers', id] as const,
  teacherSearch: (query: string) => ['teachers', 'search', query] as const,
  
  // Musicians
  musicians: ['musicians'] as const,
  musician: (id: string) => ['musicians', id] as const,
  musicianSearch: (query: string) => ['musicians', 'search', query] as const,
  
  // Users
  user: (id: string) => ['users', id] as const,
  userProfile: () => ['users', 'me'] as const,
  userFollowing: (id: string) => ['users', id, 'following'] as const,
  userFollowers: (id: string) => ['users', id, 'followers'] as const,
  
  // Dashboard
  dashboard: () => ['dashboard'] as const,
  dashboardStats: () => ['dashboard', 'stats'] as const,
  dashboardEvents: () => ['dashboard', 'events'] as const,
  dashboardUpdates: () => ['dashboard', 'updates'] as const,
  
  // Search
  searchSuggestions: (query: string) => ['search', 'suggestions', query] as const,
  savedSearches: () => ['search', 'saved'] as const,
} as const

/**
 * Hook for fetching events with pagination and filtering
 */
export const useEvents = (filters: SearchFilters = {}, options = {}) => {
  const endpoint = createEndpoint('/events', filters)
  
  return useQuery({
    queryKey: queryKeys.eventSearch(filters),
    queryFn: async () => {
      const response = await apiClient.get<{
        events: Event[]
        pagination: {
          page: number
          limit: number
          total: number
          totalPages: number
          hasNext: boolean
          hasPrev: boolean
        }
      }>(endpoint)
      return response.data
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    ...options
  })
}

/**
 * Hook for infinite scrolling events
 */
export const useInfiniteEvents = (filters: SearchFilters = {}) => {
  return useInfiniteQuery({
    queryKey: queryKeys.eventSearch(filters),
    queryFn: async ({ pageParam = 1 }) => {
      const endpoint = createEndpoint('/events', { ...filters, page: pageParam })
      const response = await apiClient.get<{
        events: Event[]
        pagination: {
          page: number
          limit: number
          total: number
          totalPages: number
          hasNext: boolean
          hasPrev: boolean
        }
      }>(endpoint)
      return response.data
    },
    getNextPageParam: (lastPage) => {
      return lastPage.pagination.hasNext ? lastPage.pagination.page + 1 : undefined
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

/**
 * Hook for fetching a single event
 */
export const useEvent = (id: string, options = {}) => {
  return useQuery({
    queryKey: queryKeys.event(id),
    queryFn: async () => {
      const response = await apiClient.get<Event>(`/events/${id}`)
      return response.data
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    ...options
  })
}

/**
 * Hook for fetching teachers
 */
export const useTeachers = (options = {}) => {
  return useQuery({
    queryKey: queryKeys.teachers,
    queryFn: async () => {
      const response = await apiClient.get<{ teachers: Teacher[] }>('/teachers')
      return response.data.teachers
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    ...options
  })
}

/**
 * Hook for fetching a single teacher
 */
export const useTeacher = (id: string, options = {}) => {
  return useQuery({
    queryKey: queryKeys.teacher(id),
    queryFn: async () => {
      const response = await apiClient.get<Teacher>(`/teachers/${id}`)
      return response.data
    },
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    ...options
  })
}

/**
 * Hook for searching teachers
 */
export const useTeacherSearch = (query: string, options = {}) => {
  return useQuery({
    queryKey: queryKeys.teacherSearch(query),
    queryFn: async () => {
      const response = await apiClient.get<{ teachers: Teacher[] }>(`/search/teachers?q=${query}`)
      return response.data.teachers
    },
    enabled: !!query && query.length > 1,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    ...options
  })
}

/**
 * Hook for fetching musicians
 */
export const useMusicians = (options = {}) => {
  return useQuery({
    queryKey: queryKeys.musicians,
    queryFn: async () => {
      const response = await apiClient.get<{ musicians: Musician[] }>('/musicians')
      return response.data.musicians
    },
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    ...options
  })
}

/**
 * Hook for fetching a single musician
 */
export const useMusician = (id: string, options = {}) => {
  return useQuery({
    queryKey: queryKeys.musician(id),
    queryFn: async () => {
      const response = await apiClient.get<Musician>(`/musicians/${id}`)
      return response.data
    },
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    ...options
  })
}

/**
 * Hook for searching musicians
 */
export const useMusicianSearch = (query: string, options = {}) => {
  return useQuery({
    queryKey: queryKeys.musicianSearch(query),
    queryFn: async () => {
      const response = await apiClient.get<{ musicians: Musician[] }>(`/search/musicians?q=${query}`)
      return response.data.musicians
    },
    enabled: !!query && query.length > 1,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    ...options
  })
}

/**
 * Hook for fetching current user profile
 */
export const useUserProfile = (options = {}) => {
  return useQuery({
    queryKey: queryKeys.userProfile(),
    queryFn: async () => {
      const response = await apiClient.get<User>('/users/me')
      return response.data
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    ...options
  })
}

/**
 * Hook for fetching user following list
 */
export const useUserFollowing = (userId: string, options = {}) => {
  return useQuery({
    queryKey: queryKeys.userFollowing(userId),
    queryFn: async () => {
      const response = await apiClient.get<{
        following: Array<Teacher | Musician>
      }>(`/users/${userId}/following`)
      return response.data.following
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    ...options
  })
}

/**
 * Hook for fetching dashboard stats
 */
export const useDashboardStats = (options = {}) => {
  return useQuery({
    queryKey: queryKeys.dashboardStats(),
    queryFn: async () => {
      const response = await apiClient.get<{
        totalEvents: number
        upcomingEvents: number
        followingCount: number
        savedEvents: number
      }>('/users/me/dashboard/stats')
      return response.data
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    ...options
  })
}

/**
 * Hook for fetching dashboard events
 */
export const useDashboardEvents = (options = {}) => {
  return useQuery({
    queryKey: queryKeys.dashboardEvents(),
    queryFn: async () => {
      const response = await apiClient.get<{
        upcomingEvents: Event[]
        followingEvents: Event[]
        recommendedEvents: Event[]
      }>('/users/me/dashboard/events')
      return response.data
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    ...options
  })
}

/**
 * Hook for fetching search suggestions
 */
export const useSearchSuggestions = (query: string, options = {}) => {
  return useQuery({
    queryKey: queryKeys.searchSuggestions(query),
    queryFn: async () => {
      const response = await apiClient.get<{
        suggestions: string[]
        events: Event[]
        teachers: Teacher[]
        musicians: Musician[]
      }>(`/search/suggestions?q=${query}`)
      return response.data
    },
    enabled: !!query && query.length > 1,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    ...options
  })
}

/**
 * Hook for fetching saved searches
 */
export const useSavedSearches = (options = {}) => {
  return useQuery({
    queryKey: queryKeys.savedSearches(),
    queryFn: async () => {
      const response = await apiClient.get<{
        savedSearches: Array<{
          id: string
          name: string
          filters: SearchFilters
          createdAt: string
        }>
      }>('/users/me/saved-searches')
      return response.data.savedSearches
    },
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    ...options
  })
}

/**
 * Mutation for following/unfollowing users
 */
export const useFollowMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ userId, action }: { userId: string; action: 'follow' | 'unfollow' }) => {
      const response = await apiClient.post(`/users/${userId}/follow`, { action })
      return response.data
    },
    onSuccess: (_, { userId }) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: queryKeys.userFollowing(userId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboardStats() })
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboardEvents() })
    },
    onError: (error) => {
      console.error('Follow mutation error:', handleApiError(error))
    }
  })
}

/**
 * Mutation for saving/unsaving events
 */
export const useSaveEventMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ eventId, action }: { eventId: string; action: 'save' | 'unsave' }) => {
      const response = await apiClient.post(`/events/${eventId}/save`, { action })
      return response.data
    },
    onSuccess: () => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboardStats() })
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboardEvents() })
    },
    onError: (error) => {
      console.error('Save event mutation error:', handleApiError(error))
    }
  })
}

/**
 * Mutation for updating user profile
 */
export const useUpdateProfileMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (profileData: Partial<User>) => {
      const response = await apiClient.patch('/users/me', profileData)
      return response.data
    },
    onSuccess: () => {
      // Invalidate user profile query
      queryClient.invalidateQueries({ queryKey: queryKeys.userProfile() })
    },
    onError: (error) => {
      console.error('Update profile mutation error:', handleApiError(error))
    }
  })
}

/**
 * Mutation for saving searches
 */
export const useSaveSearchMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ name, filters }: { name: string; filters: SearchFilters }) => {
      const response = await apiClient.post('/users/me/saved-searches', { name, filters })
      return response.data
    },
    onSuccess: () => {
      // Invalidate saved searches query
      queryClient.invalidateQueries({ queryKey: queryKeys.savedSearches() })
    },
    onError: (error) => {
      console.error('Save search mutation error:', handleApiError(error))
    }
  })
}