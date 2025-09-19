import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import {
  HeartIcon,
  StarIcon,
  BookmarkIcon,
  UsersIcon,
  MapPinIcon,
  CalendarIcon
} from '@/components/ui/Icon'

interface WishlistItem {
  id: string
  eventId: string
  eventName: string
  eventDate: string
  location: string
  priceRange: string
  imageUrl?: string
  addedAt: string
  priority: 'high' | 'medium' | 'low'
  notes?: string
}

interface RecommendationData {
  id: string
  type: 'event' | 'teacher' | 'musician'
  title: string
  description: string
  score: number
  reasons: string[]
  imageUrl?: string
  date?: string
  location?: string
  price?: string
  isBookmarked: boolean
}

interface EngagementFeaturesProps {
  userId?: string
  compact?: boolean
  showWishlist?: boolean
  showRecommendations?: boolean
}

export function EngagementFeatures({
  userId,
  compact = false,
  showWishlist = true,
  showRecommendations = true
}: EngagementFeaturesProps) {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([])
  const [recommendations, setRecommendations] = useState<RecommendationData[]>([])
  const [showWishlistModal, setShowWishlistModal] = useState(false)
  const [showRecommendationsModal, setShowRecommendationsModal] = useState(false)

  // Mock data - in real app this would come from API
  useEffect(() => {
    // Mock wishlist data
    setWishlist([
      {
        id: '1',
        eventId: 'event-1',
        eventName: 'Blues Festival Madrid 2024',
        eventDate: '2024-03-15',
        location: 'Madrid, Spain',
        priceRange: '€120-€200',
        imageUrl: '/events/madrid-blues.jpg',
        addedAt: '2024-01-10',
        priority: 'high',
        notes: 'Must attend Vicci & Adamo workshops'
      },
      {
        id: '2',
        eventId: 'event-2',
        eventName: 'Barcelona Blues Weekend',
        eventDate: '2024-04-20',
        location: 'Barcelona, Spain',
        priceRange: '€80-€150',
        addedAt: '2024-01-12',
        priority: 'medium'
      }
    ])

    // Mock recommendations data
    setRecommendations([
      {
        id: 'rec-1',
        type: 'event',
        title: 'Seaside Blues Festival',
        description: 'Perfect match for your love of coastal blues festivals',
        score: 95,
        reasons: [
          'Similar to events you\'ve saved',
          'Features your favorite teacher Vicci',
          'Coastal location preference',
          'Excellent timing for your schedule'
        ],
        imageUrl: '/events/seaside-blues.jpg',
        date: '2024-05-10',
        location: 'Lisbon, Portugal',
        price: '€100-€180',
        isBookmarked: false
      },
      {
        id: 'rec-2',
        type: 'teacher',
        title: 'Marcus Valdez',
        description: 'New blues instructor with exceptional technique',
        score: 88,
        reasons: [
          'Specializes in your preferred dance style',
          'Highly rated by community',
          'Teaching at upcoming festivals',
          'Similar teaching style to your favorites'
        ],
        imageUrl: '/teachers/marcus-valdez.jpg',
        isBookmarked: true
      },
      {
        id: 'rec-3',
        type: 'event',
        title: 'Alpine Blues Retreat',
        description: 'Mountain blues festival with intimate setting',
        score: 82,
        reasons: [
          'Unique mountain venue',
          'Small class sizes',
          'Extended workshop format',
          'Great for intermediate dancers'
        ],
        date: '2024-06-15',
        location: 'Swiss Alps, Switzerland',
        price: '€200-€300',
        isBookmarked: false
      }
    ])
  }, [])

  // const addToWishlist = (eventId: string, eventData: any) => {
  //   const newItem: WishlistItem = {
  //     id: `wishlist-${Date.now()}`,
  //     eventId,
  //     eventName: eventData.name,
  //     eventDate: eventData.startDate,
  //     location: eventData.location,
  //     priceRange: eventData.priceRange,
  //     imageUrl: eventData.imageUrl,
  //     addedAt: new Date().toISOString(),
  //     priority: 'medium'
  //   }
  //   setWishlist(prev => [...prev, newItem])
  // }

  const removeFromWishlist = (itemId: string) => {
    setWishlist(prev => prev.filter(item => item.id !== itemId))
  }

  const updateWishlistPriority = (itemId: string, priority: 'high' | 'medium' | 'low') => {
    setWishlist(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, priority } : item
      )
    )
  }

  const toggleRecommendationBookmark = (recId: string) => {
    setRecommendations(prev =>
      prev.map(rec =>
        rec.id === recId ? { ...rec, isBookmarked: !rec.isBookmarked } : rec
      )
    )
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-700 border-green-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'bg-green-500'
    if (score >= 80) return 'bg-yellow-500'
    if (score >= 70) return 'bg-orange-500'
    return 'bg-red-500'
  }

  if (compact) {
    return (
      <div className="engagement-features-compact space-y-4">
        {/* Compact Wishlist Summary */}
        {showWishlist && (
          <div className="bg-gold-50 border border-gold-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <HeartIcon className="w-5 h-5 text-gold-600" />
                <span className="font-semibold text-navy-900">My Wishlist</span>
              </div>
              <Badge variant="secondary">{wishlist.length} saved</Badge>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowWishlistModal(true)}
              className="w-full"
            >
              View Wishlist
            </Button>
          </div>
        )}

        {/* Compact Recommendations Summary */}
        {showRecommendations && (
          <div className="bg-bordeaux-50 border border-bordeaux-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <StarIcon className="w-5 h-5 text-bordeaux-600" />
                <span className="font-semibold text-navy-900">For You</span>
              </div>
              <Badge variant="secondary">{recommendations.length} new</Badge>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowRecommendationsModal(true)}
              className="w-full"
            >
              View Recommendations
            </Button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="engagement-features space-y-6">
      {/* Wishlist Section */}
      {showWishlist && (
        <Card className="vintage-wishlist-card">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <HeartIcon className="w-6 h-6 text-gold-600" />
                <span className="jazz-font text-xl text-navy-900">My Festival Wishlist</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary">{wishlist.length} events</Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowWishlistModal(true)}
                >
                  View All
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {wishlist.length === 0 ? (
              <div className="text-center py-8">
                <HeartIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-navy-600 mb-4">Your wishlist is empty</p>
                <p className="text-sm text-navy-500">Start saving events you're interested in!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {wishlist.slice(0, 4).map((item) => (
                  <div
                    key={item.id}
                    className="p-4 bg-white border border-cream-200 rounded-lg hover:border-gold-400 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-navy-900 mb-1">{item.eventName}</h4>
                        <div className="flex items-center space-x-4 text-sm text-navy-600">
                          <span className="flex items-center">
                            <CalendarIcon className="w-4 h-4 mr-1" />
                            {new Date(item.eventDate).toLocaleDateString()}
                          </span>
                          <span className="flex items-center">
                            <MapPinIcon className="w-4 h-4 mr-1" />
                            {item.location}
                          </span>
                        </div>
                      </div>
                      <Badge
                        variant="secondary"
                        className={`${getPriorityColor(item.priority)} text-xs`}
                      >
                        {item.priority}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gold-600">{item.priceRange}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromWishlist(item.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Recommendations Section */}
      {showRecommendations && (
        <Card className="vintage-recommendations-card">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <StarIcon className="w-6 h-6 text-bordeaux-600" />
                <span className="jazz-font text-xl text-navy-900">Recommended For You</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary">{recommendations.length} suggestions</Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowRecommendationsModal(true)}
                >
                  View All
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.map((rec) => (
                <div
                  key={rec.id}
                  className="relative bg-gradient-to-br from-cream-50 to-white border border-cream-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 group"
                >
                  {/* Recommendation Score Badge */}
                  <div className="absolute top-4 right-4 z-10">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm ${getScoreColor(rec.score)}`}>
                      {rec.score}%
                    </div>
                  </div>

                  {/* Bookmark Button */}
                  <button
                    onClick={() => toggleRecommendationBookmark(rec.id)}
                    className="absolute top-4 left-4 z-10 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
                  >
                    <BookmarkIcon
                      className={`w-4 h-4 ${rec.isBookmarked ? 'text-gold-600 fill-current' : 'text-gray-400'}`}
                    />
                  </button>

                  {/* Content */}
                  <div className="p-6">
                    {rec.imageUrl && (
                      <div className="w-full h-32 bg-gradient-to-br from-navy-800 to-bordeaux-900 rounded-lg mb-4 flex items-center justify-center">
                        <div className="text-4xl opacity-60">
                          {rec.type === 'event' ? '🎭' : rec.type === 'teacher' ? '👨‍🏫' : '🎷'}
                        </div>
                      </div>
                    )}

                    <div className="mb-3">
                      <Badge variant="secondary" className="mb-2">
                        {rec.type === 'event' ? 'Event' : rec.type === 'teacher' ? 'Teacher' : 'Musician'}
                      </Badge>
                      <h3 className="font-semibold text-navy-900 text-lg mb-2">{rec.title}</h3>
                      <p className="text-sm text-navy-600 mb-3">{rec.description}</p>
                    </div>

                    {/* Additional Info */}
                    {(rec.date || rec.location || rec.price) && (
                      <div className="space-y-1 mb-3">
                        {rec.date && (
                          <div className="flex items-center text-xs text-navy-600">
                            <CalendarIcon className="w-3 h-3 mr-1" />
                            {new Date(rec.date).toLocaleDateString()}
                          </div>
                        )}
                        {rec.location && (
                          <div className="flex items-center text-xs text-navy-600">
                            <MapPinIcon className="w-3 h-3 mr-1" />
                            {rec.location}
                          </div>
                        )}
                        {rec.price && (
                          <div className="text-xs font-medium text-gold-600">
                            {rec.price}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Match Reasons */}
                    <div className="mb-4">
                      <h4 className="text-xs font-bold text-navy-900 uppercase tracking-wide mb-2">
                        Why we recommend:
                      </h4>
                      <ul className="space-y-1">
                        {rec.reasons.slice(0, 2).map((reason, index) => (
                          <li key={index} className="text-xs text-navy-600 flex items-start">
                            <span className="text-green-500 mr-2">✓</span>
                            {reason}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button
                      variant="primary"
                      size="sm"
                      className="w-full vintage-button"
                    >
                      Learn More
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Wishlist Modal */}
      <Modal
        isOpen={showWishlistModal}
        onClose={() => setShowWishlistModal(false)}
        title="My Festival Wishlist"
        size="lg"
      >
        <div className="space-y-4">
          {wishlist.map((item) => (
            <div key={item.id} className="p-4 border border-cream-200 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-navy-900">{item.eventName}</h4>
                  <p className="text-sm text-navy-600">
                    {new Date(item.eventDate).toLocaleDateString()} • {item.location}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <select
                    value={item.priority}
                    onChange={(e) => updateWishlistPriority(item.id, e.target.value as any)}
                    className="text-sm border border-cream-200 rounded px-2 py-1"
                  >
                    <option value="high">High Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="low">Low Priority</option>
                  </select>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFromWishlist(item.id)}
                    className="text-red-600"
                  >
                    Remove
                  </Button>
                </div>
              </div>
              {item.notes && (
                <p className="text-sm text-navy-700 italic">{item.notes}</p>
              )}
            </div>
          ))}
        </div>
      </Modal>

      {/* Recommendations Modal */}
      <Modal
        isOpen={showRecommendationsModal}
        onClose={() => setShowRecommendationsModal(false)}
        title="All Recommendations"
        size="xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recommendations.map((rec) => (
            <div key={rec.id} className="p-6 border border-cream-200 rounded-lg">
              {/* Similar compact recommendation card */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <Badge variant="secondary" className="mb-2">
                    {rec.type}
                  </Badge>
                  <h3 className="font-semibold text-navy-900">{rec.title}</h3>
                  <p className="text-sm text-navy-600 mt-1">{rec.description}</p>
                </div>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${getScoreColor(rec.score)}`}>
                  {rec.score}%
                </div>
              </div>

              <ul className="space-y-1 mb-4">
                {rec.reasons.map((reason, index) => (
                  <li key={index} className="text-sm text-navy-600 flex items-start">
                    <span className="text-green-500 mr-2 mt-0.5">✓</span>
                    {reason}
                  </li>
                ))}
              </ul>

              <div className="flex items-center justify-between">
                <Button variant="primary" size="sm">
                  View Details
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleRecommendationBookmark(rec.id)}
                >
                  <BookmarkIcon className={`w-4 h-4 ${rec.isBookmarked ? 'text-gold-600 fill-current' : 'text-gray-400'}`} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  )
}