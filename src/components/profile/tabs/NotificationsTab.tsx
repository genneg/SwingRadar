'use client'

import { useEffect, useState } from 'react'
import { Bell, Check, CheckCheck, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

interface NotificationsTabProps {
  userId: string
}

interface Notification {
  id: string
  type: string
  title: string
  message: string
  data: any
  read: boolean
  createdAt: string
}

export function NotificationsTab({ userId }: NotificationsTabProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    fetchNotifications()
  }, [userId])

  const fetchNotifications = async () => {
    try {
      const response = await fetch(`/api/users/${userId}/notifications`)
      const data = await response.json()
      
      if (data.success) {
        setNotifications(data.data.notifications || [])
      } else {
        setError(data.error || 'Failed to load notifications')
      }
    } catch (error) {
      setError('An error occurred while loading notifications')
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (notificationIds: string[]) => {
    setActionLoading('markRead')
    
    try {
      const response = await fetch(`/api/users/${userId}/notifications`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notificationIds }),
      })

      const data = await response.json()

      if (data.success) {
        setNotifications(prev => 
          prev.map(notif => 
            notificationIds.includes(notif.id) 
              ? { ...notif, read: true }
              : notif
          )
        )
      } else {
        setError(data.error || 'Failed to mark notifications as read')
      }
    } catch (error) {
      setError('An error occurred while updating notifications')
    } finally {
      setActionLoading(null)
    }
  }

  const markAllAsRead = async () => {
    setActionLoading('markAllRead')
    
    try {
      const response = await fetch(`/api/users/${userId}/notifications`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ all: true }),
      })

      const data = await response.json()

      if (data.success) {
        setNotifications(prev => 
          prev.map(notif => ({ ...notif, read: true }))
        )
      } else {
        setError(data.error || 'Failed to mark all notifications as read')
      }
    } catch (error) {
      setError('An error occurred while updating notifications')
    } finally {
      setActionLoading(null)
    }
  }

  const deleteNotifications = async (notificationIds: string[]) => {
    setActionLoading('delete')
    
    try {
      const response = await fetch(`/api/users/${userId}/notifications`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notificationIds }),
      })

      const data = await response.json()

      if (data.success) {
        setNotifications(prev => 
          prev.filter(notif => !notificationIds.includes(notif.id))
        )
      } else {
        setError(data.error || 'Failed to delete notifications')
      }
    } catch (error) {
      setError('An error occurred while deleting notifications')
    } finally {
      setActionLoading(null)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'NEW_EVENT':
        return '🎉'
      case 'DEADLINE_REMINDER':
        return '⏰'
      case 'FOLLOWED_UPDATE':
        return '👤'
      case 'EVENT_CANCELLED':
        return '❌'
      case 'EVENT_UPDATED':
        return '✏️'
      case 'WEEKLY_DIGEST':
        return '📅'
      default:
        return '🔔'
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">{error}</p>
      </div>
    )
  }

  if (notifications.length === 0) {
    return (
      <div className="text-center py-8">
        <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">No notifications yet</p>
        <p className="text-sm text-gray-400 mt-2">
          You'll see notifications about events and updates here
        </p>
      </div>
    )
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">
          Notifications ({notifications.length})
          {unreadCount > 0 && (
            <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
              {unreadCount} unread
            </span>
          )}
        </h3>
        
        {unreadCount > 0 && (
          <Button
            size="sm"
            variant="outline"
            onClick={markAllAsRead}
            disabled={actionLoading === 'markAllRead'}
            className="flex items-center"
          >
            {actionLoading === 'markAllRead' ? (
              <LoadingSpinner size="sm" className="mr-2" />
            ) : (
              <CheckCheck className="w-4 h-4 mr-2" />
            )}
            Mark all read
          </Button>
        )}
      </div>

      <div className="space-y-2">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 border rounded-lg transition-colors ${
              notification.read
                ? 'bg-gray-50 border-gray-200'
                : 'bg-blue-50 border-blue-200'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className="text-lg">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <h4 className="text-sm font-medium text-gray-900">
                      {notification.title}
                    </h4>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    {formatDate(notification.createdAt)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {!notification.read && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => markAsRead([notification.id])}
                    disabled={actionLoading === 'markRead'}
                    className="flex items-center"
                  >
                    <Check className="w-4 h-4" />
                  </Button>
                )}
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => deleteNotifications([notification.id])}
                  disabled={actionLoading === 'delete'}
                  className="flex items-center text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}