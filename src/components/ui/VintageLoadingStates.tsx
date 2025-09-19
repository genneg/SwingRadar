'use client'

import { cn } from '@/lib/utils'
import { RefreshCw, Volume2, Music } from 'lucide-react'

interface VintageLoadingProps {
  className?: string
  text?: string
  size?: 'sm' | 'md' | 'lg'
}

interface VintageErrorProps {
  className?: string
  error?: Error | string
  onRetry?: () => void
  retryText?: string
}

/**
 * Art Deco Loader with vinyl record animation and jazz rays
 */
export function ArtDecoLoader({
  className,
  text = "Tuning the frequency...",
  size = 'md'
}: VintageLoadingProps) {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-24 h-24'
  }

  const rayCount = size === 'lg' ? 12 : 8

  return (
    <div className={cn(
      'flex flex-col items-center justify-center min-h-[200px]',
      className
    )}>
      <div className="art-deco-spinner relative">
        {/* Vinyl Record */}
        <div className={cn(
          'vinyl-record animate-vinyl-spin bg-gradient-to-br from-navy-800 to-navy-900 rounded-full flex items-center justify-center border-4 border-gold-600 shadow-gold-lg',
          sizeClasses[size]
        )}>
          {/* Center hole */}
          <div className="w-4 h-4 bg-gold-600 rounded-full relative">
            <div className="absolute inset-1 bg-navy-900 rounded-full"></div>
          </div>

          {/* Vinyl grooves */}
          <div className="absolute inset-2 border border-gold-600/30 rounded-full"></div>
          <div className="absolute inset-4 border border-gold-600/20 rounded-full"></div>
        </div>

        {/* Art Deco Rays */}
        <div className="art-deco-rays absolute inset-0 animate-jazz-glow">
          {Array.from({length: rayCount}).map((_, i) => (
            <div
              key={i}
              className="absolute w-0.5 h-8 bg-gradient-to-t from-gold-400 via-gold-500 to-transparent"
              style={{
                transform: `rotate(${i * (360 / rayCount)}deg)`,
                transformOrigin: '50% 100%',
                top: '-16px',
                left: '50%',
                marginLeft: '-1px'
              }}
            />
          ))}
        </div>

        {/* Floating musical notes */}
        <div className="absolute -top-8 -right-8 text-gold-400 animate-vintage-bounce opacity-70">
          ♪
        </div>
        <div className="absolute -bottom-8 -left-8 text-gold-400 animate-vintage-bounce opacity-50" style={{ animationDelay: '0.5s' }}>
          ♫
        </div>
      </div>

      {text && (
        <p className="vintage-text mt-6 text-gold-400 animate-pulse font-jazz text-center">
          {text}
        </p>
      )}
    </div>
  )
}

/**
 * Vintage Error State with musical themes
 */
export function VintageErrorState({
  className,
  error,
  onRetry,
  retryText = "Restart the Set"
}: VintageErrorProps) {
  const errorMessage = typeof error === 'string' ? error : error?.message || "Something went wrong in the jazz club"

  return (
    <div className={cn(
      'text-center p-8 bg-gradient-to-br from-bordeaux-900/20 to-navy-900/20 rounded-xl border border-gold-400/30 backdrop-blur-sm',
      className
    )}>
      {/* Vintage Microphone Icon */}
      <div className="vintage-microphone-icon w-16 h-16 mx-auto mb-6 relative">
        <div className="w-12 h-16 bg-gradient-to-b from-gold-600 to-gold-700 rounded-t-full mx-auto relative">
          <div className="absolute inset-2 bg-gradient-to-b from-gold-400 to-gold-500 rounded-t-full"></div>
          <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 w-6 h-1 bg-navy-900 rounded-full opacity-20"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 w-4 h-1 bg-navy-900 rounded-full opacity-20"></div>
        </div>
        <div className="w-6 h-4 bg-gold-700 mx-auto rounded-b-sm"></div>
        <div className="w-8 h-2 bg-navy-800 mx-auto rounded-full mt-1"></div>
      </div>

      <h3 className="jazz-font text-2xl text-gold-400 mb-3">
        The Music Stopped
      </h3>
      <p className="vintage-text text-cream-200 mb-6 max-w-md mx-auto leading-relaxed">
        {errorMessage}
      </p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="btn-primary px-6 py-3 bg-gold-600 hover:bg-gold-500 text-navy-900 rounded-lg transition-all duration-300 hover:scale-105 shadow-gold-lg flex items-center space-x-2 mx-auto"
        >
          <RefreshCw className="w-4 h-4" />
          <span className="font-vintage tracking-wide">{retryText}</span>
        </button>
      )}

      {/* Decorative Art Deco corners */}
      <div className="absolute top-4 left-4 w-6 h-6 border-l-2 border-t-2 border-gold-400/50"></div>
      <div className="absolute top-4 right-4 w-6 h-6 border-r-2 border-t-2 border-gold-400/50"></div>
      <div className="absolute bottom-4 left-4 w-6 h-6 border-l-2 border-b-2 border-gold-400/50"></div>
      <div className="absolute bottom-4 right-4 w-6 h-6 border-r-2 border-b-2 border-gold-400/50"></div>
    </div>
  )
}

/**
 * Vintage Skeleton with Art Deco patterns
 */
export function VintageSkeleton({
  className,
  lines = 3,
  showAvatar = false
}: VintageLoadingProps & { lines?: number; showAvatar?: boolean }) {
  return (
    <div className={cn(
      'bg-gradient-to-br from-cream-50 to-cream-100 rounded-xl border border-gold-400/20 p-6 shadow-elegant',
      className
    )}>
      <div className="flex items-start space-x-4">
        {showAvatar && (
          <div className="w-12 h-12 bg-gradient-to-br from-gold-200 to-gold-300 rounded-full flex-shrink-0 animate-pulse relative">
            <div className="absolute inset-2 bg-gold-400 rounded-full opacity-50"></div>
          </div>
        )}

        <div className="flex-1 space-y-3">
          {/* Art Deco header line */}
          <div className="h-4 bg-gradient-to-r from-gold-200 via-gold-300 to-gold-200 rounded-lg animate-pulse w-3/4 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold-400/50 to-transparent animate-shimmer"></div>
          </div>

          {/* Content lines with vintage styling */}
          {Array.from({length: lines}).map((_, i) => (
            <div
              key={i}
              className={cn(
                'h-3 bg-gradient-to-r from-bordeaux-200 via-bordeaux-300 to-bordeaux-200 rounded animate-pulse relative overflow-hidden',
                i === lines - 1 ? 'w-2/3' : 'w-full'
              )}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-bordeaux-400/50 to-transparent animate-shimmer"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Art Deco footer elements */}
      <div className="mt-6 flex justify-between items-center">
        <div className="h-6 bg-gradient-to-r from-copper-200 to-copper-300 rounded-lg w-20 animate-pulse"></div>
        <div className="h-8 bg-gradient-to-r from-gold-200 to-gold-300 rounded-lg w-16 animate-pulse"></div>
      </div>

      {/* Decorative Art Deco pattern */}
      <div className="absolute top-2 right-2 w-8 h-8 opacity-10">
        <div className="w-full h-0.5 bg-gold-400 transform rotate-45 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="w-full h-0.5 bg-gold-400 transform -rotate-45 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
      </div>
    </div>
  )
}

/**
 * Jazz Loading Spinner with vintage animations
 */
export function JazzLoadingSpinner({
  className,
  size = 'md',
  text
}: VintageLoadingProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }

  return (
    <div className={cn('flex items-center space-x-3', className)}>
      <div className="relative">
        {/* Main spinner */}
        <div className={cn(
          'border-2 border-gold-400/30 border-t-gold-600 rounded-full animate-vinyl-spin',
          sizeClasses[size]
        )}></div>

        {/* Inner musical note */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Music className="w-3 h-3 text-gold-600 animate-pulse" />
        </div>
      </div>

      {text && (
        <span className="vintage-text text-gold-600 animate-pulse font-medium">
          {text}
        </span>
      )}
    </div>
  )
}

/**
 * Event Card Vintage Skeleton
 */
export function VintageEventCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn(
      'bg-gradient-to-br from-cream-50 to-cream-100 rounded-xl border border-gold-400/20 overflow-hidden shadow-elegant animate-pulse',
      className
    )}>
      {/* Image placeholder with vintage pattern */}
      <div className="w-full h-48 bg-gradient-to-br from-gold-200 to-bordeaux-200 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold-400/30 to-transparent animate-shimmer"></div>
        <div className="absolute top-4 left-4 w-8 h-8">
          <Volume2 className="w-full h-full text-gold-400/50" />
        </div>
      </div>

      {/* Content with Art Deco styling */}
      <div className="p-6">
        <div className="space-y-4">
          {/* Title */}
          <div className="h-6 bg-gradient-to-r from-navy-200 to-navy-300 rounded-lg w-3/4 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-navy-400/50 to-transparent animate-shimmer"></div>
          </div>

          {/* Subtitle */}
          <div className="h-4 bg-gradient-to-r from-bordeaux-200 to-bordeaux-300 rounded w-1/2"></div>
        </div>

        {/* Description */}
        <div className="mt-4 space-y-2">
          <div className="h-3 bg-gradient-to-r from-gold-200 to-gold-300 rounded w-full"></div>
          <div className="h-3 bg-gradient-to-r from-gold-200 to-gold-300 rounded w-2/3"></div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-copper-300 rounded"></div>
            <div className="h-4 bg-copper-300 rounded w-20"></div>
          </div>
          <div className="h-8 bg-gradient-to-r from-gold-300 to-gold-400 rounded-lg w-20"></div>
        </div>
      </div>

      {/* Art Deco corner decorations */}
      <div className="absolute top-4 right-4 w-4 h-4 border-r-2 border-t-2 border-gold-400/30"></div>
      <div className="absolute bottom-4 left-4 w-4 h-4 border-l-2 border-b-2 border-gold-400/30"></div>
    </div>
  )
}

/**
 * Inline Jazz Loading for buttons and small spaces
 */
export function InlineJazzLoading({
  className,
  text = "Loading..."
}: VintageLoadingProps) {
  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <div className="w-4 h-4 border border-gold-400/30 border-t-gold-600 rounded-full animate-vinyl-spin"></div>
      <span className="vintage-text text-sm text-gold-600">{text}</span>
    </div>
  )
}

export default {
  ArtDecoLoader,
  VintageErrorState,
  VintageSkeleton,
  JazzLoadingSpinner,
  VintageEventCardSkeleton,
  InlineJazzLoading
}