'use client'

import { useState, useEffect, useCallback } from 'react'
import { Search, Filter, Users, Music, Calendar, Heart, UserX, MoreHorizontal, Check } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Modal } from '@/components/ui/Modal'
import { useFollowing } from '@/hooks/useFollowing'
import { cn } from '@/lib/utils'

interface FollowingItem {
  id: string
  targetType: 'teacher' | 'musician' | 'festival'
  target: {
    id: string
    name: string
    bio?: string
    specialties?: string[]
    genre?: string[]
    image?: string
    upcomingEvents?: number
    verified?: boolean
    deleted?: boolean
  }
  createdAt: string
}

interface FollowingManagementProps {
  userId: string
  className?: string
}

export function FollowingManagement({ userId, className }: FollowingManagementProps) {
  const [following, setFollowing] = useState<FollowingItem[]>([])
  const [filteredFollowing, setFilteredFollowing] = useState<FollowingItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState<'all' | 'teacher' | 'musician' | 'festival'>('all')
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'type'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  
  // Bulk actions state
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())
  const [bulkAction, setBulkAction] = useState<'none' | 'unfollow'>('none')
  const [showBulkModal, setShowBulkModal] = useState(false)
  const [bulkLoading, setBulkLoading] = useState(false)
  
  // Stats
  const [stats, setStats] = useState({
    total: 0,
    teachers: 0,
    musicians: 0,
    festivals: 0
  })

  const { toggleFollow, isLoading } = useFollowing()

  // Fetch following data
  const fetchFollowing = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/users/${userId}/following?includeDetails=true&sortBy=${sortBy}&sortOrder=${sortOrder}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch following data')
      }
      
      const data = await response.json()
      
      if (data.success) {
        setFollowing(data.data.following || [])
        setStats(data.data.stats || { total: 0, teachers: 0, musicians: 0, festivals: 0 })
      } else {
        setError(data.error || 'Failed to load following data')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }, [userId, sortBy, sortOrder])

  // Filter and search logic
  useEffect(() => {
    let filtered = following

    // Apply type filter
    if (selectedType !== 'all') {
      filtered = filtered.filter(item => item.targetType === selectedType)
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(item => 
        item.target.name.toLowerCase().includes(query) ||
        item.target.bio?.toLowerCase().includes(query) ||
        item.target.specialties?.some(s => s.toLowerCase().includes(query)) ||
        item.target.genre?.some(g => g.toLowerCase().includes(query))
      )
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0
      
      switch (sortBy) {
        case 'name':
          comparison = a.target.name.localeCompare(b.target.name)
          break
        case 'date':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          break
        case 'type':
          comparison = a.targetType.localeCompare(b.targetType)
          break
      }
      
      return sortOrder === 'asc' ? comparison : -comparison
    })

    setFilteredFollowing(filtered)
  }, [following, searchQuery, selectedType, sortBy, sortOrder])

  // Load data on mount
  useEffect(() => {
    fetchFollowing()
  }, [fetchFollowing])

  // Handle individual unfollow
  const handleUnfollow = async (item: FollowingItem) => {
    try {
      const result = await toggleFollow(item.targetType, item.target.id)
      
      if (result.success) {
        // Remove from local state
        setFollowing(prev => prev.filter(f => f.id !== item.id))
        
        // Update stats
        setStats(prev => ({
          ...prev,
          total: prev.total - 1,
          [item.targetType + 's']: prev[item.targetType + 's' as keyof typeof prev] - 1
        }))
      }
    } catch (err) {
      console.error('Failed to unfollow:', err)
    }
  }

  // Handle bulk actions
  const handleBulkUnfollow = async () => {
    if (selectedItems.size === 0) return
    
    setBulkLoading(true)
    
    try {
      const targets = Array.from(selectedItems).map(id => {
        const item = following.find(f => f.id === id)
        return {
          targetId: item?.target.id,
          targetType: item?.targetType
        }
      }).filter(Boolean)
      
      const response = await fetch(`/api/users/${userId}/following`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ targets })
      })
      
      if (response.ok) {
        // Remove unfollowed items from state
        setFollowing(prev => prev.filter(f => !selectedItems.has(f.id)))
        setSelectedItems(new Set())
        setShowBulkModal(false)
        
        // Refresh stats
        fetchFollowing()
      }
    } catch (err) {
      console.error('Bulk unfollow failed:', err)
    } finally {
      setBulkLoading(false)
    }
  }

  // Toggle item selection
  const toggleSelection = (id: string) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  // Select all visible items
  const selectAll = () => {
    setSelectedItems(new Set(filteredFollowing.map(item => item.id)))
  }

  // Clear selection
  const clearSelection = () => {
    setSelectedItems(new Set())
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
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

  const getTypeColor = (type: string) => {
    switch (type) {
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

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={() => fetchFollowing()} variant="outline">
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header with stats */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Following</h2>
          <p className="text-gray-600">Manage your followed teachers, musicians, and festivals</p>
        </div>
        
        <div className="flex gap-4 text-sm">
          <div className="text-center">
            <div className="font-semibold text-gray-900">{stats.total}</div>
            <div className="text-gray-500">Total</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-blue-600">{stats.teachers}</div>
            <div className="text-gray-500">Teachers</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-purple-600">{stats.musicians}</div>
            <div className="text-gray-500">Musicians</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-green-600">{stats.festivals}</div>
            <div className="text-gray-500">Festivals</div>
          </div>
        </div>
      </div>

      {/* Search and filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by name, bio, or specialties..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
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
            
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [sort, order] = e.target.value.split('-')
                setSortBy(sort as any)
                setSortOrder(order as any)
              }}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="name-asc">Name A-Z</option>
              <option value="name-desc">Name Z-A</option>
              <option value="type-asc">Type A-Z</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Bulk actions */}
      {selectedItems.size > 0 && (
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Check className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">
                {selectedItems.size} selected
              </span>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={clearSelection}
              >
                Clear
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowBulkModal(true)}
                className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
              >
                <UserX className="w-4 h-4 mr-1" />
                Unfollow Selected
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Following list */}
      {filteredFollowing.length === 0 ? (
        <div className="text-center py-12">
          <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">
            {searchQuery || selectedType !== 'all' 
              ? 'No following matches your filters' 
              : 'Not following anyone yet'
            }
          </p>
          {searchQuery || selectedType !== 'all' ? (
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery('')
                setSelectedType('all')
              }}
              className="mt-4"
            >
              Clear Filters
            </Button>
          ) : null}
        </div>
      ) : (
        <div className="space-y-4">
          {/* Select all option */}
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-md">
            <input
              type="checkbox"
              checked={selectedItems.size === filteredFollowing.length}
              onChange={() => {
                if (selectedItems.size === filteredFollowing.length) {
                  clearSelection()
                } else {
                  selectAll()
                }
              }}
              className="rounded border-gray-300"
            />
            <label className="text-sm text-gray-700">
              Select all {filteredFollowing.length} items
            </label>
          </div>

          {/* Following items */}
          {filteredFollowing.map((item) => (
            <Card key={item.id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start gap-4">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selectedItems.has(item.id)}
                    onChange={() => toggleSelection(item.id)}
                    className="rounded border-gray-300 mt-1"
                  />
                  
                  <Avatar
                    name={item.target.name}
                    image={item.target.image}
                    size="md"
                    className="flex-shrink-0"
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-gray-900 truncate">
                      {item.target.name}
                    </h3>
                    {item.target.verified && (
                      <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                        <Check className="w-2 h-2 text-white" />
                      </div>
                    )}
                    {item.target.deleted && (
                      <Badge variant="secondary" className="text-xs">
                        Deleted
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={cn('text-xs', getTypeColor(item.targetType))}>
                      {getTypeIcon(item.targetType)}
                      <span className="ml-1 capitalize">{item.targetType}</span>
                    </Badge>
                    
                    {item.target.upcomingEvents && (
                      <span className="text-xs text-gray-500">
                        {item.target.upcomingEvents} upcoming events
                      </span>
                    )}
                  </div>
                  
                  {item.target.bio && (
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {item.target.bio}
                    </p>
                  )}
                  
                  {(item.target.specialties || item.target.genre) && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {(item.target.specialties || item.target.genre)?.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  <p className="text-xs text-gray-500">
                    Following since {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUnfollow(item)}
                    loading={isLoading(item.targetType, item.target.id)}
                    disabled={item.target.deleted}
                    className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                  >
                    <UserX className="w-4 h-4 mr-1" />
                    Unfollow
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Bulk unfollow confirmation modal */}
      <Modal
        isOpen={showBulkModal}
        onClose={() => setShowBulkModal(false)}
        title="Confirm Bulk Unfollow"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to unfollow {selectedItems.size} selected items?
            This action cannot be undone.
          </p>
          
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => setShowBulkModal(false)}
              disabled={bulkLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleBulkUnfollow}
              loading={bulkLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              Unfollow {selectedItems.size} Items
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}