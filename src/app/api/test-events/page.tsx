'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { CheckCircle, XCircle, AlertTriangle, Calendar, MapPin, Music } from 'lucide-react'

interface Event {
  id: string
  name: string | null
  description: string | null
  startDate: string
  endDate: string
  country: string | null
  city: string | null
  website: string | null
  style: string | null
  venue?: {
    name: string | null
    city: string | null
    country: string | null
  } | null
}

interface ApiResponse {
  success: boolean
  data?: {
    events: Event[]
    pagination: {
      page: number
      limit: number
      total: number
      totalPages: number
      hasNext: boolean
      hasPrev: boolean
    }
  }
  error?: string
}

export default function TestEventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [testResults, setTestResults] = useState<{
    api: boolean | null
    database: boolean | null
    transformation: boolean | null
  }>({
    api: null,
    database: null,
    transformation: null
  })

  const fetchEvents = async (params: Record<string, string> = {}) => {
    setLoading(true)
    setError(null)
    
    try {
      const searchParams = new URLSearchParams(params)
      const response = await fetch(`/api/events?${searchParams}`)
      const data: ApiResponse = await response.json()
      
      if (data.success && data.data) {
        setEvents(data.data.events)
        setTestResults(prev => ({
          ...prev,
          api: true,
          database: (data.data?.events?.length ?? 0) > 0,
          transformation: data.data?.events?.every(event => 
            event.id && typeof event.startDate === 'string' && typeof event.endDate === 'string'
          ) ?? false
        }))
      } else {
        setError(data.error || 'Failed to fetch events')
        setTestResults(prev => ({ ...prev, api: false }))
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
      setTestResults(prev => ({ ...prev, api: false }))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEvents({ limit: '5' })
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const getEventLocation = (event: Event) => {
    const parts = [event.city, event.country].filter(Boolean)
    return parts.length > 0 ? parts.join(', ') : 'Location TBD'
  }

  const TestIndicator = ({ result, label }: { result: boolean | null, label: string }) => (
    <div className="flex items-center space-x-2">
      {result === null ? (
        <div className="w-5 h-5 bg-gray-300 rounded-full" />
      ) : result ? (
        <CheckCircle className="w-5 h-5 text-green-600" />
      ) : (
        <XCircle className="w-5 h-5 text-red-600" />
      )}
      <span className="text-sm font-medium">{label}</span>
      <span className="text-xs text-gray-500">
        {result === null ? 'Not tested' : result ? 'Passed' : 'Failed'}
      </span>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                External Database Events API Test
              </h1>
              <p className="text-gray-600">
                Testing the updated Events API with external database structure
              </p>
            </div>
            <Button
              onClick={() => fetchEvents({ limit: '5' })}
              disabled={loading}
              variant="outline"
            >
              {loading ? <LoadingSpinner size="sm" className="mr-2" /> : null}
              Refresh
            </Button>
          </div>
        </Card>

        {/* Test Results */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Test Results</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <TestIndicator result={testResults.api} label="API Response" />
            <TestIndicator result={testResults.database} label="Database Query" />
            <TestIndicator result={testResults.transformation} label="Data Transformation" />
          </div>
        </Card>

        {/* Error Display */}
        {error && (
          <Card className="p-6 border-red-200 bg-red-50">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-red-800">API Error</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </Card>
        )}

        {/* Test Controls */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Test Different Filters</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              onClick={() => fetchEvents({ limit: '10' })}
              disabled={loading}
              variant="outline"
              size="sm"
            >
              All Events
            </Button>
            <Button
              onClick={() => fetchEvents({ country: 'Italy', limit: '10' })}
              disabled={loading}
              variant="outline"
              size="sm"
            >
              Italy Events
            </Button>
            <Button
              onClick={() => fetchEvents({ style: 'blues', limit: '10' })}
              disabled={loading}
              variant="outline"
              size="sm"
            >
              Blues Style
            </Button>
            <Button
              onClick={() => fetchEvents({ search: 'festival', limit: '10' })}
              disabled={loading}
              variant="outline"
              size="sm"
            >
              Search "festival"
            </Button>
          </div>
        </Card>

        {/* Events Display */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Events ({events.length} found)
          </h2>
          
          {loading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <Card key={event.id} className="p-4 border border-gray-200">
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-gray-900 line-clamp-2">
                        {event.name || 'Unnamed Event'}
                      </h3>
                      {event.description && (
                        <p className="text-sm text-gray-600 line-clamp-3 mt-1">
                          {event.description}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {formatDate(event.startDate)} - {formatDate(event.endDate)}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{getEventLocation(event)}</span>
                      </div>

                      {event.style && (
                        <div className="flex items-center space-x-2 text-gray-600">
                          <Music className="w-4 h-4" />
                          <span className="capitalize">{event.style}</span>
                        </div>
                      )}
                    </div>

                    {event.website && (
                      <a
                        href={event.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-500 text-sm"
                      >
                        Visit Website →
                      </a>
                    )}

                    <div className="pt-2 border-t border-gray-100">
                      <code className="text-xs text-gray-500 break-all">
                        ID: {event.id}
                      </code>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No events found. Try refreshing or check the database connection.
            </div>
          )}
        </Card>

        {/* Debug Info */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Debug Information</h2>
          <div className="bg-gray-100 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">Current Configuration:</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Database: External swing_events database</li>
              <li>• Event Model: Updated to match external structure (from_date, to_date)</li>
              <li>• Event Service: Using new eventService with adapter pattern</li>
              <li>• API Endpoint: /api/events updated to use external structure</li>
              <li>• Conflicting models: Temporarily commented out</li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
  )
}