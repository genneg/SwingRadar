'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { 
  Calendar, 
  Users, 
  Music, 
  BookmarkCheck, 
  TrendingUp, 
  Settings, 
  Eye, 
  EyeOff,
  Grid,
  List,
  ChevronRight,
  Filter,
  Bell,
  Star,
  MapPin,
  Clock,
  ExternalLink
} from 'lucide-react'

import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { EventCard } from '@/components/features/EventCard'
import { FollowingStatus } from '@/components/features/FollowingStatus'
import { FollowingEventsFeed } from '@/components/dashboard/FollowingEventsFeed'
import { UpcomingEventsWidget } from '@/components/dashboard/UpcomingEventsWidget'
import { InsightsWidget } from '@/components/dashboard/InsightsWidget'
import { DashboardCustomization } from '@/components/dashboard/DashboardCustomization'

interface DashboardWidget {
  id: string
  name: string
  component: string
  visible: boolean
  position: number
  size: 'small' | 'medium' | 'large'
  customizable: boolean
}

interface DashboardStats {
  upcomingEvents: number
  following: number
  savedEvents: number
  recentActivity: number
  followingTeachers: number
  followingMusicians: number
  followingFestivals: number
}

interface PersonalizedEvent {
  id: string
  name: string
  date: string
  location: string
  venue: string
  teachers: string[]
  musicians: string[]
  image?: string
  price?: string
  registrationDeadline?: string
  isFollowingTeacher?: boolean
  isFollowingMusician?: boolean
  priority: 'high' | 'medium' | 'low'
  category: 'upcoming' | 'following' | 'recommended'
}

interface FollowingUpdate {
  id: string
  type: 'teacher' | 'musician' | 'festival'
  name: string
  avatar?: string
  action: string
  eventName?: string
  timestamp: string
  isNew: boolean
}

export function PersonalizedDashboard() {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(true)
  const [widgets, setWidgets] = useState<DashboardWidget[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    upcomingEvents: 0,
    following: 0,
    savedEvents: 0,
    recentActivity: 0,
    followingTeachers: 0,
    followingMusicians: 0,
    followingFestivals: 0
  })
  const [personalizedEvents, setPersonalizedEvents] = useState<PersonalizedEvent[]>([])
  const [followingUpdates, setFollowingUpdates] = useState<FollowingUpdate[]>([])
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [isCustomizing, setIsCustomizing] = useState(false)

  // Default widget configuration
  const defaultWidgets: DashboardWidget[] = [
    { id: 'stats', name: 'Quick Stats', component: 'StatsWidget', visible: true, position: 1, size: 'large', customizable: false },
    { id: 'following-events', name: 'Following Events', component: 'FollowingEventsWidget', visible: true, position: 2, size: 'large', customizable: true },
    { id: 'upcoming-events', name: 'Upcoming Events', component: 'UpcomingEventsWidget', visible: true, position: 3, size: 'medium', customizable: true },
    { id: 'following-updates', name: 'Following Updates', component: 'FollowingUpdatesWidget', visible: true, position: 4, size: 'medium', customizable: true },
    { id: 'recommendations', name: 'Recommendations', component: 'RecommendationsWidget', visible: true, position: 5, size: 'medium', customizable: true },
    { id: 'insights', name: 'Insights', component: 'InsightsWidget', visible: false, position: 6, size: 'small', customizable: true }
  ]

  useEffect(() => {
    fetchDashboardData()
    loadWidgetConfiguration()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)

      // Fetch dashboard stats
      const statsResponse = await fetch('/api/users/me/dashboard/stats')
      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setStats(statsData.data)
      }

      // Fetch personalized events
      const eventsResponse = await fetch('/api/users/me/dashboard/events')
      if (eventsResponse.ok) {
        const eventsData = await eventsResponse.json()
        setPersonalizedEvents(eventsData.data)
      }

      // Fetch following updates
      const updatesResponse = await fetch('/api/users/me/dashboard/updates')
      if (updatesResponse.ok) {
        const updatesData = await updatesResponse.json()
        setFollowingUpdates(updatesData.data)
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadWidgetConfiguration = () => {
    const savedConfig = localStorage.getItem('dashboardWidgets')
    if (savedConfig) {
      try {
        const parsed = JSON.parse(savedConfig)
        setWidgets(parsed)
      } catch (error) {
        setWidgets(defaultWidgets)
      }
    } else {
      setWidgets(defaultWidgets)
    }
  }

  const saveWidgetConfiguration = (newWidgets: DashboardWidget[]) => {
    localStorage.setItem('dashboardWidgets', JSON.stringify(newWidgets))
    setWidgets(newWidgets)
  }

  const toggleWidget = (widgetId: string) => {
    const newWidgets = widgets.map(widget =>
      widget.id === widgetId ? { ...widget, visible: !widget.visible } : widget
    )
    saveWidgetConfiguration(newWidgets)
  }

  const getVisibleWidgets = () => {
    return widgets.filter(widget => widget.visible).sort((a, b) => a.position - b.position)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    })
  }

  const getDaysUntil = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const diffTime = date.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const getEventPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Widget Components
  const StatsWidget = () => (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Quick Stats</h2>
        <TrendingUp className="w-5 h-5 text-blue-600" />
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.upcomingEvents}</div>
          <div className="text-sm text-gray-600">Upcoming Events</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{stats.following}</div>
          <div className="text-sm text-gray-600">Following</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">{stats.savedEvents}</div>
          <div className="text-sm text-gray-600">Saved Events</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">{stats.recentActivity}</div>
          <div className="text-sm text-gray-600">Recent Activity</div>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1">
              <Users className="w-4 h-4 text-blue-600" />
              <span className="font-medium">{stats.followingTeachers}</span>
            </div>
            <div className="text-gray-600">Teachers</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1">
              <Music className="w-4 h-4 text-purple-600" />
              <span className="font-medium">{stats.followingMusicians}</span>
            </div>
            <div className="text-gray-600">Musicians</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1">
              <Calendar className="w-4 h-4 text-green-600" />
              <span className="font-medium">{stats.followingFestivals}</span>
            </div>
            <div className="text-gray-600">Festivals</div>
          </div>
        </div>
      </div>
    </Card>
  )

  const FollowingEventsWidget = () => (
    <FollowingEventsFeed limit={5} showHeader={true} compact={false} />
  )

  const UpcomingEventsWidgetComponent = () => (
    <UpcomingEventsWidget limit={6} showHeader={true} compact={false} showFilters={false} />
  )

  const FollowingUpdatesWidget = () => (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Following Updates</h2>
        <Button variant="ghost" size="sm" asChild>
          <a href="/profile/following">
            <ExternalLink className="w-4 h-4" />
          </a>
        </Button>
      </div>
      
      <div className="space-y-4">
        {followingUpdates.slice(0, 5).map((update) => (
          <div key={update.id} className="flex items-start space-x-3">
            <Avatar
              name={update.name}
              image={update.avatar}
              size="sm"
              className="flex-shrink-0"
            />
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <p className="text-sm font-medium text-gray-900">{update.name}</p>
                {update.isNew && (
                  <Badge className="bg-blue-100 text-blue-800 text-xs">New</Badge>
                )}
              </div>
              
              <p className="text-sm text-gray-600 mt-1">{update.action}</p>
              
              {update.eventName && (
                <p className="text-sm text-blue-600 mt-1 font-medium">
                  {update.eventName}
                </p>
              )}
              
              <p className="text-xs text-gray-500 mt-1">{update.timestamp}</p>
            </div>
          </div>
        ))}
      </div>
      
      {followingUpdates.length === 0 && (
        <div className="text-center py-8">
          <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No updates</p>
          <p className="text-sm text-gray-400 mt-1">
            Updates from people you follow will appear here
          </p>
        </div>
      )}
    </Card>
  )

  const RecommendationsWidget = () => {
    const recommendations = personalizedEvents.filter(event => event.category === 'recommended')
    
    return (
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recommendations</h2>
          <Star className="w-5 h-5 text-yellow-500" />
        </div>
        
        <div className="space-y-4">
          {recommendations.slice(0, 3).map((event) => (
            <div key={event.id} className="p-3 bg-yellow-50 rounded-lg">
              <h3 className="font-medium text-gray-900">{event.name}</h3>
              <div className="flex items-center text-sm text-gray-500 space-x-2 mt-1">
                <span>{formatDate(event.date)}</span>
                <span>•</span>
                <span>{event.location}</span>
              </div>
              
              <div className="mt-2">
                <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                  Recommended for you
                </Badge>
              </div>
            </div>
          ))}
        </div>
        
        {recommendations.length === 0 && (
          <div className="text-center py-8">
            <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No recommendations yet</p>
            <p className="text-sm text-gray-400 mt-1">
              We'll suggest events based on your interests
            </p>
          </div>
        )}
      </Card>
    )
  }

  const InsightsWidgetComponent = () => (
    <InsightsWidget limit={5} showHeader={true} compact={false} />
  )

  const renderWidget = (widget: DashboardWidget) => {
    switch (widget.component) {
      case 'StatsWidget':
        return <StatsWidget />
      case 'FollowingEventsWidget':
        return <FollowingEventsWidget />
      case 'UpcomingEventsWidget':
        return <UpcomingEventsWidgetComponent />
      case 'FollowingUpdatesWidget':
        return <FollowingUpdatesWidget />
      case 'RecommendationsWidget':
        return <RecommendationsWidget />
      case 'InsightsWidget':
        return <InsightsWidgetComponent />
      default:
        return null
    }
  }

  const getWidgetGridClass = (widget: DashboardWidget) => {
    switch (widget.size) {
      case 'large':
        return 'col-span-full'
      case 'medium':
        return 'col-span-full lg:col-span-6'
      case 'small':
        return 'col-span-full lg:col-span-4'
      default:
        return 'col-span-full lg:col-span-6'
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {session?.user.name}!
          </h1>
          <p className="text-gray-600 mt-1">
            Here's what's happening in your blues dance world
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
          >
            {viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCustomizing(!isCustomizing)}
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Dashboard Customization Modal */}
      <DashboardCustomization
        widgets={widgets}
        onWidgetsChange={saveWidgetConfiguration}
        onClose={() => setIsCustomizing(false)}
        isOpen={isCustomizing}
      />

      {/* Dashboard Widgets */}
      <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-12' : 'grid-cols-1'}`}>
        {getVisibleWidgets().map((widget) => (
          <div key={widget.id} className={viewMode === 'grid' ? getWidgetGridClass(widget) : ''}>
            {renderWidget(widget)}
          </div>
        ))}
      </div>
    </div>
  )
}