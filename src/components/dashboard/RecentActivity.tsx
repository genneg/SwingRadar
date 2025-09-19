'use client'

import { Bell, UserPlus, Calendar, Music, BookmarkCheck } from 'lucide-react'

const RecentActivity = () => {
  // Mock data - in real app, this would come from API
  const activities = [
    {
      id: 1,
      type: 'event_added',
      title: 'New event added',
      description: 'Blues Weekend Workshop was added to your area',
      timestamp: '2 hours ago',
      icon: Calendar,
      color: 'text-blue-600 bg-blue-100'
    },
    {
      id: 2,
      type: 'teacher_followed',
      title: 'Started following',
      description: 'You are now following Sarah Johnson',
      timestamp: '5 hours ago',
      icon: UserPlus,
      color: 'text-green-600 bg-green-100'
    },
    {
      id: 3,
      type: 'event_saved',
      title: 'Event saved',
      description: 'Summer Blues Festival saved to your list',
      timestamp: '1 day ago',
      icon: BookmarkCheck,
      color: 'text-purple-600 bg-purple-100'
    },
    {
      id: 4,
      type: 'musician_update',
      title: 'Musician update',
      description: 'Mike Anderson posted a new video',
      timestamp: '2 days ago',
      icon: Music,
      color: 'text-orange-600 bg-orange-100'
    },
    {
      id: 5,
      type: 'deadline_reminder',
      title: 'Registration reminder',
      description: 'Registration closes in 3 days for Blues Connection Workshop',
      timestamp: '3 days ago',
      icon: Bell,
      color: 'text-red-600 bg-red-100'
    }
  ]

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
      </div>

      <div className="p-6">
        <div className="flow-root">
          <ul className="-mb-8">
            {activities.map((activity, activityIdx) => (
              <li key={activity.id}>
                <div className="relative pb-8">
                  {activityIdx !== activities.length - 1 ? (
                    <span
                      className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                      aria-hidden="true"
                    />
                  ) : null}
                  <div className="relative flex space-x-3">
                    <div>
                      <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${activity.color}`}>
                        <activity.icon className="h-4 w-4" />
                      </span>
                    </div>
                    <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {activity.title}
                        </p>
                        <p className="text-sm text-gray-500">
                          {activity.description}
                        </p>
                      </div>
                      <div className="text-right text-sm whitespace-nowrap text-gray-500">
                        {activity.timestamp}
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {activities.length === 0 && (
          <div className="text-center py-8">
            <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No recent activity</p>
            <p className="text-sm text-gray-400 mt-1">
              Your activity will appear here
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default RecentActivity