'use client'

import { useEffect, useState } from 'react'
import { Heart, BookOpen, MessageCircle, Calendar } from 'lucide-react'

import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

interface ProfileStatsProps {
  userId: string
}

interface Stats {
  following: number
  savedEvents: number
  reviews: number
  createdEvents: number
  unreadNotifications: number
}

export function ProfileStats({ userId }: ProfileStatsProps) {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`/api/users/${userId}`)
        const data = await response.json()
        
        if (data.success) {
          setStats(data.data.stats)
        }
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [userId])

  if (loading) {
    return (
      <div className="p-6 flex justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="p-6 text-center text-gray-500">
        Unable to load statistics
      </div>
    )
  }

  const statItems = [
    {
      label: 'Following',
      value: stats.following,
      icon: Heart,
      color: 'text-red-500',
      bgColor: 'bg-red-50',
    },
    {
      label: 'Saved Events',
      value: stats.savedEvents,
      icon: BookOpen,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'Reviews',
      value: stats.reviews,
      icon: MessageCircle,
      color: 'text-green-500',
      bgColor: 'bg-green-50',
    },
    {
      label: 'Created Events',
      value: stats.createdEvents,
      icon: Calendar,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
    },
  ]

  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statItems.map((item) => {
          const Icon = item.icon
          return (
            <div
              key={item.label}
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className={`w-10 h-10 rounded-full ${item.bgColor} flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${item.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{item.value}</p>
                <p className="text-sm text-gray-600">{item.label}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Unread Notifications Badge */}
      {stats.unreadNotifications > 0 && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
            <span className="text-sm text-yellow-800">
              You have {stats.unreadNotifications} unread notification{stats.unreadNotifications > 1 ? 's' : ''}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}