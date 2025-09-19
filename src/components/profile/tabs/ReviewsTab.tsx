'use client'

import { useEffect, useState } from 'react'
import { MessageCircle, Star, ExternalLink } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/Button'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

interface ReviewsTabProps {
  userId: string
}

interface Review {
  id: string
  rating: number
  review: string | null
  createdAt: string
  event: {
    id: string
    name: string
    slug: string
  }
}

export function ReviewsTab({ userId }: ReviewsTabProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`/api/users/me`)
        const data = await response.json()
        
        if (data.success) {
          setReviews(data.data.recentActivity.reviews || [])
        } else {
          setError(data.error || 'Failed to load reviews')
        }
      } catch (error) {
        setError('An error occurred while loading reviews')
      } finally {
        setLoading(false)
      }
    }

    fetchReviews()
  }, [userId])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating 
            ? 'text-yellow-500 fill-current' 
            : 'text-gray-300'
        }`}
      />
    ))
  }

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">{error}</p>
      </div>
    )
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">No reviews yet</p>
        <p className="text-sm text-gray-400 mt-2">
          Write reviews for events you've attended
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">
          Reviews ({reviews.length})
        </h3>
      </div>

      <div className="space-y-4">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-2">
                  <h4 className="text-sm font-medium text-gray-900 truncate">
                    {review.event.name}
                  </h4>
                  <Link href={`/events/${review.event.slug}`}>
                    <ExternalLink className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                  </Link>
                </div>
                
                <div className="flex items-center space-x-2 mb-2">
                  <div className="flex items-center space-x-1">
                    {renderStars(review.rating)}
                  </div>
                  <span className="text-sm text-gray-500">
                    {review.rating} out of 5 stars
                  </span>
                </div>

                {review.review && (
                  <p className="text-sm text-gray-700 mb-2">
                    "{review.review}"
                  </p>
                )}

                <p className="text-xs text-gray-400">
                  Reviewed on {formatDate(review.createdAt)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}