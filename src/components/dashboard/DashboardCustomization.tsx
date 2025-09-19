'use client'

import { useState } from 'react'
import { 
  Settings, 
  Eye, 
  EyeOff, 
  Grid, 
  List, 
  Move,
  RotateCcw,
  Save,
  X,
  Check,
  Info
} from 'lucide-react'

import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'

interface DashboardWidget {
  id: string
  name: string
  description: string
  component: string
  visible: boolean
  position: number
  size: 'small' | 'medium' | 'large'
  customizable: boolean
  category: 'essential' | 'social' | 'analytics' | 'recommendations'
}

interface DashboardCustomizationProps {
  widgets: DashboardWidget[]
  onWidgetsChange: (widgets: DashboardWidget[]) => void
  onClose: () => void
  isOpen: boolean
}

export function DashboardCustomization({
  widgets,
  onWidgetsChange,
  onClose,
  isOpen
}: DashboardCustomizationProps) {
  const [localWidgets, setLocalWidgets] = useState<DashboardWidget[]>(widgets)
  const [hasChanges, setHasChanges] = useState(false)
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [resetConfirm, setResetConfirm] = useState(false)

  const defaultWidgets: DashboardWidget[] = [
    {
      id: 'stats',
      name: 'Quick Stats',
      description: 'Overview of your activity and following',
      component: 'StatsWidget',
      visible: true,
      position: 1,
      size: 'large',
      customizable: false,
      category: 'essential'
    },
    {
      id: 'following-events',
      name: 'Following Events',
      description: 'Events from teachers and musicians you follow',
      component: 'FollowingEventsWidget',
      visible: true,
      position: 2,
      size: 'large',
      customizable: true,
      category: 'social'
    },
    {
      id: 'upcoming-events',
      name: 'Upcoming Events',
      description: 'Blues dance events happening soon',
      component: 'UpcomingEventsWidget',
      visible: true,
      position: 3,
      size: 'medium',
      customizable: true,
      category: 'essential'
    },
    {
      id: 'following-updates',
      name: 'Following Updates',
      description: 'Latest updates from people you follow',
      component: 'FollowingUpdatesWidget',
      visible: true,
      position: 4,
      size: 'medium',
      customizable: true,
      category: 'social'
    },
    {
      id: 'recommendations',
      name: 'Recommendations',
      description: 'Personalized event suggestions',
      component: 'RecommendationsWidget',
      visible: true,
      position: 5,
      size: 'medium',
      customizable: true,
      category: 'recommendations'
    },
    {
      id: 'insights',
      name: 'Insights',
      description: 'Personal analytics and achievements',
      component: 'InsightsWidget',
      visible: false,
      position: 6,
      size: 'medium',
      customizable: true,
      category: 'analytics'
    },
    {
      id: 'recent-activity',
      name: 'Recent Activity',
      description: 'Your recent actions and events',
      component: 'RecentActivityWidget',
      visible: false,
      position: 7,
      size: 'small',
      customizable: true,
      category: 'essential'
    },
    {
      id: 'favorite-teachers',
      name: 'Favorite Teachers',
      description: 'Teachers you follow most',
      component: 'FavoriteTeachersWidget',
      visible: false,
      position: 8,
      size: 'small',
      customizable: true,
      category: 'social'
    },
    {
      id: 'event-calendar',
      name: 'Event Calendar',
      description: 'Monthly view of your events',
      component: 'EventCalendarWidget',
      visible: false,
      position: 9,
      size: 'large',
      customizable: true,
      category: 'essential'
    },
    {
      id: 'price-tracker',
      name: 'Price Tracker',
      description: 'Track your event spending',
      component: 'PriceTrackerWidget',
      visible: false,
      position: 10,
      size: 'small',
      customizable: true,
      category: 'analytics'
    }
  ]

  const categories = [
    { id: 'all', name: 'All Widgets', count: localWidgets.length },
    { id: 'essential', name: 'Essential', count: localWidgets.filter(w => w.category === 'essential').length },
    { id: 'social', name: 'Social', count: localWidgets.filter(w => w.category === 'social').length },
    { id: 'analytics', name: 'Analytics', count: localWidgets.filter(w => w.category === 'analytics').length },
    { id: 'recommendations', name: 'Recommendations', count: localWidgets.filter(w => w.category === 'recommendations').length }
  ]

  const toggleWidget = (widgetId: string) => {
    if (!localWidgets.find(w => w.id === widgetId)?.customizable) return
    
    const newWidgets = localWidgets.map(widget =>
      widget.id === widgetId ? { ...widget, visible: !widget.visible } : widget
    )
    setLocalWidgets(newWidgets)
    setHasChanges(true)
  }

  const updateWidgetSize = (widgetId: string, size: 'small' | 'medium' | 'large') => {
    const newWidgets = localWidgets.map(widget =>
      widget.id === widgetId ? { ...widget, size } : widget
    )
    setLocalWidgets(newWidgets)
    setHasChanges(true)
  }

  const moveWidget = (widgetId: string, direction: 'up' | 'down') => {
    const widget = localWidgets.find(w => w.id === widgetId)
    if (!widget) return

    const newWidgets = [...localWidgets]
    const currentIndex = newWidgets.findIndex(w => w.id === widgetId)
    
    if (direction === 'up' && currentIndex > 0) {
      [newWidgets[currentIndex], newWidgets[currentIndex - 1]] = [newWidgets[currentIndex - 1], newWidgets[currentIndex]]
    } else if (direction === 'down' && currentIndex < newWidgets.length - 1) {
      [newWidgets[currentIndex], newWidgets[currentIndex + 1]] = [newWidgets[currentIndex + 1], newWidgets[currentIndex]]
    }

    // Update positions
    newWidgets.forEach((widget, index) => {
      widget.position = index + 1
    })

    setLocalWidgets(newWidgets)
    setHasChanges(true)
  }

  const resetToDefault = () => {
    setLocalWidgets(defaultWidgets)
    setHasChanges(true)
    setResetConfirm(false)
  }

  const saveChanges = () => {
    onWidgetsChange(localWidgets)
    setHasChanges(false)
  }

  const cancelChanges = () => {
    setLocalWidgets(widgets)
    setHasChanges(false)
    onClose()
  }

  const getFilteredWidgets = () => {
    if (activeCategory === 'all') return localWidgets
    return localWidgets.filter(widget => widget.category === activeCategory)
  }

  const getSizeColor = (size: string) => {
    switch (size) {
      case 'small': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'large': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'essential': return 'bg-blue-100 text-blue-800'
      case 'social': return 'bg-pink-100 text-pink-800'
      case 'analytics': return 'bg-orange-100 text-orange-800'
      case 'recommendations': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (!isOpen) return null

  return (
    <Modal open={isOpen} onOpenChange={onClose} title="Customize Dashboard">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Dashboard Widgets</h3>
            <p className="text-sm text-gray-600">
              Customize your dashboard by showing, hiding, and arranging widgets
            </p>
          </div>
          {hasChanges && (
            <Badge className="bg-blue-100 text-blue-800">
              Unsaved changes
            </Badge>
          )}
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                activeCategory === category.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.name} ({category.count})
            </button>
          ))}
        </div>

        {/* Widgets List */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {getFilteredWidgets().map((widget) => (
            <Card key={widget.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => toggleWidget(widget.id)}
                    className={`p-2 rounded-full transition-colors ${
                      widget.visible
                        ? 'bg-green-100 text-green-600'
                        : 'bg-gray-100 text-gray-400'
                    } ${
                      !widget.customizable
                        ? 'cursor-not-allowed opacity-50'
                        : 'hover:bg-opacity-80'
                    }`}
                    disabled={!widget.customizable}
                  >
                    {widget.visible ? (
                      <Eye className="w-4 h-4" />
                    ) : (
                      <EyeOff className="w-4 h-4" />
                    )}
                  </button>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium text-gray-900">{widget.name}</h4>
                      {!widget.customizable && (
                        <Badge className="bg-gray-100 text-gray-600 text-xs">
                          Required
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{widget.description}</p>
                    
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge className={`text-xs ${getCategoryColor(widget.category)}`}>
                        {widget.category}
                      </Badge>
                      <Badge className={`text-xs ${getSizeColor(widget.size)}`}>
                        {widget.size}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {/* Size Controls */}
                  {widget.customizable && (
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => updateWidgetSize(widget.id, 'small')}
                        className={`px-2 py-1 text-xs rounded ${
                          widget.size === 'small'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        S
                      </button>
                      <button
                        onClick={() => updateWidgetSize(widget.id, 'medium')}
                        className={`px-2 py-1 text-xs rounded ${
                          widget.size === 'medium'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        M
                      </button>
                      <button
                        onClick={() => updateWidgetSize(widget.id, 'large')}
                        className={`px-2 py-1 text-xs rounded ${
                          widget.size === 'large'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        L
                      </button>
                    </div>
                  )}
                  
                  {/* Move Controls */}
                  {widget.customizable && (
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => moveWidget(widget.id, 'up')}
                        className="p-1 text-gray-400 hover:text-gray-600"
                        disabled={widget.position === 1}
                      >
                        <Move className="w-4 h-4 rotate-180" />
                      </button>
                      <button
                        onClick={() => moveWidget(widget.id, 'down')}
                        className="p-1 text-gray-400 hover:text-gray-600"
                        disabled={widget.position === localWidgets.length}
                      >
                        <Move className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setResetConfirm(true)}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset to Default
            </Button>
            
            <div className="flex items-center space-x-1 text-sm text-gray-500">
              <Info className="w-4 h-4" />
              <span>Changes are saved automatically</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={cancelChanges}
            >
              Cancel
            </Button>
            <Button
              onClick={saveChanges}
              disabled={!hasChanges}
            >
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      <Modal open={resetConfirm} onOpenChange={setResetConfirm} title="Reset Dashboard">
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to reset your dashboard to the default configuration?
            This will undo all your customizations.
          </p>
          
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setResetConfirm(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={resetToDefault}
              className="bg-red-600 hover:bg-red-700"
            >
              Reset Dashboard
            </Button>
          </div>
        </div>
      </Modal>
    </Modal>
  )
}