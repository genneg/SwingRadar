'use client'

import { Users, Calendar, Music, ExternalLink, MapPin } from 'lucide-react'
import Link from 'next/link'

const FollowingUpdates = () => {
  // Mock data - in real app, this would come from API
  const followingUpdates = [
    {
      id: 1,
      type: 'teacher',
      name: 'Sarah Johnson',
      avatar: '/api/placeholder/40/40',
      update: 'Teaching at Blues Weekend Workshop',
      event: 'Blues Weekend Workshop',
      date: '2024-07-20',
      location: 'Portland, OR',
      timestamp: '2 hours ago',
      isNew: true
    },
    {
      id: 2,
      type: 'musician',
      name: 'Mike Anderson',
      avatar: '/api/placeholder/40/40',
      update: 'Performing at Summer Blues Festival',
      event: 'Summer Blues Festival',
      date: '2024-08-05',
      location: 'Austin, TX',
      timestamp: '1 day ago',
      isNew: false
    },
    {
      id: 3,
      type: 'teacher',
      name: 'Lisa Chen',
      avatar: '/api/placeholder/40/40',
      update: 'Added new workshop session',
      event: 'Blues Connection Workshop',
      date: '2024-08-12',
      location: 'Seattle, WA',
      timestamp: '3 days ago',
      isNew: false
    },
    {
      id: 4,
      type: 'musician',
      name: 'David Wilson',
      avatar: '/api/placeholder/40/40',
      update: 'Released new album',
      event: null,
      date: null,
      location: null,
      timestamp: '1 week ago',
      isNew: false
    }
  ]

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Following Updates</h2>
          <Link
            href="/dashboard/following"
            className="text-blue-600 hover:text-blue-500 text-sm font-medium flex items-center"
          >
            View all
            <ExternalLink className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </div>

      <div className="p-6">
        <div className="space-y-6">
          {followingUpdates.map((update) => (
            <div key={update.id} className="flex space-x-4">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  {update.type === 'teacher' ? (
                    <Users className="w-5 h-5 text-gray-600" />
                  ) : (
                    <Music className="w-5 h-5 text-gray-600" />
                  )}
                </div>
              </div>

              {/* Update Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-medium text-gray-900">
                        {update.name}
                      </p>
                      {update.isNew && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          New
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {update.update}
                    </p>
                    
                    {/* Event Details */}
                    {update.event && (
                      <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-start space-x-2">
                          <Calendar className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              {update.event}
                            </p>
                            <div className="flex items-center text-sm text-gray-500 mt-1 space-x-4">
                              {update.date && (
                                <span>{formatDate(update.date)}</span>
                              )}
                              {update.location && (
                                <div className="flex items-center">
                                  <MapPin className="w-3 h-3 mr-1" />
                                  {update.location}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex-shrink-0 ml-2">
                    <span className="text-xs text-gray-500">
                      {update.timestamp}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {followingUpdates.length === 0 && (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No updates from people you follow</p>
            <p className="text-sm text-gray-400 mt-1">
              Follow some teachers and musicians to see their updates
            </p>
            <Link
              href="/dashboard/following"
              className="inline-flex items-center mt-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Find people to follow
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default FollowingUpdates