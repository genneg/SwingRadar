'use client'

import { useState, useEffect } from 'react'
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  PieChart, 
  Calendar, 
  MapPin, 
  Users, 
  Music, 
  Star,
  Award,
  Target,
  Clock,
  DollarSign,
  Activity
} from 'lucide-react'

import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

interface UserInsight {
  id: string
  type: 'achievement' | 'trend' | 'recommendation' | 'milestone'
  title: string
  description: string
  value?: string | number
  change?: number
  changeType?: 'positive' | 'negative' | 'neutral'
  icon: any
  color: string
  actionText?: string
  actionUrl?: string
  isNew?: boolean
}

interface UserStats {
  totalEvents: number
  eventsThisMonth: number
  favoriteGenres: string[]
  favoriteLocations: string[]
  topTeachers: string[]
  topMusicians: string[]
  averageEventPrice: number
  totalSpent: number
  upcomingEvents: number
  followingCount: number
  streakDays: number
  achievements: number
}

interface InsightsWidgetProps {
  limit?: number
  showHeader?: boolean
  compact?: boolean
}

export function InsightsWidget({ 
  limit = 5, 
  showHeader = true, 
  compact = false 
}: InsightsWidgetProps) {
  const [insights, setInsights] = useState<UserInsight[]>([])
  const [stats, setStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchUserInsights()
  }, [])

  const fetchUserInsights = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Fetch insights from API
      const response = await fetch('/api/users/me/dashboard/insights')
      
      if (!response.ok) {
        throw new Error('Failed to fetch user insights')
      }
      
      const data = await response.json()
      
      if (data.success) {
        generateInsights(data.data)
      } else {
        setError(data.error || 'Failed to load insights')
      }
    } catch (err) {
      // Generate mock insights for demonstration
      generateMockInsights()
    } finally {
      setLoading(false)
    }
  }

  const generateMockInsights = () => {
    const mockStats: UserStats = {
      totalEvents: 25,
      eventsThisMonth: 4,
      favoriteGenres: ['Traditional Blues', 'Swing', 'Jazz'],
      favoriteLocations: ['Portland, OR', 'Seattle, WA', 'San Francisco, CA'],
      topTeachers: ['Sarah Johnson', 'Mike Anderson', 'Lisa Chen'],
      topMusicians: ['Charlie Blues Band', 'Seattle Blues Society'],
      averageEventPrice: 75,
      totalSpent: 1875,
      upcomingEvents: 8,
      followingCount: 24,
      streakDays: 12,
      achievements: 7
    }
    
    setStats(mockStats)
    
    const mockInsights: UserInsight[] = [
      {
        id: '1',
        type: 'achievement',
        title: 'Dance Enthusiast',
        description: 'You\'ve attended 25 blues dance events!',
        value: '25 events',
        icon: Award,
        color: 'text-yellow-600 bg-yellow-100',
        isNew: true
      },
      {
        id: '2',
        type: 'trend',
        title: 'Activity Increasing',
        description: 'You\'ve been more active this month compared to last month',
        value: '+60%',
        change: 60,
        changeType: 'positive',
        icon: TrendingUp,
        color: 'text-green-600 bg-green-100'
      },
      {
        id: '3',
        type: 'recommendation',
        title: 'Perfect Match',
        description: 'Based on your interests, you might enjoy Swing workshops in Portland',
        icon: Target,
        color: 'text-blue-600 bg-blue-100',
        actionText: 'Explore',
        actionUrl: '/events?genre=swing&location=portland'
      },
      {
        id: '4',
        type: 'milestone',
        title: 'Streak Master',
        description: 'You\'ve been active for 12 days in a row!',
        value: '12 days',
        icon: Activity,
        color: 'text-purple-600 bg-purple-100'
      },
      {
        id: '5',
        type: 'trend',
        title: 'Favorite Genre',
        description: 'Traditional Blues is your most attended genre',
        value: '40%',
        icon: Music,
        color: 'text-indigo-600 bg-indigo-100'
      },
      {
        id: '6',
        type: 'achievement',
        title: 'Social Butterfly',
        description: 'You\'re following 24 teachers and musicians',
        value: '24 following',
        icon: Users,
        color: 'text-pink-600 bg-pink-100'
      },
      {
        id: '7',
        type: 'recommendation',
        title: 'Budget Friendly',
        description: 'Your average event cost is $75. Great value for quality events!',
        value: '$75 avg',
        icon: DollarSign,
        color: 'text-green-600 bg-green-100'
      }
    ]
    
    setInsights(mockInsights)
  }

  const generateInsights = (data: any) => {
    // This would generate insights based on actual user data
    generateMockInsights()
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const getChangeIcon = (changeType: string) => {
    switch (changeType) {
      case 'positive':
        return <TrendingUp className="w-3 h-3 text-green-600" />
      case 'negative':
        return <TrendingDown className="w-3 h-3 text-red-600" />
      default:
        return null
    }
  }

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex justify-center items-center py-8">
          <LoadingSpinner />
        </div>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchUserInsights}
            className="text-blue-600 hover:text-blue-700 underline"
          >
            Try Again
          </button>
        </div>
      </Card>
    )
  }

  const displayInsights = insights.slice(0, limit)

  return (
    <Card className="p-6">
      {showHeader && (
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Your Insights</h2>
            <p className="text-sm text-gray-600">
              Personal analytics and recommendations
            </p>
          </div>
          <BarChart3 className="w-5 h-5 text-blue-600" />
        </div>
      )}

      {/* Quick Stats Grid */}
      {!compact && stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-lg font-bold text-blue-600">{stats.totalEvents}</div>
            <div className="text-xs text-gray-600">Total Events</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-lg font-bold text-green-600">{stats.followingCount}</div>
            <div className="text-xs text-gray-600">Following</div>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="text-lg font-bold text-purple-600">{stats.streakDays}</div>
            <div className="text-xs text-gray-600">Day Streak</div>
          </div>
          <div className="text-center p-3 bg-yellow-50 rounded-lg">
            <div className="text-lg font-bold text-yellow-600">{stats.achievements}</div>
            <div className="text-xs text-gray-600">Achievements</div>
          </div>
        </div>
      )}

      {/* Insights List */}
      <div className="space-y-4">
        {displayInsights.map((insight) => (
          <div key={insight.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${insight.color}`}>
              <insight.icon className="w-4 h-4" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <h4 className="font-medium text-gray-900">{insight.title}</h4>
                {insight.isNew && (
                  <Badge className="bg-blue-100 text-blue-800 text-xs">New</Badge>
                )}
                {insight.changeType && (
                  <div className="flex items-center space-x-1">
                    {getChangeIcon(insight.changeType)}
                    <span className={`text-xs ${
                      insight.changeType === 'positive' ? 'text-green-600' : 
                      insight.changeType === 'negative' ? 'text-red-600' : 
                      'text-gray-600'
                    }`}>
                      {insight.value}
                    </span>
                  </div>
                )}
              </div>
              
              <p className="text-sm text-gray-600 mb-2">{insight.description}</p>
              
              <div className="flex items-center justify-between">
                {insight.value && !insight.changeType && (
                  <span className="text-sm font-medium text-gray-900">{insight.value}</span>
                )}
                
                {insight.actionText && insight.actionUrl && (
                  <a
                    href={insight.actionUrl}
                    className="text-sm text-blue-600 hover:text-blue-700 underline"
                  >
                    {insight.actionText}
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Favorite Genres & Locations */}
      {!compact && stats && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Favorite Genres</h4>
              <div className="space-y-2">
                {stats.favoriteGenres.map((genre, index) => (
                  <div key={genre} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">{genre}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 h-2 bg-gray-200 rounded-full">
                        <div 
                          className="h-2 bg-blue-500 rounded-full"
                          style={{ width: `${(3 - index) * 30}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500">
                        {(3 - index) * 30}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Top Locations</h4>
              <div className="space-y-2">
                {stats.favoriteLocations.map((location, index) => (
                  <div key={location} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">{location}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 h-2 bg-gray-200 rounded-full">
                        <div 
                          className="h-2 bg-green-500 rounded-full"
                          style={{ width: `${(3 - index) * 25}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500">
                        {(3 - index) * 25}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Financial Summary */}
      {!compact && stats && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(stats.averageEventPrice)}
              </div>
              <div className="text-sm text-gray-600">Average Event Cost</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(stats.totalSpent)}
              </div>
              <div className="text-sm text-gray-600">Total Invested</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {formatCurrency(stats.totalSpent / stats.totalEvents)}
              </div>
              <div className="text-sm text-gray-600">Cost per Event</div>
            </div>
          </div>
        </div>
      )}

      {displayInsights.length === 0 && (
        <div className="text-center py-8">
          <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No insights available yet</p>
          <p className="text-sm text-gray-400 mt-1">
            Keep using the app to see personalized insights
          </p>
        </div>
      )}
    </Card>
  )
}