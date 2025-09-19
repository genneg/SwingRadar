'use client'

import { Calendar, Users, Music, BookmarkCheck } from 'lucide-react'

const DashboardStats = () => {
  // Mock data - in real app, this would come from API
  const stats = [
    {
      name: 'Upcoming Events',
      value: '12',
      change: '+2 this week',
      changeType: 'positive',
      icon: Calendar,
      href: '/dashboard/events'
    },
    {
      name: 'Following',
      value: '24',
      change: '+3 teachers',
      changeType: 'positive',
      icon: Users,
      href: '/dashboard/following'
    },
    {
      name: 'Musicians',
      value: '8',
      change: '+1 musician',
      changeType: 'positive',
      icon: Music,
      href: '/dashboard/musicians'
    },
    {
      name: 'Saved Events',
      value: '5',
      change: 'No change',
      changeType: 'neutral',
      icon: BookmarkCheck,
      href: '/dashboard/saved'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div key={stat.name} className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
                <stat.icon className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  {stat.name}
                </dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900">
                    {stat.value}
                  </div>
                  <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                    stat.changeType === 'positive' 
                      ? 'text-green-600' 
                      : stat.changeType === 'negative' 
                      ? 'text-red-600' 
                      : 'text-gray-500'
                  }`}>
                    {stat.change}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default DashboardStats