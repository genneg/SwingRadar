'use client'

import { useState, useEffect } from 'react'
import { Heart, Users, Music, Calendar, Bell, BellOff } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

interface FollowingStatusProps {
  targetId: string
  targetType: 'teacher' | 'musician' | 'festival'
  targetName: string
  followersCount?: number
  isFollowing?: boolean
  hasNotifications?: boolean
  compact?: boolean
  showFollowersCount?: boolean
  showNotificationToggle?: boolean
  className?: string
  onFollowChange?: (following: boolean) => void
  onNotificationChange?: (enabled: boolean) => void
}

export function FollowingStatus({
  targetId,
  targetType,
  targetName,
  followersCount,
  isFollowing = false,
  hasNotifications = false,
  compact = false,
  showFollowersCount = true,
  showNotificationToggle = true,
  className,
  onFollowChange,
  onNotificationChange
}: FollowingStatusProps) {
  const [following, setFollowing] = useState(isFollowing)
  const [notifications, setNotifications] = useState(hasNotifications)
  const [followerCount, setFollowerCount] = useState(followersCount || 0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setFollowing(isFollowing)
    setNotifications(hasNotifications)
    setFollowerCount(followersCount || 0)
  }, [isFollowing, hasNotifications, followersCount])

  const handleToggleFollow = async () => {
    setLoading(true)
    
    try {
      const response = await fetch(`/api/users/me/follow`, {
        method: following ? 'DELETE' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          targetId,
          targetType
        })
      })

      if (response.ok) {
        const newFollowingState = !following
        setFollowing(newFollowingState)
        
        // Update follower count
        setFollowerCount(prev => newFollowingState ? prev + 1 : prev - 1)
        
        // If unfollowing, also disable notifications
        if (!newFollowingState) {
          setNotifications(false)
        }
        
        onFollowChange?.(newFollowingState)
      }
    } catch (error) {
      console.error('Error toggling follow:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleNotifications = async () => {
    if (!following) return
    
    try {
      const response = await fetch(`/api/users/me/notifications`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          targetId,
          targetType,
          enabled: !notifications
        })
      })

      if (response.ok) {
        const newNotificationState = !notifications
        setNotifications(newNotificationState)
        onNotificationChange?.(newNotificationState)
      }
    } catch (error) {
      console.error('Error toggling notifications:', error)
    }
  }

  const getTypeIcon = () => {
    switch (targetType) {
      case 'teacher':
        return <Users className="w-4 h-4" />
      case 'musician':
        return <Music className="w-4 h-4" />
      case 'festival':
        return <Calendar className="w-4 h-4" />
      default:
        return <Heart className="w-4 h-4" />
    }
  }

  const getTypeColor = () => {
    switch (targetType) {
      case 'teacher':
        return 'blue'
      case 'musician':
        return 'purple'
      case 'festival':
        return 'green'
      default:
        return 'gray'
    }
  }

  const formatFollowersCount = (count: number) => {
    if (count < 1000) return count.toString()
    if (count < 1000000) return `${(count / 1000).toFixed(1)}k`
    return `${(count / 1000000).toFixed(1)}m`
  }

  if (compact) {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        {following && (
          <div className="flex items-center gap-1">
            <Heart className="w-4 h-4 text-red-500 fill-current" />
            <span className="text-sm text-gray-600">Following</span>
          </div>
        )}
        
        {showFollowersCount && followerCount > 0 && (
          <div className="flex items-center gap-1">
            {getTypeIcon()}
            <span className="text-sm text-gray-600">
              {formatFollowersCount(followerCount)}
            </span>
          </div>
        )}
        
        {following && notifications && showNotificationToggle && (
          <Bell className="w-4 h-4 text-blue-500" />
        )}
      </div>
    )
  }

  return (
    <div className={cn('space-y-3', className)}>
      {/* Following status */}
      <div className="flex items-center gap-3">
        <Badge 
          className={cn(
            'text-xs',
            following 
              ? `bg-${getTypeColor()}-100 text-${getTypeColor()}-800` 
              : 'bg-gray-100 text-gray-800'
          )}
        >
          {getTypeIcon()}
          <span className="ml-1">
            {following ? `Following ${targetType}` : `Not following`}
          </span>
        </Badge>
        
        {showFollowersCount && (
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <Heart className="w-4 h-4" />
            <span>{formatFollowersCount(followerCount)} followers</span>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2">
        <Button
          variant={following ? 'outline' : 'primary'}
          size="sm"
          onClick={handleToggleFollow}
          loading={loading}
          className={cn(
            'flex items-center gap-2',
            following && 'hover:bg-red-50 hover:text-red-600 hover:border-red-300'
          )}
        >
          <Heart className={cn('w-4 h-4', following && 'fill-current')} />
          {following ? 'Unfollow' : 'Follow'}
        </Button>
        
        {following && showNotificationToggle && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleToggleNotifications}
            className={cn(
              'flex items-center gap-2',
              notifications 
                ? 'text-blue-600 border-blue-300 bg-blue-50' 
                : 'text-gray-600'
            )}
          >
            {notifications ? (
              <Bell className="w-4 h-4" />
            ) : (
              <BellOff className="w-4 h-4" />
            )}
            Notifications
          </Button>
        )}
      </div>

      {/* Status message */}
      {following && (
        <p className="text-sm text-gray-600">
          {notifications 
            ? `You'll receive notifications about ${targetName}'s updates`
            : `You're following ${targetName} but notifications are disabled`
          }
        </p>
      )}
    </div>
  )
}

// Specialized components for different types
export function TeacherFollowingStatus(props: Omit<FollowingStatusProps, 'targetType'>) {
  return <FollowingStatus {...props} targetType="teacher" />
}

export function MusicianFollowingStatus(props: Omit<FollowingStatusProps, 'targetType'>) {
  return <FollowingStatus {...props} targetType="musician" />
}

export function FestivalFollowingStatus(props: Omit<FollowingStatusProps, 'targetType'>) {
  return <FollowingStatus {...props} targetType="festival" />
}