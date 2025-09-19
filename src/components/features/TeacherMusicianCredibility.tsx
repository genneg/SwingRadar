import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { FollowButton } from './FollowButton'
import { StarIcon, HeartIcon, TrendingUpIcon, UsersIcon, AwardIcon, CheckCircleIcon } from '@/components/ui/Icon'

interface TeacherMusicianCredibilityProps {
  artist: {
    id: string
    name: string
    type: 'teacher' | 'musician'
    photo?: string
    specialties: string[]
    experience: number
    location: string
    followerCount: number
    rating: number
    reviewCount: number
    verified: boolean
    featured: boolean
    upcomingEvents: number
    credentials: string[]
    socialLinks?: {
      website?: string
      instagram?: string
      facebook?: string
      youtube?: string
    }
  }
  enhanced?: boolean
}

export function TeacherMusicianCredibility({
  artist,
  enhanced = true
}: TeacherMusicianCredibilityProps) {
  const [showFullBio, setShowFullBio] = useState(false)
  const [isFollowing, setIsFollowing] = useState(false)

  const getEngagementMetrics = () => {
    // Mock engagement metrics
    return {
      responseRate: 95,
      averageRating: 4.8,
      totalStudents: 1247,
      yearsActive: artist.experience,
      completionRate: 92
    }
  }

  const getTrustBadges = () => {
    const badges = []
    if (artist.verified) badges.push({ type: 'verified', label: 'Verified Artist', icon: '✓' })
    if (artist.featured) badges.push({ type: 'featured', label: 'Featured', icon: '⭐' })
    if (artist.rating >= 4.8) badges.push({ type: 'top-rated', label: 'Top Rated', icon: '🏆' })
    if (artist.followerCount > 1000) badges.push({ type: 'popular', label: 'Popular', icon: '🔥' })
    if (artist.yearsActive >= 10) badges.push({ type: 'veteran', label: 'Veteran', icon: '🎖️' })
    return badges
  }

  const engagementMetrics = getEngagementMetrics()
  const trustBadges = getTrustBadges()

  return (
    <Card className="vintage-artist-credibility-card group overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-gold-400/40">
      <CardContent className="p-0">
        {/* Enhanced Artist Header with Trust Signals */}
        <div className="relative">
          {/* Background gradient with Art Deco pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-navy-900 via-bordeaux-900 to-gold-900 opacity-10">
            <div className="absolute inset-0 opacity-20">
              <div className="art-deco-pattern w-full h-full" />
            </div>
          </div>

          <div className="relative p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-6">
              {/* Enhanced Avatar with Trust Overlay */}
              <div className="relative flex-shrink-0">
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center text-navy-900 font-bold text-3xl vintage-avatar-shadow">
                    {artist.photo ? (
                      <img
                        src={artist.photo}
                        alt={artist.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      artist.name.charAt(0)
                    )}
                  </div>

                  {/* Verification Badge Overlay */}
                  {artist.verified && (
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gold-600 rounded-full flex items-center justify-center border-2 border-cream-200 shadow-lg">
                      <CheckCircleIcon className="w-5 h-5 text-cream-200" />
                    </div>
                  )}

                  {/* Artist Type Badge */}
                  <div className="absolute -top-2 -right-2 px-3 py-1 bg-bordeaux-600 text-cream-200 rounded-full text-xs font-bold">
                    {artist.type === 'teacher' ? '👨‍🏫 Teacher' : '🎷 Musician'}
                  </div>
                </div>
              </div>

              {/* Enhanced Artist Info */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <h2 className="jazz-font text-3xl font-bold text-navy-900 mb-2 group-hover:text-bordeaux-700 transition-colors">
                      {artist.name}
                    </h2>
                    <p className="vintage-text text-lg text-navy-700 mb-3">
                      {artist.specialties.join(' • ')}
                    </p>
                  </div>

                  {/* Enhanced Follow Button */}
                  <div className="mt-4 md:mt-0">
                    <FollowButton
                      targetType={artist.type}
                      targetId={artist.id}
                      size="lg"
                      showStats={enhanced}
                    />
                  </div>
                </div>

                {/* Enhanced Trust Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {trustBadges.map((badge, index) => (
                    <Badge
                      key={index}
                      variant={badge.type === 'verified' ? 'primary' : 'secondary'}
                      className="vintage-trust-badge flex items-center space-x-1 px-3 py-1"
                    >
                      <span>{badge.icon}</span>
                      <span className="text-xs font-medium">{badge.label}</span>
                    </Badge>
                  ))}
                </div>

                {/* Enhanced Location and Experience */}
                <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm text-navy-600">
                  <div className="flex items-center space-x-2">
                    <span className="text-bordeaux-600">📍</span>
                    <span>{artist.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-gold-600">🎖️</span>
                    <span>{artist.yearsActive} years experience</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-bordeaux-600">📅</span>
                    <span>{artist.upcomingEvents} upcoming events</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Social Proof Section */}
        <div className="p-6 bg-gradient-to-b from-cream-50 to-cream-100">
          {/* Primary Metrics Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {/* Follower Count */}
            <div className="text-center p-4 bg-gold-50 rounded-lg border border-gold-200">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <UsersIcon className="w-5 h-5 text-gold-600" />
                <span className="text-2xl font-bold text-navy-900">
                  {artist.followerCount.toLocaleString()}
                </span>
              </div>
              <div className="text-sm text-navy-600 font-medium">Followers</div>
              {artist.followerCount > 500 && (
                <div className="text-xs text-gold-600 mt-1">🔥 Growing</div>
              )}
            </div>

            {/* Rating */}
            <div className="text-center p-4 bg-bordeaux-50 rounded-lg border border-bordeaux-200">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <StarIcon className="w-5 h-5 text-bordeaux-600" />
                <span className="text-2xl font-bold text-navy-900">
                  {artist.rating.toFixed(1)}
                </span>
              </div>
              <div className="text-sm text-navy-600 font-medium">Rating</div>
              <div className="text-xs text-navy-500 mt-1">
                {artist.reviewCount} reviews
              </div>
            </div>

            {/* Response Rate */}
            <div className="text-center p-4 bg-cream-100 rounded-lg border border-cream-200">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <TrendingUpIcon className="w-5 h-5 text-navy-600" />
                <span className="text-2xl font-bold text-navy-900">
                  {engagementMetrics.responseRate}%
                </span>
              </div>
              <div className="text-sm text-navy-600 font-medium">Response Rate</div>
              <div className="text-xs text-green-600 mt-1">⚡ Fast</div>
            </div>

            {/* Completion Rate */}
            <div className="text-center p-4 bg-navy-50 rounded-lg border border-navy-200">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <AwardIcon className="w-5 h-5 text-navy-600" />
                <span className="text-2xl font-bold text-navy-900">
                  {engagementMetrics.completionRate}%
                </span>
              </div>
              <div className="text-sm text-navy-600 font-medium">Completion</div>
              <div className="text-xs text-green-600 mt-1">✅ Reliable</div>
            </div>
          </div>

          {/* Enhanced Credentials Section */}
          {artist.credentials.length > 0 && (
            <div className="mb-6">
              <h3 className="vintage-text text-sm font-bold text-navy-900 uppercase tracking-wide mb-3 flex items-center">
                <AwardIcon className="w-4 h-4 mr-2 text-gold-600" />
                Credentials & Certifications
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {artist.credentials.map((credential, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-cream-200 shadow-sm"
                  >
                    <div className="w-8 h-8 bg-gold-100 rounded-full flex items-center justify-center">
                      <AwardIcon className="w-4 h-4 text-gold-600" />
                    </div>
                    <span className="text-sm text-navy-700 font-medium">{credential}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Enhanced Social Links */}
          {artist.socialLinks && Object.keys(artist.socialLinks).some(key => artist.socialLinks![key]) && (
            <div className="mb-6">
              <h3 className="vintage-text text-sm font-bold text-navy-900 uppercase tracking-wide mb-3">
                Connect & Follow
              </h3>
              <div className="flex flex-wrap gap-3">
                {artist.socialLinks.website && (
                  <a
                    href={artist.socialLinks.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="vintage-social-link px-4 py-2 bg-navy-800 text-cream-200 rounded-lg hover:bg-navy-700 transition-colors text-sm font-medium"
                  >
                    🌐 Website
                  </a>
                )}
                {artist.socialLinks.instagram && (
                  <a
                    href={artist.socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="vintage-social-link px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-colors text-sm font-medium"
                  >
                    📷 Instagram
                  </a>
                )}
                {artist.socialLinks.facebook && (
                  <a
                    href={artist.socialLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="vintage-social-link px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    👥 Facebook
                  </a>
                )}
                {artist.socialLinks.youtube && (
                  <a
                    href={artist.socialLinks.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="vintage-social-link px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                  >
                    🎥 YouTube
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Enhanced Stats Summary */}
          <div className="bg-gradient-to-r from-gold-50 to-bordeaux-50 rounded-lg p-4 border border-gold-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-navy-900">
                    {engagementMetrics.totalStudents.toLocaleString()}
                  </div>
                  <div className="text-xs text-navy-600">Total Students</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-navy-900">
                    {artist.upcomingEvents}
                  </div>
                  <div className="text-xs text-navy-600">Upcoming Events</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-navy-900">
                    {artist.rating.toFixed(1)}
                  </div>
                  <div className="text-xs text-navy-600">Average Rating</div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm font-medium text-navy-700">
                  Trust Score
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-20 h-2 bg-navy-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-gold-500 to-gold-600 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, (artist.rating / 5) * 100)}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-gold-600">
                    {Math.round((artist.rating / 5) * 100)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}