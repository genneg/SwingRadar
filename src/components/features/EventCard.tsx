import Image from 'next/image'
import Link from 'next/link'

import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardFooter } from '@/components/ui/Card'
import { Festival } from '@/types'
import { formatDate, getRelativeDate, isRegistrationUrgent } from '@/lib/dateUtils'

import { FollowButton } from './FollowButton'

interface EventCardProps {
  event: Festival
  className?: string
  onClick?: () => void
  compact?: boolean
  showDistance?: boolean
  highlightQuery?: string
}

export function EventCard({ 
  event, 
  className, 
  onClick, 
  compact = false, 
  showDistance = false, 
  highlightQuery 
}: EventCardProps) {

  const getLowestPrice = () => {
    if (!event.prices || event.prices.length === 0) return null

    const validPrices = event.prices
      .map(p => {
        // Handle different price object structures
        let amount = null

        if (p && typeof p === 'object') {
          // Check for amount property
          if ('amount' in p) {
            amount = typeof p.amount === 'string' ? parseFloat(p.amount) : p.amount
          }
          // Check for price property (alternative structure)
          else if ('price' in p) {
            amount = typeof p.price === 'string' ? parseFloat(p.price) : p.price
          }
        }

        return amount !== null && !isNaN(amount) ? amount : null
      })
      .filter(p => p !== null)

    return validPrices.length > 0 ? Math.min(...validPrices) : null
  }

  // Get image URL from either imageUrl or image property
  const getImageUrl = () => {
    return event.imageUrl || event.image || null
  }

  return (
    <Card 
      hover 
      className={`stats-card group cursor-pointer ${className}`}
      role="article"
      aria-labelledby={`event-title-${event.id}`}
    >
      <CardContent className="p-0">
        {/* Event Image */}
        <div className="relative h-48 w-full overflow-hidden rounded-t-lg bg-gray-800">
          {getImageUrl() ? (
            <img
              src={getImageUrl()!}
              alt={event.name || 'Event image'}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback if image fails to load
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent && !parent.querySelector('.fallback-placeholder')) {
                  const fallbackDiv = document.createElement('div');
                  fallbackDiv.className = 'fallback-placeholder flex items-center justify-center h-full bg-gradient-to-br from-primary/20 to-primary/10';
                  fallbackDiv.innerHTML = `
                    <svg class="w-12 h-12 text-primary/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                    </svg>
                  `;
                  parent.appendChild(fallbackDiv);
                }
              }}
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-gradient-to-br from-primary/20 to-primary/10">
              <svg className="w-12 h-12 text-primary/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-base mb-3 gap-2">
            <span className="font-semibold text-primary">{getRelativeDate(event.startDate)}</span>
            <span className="text-base font-medium text-white">{event.venue?.city || event.city}, {event.venue?.country || event.country}</span>
          </div>
          
          {/* Registration Deadline Warning */}
          {event.registrationDeadline && isRegistrationUrgent(event.registrationDeadline) && (
            <div className="bg-warning-600/20 border border-warning-600/30 rounded-lg p-4 mb-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-warning-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <span className="text-sm text-warning-300 font-semibold">
                  Registration deadline: {formatDate(event.registrationDeadline)}
                </span>
              </div>
            </div>
          )}

          {/* Event Title and Price */}
          <div className="flex items-start justify-between mb-4 gap-3 overflow-hidden">
            <h3
              id={`event-title-${event.id}`}
              className="text-xl md:text-2xl font-bold text-white line-clamp-2 leading-tight flex-1 min-w-0 overflow-hidden"
            >
              {event.name}
            </h3>
            {getLowestPrice() && (
              <div className="flex-shrink-0 bg-black/30 backdrop-blur-sm rounded-lg px-2 py-1.5 md:px-3 md:py-2 price-container max-w-[100px] md:max-w-[120px] overflow-hidden">
                <div className="text-base md:text-lg font-bold text-primary price-text whitespace-nowrap overflow-hidden text-ellipsis">
                  €{getLowestPrice()}
                </div>
                <div className="text-xs md:text-sm text-white/90 text-right font-medium whitespace-nowrap">from</div>
              </div>
            )}
          </div>

          {/* Venue */}
          <p className="text-base font-medium text-white mb-4">
            {event.venue?.name || 'Venue TBD'}
          </p>

          {/* Description */}
          <p className="text-base text-white line-clamp-2 mb-6 leading-relaxed">
            {event.description}
          </p>

          {/* Teachers and Musicians */}
          <div className="space-y-3 mb-4">
            {event.teachers && event.teachers.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-primary uppercase tracking-wide mb-3 flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  Teachers
                </h4>
                <div className="flex flex-wrap gap-1">
                  {(event.teachers || []).slice(0, 2).filter(teacher => teacher && teacher.name).map((teacher) => (
                    <span
                      key={teacher.id}
                      className="inline-block bg-primary/20 text-primary text-xs md:text-sm px-2 py-1.5 md:px-3 rounded-full hover:bg-primary/30 transition-colors cursor-pointer font-medium break-words max-w-[150px] md:max-w-[200px] truncate"
                      role="button"
                      tabIndex={0}
                      aria-label={`View teacher ${teacher.name}`}
                    >
                      {teacher.name}
                    </span>
                  ))}
                  {event.teachers && event.teachers.length > 2 && (
                    <span className="inline-block bg-white/10 text-white text-xs md:text-sm px-2 py-1.5 md:px-3 rounded-full font-medium">
                      +{event.teachers.length - 2} more
                    </span>
                  )}
                </div>
              </div>
            )}

            {event.musicians && event.musicians.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-primary uppercase tracking-wide mb-3 flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM15.657 6.343a1 1 0 011.414 0A9.972 9.972 0 0119 12a9.972 9.972 0 01-1.929 5.657 1 1 0 11-1.414-1.414A7.971 7.971 0 0017 12c0-1.594-.471-3.077-1.343-4.343a1 1 0 010-1.414zm-2.829 2.829a1 1 0 011.415 0A5.983 5.983 0 0115 12a5.984 5.984 0 01-.757 2.828 1 1 0 01-1.415-1.414A3.989 3.989 0 0013 12a3.988 3.988 0 00-.172-1.172 1 1 0 010-1.415z" clipRule="evenodd" />
                  </svg>
                  Musicians
                </h4>
                <div className="flex flex-wrap gap-1">
                  {(event.musicians || []).slice(0, 2).filter(musician => musician && musician.name).map((musician) => (
                    <span
                      key={musician.id}
                      className="inline-block bg-primary/20 text-primary text-xs md:text-sm px-2 py-1.5 md:px-3 rounded-full hover:bg-primary/30 transition-colors cursor-pointer font-medium break-words max-w-[150px] md:max-w-[200px] truncate"
                      role="button"
                      tabIndex={0}
                      aria-label={`View musician ${musician.name}`}
                    >
                      {musician.name}
                    </span>
                  ))}
                  {event.musicians && event.musicians.length > 2 && (
                    <span className="inline-block bg-white/10 text-white text-xs md:text-sm px-2 py-1.5 md:px-3 rounded-full font-medium">
                      +{event.musicians.length - 2} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-6">
        <Link href={`/events/${event.id}`} className="flex-1">
          <Button variant="ghost" size="lg" className="w-full btn-secondary">
            View Details
          </Button>
        </Link>
        
        {event.website && (
          <a href={event.website} target="_blank" rel="noopener noreferrer" className="flex-1">
            <Button variant="primary" size="lg" className="w-full btn-primary">
  Visit Website
            </Button>
          </a>
        )}
      </CardFooter>
    </Card>
  )
}