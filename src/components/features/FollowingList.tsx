'use client'

import { useState, useEffect } from 'react'
import { Heart, Users, Music, Calendar, ChevronRight, Filter, Search } from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { FollowButton } from '@/components/features/FollowButton'
import { cn } from '@/lib/utils'

interface FollowingItem {
  id: string
  name: string
  type: 'teacher' | 'musician' | 'festival'
  image?: string
  bio?: string
  specialties?: string[]
  genre?: string[]
  upcomingEvents?: number
  followersCount?: number
  verified?: boolean
  followedAt: string
}

interface FollowingListProps {
  userId?: string
  type?: 'teacher' | 'musician' | 'festival' | 'all'
  limit?: number
  showSearch?: boolean
  showFilter?: boolean
  showActions?: boolean
  compact?: boolean
  className?: string
}

export function FollowingList({
  userId,
  type = 'all',
  limit,
  showSearch = false,
  showFilter = false,
  showActions = true,
  compact = false,
  className
}: FollowingListProps) {
  const [following, setFollowing] = useState<FollowingItem[]>([])
  const [filteredFollowing, setFilteredFollowing] = useState<FollowingItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState<'all' | 'teacher' | 'musician' | 'festival'>(type)

  useEffect(() => {
    fetchFollowing()
  }, [userId, type])

  useEffect(() => {
    filterFollowing()
  }, [following, searchQuery, selectedType])

  const fetchFollowing = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const params = new URLSearchParams({
        includeDetails: 'true',
        ...(type !== 'all' && { type }),
        ...(limit && { limit: limit.toString() })
      })
      
      const endpoint = userId 
        ? `/api/users/${userId}/following?${params}`
        : `/api/users/me/following?${params}`
      
      const response = await fetch(endpoint)
      
      if (!response.ok) {
        throw new Error('Failed to fetch following data')
      }
      
      const data = await response.json()
      
      if (data.success) {
        // Transform API response to match our interface
        const transformedFollowing: FollowingItem[] = data.data.following?.map((item: any) => ({
          id: item.id,
          name: item.target.name,
          type: item.targetType,
          image: item.target.image,
          bio: item.target.bio,
          specialties: item.target.specialties,
          genre: item.target.genre,
          upcomingEvents: item.target.upcomingEvents,
          followersCount: item.target.followersCount,
          verified: item.target.verified,
          followedAt: item.createdAt
        })) || []
        
        setFollowing(transformedFollowing)
      } else {
        setError(data.error || 'Failed to load following data')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const filterFollowing = () => {
    let filtered = following

    // Apply type filter
    if (selectedType !== 'all') {
      filtered = filtered.filter(item => item.type === selectedType)
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(query) ||
        item.bio?.toLowerCase().includes(query) ||
        item.specialties?.some(s => s.toLowerCase().includes(query)) ||
        item.genre?.some(g => g.toLowerCase().includes(query))
      )
    }

    // Apply limit
    if (limit) {
      filtered = filtered.slice(0, limit)
    }

    setFilteredFollowing(filtered)
  }

  const getTypeIcon = (itemType: string) => {
    switch (itemType) {
      case 'teacher':
        return <Users className="w-4 h-4" />
      case 'musician':
        return <Music className="w-4 h-4" />
      case 'festival':
        return <Calendar className="w-4 h-4" />
      default:
        return <Heart className="w-4 h-4" />
    }
  }

  const getTypeColor = (itemType: string) => {
    switch (itemType) {
      case 'teacher':
        return 'bg-blue-100 text-blue-800'
      case 'musician':
        return 'bg-purple-100 text-purple-800'
      case 'festival':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
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
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={fetchFollowing} variant="outline">
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Search and Filter */}
      {(showSearch || showFilter) && (
        <div className="flex flex-col sm:flex-row gap-3">
          {showSearch && (
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search following..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          )}
          
          {showFilter && (
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="all">All Types</option>
              <option value="teacher">Teachers</option>
              <option value="musician">Musicians</option>
              <option value="festival">Festivals</option>
            </select>
          )}
        </div>
      )}

      {/* Following List */}
      {filteredFollowing.length === 0 ? (
        <div className="text-center py-8">
          <Heart className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500">
            {searchQuery || selectedType !== 'all' 
              ? 'No following matches your search'
              : 'Not following anyone yet'
            }
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredFollowing.map((item) => (
            <Card key={item.id} className={cn(
              'p-4 hover:bg-gray-50 transition-colors',
              compact && 'p-3'
            )}>
              <div className="flex items-start gap-3">
                <Avatar
                  name={item.name}
                  image={item.image}
                  size={compact ? 'sm' : 'md'}
                  className="flex-shrink-0"
                />
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className={cn(
                      'font-medium text-gray-900 truncate',
                      compact ? 'text-sm' : 'text-base'
                    )}>
                      {item.name}
                    </h3>
                    {item.verified && (
                      <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={cn('text-xs', getTypeColor(item.type))}>
                      {getTypeIcon(item.type)}
                      <span className="ml-1 capitalize">{item.type}</span>
                    </Badge>
                    
                    {item.upcomingEvents && (
                      <span className="text-xs text-gray-500">
                        {item.upcomingEvents} upcoming events
                      </span>
                    )}
                  </div>
                  
                  {!compact && item.bio && (
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {item.bio}
                    </p>
                  )}
                  
                  {!compact && (item.specialties || item.genre) && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {(item.specialties || item.genre)?.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-500">
                      Following since {formatDate(item.followedAt)}
                    </p>
                    
                    {item.followersCount && (
                      <div className="flex items-center gap-1">
                        <Heart className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-500">
                          {item.followersCount}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                {showActions && (
                  <div className="flex items-center gap-2">
                    <FollowButton
                      targetType={item.type}
                      targetId={item.id}
                      initialFollowing={true}
                      size="sm"
                    />
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                    >
                      <a href={`/${item.type}s/${item.id}`}>
                        <ChevronRight className="w-4 h-4" />
                      </a>
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
      
      {/* View More Link */}
      {limit && filteredFollowing.length >= limit && (
        <div className="text-center pt-4">
          <Button variant="outline" asChild>
            <a href="/profile/following">
              View All Following
            </a>
          </Button>
        </div>
      )}
    </div>
  )
}