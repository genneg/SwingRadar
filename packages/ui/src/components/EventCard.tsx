import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardFooter } from './Card'
import { Button } from './Button'
import { FollowButton } from './FollowButton'

// TODO: Replace with actual types from @festival-scout/types
interface Event {
  id: string
  name: string
  description: string
  startDate: string
  endDate: string
  venue: {
    name: string
    city: string
    country: string
  }
  teachers: Array<{
    id: string
    name: string
  }>
  musicians: Array<{
    id: string
    name: string
  }>
  image?: string
  registrationUrl?: string
}

interface EventCardProps {
  event: Event
  className?: string
}

export function EventCard({ event, className }: EventCardProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const formatDateRange = (start: string, end: string) => {
    const startDate = new Date(start)
    const endDate = new Date(end)
    
    if (startDate.getMonth() === endDate.getMonth()) {
      return `${startDate.toLocaleDateString('en-US', { month: 'short' })} ${startDate.getDate()}-${endDate.getDate()}, ${startDate.getFullYear()}`
    }
    
    return `${formatDate(start)} - ${formatDate(end)}`
  }

  return (
    <Card hover className={className}>
      <CardContent className="p-0">
        {/* Event Image */}
        <div className="relative h-48 w-full overflow-hidden rounded-t-lg bg-gray-100">
          {event.image ? (
            <Image
              src={event.image}
              alt={event.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-gradient-to-br from-primary-100 to-blues-100">
              <svg className="w-12 h-12 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            </div>
          )}
          
          {/* Follow Button */}
          <div className="absolute top-3 right-3">
            <FollowButton
              targetType="event"
              targetId={event.id}
              size="sm"
            />
          </div>
        </div>

        {/* Event Content */}
        <div className="p-6">
          {/* Date and Location */}
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span className="font-medium">{formatDateRange(event.startDate, event.endDate)}</span>
            <span>{event.venue.city}, {event.venue.country}</span>
          </div>

          {/* Event Title */}
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {event.name}
          </h3>

          {/* Venue */}
          <p className="text-sm text-gray-600 mb-3">
            {event.venue.name}
          </p>

          {/* Description */}
          <p className="text-sm text-gray-700 line-clamp-3 mb-4">
            {event.description}
          </p>

          {/* Teachers */}
          {event.teachers.length > 0 && (
            <div className="mb-3">
              <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                Teachers
              </h4>
              <div className="flex flex-wrap gap-1">
                {event.teachers.slice(0, 3).map((teacher) => (
                  <span
                    key={teacher.id}
                    className="inline-block bg-primary-100 text-primary-700 text-xs px-2 py-1 rounded-full"
                  >
                    {teacher.name}
                  </span>
                ))}
                {event.teachers.length > 3 && (
                  <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                    +{event.teachers.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Musicians */}
          {event.musicians.length > 0 && (
            <div className="mb-4">
              <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                Musicians
              </h4>
              <div className="flex flex-wrap gap-1">
                {event.musicians.slice(0, 2).map((musician) => (
                  <span
                    key={musician.id}
                    className="inline-block bg-blues-100 text-blues-700 text-xs px-2 py-1 rounded-full"
                  >
                    {musician.name}
                  </span>
                ))}
                {event.musicians.length > 2 && (
                  <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                    +{event.musicians.length - 2} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between">
        <Link href={`/events/${event.id}`}>
          <Button variant="ghost" size="sm">
            View Details
          </Button>
        </Link>
        
        {event.registrationUrl && (
          <a href={event.registrationUrl} target="_blank" rel="noopener noreferrer">
            <Button variant="primary" size="sm">
              Visit Website
            </Button>
          </a>
        )}
      </CardFooter>
    </Card>
  )
}