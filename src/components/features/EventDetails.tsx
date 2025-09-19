'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Festival } from '@/types'
import { 
  formatLongDate, 
  formatTime, 
  getEventDuration, 
  isRegistrationUrgent, 
  isRegistrationClosed 
} from '@/lib/dateUtils'

import { FollowButton } from './FollowButton'

interface EventDetailsProps {
  event: Festival
  className?: string
}

export function EventDetails({ event, className }: EventDetailsProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [showAllTeachers, setShowAllTeachers] = useState(false)
  const [showAllMusicians, setShowAllMusicians] = useState(false)

  return (
    <div className={`space-y-8 lg:space-y-12 event-details-container ${className}`}>
      {/* Hero Section */}
      <Card className="stats-card">
        <CardContent className="p-0">
          {/* Event Image */}
          <div className="relative h-64 sm:h-80 lg:h-96 w-full overflow-hidden rounded-t-lg bg-gradient-to-br from-primary/20 to-primary/10">
            {(event.imageUrl || event.image) ? (
              <Image
                src={event.imageUrl || event.image || ''}
                alt={event.name || 'Event image'}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <svg className="w-20 h-20 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
              </div>
            )}
            
            {/* Follow Button */}
            <div className="absolute top-4 right-4">
              <FollowButton
                targetType="event"
                targetId={event.id}
                size="md"
              />
            </div>
          </div>

          {/* Event Header */}
          <div className="p-6 lg:p-8">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 lg:gap-8 mb-6">
              <div className="flex-1">
                <h1 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 lg:mb-6 leading-tight event-heading">
                  {event.name}
                </h1>
                
                <div className="flex flex-wrap items-center gap-6 lg:gap-8 text-white mb-6 text-lg lg:text-xl">
                  <div className="flex items-center">
                    <svg className="w-8 h-8 mr-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="font-bold text-white">{formatLongDate(event.startDate)}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <svg className="w-8 h-8 mr-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="font-bold text-white">{event.venue?.city || event.city}, {event.venue?.country || event.country}</span>
                  </div>

                  <div className="flex items-center">
                    <svg className="w-8 h-8 mr-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-bold text-white">{getEventDuration(event.startDate, event.endDate)}</span>
                  </div>
                </div>

                {/* Registration Status */}
                {event.registrationDeadline && (
                  <div className="mb-6">
                    {isRegistrationClosed(event.registrationDeadline) ? (
                      <div className="inline-flex items-center px-4 py-3 rounded-lg bg-error-600/20 border border-error-600/30">
                        <svg className="w-5 h-5 text-error-300 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <span className="text-error-200 font-semibold text-base">Registration Closed</span>
                      </div>
                    ) : isRegistrationUrgent(event.registrationDeadline) ? (
                      <div className="inline-flex items-center px-4 py-3 rounded-lg bg-warning-600/20 border border-warning-600/30">
                        <svg className="w-5 h-5 text-warning-300 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        <span className="text-warning-200 font-semibold text-base">
                          Registration deadline: {formatLongDate(event.registrationDeadline)}
                        </span>
                      </div>
                    ) : (
                      <div className="inline-flex items-center px-4 py-3 rounded-lg bg-success-600/20 border border-success-600/30">
                        <svg className="w-5 h-5 text-success-300 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-success-200 font-semibold text-base">Registration Open</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Registration Button */}
              <div className="flex flex-col gap-4">
                {event.website && !isRegistrationClosed(event.registrationDeadline) && (
                  <a href={event.website} target="_blank" rel="noopener noreferrer">
                    <Button size="lg" className="w-full lg:w-auto btn-primary text-lg px-8 py-4">
                      Visit Website
                    </Button>
                  </a>
                )}
                
                <Button variant="outline" size="lg" className="w-full lg:w-auto btn-secondary text-lg px-8 py-4">
                  Share Event
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Event Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 event-details-grid">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6 lg:space-y-8">
          {/* Description */}
          <Card className="stats-card">
            <CardHeader>
              <CardTitle className="text-3xl font-semibold text-primary mb-6">About This Festival</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white text-lg leading-relaxed whitespace-pre-line font-medium event-description">
                {event.description}
              </p>
            </CardContent>
          </Card>

          {/* Teachers */}
          {event.teachers.length > 0 && (
            <Card className="stats-card">
              <CardHeader>
                <CardTitle className="flex items-center text-3xl font-bold text-primary mb-8">
                  <svg className="w-10 h-10 mr-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  Teachers ({event.teachers.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-8">
                  {(showAllTeachers ? event.teachers : event.teachers.slice(0, 4)).map((teacher) => (
                    <div key={teacher.id} className="flex items-start p-4 sm:p-8 border border-primary/30 rounded-xl bg-white/5 hover:bg-white/10 hover:border-primary/50 transition-all duration-300 hover:shadow-xl">
                      {/* Teacher Avatar */}
                      <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-primary/30 to-primary/10 rounded-full flex items-center justify-center overflow-hidden mr-4 sm:mr-6 flex-shrink-0">
                        {teacher.image_url ? (
                          <img 
                            src={teacher.image_url} 
                            alt={teacher.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const parent = target.parentElement;
                              if (parent && !parent.querySelector('.fallback-icon')) {
                                const fallbackIcon = document.createElement('div');
                                fallbackIcon.className = 'fallback-icon';
                                fallbackIcon.innerHTML = `
                                  <svg class="w-12 h-12 text-primary" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                                  </svg>
                                `;
                                parent.appendChild(fallbackIcon);
                              }
                            }}
                          />
                        ) : (
                          <svg className="w-12 h-12 text-primary" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <Link href={`/teachers/${teacher.id}`} className="block hover:text-primary transition-colors">
                          <h4 className="text-xl md:text-2xl font-bold text-white hover:text-primary mb-3 leading-snug break-words">{teacher.name}</h4>
                        </Link>

                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mt-4 sm:mt-6">
                          <Link href={`/teachers/${teacher.id}`}>
                            <Button variant="outline" size="sm" className="btn-secondary text-base px-10 py-4 min-h-[48px] w-full sm:w-auto">
                              View Profile
                            </Button>
                          </Link>
                          <FollowButton
                            targetType="teacher"
                            targetId={teacher.id}
                            size="sm"
                            className="w-full sm:w-auto"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {event.teachers.length > 4 && (
                  <div className="mt-8 text-center">
                    <Button
                      variant="ghost"
                      onClick={() => setShowAllTeachers(!showAllTeachers)}
                      className="btn-secondary text-lg px-8 py-4"
                    >
                      {showAllTeachers ? 'Show Less' : `Show ${event.teachers.length - 4} More Teachers`}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Musicians */}
          {event.musicians.length > 0 && (
            <Card className="stats-card">
              <CardHeader>
                <CardTitle className="flex items-center text-4xl font-bold text-primary mb-8">
                  <svg className="w-10 h-10 mr-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM15.657 6.343a1 1 0 011.414 0A9.972 9.972 0 0119 12a9.972 9.972 0 01-1.929 5.657 1 1 0 11-1.414-1.414A7.971 7.971 0 0017 12c0-1.594-.471-3.077-1.343-4.343a1 1 0 010-1.414zm-2.829 2.829a1 1 0 011.415 0A5.983 5.983 0 0115 12a5.984 5.984 0 01-.757 2.828 1 1 0 01-1.415-1.414A3.989 3.989 0 0013 12a3.988 3.988 0 00-.172-1.172 1 1 0 010-1.415z" clipRule="evenodd" />
                  </svg>
                  Musicians ({event.musicians.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-8">
                  {(showAllMusicians ? event.musicians : event.musicians.slice(0, 4)).map((musician) => (
                    <div key={musician.id} className="flex items-start p-4 sm:p-8 border border-primary/30 rounded-xl bg-white/5 hover:bg-white/10 hover:border-primary/50 transition-all duration-300 hover:shadow-xl">
                      {/* Musician Avatar */}
                      <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-primary/30 to-primary/10 rounded-full flex items-center justify-center overflow-hidden mr-4 sm:mr-6 flex-shrink-0">
                        {musician.image_url ? (
                          <img 
                            src={musician.image_url} 
                            alt={musician.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <svg className="w-12 h-12 text-primary" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM15.657 6.343a1 1 0 011.414 0A9.972 9.972 0 0119 12a9.972 9.972 0 01-1.929 5.657 1 1 0 11-1.414-1.414A7.971 7.971 0 0017 12c0-1.594-.471-3.077-1.343-4.343a1 1 0 010-1.414zm-2.829 2.829a1 1 0 011.415 0A5.983 5.983 0 0115 12a5.984 5.984 0 01-.757 2.828 1 1 0 01-1.415-1.414A3.989 3.989 0 0013 12a3.988 3.988 0 00-.172-1.172 1 1 0 010-1.415z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <Link href={`/musicians/${musician.id}`} className="block hover:text-primary transition-colors">
                          <h4 className="text-xl md:text-2xl font-bold text-white hover:text-primary mb-3 leading-snug break-words">{musician.name}</h4>
                        </Link>

                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mt-4 sm:mt-6">
                          <Link href={`/musicians/${musician.id}`}>
                            <Button variant="outline" size="sm" className="btn-secondary text-base px-10 py-4 min-h-[48px] w-full sm:w-auto">
                              View Profile
                            </Button>
                          </Link>
                          <FollowButton
                            targetType="musician"
                            targetId={musician.id}
                            size="sm"
                            className="w-full sm:w-auto"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {event.musicians.length > 4 && (
                  <div className="mt-8 text-center">
                    <Button
                      variant="ghost"
                      onClick={() => setShowAllMusicians(!showAllMusicians)}
                      className="btn-secondary text-lg px-8 py-4"
                    >
                      {showAllMusicians ? 'Show Less' : `Show ${event.musicians.length - 4} More Musicians`}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-12">
          {/* Event Information */}
          <Card className="stats-card">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-primary mb-6">Event Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold text-primary mb-2 text-lg">Dates</h4>
                <p className="text-white text-base font-medium">{formatLongDate(event.startDate)}</p>
                {new Date(event.startDate).getTime() !== new Date(event.endDate).getTime() && (
                  <p className="text-white text-base font-medium">{formatLongDate(event.endDate)}</p>
                )}
              </div>

              <div>
                <h4 className="font-semibold text-primary mb-2 text-lg">Venue</h4>
                <p className="text-white text-base font-medium">{event.venue?.name || 'Venue TBD'}</p>
                {event.venue?.address && <p className="text-white text-base font-medium">{event.venue.address}</p>}
                <p className="text-white text-base font-medium">{event.venue?.city || event.city}, {event.venue?.country || event.country}</p>
              </div>

              {event.registrationDeadline && (
                <div>
                  <h4 className="font-semibold text-primary mb-2 text-lg">Registration Deadline</h4>
                  <p className="text-white text-base font-medium">{formatLongDate(event.registrationDeadline)}</p>
                </div>
              )}

              {/* Map Placeholder */}
              <div>
                <h4 className="font-semibold text-primary mb-3 text-lg">Location</h4>
                <div className="aspect-video bg-white/5 border border-primary/30 rounded-lg flex items-center justify-center">
                  <div className="text-center text-white/80">
                    <svg className="w-10 h-10 mx-auto mb-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <p className="text-base font-medium">Map integration coming soon</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          {event.prices && event.prices.length > 0 && (
            <Card className="stats-card border-2 border-primary/50">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-primary mb-8 flex items-center">
                  <svg className="w-10 h-10 mr-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                  Pricing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {event.prices.map((price) => {
                    // Handle different price structures and validate amount
                    let displayAmount = 'N/A'
                    let displayCurrency = price.currency || 'EUR'

                    if (price && typeof price === 'object') {
                      if ('amount' in price) {
                        const amount = typeof price.amount === 'string' ? parseFloat(price.amount) : price.amount
                        displayAmount = !isNaN(amount) ? amount.toFixed(2) : 'N/A'
                      } else if ('price' in price) {
                        const amount = typeof price.price === 'string' ? parseFloat(price.price) : price.price
                        displayAmount = !isNaN(amount) ? amount.toFixed(2) : 'N/A'
                      }
                    }

                    return (
                      <div key={price.id} className="flex flex-col sm:flex-row lg:flex-col justify-between sm:items-start lg:items-stretch p-6 bg-white/5 rounded-lg border border-primary/30 hover:border-primary/50 hover:bg-white/10 transition-all duration-300 overflow-hidden">
                        <div className="flex-1 mb-4 sm:mb-0 lg:mb-4 sm:min-w-0 sm:pr-4 lg:pr-0 lg:w-full">
                          <p className="text-xl font-bold text-white mb-2">{price.category}</p>
                          {price.description && (
                            <p className="text-base text-white/80 font-medium">{price.description}</p>
                          )}
                        </div>
                        <div className="text-right sm:flex-shrink-0 sm:w-[100px] sm:w-[120px] lg:text-center lg:w-full lg:flex-shrink-0 event-price-display overflow-hidden">
                          <p className="text-2xl sm:text-3xl font-bold text-primary event-price-text whitespace-nowrap overflow-hidden text-ellipsis">
                            {displayAmount}
                          </p>
                          <p className="text-lg text-white font-semibold">
                            {displayCurrency}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Social Sharing */}
          <Card className="stats-card">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-primary mb-6">Share This Event</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Button variant="outline" size="sm" className="flex-1 btn-secondary text-base py-3 min-h-[48px]">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                  Twitter
                </Button>
                <Button variant="outline" size="sm" className="flex-1 btn-secondary text-base py-3 min-h-[48px]">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Facebook
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Back to Events */}
      <div className="text-center">
        <Link href="/events">
          <Button variant="outline" className="btn-secondary text-lg px-8 py-4">
            ← Back to All Events
          </Button>
        </Link>
      </div>
    </div>
  )
}