'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FollowingManagement } from '@/components/features/FollowingManagement'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Users, Music, Calendar, Search } from 'lucide-react'

// Types for following data
interface FollowingStats {
  teachers: number
  musicians: number
  totalEvents: number
  recentUpdates: number
}

export default function DashboardFollowingPage() {
  const [stats, setStats] = useState<FollowingStats>({
    teachers: 0,
    musicians: 0,
    totalEvents: 0,
    recentUpdates: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch following stats from API
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true)
        // TODO: Replace with actual following stats API
        // For now, using mock data
        setStats({
          teachers: 8,
          musicians: 5,
          totalEvents: 23,
          recentUpdates: 3
        })
      } catch (error) {
        setError('Failed to load following data')
        console.error('Error fetching following stats:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  return (
    <div className="app-container">
      <div className="max-w-md mx-auto bg-background min-h-screen">
        {/* Header */}
        <div className="p-6 border-b border-border/50">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-playfair text-foreground">Following</h1>
            <Link href="/search">
              <Button size="sm" className="flex items-center gap-2">
                <Search className="w-4 h-4" />
                Discover
              </Button>
            </Link>
          </div>
          
          <p className="text-muted-foreground text-sm">
            Manage your followed teachers and musicians, and stay updated on their events.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="p-6 border-b border-border/50">
          {isLoading ? (
            <div className="text-center py-8">
              <LoadingSpinner className="mx-auto mb-4" />
              <p className="text-white/80">Loading following data...</p>
            </div>
          ) : error ? (
            <div className="card p-4 border-error-600/30 bg-error-900/20">
              <p className="text-error-300 text-sm">{error}</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <div className="stats-card">
                <Users className="w-5 h-5 text-primary mx-auto mb-2" />
                <p className="text-xl font-medium text-primary">{stats.teachers}</p>
                <p className="text-xs text-muted-foreground">Teachers</p>
              </div>
              <div className="stats-card">
                <Music className="w-5 h-5 text-primary mx-auto mb-2" />
                <p className="text-xl font-medium text-primary">{stats.musicians}</p>
                <p className="text-xs text-muted-foreground">Musicians</p>
              </div>
              <div className="stats-card">
                <Calendar className="w-5 h-5 text-primary mx-auto mb-2" />
                <p className="text-xl font-medium text-primary">{stats.totalEvents}</p>
                <p className="text-xs text-muted-foreground">Total Events</p>
              </div>
              <div className="stats-card relative">
                <Users className="w-5 h-5 text-primary mx-auto mb-2" />
                <p className="text-xl font-medium text-primary">{stats.recentUpdates}</p>
                <p className="text-xs text-muted-foreground">New Updates</p>
                {stats.recentUpdates > 0 && (
                  <Badge size="sm" className="absolute -top-1 -right-1">
                    {stats.recentUpdates}
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Following Management Component */}
        <div className="p-6">
          {!isLoading && !error && (
            <FollowingManagement />
          )}
          
          {/* Empty State */}
          {!isLoading && !error && stats.teachers === 0 && stats.musicians === 0 && (
            <div className="card p-8 text-center">
              <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                Start Following Artists
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Follow your favorite teachers and musicians to get notified about their upcoming events.
              </p>
              <div className="space-y-2">
                <Link href="/search?type=teachers">
                  <Button className="w-full" size="sm">
                    Browse Teachers
                  </Button>
                </Link>
                <Link href="/musicians">
                  <Button variant="outline" className="w-full" size="sm">
                    Browse Musicians
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}