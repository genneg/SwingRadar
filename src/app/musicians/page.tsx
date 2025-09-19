'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArtistCardEnhanced } from '@/components/features/ArtistCardEnhanced'
import { SearchBarSimple } from '@/components/features/SearchBarSimple'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Music, Users, TrendingUp } from 'lucide-react'

// Types for API responses
interface Musician {
  id: string | number
  name: string
  bio?: string | null
  instruments?: string[]
  website?: string | null
  image_url?: string | null
  followerCount?: number | null
  eventCount?: number | null
}

export default function MusiciansPage() {
  const [musicians, setMusicians] = useState<Musician[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  // Fetch musicians from API
  useEffect(() => {
    const fetchMusicians = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/musicians?limit=20')
        const data = await response.json()
        
        if (data.success) {
          setMusicians(data.data.musicians || [])
        } else {
          setError('Failed to load musicians')
        }
      } catch (error) {
        setError('Failed to load musicians')
        console.error('Error fetching musicians:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMusicians()
  }, [])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    // TODO: Implement search functionality
  }

  // Transform musician data for ArtistCardEnhanced component
  const transformMusicianForCard = (musician: Musician) => {
    return {
      id: musician.id.toString(),
      name: musician.name,
      instrument: musician.instruments?.[0] || 'Musician',
      location: 'Various',
      nextShow: 'TBA',
      followers: musician.followerCount || 0,
      imageUrl: musician.image_url || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop",
      genres: musician.instruments || ['Blues'],
      isFollowing: false
    }
  }

  const filteredMusicians = musicians.filter(musician =>
    musician.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="app-container">
      <div className="max-w-md mx-auto bg-background min-h-screen">
        {/* Header */}
        <div className="p-6 border-b border-border/50">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-playfair text-foreground">Musicians</h1>
            <Link href="/search">
              <Button variant="outline" size="sm">
                Advanced Search
              </Button>
            </Link>
          </div>
          
          {/* Search */}
          <SearchBarSimple 
            onSearch={handleSearch} 
            placeholder="Search musicians..."
          />
          
          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3 mt-4">
            <div className="stats-card">
              <Music className="w-5 h-5 text-primary mx-auto mb-2" />
              <p className="text-xl font-medium text-primary">{musicians.length}</p>
              <p className="text-xs text-muted-foreground">Artists</p>
            </div>
            <div className="stats-card">
              <Users className="w-5 h-5 text-primary mx-auto mb-2" />
              <p className="text-xl font-medium text-primary">
                {musicians.reduce((acc, m) => acc + (m.followerCount || 0), 0)}
              </p>
              <p className="text-xs text-muted-foreground">Followers</p>
            </div>
            <div className="stats-card">
              <TrendingUp className="w-5 h-5 text-primary mx-auto mb-2" />
              <p className="text-xl font-medium text-primary">
                {musicians.reduce((acc, m) => acc + (m.eventCount || 0), 0)}
              </p>
              <p className="text-xs text-muted-foreground">Events</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Filter Tags */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="primary" size="sm">All</Badge>
            <Badge variant="secondary" size="sm">Blues</Badge>
            <Badge variant="secondary" size="sm">Jazz</Badge>
            <Badge variant="secondary" size="sm">Traditional</Badge>
          </div>

          {/* Musicians List */}
          <div className="space-y-4">
            {isLoading && (
              <div className="card p-8 text-center">
                <LoadingSpinner className="mx-auto mb-4" />
                <p className="text-white/80">Loading musicians...</p>
              </div>
            )}
            
            {error && (
              <div className="card p-4 border-error-600/30 bg-error-900/20">
                <p className="text-error-300 text-sm">{error}</p>
              </div>
            )}
            
            {!isLoading && !error && filteredMusicians.length === 0 && (
              <div className="card p-8 text-center">
                <Music className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-white/80 mb-2">No musicians found</p>
                <p className="text-sm text-muted-foreground">
                  {searchQuery ? 'Try adjusting your search terms' : 'Check back later for new artists'}
                </p>
              </div>
            )}
            
            {!isLoading && !error && filteredMusicians.map((musician) => (
              <Link key={musician.id} href={`/musicians/${musician.id}`}>
                <ArtistCardEnhanced {...transformMusicianForCard(musician)} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}