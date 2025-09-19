'use client'

import { useState } from 'react'

import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

interface FollowButtonProps {
  targetType: 'teacher' | 'musician' | 'event' | 'venue'
  targetId: string
  initialFollowing?: boolean
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'outline' | 'ghost'
  className?: string
  onFollowChange?: (following: boolean) => void
}

export function FollowButton({
  targetType,
  targetId,
  initialFollowing = false,
  size = 'md',
  variant = 'default',
  className,
  onFollowChange
}: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialFollowing)
  const [isLoading, setIsLoading] = useState(false)

  const handleToggleFollow = async () => {
    setIsLoading(true)
    
    try {
      // TODO: Replace with actual API call
      const response = await fetch(`/api/follow/${targetType}/${targetId}`, {
        method: isFollowing ? 'DELETE' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const newFollowingState = !isFollowing
        setIsFollowing(newFollowingState)
        onFollowChange?.(newFollowingState)
      } else {
        // Handle error - could show toast notification
        console.error('Failed to toggle follow status')
      }
    } catch (error) {
      console.error('Error toggling follow:', error)
      // Handle error - could show toast notification
    } finally {
      setIsLoading(false)
    }
  }

  const getButtonText = () => {
    if (isLoading) {
return 'Loading...'
}
    
    switch (targetType) {
      case 'teacher':
        return isFollowing ? 'Following Teacher' : 'Follow Teacher'
      case 'musician':
        return isFollowing ? 'Following Musician' : 'Follow Musician'
      case 'event':
        return isFollowing ? 'Following Event' : 'Follow Event'
      case 'venue':
        return isFollowing ? 'Following Venue' : 'Follow Venue'
      default:
        return isFollowing ? 'Following' : 'Follow'
    }
  }

  const getButtonVariant = () => {
    if (variant !== 'default') {
return variant
}
    return isFollowing ? 'outline' : 'primary'
  }

  const getIcon = () => {
    if (isFollowing) {
      return (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      )
    }

    return (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    )
  }

  return (
    <Button
      variant={getButtonVariant()}
      size={size}
      loading={isLoading}
      onClick={handleToggleFollow}
      className={cn(
        'flex items-center space-x-2 transition-all',
        isFollowing && 'hover:bg-red-50 hover:text-red-600 hover:border-red-300',
        className
      )}
    >
      {!isLoading && getIcon()}
      <span className={size === 'sm' && (targetType === 'event' || targetType === 'venue') ? 'hidden sm:inline' : ''}>
        {size === 'sm' && !isLoading && (targetType === 'event' || targetType === 'venue') ? (isFollowing ? 'Following' : 'Follow') : getButtonText()}
      </span>
    </Button>
  )
}

// Convenience components for specific types
export function FollowTeacherButton(props: Omit<FollowButtonProps, 'targetType'>) {
  return <FollowButton {...props} targetType="teacher" />
}

export function FollowMusicianButton(props: Omit<FollowButtonProps, 'targetType'>) {
  return <FollowButton {...props} targetType="musician" />
}

export function FollowEventButton(props: Omit<FollowButtonProps, 'targetType'>) {
  return <FollowButton {...props} targetType="event" />
}