'use client'

import { useState } from 'react'
import { Calendar, Heart, MessageCircle, Bell } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { SavedEventsTab } from './tabs/SavedEventsTab'
import { FollowingTab } from './tabs/FollowingTab'
import { ReviewsTab } from './tabs/ReviewsTab'
import { NotificationsTab } from './tabs/NotificationsTab'

interface ProfileTabsProps {
  userId: string
}

type TabType = 'saved' | 'following' | 'reviews' | 'notifications'

export function ProfileTabs({ userId }: ProfileTabsProps) {
  const [activeTab, setActiveTab] = useState<TabType>('saved')

  const tabs = [
    {
      id: 'saved' as TabType,
      label: 'Saved Events',
      icon: Calendar,
      component: <SavedEventsTab userId={userId} />,
    },
    {
      id: 'following' as TabType,
      label: 'Following',
      icon: Heart,
      component: <FollowingTab userId={userId} />,
    },
    {
      id: 'reviews' as TabType,
      label: 'Reviews',
      icon: MessageCircle,
      component: <ReviewsTab userId={userId} />,
    },
    {
      id: 'notifications' as TabType,
      label: 'Notifications',
      icon: Bell,
      component: <NotificationsTab userId={userId} />,
    },
  ]

  return (
    <div>
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <div className="flex space-x-8 px-6">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {tabs.find((tab) => tab.id === activeTab)?.component}
      </div>
    </div>
  )
}