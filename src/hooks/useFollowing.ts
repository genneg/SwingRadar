'use client'

import { useState, useCallback } from 'react'

interface FollowingState {
  following: Set<string>
  loading: Set<string>
  error: string | null
}

/**
 * Custom hook for managing following relationships
 */
export function useFollowing() {
  const [state, setState] = useState<FollowingState>({
    following: new Set(),
    loading: new Set(),
    error: null
  })

  const isFollowing = useCallback((targetType: string, targetId: string) => {
    return state.following.has(`${targetType}:${targetId}`)
  }, [state.following])

  const isLoading = useCallback((targetType: string, targetId: string) => {
    return state.loading.has(`${targetType}:${targetId}`)
  }, [state.loading])

  const toggleFollow = useCallback(async (targetType: string, targetId: string) => {
    const key = `${targetType}:${targetId}`
    const wasFollowing = state.following.has(key)
    
    // Add to loading set
    setState(prev => ({
      ...prev,
      loading: new Set([...prev.loading, key]),
      error: null
    }))

    try {
      // TODO: Replace with actual API call
      const response = await fetch(`/api/follow/${targetType}/${targetId}`, {
        method: wasFollowing ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' }
      })

      if (!response.ok) {
        throw new Error(`Failed to ${wasFollowing ? 'unfollow' : 'follow'} ${targetType}`)
      }

      // Update following state
      setState(prev => {
        const newFollowing = new Set(prev.following)
        const newLoading = new Set(prev.loading)
        
        if (wasFollowing) {
          newFollowing.delete(key)
        } else {
          newFollowing.add(key)
        }
        
        newLoading.delete(key)
        
        return {
          following: newFollowing,
          loading: newLoading,
          error: null
        }
      })

      return { success: true, following: !wasFollowing }

    } catch (error) {
      // Remove from loading and set error
      setState(prev => {
        const newLoading = new Set(prev.loading)
        newLoading.delete(key)
        
        return {
          ...prev,
          loading: newLoading,
          error: error instanceof Error ? error.message : 'Follow operation failed'
        }
      })

      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Follow operation failed' 
      }
    }
  }, [state.following])

  const followTeacher = useCallback((teacherId: string) => {
    return toggleFollow('teacher', teacherId)
  }, [toggleFollow])

  const followMusician = useCallback((musicianId: string) => {
    return toggleFollow('musician', musicianId)
  }, [toggleFollow])

  const followEvent = useCallback((eventId: string) => {
    return toggleFollow('event', eventId)
  }, [toggleFollow])

  const loadFollowing = useCallback(async () => {
    setState(prev => ({ ...prev, loading: new Set(['initial']), error: null }))

    try {
      // TODO: Replace with actual API call
      const response = await fetch('/api/user/following')
      
      if (!response.ok) {
        throw new Error('Failed to load following data')
      }

      const data = await response.json()
      const followingSet = new Set<string>()
      
      // Convert API response to Set format
      data.following?.forEach((item: any) => {
        followingSet.add(`${item.targetType}:${item.targetId}`)
      })

      setState({
        following: followingSet,
        loading: new Set(),
        error: null
      })

    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: new Set(),
        error: error instanceof Error ? error.message : 'Failed to load following data'
      }))
    }
  }, [])

  const getFollowingList = useCallback((targetType?: string) => {
    const followingArray: string[] = []
    state.following.forEach(key => followingArray.push(key))
    
    const following = followingArray
      .filter(key => !targetType || key.startsWith(`${targetType}:`))
      .map(key => {
        const [type, id] = key.split(':')
        return { targetType: type, targetId: id }
      })
    
    return following
  }, [state.following])

  return {
    following: state.following,
    error: state.error,
    isFollowing,
    isLoading,
    toggleFollow,
    followTeacher,
    followMusician,
    followEvent,
    loadFollowing,
    getFollowingList
  }
}