'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { SearchBar } from '@/components/features/SearchBar'
import { BottomNavigationEnhanced } from '@/components/layout/BottomNavigationEnhanced'
import {
  ArtDecoLoader,
  VintageErrorState,
  VintageSkeleton,
  VintageEventCardSkeleton
} from '@/components/ui/VintageLoadingStates'
import { VintageApiError } from '@/hooks/useVintageApi'

interface Teacher {
  id: string
  name: string
  bio: string | null
  website: string | null
  imageUrl: string | null
  aiRelevanceScore: number | null
  specialties: string[]
  upcomingEvents: number
  totalEvents: number
}

interface TeachersResponse {
  teachers: Teacher[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("teachers")
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchTeachers()
  }, [currentPage, searchQuery])

  const fetchTeachers = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '12'
      })
      
      if (searchQuery) {
        params.append('search', searchQuery)
      }
      
      const response = await fetch(`/api/teachers?${params}`)
      
      if (!response.ok) {
        throw new Error('Failed to load teachers')
      }
      
      const data: { data: TeachersResponse } = await response.json()
      setTeachers(data.data.teachers)
      setTotalPages(data.data.pagination.totalPages)
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error fetching teachers:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setCurrentPage(1) // Reset to first page when searching
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (error) {
    return (
      <div className="app-container">
        <div className="max-w-md mx-auto bg-background min-h-screen relative flex items-center justify-center">
          <VintageErrorState
            error={new VintageApiError('ServerError', 'The artist directory hit a sour note')}
            onRetry={() => fetchTeachers()}
            retryText="Tune Up the Connection"
            className="max-w-md mx-auto"
          />
        </div>
      </div>
    )
  }

  return (
    <div className="app-container">
      <div className="max-w-md mx-auto bg-background min-h-screen relative">
        {/* Vintage Background Pattern */}
        <div className="absolute inset-0 vintage-pattern opacity-10"></div>

        {/* Enhanced Vintage Page Header */}
        <div className="content-wrapper">
          <div className="hero-section vintage-spotlight relative overflow-hidden rounded-2xl p-8 mb-8">
            <div className="hero-overlay vintage-pattern"></div>
            
            {/* Art Deco Corner Decorations */}
            <div className="art-deco-corner absolute top-4 left-4 w-6 h-6 z-20"></div>
            <div className="art-deco-corner absolute bottom-4 right-4 w-6 h-6 z-20" style={{transform: 'rotate(180deg)'}}></div>
            
            {/* Musical Note Decorations */}
            <div className="musical-notes absolute top-8 right-8 z-20"></div>
            
            {/* Main Content */}
            <div className="relative z-10 text-center">
              <h1 className="font-jazz text-5xl md:text-6xl font-bold text-gradient-gold leading-tight mb-4">
                Master Teachers
              </h1>
              <h2 className="font-vintage text-2xl md:text-3xl mb-6 text-cream-200 leading-tight tracking-wider">
                OF BLUES DANCE
              </h2>
              
              <div className="jazz-lines relative mb-6 py-4">
                <p className="text-cream-100 text-lg leading-relaxed max-w-xl mx-auto font-medium">
                  Learn from legendary instructors who carry the authentic spirit of blues dance. 
                  Connect with masters who've dedicated their lives to this timeless art form.
                </p>
              </div>
              
            </div>
            
            {/* Floating Art Deco Elements */}
            <div className="absolute top-1/4 left-8 w-4 h-4 border-2 border-copper-600 rotate-45 animate-jazz-glow opacity-60"></div>
            <div className="absolute bottom-1/3 right-12 w-3 h-3 bg-gold-600 rounded-full animate-vintage-bounce opacity-70"></div>
          </div>

          {/* Enhanced Search Section */}
          <div className="mb-8">
            <div className="card p-6 bg-copper-900/20 border-copper-600/30">
              <div className="text-center mb-4">
                <h3 className="font-jazz text-2xl font-bold text-copper-600 mb-2">
                  Find Your Perfect Instructor
                </h3>
                <p className="text-cream-200 text-sm">Search by name, style, or specialization</p>
              </div>
              <SearchBar 
                onSearch={handleSearch}
                placeholder="Search teachers by name or bio..."
                className="max-w-full search-elegant"
              />
            </div>
          </div>

          {/* Enhanced Loading State */}
          {isLoading && (
            <ArtDecoLoader
              text="Discovering legendary instructors..."
              size="lg"
              className="py-12"
            />
          )}

          {/* Enhanced Teachers List with Vintage Styling */}
          {!isLoading && teachers.length > 0 && (
            <>
              <div className="space-y-6 mb-8">
                {teachers.map((teacher) => (
                  <Link 
                    key={teacher.id} 
                    href={`/teachers/${teacher.id}`}
                    className="group block"
                  >
                    <div className="card-hover vintage-spotlight relative overflow-hidden p-6 border-copper-600/30 bg-copper-900/10">
                      {/* Art Deco Corner */}
                      <div className="art-deco-corner absolute top-2 left-2 w-4 h-4 z-10 opacity-40"></div>
                      
                      <div className="flex items-start space-x-4">
                        {/* Teacher Avatar */}
                        <div className="flex-shrink-0">
                          {teacher.imageUrl ? (
                            <div className="relative">
                              <img
                                src={teacher.imageUrl}
                                alt={teacher.name}
                                className="w-20 h-20 rounded-full object-cover border-3 border-copper-600/30 group-hover:border-copper-600 transition-all duration-300"
                              />
                              <div className="absolute -top-1 -right-1 w-4 h-4 bg-copper-600 rounded-full animate-pulse"></div>
                            </div>
                          ) : (
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-copper-600/30 to-gold-600/30 flex items-center justify-center border-2 border-copper-600/30">
                              <span className="text-2xl">🎭</span>
                            </div>
                          )}
                        </div>
                        
                        {/* Teacher Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-jazz text-xl font-bold text-copper-600 group-hover:text-gold-600 transition-colors duration-300 truncate">
                              {teacher.name}
                            </h3>
                            {teacher.aiRelevanceScore && teacher.aiRelevanceScore > 80 && (
                              <div className="badge-gold text-xs px-2 py-1">
                                ⭐ Master
                              </div>
                            )}
                          </div>
                          
                          {teacher.bio && (
                            <p className="text-cream-200 text-sm mb-3 leading-relaxed line-clamp-2">
                              {teacher.bio.substring(0, 150)}...
                            </p>
                          )}
                          
                          {/* Specialties */}
                          {teacher.specialties.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-3">
                              {teacher.specialties.slice(0, 3).map((specialty, index) => (
                                <span key={index} className="badge-secondary text-xs">
                                  {specialty}
                                </span>
                              ))}
                              {teacher.specialties.length > 3 && (
                                <span className="text-cream-300 text-xs">+{teacher.specialties.length - 3} more</span>
                              )}
                            </div>
                          )}
                          
                          {/* Stats */}
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-4 text-cream-300">
                              <span className="flex items-center space-x-1">
                                <span>🎪</span>
                                <span>{teacher.totalEvents} events</span>
                              </span>
                              {teacher.upcomingEvents > 0 && (
                                <span className="flex items-center space-x-1 text-gold-600">
                                  <span>📅</span>
                                  <span>{teacher.upcomingEvents} upcoming</span>
                                </span>
                              )}
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              {teacher.website && (
                                <span className="text-copper-600 text-xs">🌐</span>
                              )}
                              <svg className="w-4 h-4 text-cream-400 group-hover:text-copper-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Enhanced Vintage Pagination */}
              {totalPages > 1 && (
                <div className="card p-6 bg-gold-900/20 border-gold-600/30">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 text-cream-200 border-copper-600/30 hover:border-copper-600"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      <span className="font-vintage text-sm tracking-wide">PREVIOUS</span>
                    </button>
                    
                    <div className="flex items-center space-x-2">
                      <span className="font-jazz text-lg text-gold-600">Page {currentPage}</span>
                      <span className="text-cream-300">of</span>
                      <span className="font-jazz text-lg text-gold-600">{totalPages}</span>
                    </div>
                    
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 text-cream-200 border-copper-600/30 hover:border-copper-600"
                    >
                      <span className="font-vintage text-sm tracking-wide">NEXT</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Enhanced No Results State */}
          {!isLoading && teachers.length === 0 && (
            <div className="card p-12 text-center bg-bordeaux-900/20 border-bordeaux-600/30">
              <div className="mb-6">
                <span className="text-6xl">🎭</span>
              </div>
              <h3 className="font-jazz text-3xl font-bold text-bordeaux-400 mb-4">
                No Masters Found
              </h3>
              <p className="text-cream-200 mb-6 leading-relaxed">
                {searchQuery 
                  ? `We couldn't find any teachers matching "${searchQuery}". Try adjusting your search terms or explore our full collection of master instructors.`
                  : 'Our legendary teachers are gathering their wisdom. Check back soon for an incredible collection of blues dance masters.'
                }
              </p>
              {searchQuery && (
                <button 
                  onClick={() => {
                    setSearchQuery('')
                    setCurrentPage(1)
                  }}
                  className="btn-primary px-6 py-3 font-vintage tracking-wide"
                >
                  🔍 Browse All Teachers
                </button>
              )}
            </div>
          )}
        </div>

        {/* Enhanced Bottom Navigation */}
        <BottomNavigationEnhanced activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </div>
  )
}