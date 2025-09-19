import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

interface UserProfile {
  id: string
  name: string
  email: string
  avatar?: string
  verified: boolean
  createdAt: string
  updatedAt: string
  preferences?: UserPreferences
  stats: {
    following: number
    savedEvents: number
    reviews: number
    createdEvents: number
    unreadNotifications?: number
  }
  recentActivity: {
    savedEvents: Array<{
      createdAt: string
      event: {
        id: string
        name: string
        slug: string
        startDate: string
        imageUrl?: string
        venue?: {
          city: string
          country: string
        }
      }
    }>
    following: Array<{
      type: 'teacher' | 'musician'
      id: string
      name: string
      slug: string
      avatar?: string
      verified: boolean
      followedAt: string
    }>
    reviews: Array<{
      id: string
      rating: number
      review: string
      createdAt: string
      event: {
        id: string
        name: string
        slug: string
      }
    }>
  }
  notifications?: Array<{
    id: string
    type: string
    title: string
    message: string
    data: any
    read: boolean
    createdAt: string
  }>
}

interface UserPreferences {
  id: string
  emailNotifications: boolean
  pushNotifications: boolean
  newEventNotifications: boolean
  deadlineReminders: boolean
  weeklyDigest: boolean
  followingUpdates: boolean
  defaultCountry?: string
  defaultCity?: string
  searchRadius?: number
  theme: 'light' | 'dark' | 'auto'
  language: string
  timezone?: string
  createdAt: string
  updatedAt: string
}

interface UpdateProfileData {
  name?: string
  email?: string
  avatar?: string
  bio?: string
}

interface ChangePasswordData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export function useProfile(userId?: string) {
  const { data: session, update: updateSession } = useSession()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Use session user ID if no userId provided
  const targetUserId = userId || session?.user?.id

  const fetchProfile = async () => {
    if (!targetUserId) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      const endpoint = targetUserId === session?.user?.id ? '/api/users/me' : `/api/users/${targetUserId}`
      const response = await fetch(endpoint)
      const data = await response.json()

      if (data.success) {
        setProfile(data.data)
      } else {
        setError(data.error || 'Failed to load profile')
      }
    } catch (error) {
      setError('An error occurred while loading profile')
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (updateData: UpdateProfileData) => {
    if (!targetUserId) throw new Error('No user ID available')

    const response = await fetch(`/api/users/${targetUserId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData),
    })

    const data = await response.json()

    if (data.success) {
      // Update session if it's the current user
      if (targetUserId === session?.user?.id) {
        await updateSession({
          ...session?.user,
          name: updateData.name || session?.user?.name,
          email: updateData.email || session?.user?.email,
          image: updateData.avatar || session?.user?.image,
        })
      }
      
      // Refresh profile data
      await fetchProfile()
      return data.data
    } else {
      throw new Error(data.error || 'Failed to update profile')
    }
  }

  const changePassword = async (passwordData: ChangePasswordData) => {
    if (!targetUserId) throw new Error('No user ID available')

    const response = await fetch(`/api/users/${targetUserId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(passwordData),
    })

    const data = await response.json()

    if (data.success) {
      return data
    } else {
      throw new Error(data.error || 'Failed to change password')
    }
  }

  const updatePreferences = async (preferences: Partial<UserPreferences>) => {
    if (!targetUserId) throw new Error('No user ID available')

    const response = await fetch(`/api/users/${targetUserId}/preferences`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(preferences),
    })

    const data = await response.json()

    if (data.success) {
      // Refresh profile data to get updated preferences
      await fetchProfile()
      return data.data
    } else {
      throw new Error(data.error || 'Failed to update preferences')
    }
  }

  const deleteAccount = async () => {
    if (!targetUserId) throw new Error('No user ID available')

    const response = await fetch(`/api/users/${targetUserId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ confirmation: 'DELETE' }),
    })

    const data = await response.json()

    if (data.success) {
      return data
    } else {
      throw new Error(data.error || 'Failed to delete account')
    }
  }

  const refreshProfile = () => {
    fetchProfile()
  }

  // Load profile data when component mounts or userId changes
  useEffect(() => {
    fetchProfile()
  }, [targetUserId])

  return {
    profile,
    loading,
    error,
    isOwnProfile: targetUserId === session?.user?.id,
    updateProfile,
    changePassword,
    updatePreferences,
    deleteAccount,
    refreshProfile,
  }
}