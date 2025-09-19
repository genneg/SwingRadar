'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { FollowButton } from '@/components/features/FollowButton'
import { EventCard } from '@/components/features/EventCard'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Button } from '@/components/ui/Button'
import { BottomNavigationEnhanced } from '@/components/layout/BottomNavigationEnhanced'
import { Musician } from '@/types'
import { PersonSchema, OrganizationSchema, WebsiteSchema } from '@/components/seo/SchemaMarkup'
import BreadcrumbNavigation from '@/components/ui/BreadcrumbNavigation'

export default function MusicianProfilePage() {
  const params = useParams()
  const [musician, setMusician] = useState<Musician | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("search")

  useEffect(() => {
    const fetchMusician = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/musicians/${params.id}`)
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Musician not found')
          }
          throw new Error('Failed to load musician profile')
        }
        
        const apiResponse = await response.json()
        
        if (!apiResponse.success) {
          throw new Error(apiResponse.error || 'Failed to load musician')
        }
        
        const musicianData = apiResponse.data
        setMusician(musicianData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id) {
      fetchMusician()
    }
  }, [params.id])

  if (isLoading) {
    return (
      <div className="app-container">
        <div className="max-w-md mx-auto bg-background min-h-screen relative">
          <div className="content-wrapper flex items-center justify-center">
            <div className="card p-8 text-center">
              <div className="spinner mx-auto mb-4"></div>
              <p className="text-white/80">Loading musician profile...</p>
            </div>
          </div>
          <BottomNavigationEnhanced activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="app-container">
        <div className="max-w-md mx-auto bg-background min-h-screen relative">
          <div className="content-wrapper flex items-center justify-center">
            <div className="card p-6 border-red-600/30 bg-red-900/20">
              <div className="flex items-center mb-3">
                <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <h4 className="text-red-300 font-medium">
                  {error === 'Musician not found' ? 'Musician Not Found' : 'Error Loading Profile'}
                </h4>
              </div>
              <p className="text-red-200 text-sm mb-3">{error}</p>
              <Link href="/search">
                <Button variant="ghost" className="text-primary">
                  ← Back to Search
                </Button>
              </Link>
            </div>
          </div>
          <BottomNavigationEnhanced activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      </div>
    )
  }

  if (!musician) {
    return null
  }

  return (
    <div className="app-container">
      <div className="max-w-md mx-auto bg-background min-h-screen relative">
        {/* Enhanced Schema Markup for SEO */}
        <PersonSchema
          person={{
            name: musician.name,
            description: musician.bio,
            imageUrl: musician.imageUrl,
            url: `https://blues-festival-finder.vercel.app/musicians/${musician.id}`,
            jobTitle: "Blues Musician",
            specialties: musician.genres,
            sameAs: musician.website ? [musician.website] : undefined
          }}
        />
        <OrganizationSchema />
        <WebsiteSchema />

        {/* Enhanced Breadcrumb Navigation */}
        {musician && (
          <BreadcrumbNavigation
            items={[
              { name: 'Home', url: '/' },
              { name: 'Musicians', url: '/musicians' },
              { name: musician.name, url: `/musicians/${musician.id}`, current: true }
            ]}
            className="mb-6"
          />
        )}

        <div className="content-wrapper">
        {/* Musician Header */}
        <div className="card mb-8 p-8">
          <div className="flex flex-col gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-20 h-20 bg-gradient-to-br from-primary/30 to-primary/10 rounded-full flex items-center justify-center">
                  <svg className="w-10 h-10 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM15.657 6.343a1 1 0 011.414 0A9.972 9.972 0 0119 12a9.972 9.972 0 01-1.929 5.657 1 1 0 11-1.414-1.414A7.971 7.971 0 0017 12c0-1.594-.471-3.077-1.343-4.343a1 1 0 010-1.414zm-2.829 2.829a1 1 0 011.415 0A5.983 5.983 0 0115 12a5.984 5.984 0 01-.757 2.828 1 1 0 01-1.415-1.414A3.989 3.989 0 0013 12a3.988 3.988 0 00-.172-1.172 1 1 0 010-1.415z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h1 className="font-playfair text-3xl font-bold text-white mb-2">
                      {musician.name}
                    </h1>
                    <p className="text-white/80 flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM15.657 6.343a1 1 0 011.414 0A9.972 9.972 0 0119 12a9.972 9.972 0 01-1.929 5.657 1 1 0 11-1.414-1.414A7.971 7.971 0 0017 12c0-1.594-.471-3.077-1.343-4.343a1 1 0 010-1.414zm-2.829 2.829a1 1 0 011.415 0A5.983 5.983 0 0115 12a5.984 5.984 0 01-.757 2.828 1 1 0 01-1.415-1.414A3.989 3.989 0 0013 12a3.988 3.988 0 00-.172-1.172 1 1 0 010-1.415z" clipRule="evenodd" />
                      </svg>
                      Blues Musician
                    </p>
                  </div>
                </div>

                {/* Genres */}
                {musician.genre && musician.genre.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-primary mb-2">Genres</h3>
                    <div className="flex flex-wrap gap-2">
                      {musician.genre.map((genre, idx) => (
                        <span
                          key={idx}
                          className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-medium"
                        >
                          {genre}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Bio */}
                {musician.bio && (
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-primary mb-2">About</h3>
                    <p className="text-white/80 leading-relaxed whitespace-pre-line">
                      {musician.bio}
                    </p>
                  </div>
                )}

                {/* Social Links */}
                {musician.socialLinks && (
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-primary mb-2">Listen & Connect</h3>
                    <div className="flex gap-3">
                      {musician.website && (
                        <a
                          href={musician.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white/60 hover:text-primary transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      )}
                      {musician.socialLinks.spotify && (
                        <a
                          href={musician.socialLinks.spotify}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white/60 hover:text-green-400 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
                          </svg>
                        </a>
                      )}
                      {musician.socialLinks.youtube && (
                        <a
                          href={musician.socialLinks.youtube}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white/60 hover:text-red-400 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                          </svg>
                        </a>
                      )}
                      {musician.socialLinks.facebook && (
                        <a
                          href={musician.socialLinks.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white/60 hover:text-blue-400 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                          </svg>
                        </a>
                      )}
                      {musician.socialLinks.instagram && (
                        <a
                          href={musician.socialLinks.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white/60 hover:text-pink-400 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987c6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 20.312c-3.347 0-6.062-2.715-6.062-6.062s2.715-6.062 6.062-6.062s6.062 2.715 6.062 6.062s-2.715 6.062-6.062 6.062z"/>
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Follow Button and Stats */}
              <div className="flex flex-col items-center gap-4 mt-6">
                <FollowButton
                  targetType="musician"
                  targetId={musician.id}
                  size="lg"
                />
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    {musician.followers?.length || 0}
                  </div>
                  <div className="text-sm text-white/60">Followers</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Performances */}
        <div className="card">
          <div className="p-6">
            <h3 className="font-playfair text-2xl font-semibold text-white mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
              Upcoming Performances ({musician.festivals?.length || 0})
            </h3>
            <div className="content">
            {musician.festivals && musician.festivals.length > 0 ? (
              <div className="space-y-6">
                {musician.festivals.map((festival) => (
                  <EventCard key={festival.id} event={festival} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-white">No upcoming performances</h3>
                <p className="mt-1 text-sm text-white/60">
                  {musician.name} doesn't have any upcoming performances scheduled.
                </p>
              </div>
            )}
            </div>
          </div>
        </div>

        {/* Back Navigation */}
        <div className="mt-8 text-center">
          <Link href="/search">
            <Button variant="ghost" className="text-primary">
              ← Back to Search
            </Button>
          </Link>
        </div>

        {/* Bottom Navigation */}
        <BottomNavigationEnhanced activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </div>
  )
}