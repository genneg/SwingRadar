'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { FollowButton } from '@/components/features/FollowButton'
import { EventCard } from '@/components/features/EventCard'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Button } from '@/components/ui/Button'
import { BottomNavigationEnhanced } from '@/components/layout/BottomNavigationEnhanced'
import { Teacher } from '@/types'
import { PersonSchema, OrganizationSchema, WebsiteSchema } from '@/components/seo/SchemaMarkup'
import BreadcrumbNavigation from '@/components/ui/BreadcrumbNavigation'

export default function TeacherProfilePage() {
  const params = useParams()
  const [teacher, setTeacher] = useState<Teacher | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("teachers")

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/teachers/${params.id}`)
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Teacher not found')
          }
          throw new Error('Failed to load teacher profile')
        }
        
        const apiResponse = await response.json()
        
        if (!apiResponse.success) {
          throw new Error(apiResponse.error || 'Failed to load teacher')
        }
        
        const teacherData = apiResponse.data
        setTeacher(teacherData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id) {
      fetchTeacher()
    }
  }, [params.id])

  if (isLoading) {
    return (
      <div className="app-container">
        <div className="max-w-md mx-auto bg-background min-h-screen flex items-center justify-center">
          <div className="card p-8 text-center">
            <div className="spinner mx-auto mb-4"></div>
            <p className="text-white/80">Loading teacher profile...</p>
            <p className="text-white/60 text-sm mt-2">Retrieving blues dance expertise</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="app-container">
        <div className="max-w-md mx-auto bg-background min-h-screen flex items-center justify-center">
          <div className="card p-6 border-error-600/30 bg-error-900/20 text-center max-w-sm">
            <svg className="w-12 h-12 text-error-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" />
            </svg>
            <h2 className="text-xl font-semibold text-error-300 mb-2">
              {error === 'Teacher not found' ? 'Teacher Not Found' : 'Error Loading Profile'}
            </h2>
            <p className="text-error-200 mb-4 text-sm">{error}</p>
            <Link href="/teachers" className="btn-primary btn-sm">
              ← Back to Teachers
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!teacher) {
    return null
  }

  return (
    <div className="app-container">
      <div className="max-w-md mx-auto bg-background min-h-screen relative">
        {/* Enhanced Schema Markup for SEO */}
        <PersonSchema
          person={{
            name: teacher.name,
            description: teacher.bio,
            imageUrl: teacher.imageUrl,
            url: `https://blues-festival-finder.vercel.app/teachers/${teacher.id}`,
            jobTitle: "Blues Dance Teacher",
            specialties: teacher.specialties,
            sameAs: teacher.website ? [teacher.website] : undefined
          }}
        />
        <OrganizationSchema />
        <WebsiteSchema />

        {/* Enhanced Breadcrumb Navigation */}
        {teacher && (
          <BreadcrumbNavigation
            items={[
              { name: 'Home', url: '/' },
              { name: 'Teachers', url: '/teachers' },
              { name: teacher.name, url: `/teachers/${teacher.id}`, current: true }
            ]}
            className="mb-6"
          />
        )}

        {/* Main Content */}
        <div className="content-wrapper space-y-6">
          {/* Teacher Header */}
          <div className="card p-6">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-24 h-24 bg-gradient-to-br from-primary/30 to-primary/10 rounded-full flex items-center justify-center overflow-hidden">
                {teacher.imageUrl ? (
                  <img 
                    src={teacher.imageUrl} 
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
              
              <div>
                <h1 className="font-playfair text-3xl font-bold text-white mb-2">
                  {teacher.name}
                </h1>
                <p className="text-white/80 flex items-center justify-center">
                  <svg className="w-4 h-4 mr-2 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  Blues Dance Teacher
                </p>
              </div>

              {/* Specialties */}
              {teacher.specialties && teacher.specialties.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-primary mb-2">Specialties</h3>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {teacher.specialties.map((specialty, idx) => (
                      <span
                        key={idx}
                        className="bg-primary/20 text-primary border border-primary/30 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Bio */}
              {teacher.bio && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-primary mb-3">About</h3>
                  <p className="text-white/80 leading-relaxed whitespace-pre-line text-sm">
                    {teacher.bio}
                  </p>
                </div>
              )}

              {/* Social Links and Follow */}
              <div className="flex flex-col items-center gap-4">
                {/* Website link if available */}
                {teacher.website && (
                  <a
                    href={teacher.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80 transition-colors flex items-center text-sm"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Visit Website
                  </a>
                )}

                {/* Follow Button */}
                <FollowButton
                  targetType="teacher"
                  targetId={teacher.id}
                  size="md"
                />
                
                {/* Stats */}
                <div className="text-center">
                  <div className="text-xl font-bold text-primary">
                    {teacher.stats?.totalFollowers || teacher.followers?.length || 0}
                  </div>
                  <div className="text-xs text-white/60">Followers</div>
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="card p-6">
            <div className="flex items-center mb-4">
              <svg className="w-5 h-5 mr-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h2 className="font-playfair text-xl font-semibold text-white">
                Upcoming Events ({teacher.stats?.upcomingEvents || teacher.festivals?.length || 0})
              </h2>
            </div>
            
            {teacher.festivals && teacher.festivals.length > 0 ? (
              <div className="space-y-4">
                {teacher.festivals.map((festival) => (
                  <EventCard key={festival.id} event={festival} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <svg className="mx-auto h-12 w-12 text-white/40 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h3 className="text-lg font-medium text-white mb-2">No upcoming events</h3>
                <p className="text-white/60 text-sm">
                  {teacher.name} doesn't have any upcoming events scheduled.
                </p>
              </div>
            )}
          </div>

          {/* Back Navigation */}
          <div className="text-center pb-20">
            <Link href="/teachers" className="btn-secondary btn-sm">
              ← Back to Teachers
            </Link>
          </div>
        </div>

        {/* Bottom Navigation */}
        <BottomNavigationEnhanced activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </div>
  )
}