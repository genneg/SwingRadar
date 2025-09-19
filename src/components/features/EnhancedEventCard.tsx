import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardFooter } from '@/components/ui/Card'
import { Festival } from '@/types'
import { formatDate, getRelativeDate, isRegistrationUrgent } from '@/lib/dateUtils'

import { FollowButton } from './FollowButton'

interface EnhancedEventCardProps {
  event: Festival
  className?: string
  onClick?: () => void
  compact?: boolean
  showDistance?: boolean
  highlightQuery?: string
  enhanced?: boolean
}

export function EnhancedEventCard({
  event,
  className,
  onClick,
  compact = false,
  showDistance = false,
  highlightQuery,
  enhanced = true
}: EnhancedEventCardProps) {
  const [showFullDescription, setShowFullDescription] = useState(false)
  const [imageError, setImageError] = useState(false)

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

  const getHighestPrice = () => {
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

    return validPrices.length > 0 ? Math.max(...validPrices) : null
  }

  const getPriceRange = () => {
    const lowest = getLowestPrice()
    const highest = getHighestPrice()
    if (!lowest) return null
    if (lowest === highest) return `€${lowest}`
    return `€${lowest} - €${highest}`
  }

  // Get image URL from either imageUrl or image property
  const getImageUrl = () => {
    return event.imageUrl || event.image || null
  }

  // Get attendance metrics for social proof
  const getAttendanceInfo = () => {
    // Mock data - in real app this would come from API
    return {
      capacity: 200,
      currentAttendees: 156,
      popularityScore: 92
    }
  }

  const attendanceInfo = getAttendanceInfo()
  const truncatedDescription = event.description?.slice(0, 150) + '...'

  return (
    <Card
      hover
      className={`vintage-event-card group cursor-pointer transition-all duration-300 hover:shadow-xl hover:border-gold-400/40 ${className}`}
      role="article"
      aria-labelledby={`event-title-${event.id}`}
    >
      <CardContent className="p-0">
        {/* Enhanced Event Image with Overlay Info */}
        <div className="relative h-56 w-full overflow-hidden rounded-t-xl bg-gradient-to-br from-navy-800 to-bordeaux-900">
          {getImageUrl() && !imageError ? (
            <img
              src={getImageUrl()!}
              alt={event.name || 'Event image'}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-gradient-to-br from-navy-800/60 to-bordeaux-900/60">
              <div className="vintage-vinyl-icon relative">
                <div className="w-16 h-16 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full animate-vinyl-spin">
                  <div className="absolute inset-0 bg-navy-900 w-4 h-4 rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                  <div className="absolute inset-0 border-2 border-gold-300/30 rounded-full"></div>
                </div>
                <div className="absolute -inset-2 border border-gold-400/20 rounded-full"></div>
              </div>
            </div>
          )}

          {/* Gradient Overlay for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30"></div>

          {/* Enhanced Price Badge */}
          {getPriceRange() && (
            <div className="absolute top-4 left-4 bg-gold-600/90 backdrop-blur-sm rounded-xl px-4 py-2 border border-gold-400/30 price-badge max-w-[200px] overflow-hidden">
              <div className="text-navy-900 font-bold text-lg price-text whitespace-nowrap overflow-hidden text-ellipsis">
                {getPriceRange()}
              </div>
              <div className="text-navy-900/80 text-xs font-medium whitespace-nowrap">
                from
              </div>
            </div>
          )}

          {/* Attendance Social Proof - Temporarily Disabled */}
          {/*
          {enhanced && attendanceInfo.currentAttendees > 100 && (
            <div className="absolute top-4 right-16 bg-bordeaux-600/90 backdrop-blur-sm rounded-xl px-3 py-2 border border-bordeaux-400/30">
              <div className="text-cream-200 text-xs font-medium">
                {attendanceInfo.currentAttendees}/{attendanceInfo.capacity}
              </div>
              <div className="text-cream-200/80 text-xs">
                attending
              </div>
            </div>
          )}
          */}

          {/* Enhanced Follow Button */}
          <div className="absolute top-4 right-4">
            <FollowButton
              targetType="event"
              targetId={event.id}
              size="sm"
            />
          </div>

          {/* Featured Badge */}
          {event.featured && (
            <div className="absolute bottom-4 left-4 bg-gold-600 text-navy-900 px-3 py-1 rounded-full text-sm font-bold">
              ⭐ Featured
            </div>
          )}

          {/* Popularity Score - Temporarily Disabled */}
          {/*
          {enhanced && attendanceInfo.popularityScore > 85 && (
            <div className="absolute bottom-4 right-4 bg-cream-100/90 text-navy-900 px-3 py-1 rounded-full text-sm font-bold">
              🔥 {attendanceInfo.popularityScore}% Hot
            </div>
          )}
          */}
        </div>

        {/* Enhanced Event Content */}
        <div className="p-6 bg-gradient-to-b from-cream-50 to-cream-100">
          {/* Enhanced Date and Location with Icons */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-base mb-4 gap-2">
            <div className="flex items-center space-x-2">
              <div className="vintage-calendar-icon w-5 h-5 text-bordeaux-600">
                📅
              </div>
              <span className="font-bold text-navy-900 jazz-font text-lg">{getRelativeDate(event.startDate)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="vintage-location-icon w-5 h-5 text-bordeaux-600">
                📍
              </div>
              <span className="text-base font-medium text-navy-700">{event.venue?.city || event.city}, {event.venue?.country || event.country}</span>
            </div>
          </div>

          {/* Distance Info */}
          {showDistance && event.distance && (
            <div className="flex items-center space-x-2 mb-3">
              <div className="text-bordeaux-600">📏</div>
              <span className="text-sm text-navy-600 font-medium">
                {event.distance.toFixed(1)} km away
              </span>
            </div>
          )}

          {/* Registration Deadline Warning */}
          {event.registrationDeadline && isRegistrationUrgent(event.registrationDeadline) && (
            <div className="bg-red-100 border border-red-300 rounded-lg p-4 mb-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <span className="text-sm text-red-700 font-semibold">
                  ⏰ Registration deadline: {formatDate(event.registrationDeadline)}
                </span>
              </div>
            </div>
          )}

          {/* Enhanced Event Title */}
          <div className="mb-4">
            <h3
              id={`event-title-${event.id}`}
              className="jazz-font text-2xl md:text-3xl font-bold text-navy-900 line-clamp-2 leading-tight hover:text-bordeaux-700 transition-colors"
            >
              {event.name}
            </h3>
          </div>

          {/* Enhanced Venue with Art Deco Styling */}
          <div className="mb-4 p-3 bg-gold-100/50 rounded-lg border border-gold-300/30">
            <div className="flex items-center space-x-2">
              <div className="vintage-venue-icon text-gold-700">🏛️</div>
              <p className="text-base font-medium text-navy-800">
                {event.venue?.name || 'Venue TBD'}
              </p>
            </div>
          </div>

          {/* Enhanced Description with Read More */}
          {event.description && (
            <div className="mb-6">
              <p className="text-base text-navy-700 leading-relaxed vintage-text">
                {showFullDescription ? event.description : truncatedDescription}
              </p>
              {event.description.length > 150 && (
                <button
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="text-bordeaux-600 hover:text-bordeaux-700 text-sm font-medium mt-2 underline"
                >
                  {showFullDescription ? 'Read Less' : 'Read More'}
                </button>
              )}
            </div>
          )}

          {/* Enhanced Teachers Section with Avatars */}
          {event.teachers && event.teachers.length > 0 && (
            <div className="mb-4">
              <h4 className="vintage-text text-sm font-bold text-navy-900 uppercase tracking-wide mb-3 flex items-center">
                <div className="vintage-teacher-icon w-5 h-5 mr-2 text-bordeaux-600">👨‍🏫</div>
                Master Teachers
              </h4>
              <div className="space-y-2">
                {(event.teachers || []).slice(0, enhanced ? 4 : 2).filter(teacher => teacher && teacher.name).map((teacher) => (
                  <div
                    key={teacher.id}
                    className="flex items-center space-x-3 p-3 bg-bordeaux-50 rounded-lg hover:bg-bordeaux-100 transition-colors cursor-pointer border border-bordeaux-200/50"
                    role="button"
                    tabIndex={0}
                    aria-label={`View teacher ${teacher.name}`}
                  >
                    {/* Teacher Avatar */}
                    <div className="relative">
                      <div className="w-10 h-10 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center text-navy-900 font-bold text-lg">
                        {teacher.name.charAt(0)}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-bordeaux-600 rounded-full flex items-center justify-center">
                        <span className="text-cream-200 text-xs">👑</span>
                      </div>
                    </div>

                    {/* Teacher Info */}
                    <div className="flex-1">
                      <div className="font-medium text-navy-900 vintage-text">
                        {teacher.name}
                      </div>
                      <div className="text-sm text-navy-600">
                        Master Instructor
                      </div>
                    </div>

                    {/* Teacher Badge */}
                    <div className="text-bordeaux-600 text-sm font-medium">
                      ⭐
                    </div>
                  </div>
                ))}
                {event.teachers && event.teachers.length > (enhanced ? 4 : 2) && (
                  <div className="text-center p-2 text-navy-600 text-sm font-medium">
                    +{event.teachers.length - (enhanced ? 4 : 2)} more instructors
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Enhanced Musicians Section with Avatars */}
          {event.musicians && event.musicians.length > 0 && (
            <div className="mb-4">
              <h4 className="vintage-text text-sm font-bold text-navy-900 uppercase tracking-wide mb-3 flex items-center">
                <div className="vintage-music-icon w-5 h-5 mr-2 text-bordeaux-600">🎷</div>
                Live Musicians
              </h4>
              <div className="space-y-2">
                {(event.musicians || []).slice(0, enhanced ? 3 : 2).filter(musician => musician && musician.name).map((musician) => (
                  <div
                    key={musician.id}
                    className="flex items-center space-x-3 p-3 bg-gold-50 rounded-lg hover:bg-gold-100 transition-colors cursor-pointer border border-gold-200/50"
                    role="button"
                    tabIndex={0}
                    aria-label={`View musician ${musician.name}`}
                  >
                    {/* Musician Avatar */}
                    <div className="relative">
                      <div className="w-10 h-10 bg-gradient-to-br from-bordeaux-400 to-bordeaux-600 rounded-full flex items-center justify-center text-cream-200 font-bold text-lg">
                        {musician.name.charAt(0)}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gold-600 rounded-full flex items-center justify-center">
                        <span className="text-navy-900 text-xs">🎵</span>
                      </div>
                    </div>

                    {/* Musician Info */}
                    <div className="flex-1">
                      <div className="font-medium text-navy-900 vintage-text">
                        {musician.name}
                      </div>
                      <div className="text-sm text-navy-600">
                        Live Performer
                      </div>
                    </div>

                    {/* Musician Badge */}
                    <div className="text-bordeaux-600 text-sm font-medium">
                      🎶
                    </div>
                  </div>
                ))}
                {event.musicians && event.musicians.length > (enhanced ? 3 : 2) && (
                  <div className="text-center p-2 text-navy-600 text-sm font-medium">
                    +{event.musicians.length - (enhanced ? 3 : 2)} more musicians
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Event Tags/Styles */}
          {event.tags && event.tags.length > 0 && (
            <div className="mb-4">
              <h4 className="vintage-text text-sm font-bold text-navy-900 uppercase tracking-wide mb-2">
                Dance Styles
              </h4>
              <div className="flex flex-wrap gap-2">
                {event.tags.slice(0, 6).map((tag) => (
                  <span
                    key={tag}
                    className="inline-block bg-cream-200 text-navy-700 text-sm px-3 py-1 rounded-full font-medium hover:bg-cream-300 transition-colors cursor-pointer"
                  >
                    {tag}
                  </span>
                ))}
                {event.tags.length > 6 && (
                  <span className="inline-block bg-navy-100 text-navy-600 text-sm px-3 py-1 rounded-full font-medium">
                    +{event.tags.length - 6} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>

      {/* Enhanced Footer with Better CTAs */}
      <CardFooter className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-6 bg-gradient-to-r from-cream-100 to-cream-200 border-t border-cream-300">
        <Link href={`/events/${event.id}`} className="flex-1">
          <Button variant="ghost" size="lg" className="w-full vintage-button bg-navy-800 hover:bg-navy-700 text-cream-200 border border-navy-600">
            📖 View Details
          </Button>
        </Link>

        {event.website && (
          <a href={event.website} target="_blank" rel="noopener noreferrer" className="flex-1">
            <Button variant="primary" size="lg" className="w-full vintage-button bg-gold-600 hover:bg-gold-500 text-navy-900 font-bold">
              🌐 Visit Website
            </Button>
          </a>
        )}
      </CardFooter>
    </Card>
  )
}