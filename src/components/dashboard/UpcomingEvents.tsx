'use client'

import { Calendar, MapPin, Users, ExternalLink } from 'lucide-react'
import Link from 'next/link'

const UpcomingEvents = () => {
  // Mock data - in real app, this would come from API
  const upcomingEvents = [
    {
      id: 1,
      name: 'Blues Weekend Workshop',
      date: '2024-07-20',
      location: 'Portland, OR',
      teachers: ['Sarah Johnson', 'Mike Anderson'],
      image: '/api/placeholder/300/200',
      registrationDeadline: '2024-07-15',
      price: '$85',
      isFollowing: true
    },
    {
      id: 2,
      name: 'Summer Blues Festival',
      date: '2024-08-05',
      location: 'Austin, TX',
      teachers: ['Lisa Chen', 'David Wilson'],
      image: '/api/placeholder/300/200',
      registrationDeadline: '2024-07-30',
      price: '$120',
      isFollowing: false
    },
    {
      id: 3,
      name: 'Blues Connection Workshop',
      date: '2024-08-12',
      location: 'Seattle, WA',
      teachers: ['Emma Thompson'],
      image: '/api/placeholder/300/200',
      registrationDeadline: '2024-08-08',
      price: '$75',
      isFollowing: true
    }
  ]

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    })
  }

  const getDaysUntilDeadline = (deadline: string) => {
    const deadlineDate = new Date(deadline)
    const today = new Date()
    const diffTime = deadlineDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Upcoming Events</h2>
          <Link
            href="/dashboard/events"
            className="text-blue-600 hover:text-blue-500 text-sm font-medium flex items-center"
          >
            View all
            <ExternalLink className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </div>

      <div className="p-6">
        <div className="space-y-6">
          {upcomingEvents.map((event) => (
            <div key={event.id} className="flex space-x-4">
              {/* Event Image */}
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-8 h-8 text-blue-600" />
                </div>
              </div>

              {/* Event Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {event.name}
                    </h3>
                    <div className="mt-1 flex items-center text-sm text-gray-500 space-x-4">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(event.date)}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {event.location}
                      </div>
                    </div>
                    <div className="mt-1 flex items-center text-sm text-gray-500">
                      <Users className="w-4 h-4 mr-1" />
                      {event.teachers.join(', ')}
                    </div>
                  </div>
                  <div className="flex-shrink-0 ml-2">
                    <span className="text-sm font-medium text-gray-900">
                      {event.price}
                    </span>
                  </div>
                </div>

                {/* Registration Deadline */}
                <div className="mt-2">
                  {(() => {
                    const daysLeft = getDaysUntilDeadline(event.registrationDeadline)
                    if (daysLeft <= 0) {
                      return (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Registration closed
                        </span>
                      )
                    } else if (daysLeft <= 3) {
                      return (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          {daysLeft} day{daysLeft !== 1 ? 's' : ''} left to register
                        </span>
                      )
                    } else {
                      return (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Registration open
                        </span>
                      )
                    }
                  })()}
                  
                  {event.isFollowing && (
                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Following teacher
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {upcomingEvents.length === 0 && (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No upcoming events</p>
            <p className="text-sm text-gray-400 mt-1">
              Follow some teachers to see their upcoming events
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default UpcomingEvents