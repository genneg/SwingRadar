'use client'

import { useState } from 'react'
import {
  ArtDecoLoader,
  VintageErrorState,
  VintageSkeleton,
  JazzLoadingSpinner,
  VintageEventCardSkeleton,
  InlineJazzLoading
} from '@/components/ui/VintageLoadingStates'
import { useLoadingState, useEventSearch, useApiHealth, VintageApiError } from '@/hooks/useVintageApi'

export default function VintageTestPage() {
  const [showError, setShowError] = useState(false)
  const [showLoading, setShowLoading] = useState(false)
  const loadingState = useLoadingState()
  const eventSearch = useEventSearch({ query: 'Blues' }, { autoSearch: false })
  const apiHealth = useApiHealth()

  const simulateError = () => {
    const error = new VintageApiError('NetworkError', 'Lost connection to the blues club')
    loadingState.setError(error)
    setShowError(true)
  }

  const simulateLoading = () => {
    setShowLoading(true)
    setTimeout(() => setShowLoading(false), 3000)
  }

  const handleRetry = () => {
    loadingState.reset()
    setShowError(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-900 to-navy-800 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="jazz-font text-4xl text-gold-400 mb-4">
            🎷 Vintage Components Test Page
          </h1>
          <p className="vintage-text text-cream-200">
            Testing the new Art Deco loading states and API hooks
          </p>
        </div>

        {/* Control Buttons */}
        <div className="flex justify-center space-x-4 mb-12">
          <button
            onClick={simulateLoading}
            className="btn-primary px-6 py-3 bg-gold-600 hover:bg-gold-500 text-navy-900 rounded-lg"
          >
            Test Loading
          </button>
          <button
            onClick={simulateError}
            className="btn-primary px-6 py-3 bg-bordeaux-600 hover:bg-bordeaux-500 text-cream-200 rounded-lg"
          >
            Test Error
          </button>
          <button
            onClick={() => eventSearch.search({ query: 'Jazz' })}
            className="btn-primary px-6 py-3 bg-copper-600 hover:bg-copper-500 text-cream-200 rounded-lg"
          >
            Test API Search
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Art Deco Loader */}
          <div className="bg-gradient-to-br from-cream-50 to-cream-100 rounded-xl p-8 border border-gold-400/20">
            <h2 className="jazz-font text-2xl text-navy-900 mb-6">Art Deco Loader</h2>
            {showLoading ? (
              <ArtDecoLoader text="Testing the vinyl record animation..." />
            ) : (
              <div className="text-center p-8">
                <p className="vintage-text text-navy-600">Click "Test Loading" to see the animation</p>
              </div>
            )}
          </div>

          {/* Vintage Error State */}
          <div className="bg-gradient-to-br from-cream-50 to-cream-100 rounded-xl p-8 border border-gold-400/20">
            <h2 className="jazz-font text-2xl text-navy-900 mb-6">Vintage Error State</h2>
            {showError ? (
              <VintageErrorState
                error={loadingState.error}
                onRetry={handleRetry}
                retryText="Restart the Blues"
              />
            ) : (
              <div className="text-center p-8">
                <p className="vintage-text text-navy-600">Click "Test Error" to see jazz club error handling</p>
              </div>
            )}
          </div>

          {/* Vintage Skeleton */}
          <div className="bg-gradient-to-br from-cream-50 to-cream-100 rounded-xl p-8 border border-gold-400/20">
            <h2 className="jazz-font text-2xl text-navy-900 mb-6">Vintage Skeleton</h2>
            <VintageSkeleton lines={4} showAvatar={true} />
          </div>

          {/* Jazz Loading Spinner */}
          <div className="bg-gradient-to-br from-cream-50 to-cream-100 rounded-xl p-8 border border-gold-400/20">
            <h2 className="jazz-font text-2xl text-navy-900 mb-6">Jazz Loading Spinner</h2>
            <div className="flex flex-col space-y-4">
              <JazzLoadingSpinner size="sm" text="Small spinner" />
              <JazzLoadingSpinner size="md" text="Medium spinner" />
              <JazzLoadingSpinner size="lg" text="Large spinner" />
            </div>
          </div>

          {/* Event Card Skeleton */}
          <div className="bg-gradient-to-br from-cream-50 to-cream-100 rounded-xl p-8 border border-gold-400/20">
            <h2 className="jazz-font text-2xl text-navy-900 mb-6">Event Card Skeleton</h2>
            <VintageEventCardSkeleton />
          </div>

          {/* Inline Jazz Loading */}
          <div className="bg-gradient-to-br from-cream-50 to-cream-100 rounded-xl p-8 border border-gold-400/20">
            <h2 className="jazz-font text-2xl text-navy-900 mb-6">Inline Loading</h2>
            <div className="space-y-4">
              <InlineJazzLoading text="Processing your request..." />
              <button className="btn-ghost px-4 py-2 border border-gold-400 text-gold-600 rounded-lg flex items-center space-x-2">
                <InlineJazzLoading text="Loading..." />
              </button>
            </div>
          </div>
        </div>

        {/* API Hooks Testing */}
        <div className="mt-12 bg-gradient-to-br from-cream-50 to-cream-100 rounded-xl p-8 border border-gold-400/20">
          <h2 className="jazz-font text-2xl text-navy-900 mb-6">API Hooks Testing</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Event Search Hook */}
            <div>
              <h3 className="vintage-text font-semibold text-navy-800 mb-3">Event Search Hook</h3>
              <div className="space-y-2">
                <p className="text-sm text-navy-600">
                  Loading: {eventSearch.isLoading ? '✅' : '❌'}
                </p>
                <p className="text-sm text-navy-600">
                  Error: {eventSearch.isError ? '✅' : '❌'}
                </p>
                <p className="text-sm text-navy-600">
                  Events Found: {eventSearch.events.length}
                </p>
                {eventSearch.isLoading && <InlineJazzLoading text="Searching events..." />}
                {eventSearch.error && (
                  <p className="text-sm text-red-600">{eventSearch.userFriendlyError}</p>
                )}
              </div>
            </div>

            {/* API Health Hook */}
            <div>
              <h3 className="vintage-text font-semibold text-navy-800 mb-3">API Health Hook</h3>
              <div className="space-y-2">
                <p className="text-sm text-navy-600">
                  Online: {apiHealth.isOnline ? '🟢' : '🔴'}
                </p>
                <p className="text-sm text-navy-600">
                  Connected: {apiHealth.isConnected ? '🟢' : '🔴'}
                </p>
                <p className="text-sm text-navy-600">
                  Health Status: {apiHealth.data?.status || 'Unknown'}
                </p>
                {apiHealth.isLoading && <InlineJazzLoading text="Checking connection..." />}
              </div>
            </div>
          </div>
        </div>

        {/* Loading State Manager */}
        <div className="mt-8 bg-gradient-to-br from-cream-50 to-cream-100 rounded-xl p-8 border border-gold-400/20">
          <h2 className="jazz-font text-2xl text-navy-900 mb-6">Loading State Manager</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <p className="font-semibold text-navy-800">Loading</p>
              <p className="text-navy-600">{loadingState.isLoading ? '✅' : '❌'}</p>
            </div>
            <div className="text-center">
              <p className="font-semibold text-navy-800">Error</p>
              <p className="text-navy-600">{loadingState.isError ? '✅' : '❌'}</p>
            </div>
            <div className="text-center">
              <p className="font-semibold text-navy-800">Retrying</p>
              <p className="text-navy-600">{loadingState.isRetrying ? '✅' : '❌'}</p>
            </div>
            <div className="text-center">
              <p className="font-semibold text-navy-800">Retry Count</p>
              <p className="text-navy-600">{loadingState.retryCount}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}