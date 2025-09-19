'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { cn } from '@/lib/utils'

interface TouchGesture {
  type: 'swipe' | 'pinch' | 'doubleTap' | 'longPress'
  direction?: 'left' | 'right' | 'up' | 'down'
  callback: () => void
}

interface TouchOptimizationProps {
  minimumSize?: number
  gestureSupport?: {
    swipe?: boolean
    pinch?: boolean
    doubleTap?: boolean
    longPress?: boolean
  }
  gestures?: TouchGesture[]
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  onDoubleTap?: () => void
  onLongPress?: () => void
  className?: string
  children: React.ReactNode
}

interface PullToRefreshProps {
  onRefresh: () => Promise<void>
  threshold?: number
  children: React.ReactNode
  className?: string
}

export function TouchOptimization({
  minimumSize = 44,
  gestureSupport = {
    swipe: true,
    pinch: false,
    doubleTap: true,
    longPress: false
  },
  gestures = [],
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  onDoubleTap,
  onLongPress,
  className,
  children
}: TouchOptimizationProps) {
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null)
  const touchEndRef = useRef<{ x: number; y: number } | null>(null)
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null)
  const [isActive, setIsActive] = useState(false)

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0]
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    }

    // Handle long press
    if (gestureSupport.longPress && onLongPress) {
      longPressTimerRef.current = setTimeout(() => {
        onLongPress()
        setIsActive(false)
      }, 500) // 500ms for long press
    }

    setIsActive(true)
  }, [gestureSupport.longPress, onLongPress])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchStartRef.current) return

    const touch = e.touches[0]
    touchEndRef.current = {
      x: touch.clientX,
      y: touch.clientY
    }

    // Cancel long press if moved too much
    if (longPressTimerRef.current) {
      const deltaX = Math.abs(touch.clientX - touchStartRef.current.x)
      const deltaY = Math.abs(touch.clientY - touchStartRef.current.y)
      if (deltaX > 10 || deltaY > 10) {
        clearTimeout(longPressTimerRef.current)
        longPressTimerRef.current = null
      }
    }
  }, [])

  const handleTouchEnd = useCallback(() => {
    if (!touchStartRef.current || !touchEndRef.current) {
      setIsActive(false)
      return
    }

    const start = touchStartRef.current
    const end = touchEndRef.current
    const deltaTime = Date.now() - start.time

    // Clear long press timer
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current)
      longPressTimerRef.current = null
    }

    // Calculate distance and direction
    const deltaX = end.x - start.x
    const deltaY = end.y - start.y
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

    // Handle double tap
    if (gestureSupport.doubleTap && onDoubleTap && deltaTime < 300) {
      onDoubleTap()
      setIsActive(false)
      return
    }

    // Handle swipe gestures
    if (gestureSupport.swipe && deltaTime < 500 && distance > 50) {
      const angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI
      let direction: 'left' | 'right' | 'up' | 'down' | null = null

      if (angle >= -45 && angle < 45) direction = 'right'
      else if (angle >= 45 && angle < 135) direction = 'down'
      else if (angle >= 135 || angle < -135) direction = 'left'
      else if (angle >= -135 && angle < -45) direction = 'up'

      if (direction) {
        switch (direction) {
          case 'left':
            onSwipeLeft?.()
            break
          case 'right':
            onSwipeRight?.()
            break
          case 'up':
            onSwipeUp?.()
            break
          case 'down':
            onSwipeDown?.()
            break
        }
      }
    }

    // Execute custom gestures
    gestures.forEach(gesture => {
      if (gesture.type === 'swipe' && gesture.direction && deltaTime < 500 && distance > 50) {
        const angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI
        let gestureDirection: 'left' | 'right' | 'up' | 'down' | null = null

        if (angle >= -45 && angle < 45) gestureDirection = 'right'
        else if (angle >= 45 && angle < 135) gestureDirection = 'down'
        else if (angle >= 135 || angle < -135) gestureDirection = 'left'
        else if (angle >= -135 && angle < -45) gestureDirection = 'up'

        if (gestureDirection === gesture.direction) {
          gesture.callback()
        }
      }
    })

    touchStartRef.current = null
    touchEndRef.current = null
    setIsActive(false)
  }, [gestureSupport, gestures, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, onDoubleTap])

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current)
      }
    }
  }, [])

  return (
    <div
      className={cn(
        'relative select-none',
        isActive && 'active-touch',
        className
      )}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={() => {
        if (longPressTimerRef.current) {
          clearTimeout(longPressTimerRef.current)
        }
        setIsActive(false)
      }}
    >
      {children}
      {isActive && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="w-full h-full bg-gold-400/10 rounded-lg transition-opacity duration-200" />
        </div>
      )}
    </div>
  )
}

// Pull to refresh component
export function PullToRefresh({
  onRefresh,
  threshold = 100,
  children,
  className
}: PullToRefreshProps) {
  const [pullStart, setPullStart] = useState(0)
  const [pullDistance, setPullDistance] = useState(0)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [canRefresh, setCanRefresh] = useState(false)

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (window.pageYOffset === 0 && !isRefreshing) {
      setPullStart(e.touches[0].screenY)
    }
  }, [isRefreshing])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (pullStart && window.pageYOffset === 0 && !isRefreshing) {
      const distance = e.touches[0].screenY - pullStart
      if (distance > 0) {
        e.preventDefault()
        setPullDistance(distance)
        setCanRefresh(distance > threshold)
      }
    }
  }, [pullStart, threshold, isRefreshing])

  const handleTouchEnd = useCallback(async () => {
    if (pullDistance > threshold && !isRefreshing && canRefresh) {
      setIsRefreshing(true)
      try {
        await onRefresh()
      } catch (error) {
        console.error('Refresh failed:', error)
      } finally {
        setIsRefreshing(false)
      }
    }
    setPullStart(0)
    setPullDistance(0)
    setCanRefresh(false)
  }, [pullDistance, threshold, isRefreshing, canRefresh, onRefresh])

  return (
    <div
      className={cn('min-h-screen', className)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull indicator */}
      {pullDistance > 0 && (
        <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none">
          <div
            className="flex flex-col items-center justify-center transition-all duration-300"
            style={{
              transform: `translateY(${Math.min(pullDistance / 2, threshold)}px)`,
              opacity: Math.min(pullDistance / threshold, 1)
            }}
          >
            {isRefreshing ? (
              <div className="vintage-loader">
                <div className="vinyl-record w-8 h-8 animate-vinyl-spin bg-gold-600 rounded-full flex items-center justify-center">
                  <span className="text-navy-900 text-sm">♪</span>
                </div>
              </div>
            ) : (
              <div className={cn(
                'w-8 h-8 flex items-center justify-center rounded-full transition-colors',
                canRefresh ? 'bg-gold-600 text-navy-900' : 'bg-gold-400 text-navy-800'
              )}>
                {canRefresh ? (
                  <span className="animate-spin">↻</span>
                ) : (
                  <span>↑</span>
                )}
              </div>
            )}
            <div className="mt-2 text-sm font-medium jazz-font">
              {isRefreshing ? 'Refreshing...' : canRefresh ? 'Release to refresh' : 'Pull to refresh'}
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div
        style={{
          transform: `translateY(${Math.min(pullDistance / 4, threshold / 2)}px)`,
          transition: pullDistance === 0 ? 'transform 0.3s ease' : 'none'
        }}
      >
        {children}
      </div>
    </div>
  )
}

// Touch-friendly button component
export function TouchButton({
  children,
  minimumSize = 44,
  hapticFeedback = true,
  className,
  ...props
}: {
  children: React.ReactNode
  minimumSize?: number
  hapticFeedback?: boolean
  className?: string
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const handleTouchStart = useCallback(() => {
    if (hapticFeedback && 'vibrate' in navigator) {
      navigator.vibrate(10) // Light vibration
    }
  }, [hapticFeedback])

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center',
        'min-h-[44px] min-w-[44px]',
        'active:scale-95 transition-transform duration-100',
        'focus:outline-none focus:ring-2 focus:ring-gold-500',
        className
      )}
      style={{
        minWidth: minimumSize,
        minHeight: minimumSize,
        touchAction: 'manipulation'
      }}
      onTouchStart={handleTouchStart}
      {...props}
    >
      {children}
    </button>
  )
}

// Swipeable cards component
export function SwipeableCard({
  children,
  onSwipeLeft,
  onSwipeRight,
  threshold = 100,
  className
}: {
  children: React.ReactNode
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  threshold?: number
  className?: string
}) {
  const [startX, setStartX] = useState(0)
  const [currentX, setCurrentX] = useState(0)
  const [isDragging, setIsDragging] = useState(false)

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX)
    setIsDragging(true)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return
    const deltaX = e.touches[0].clientX - startX
    setCurrentX(deltaX)
  }

  const handleTouchEnd = () => {
    if (!isDragging) return

    if (Math.abs(currentX) > threshold) {
      if (currentX > 0 && onSwipeRight) {
        onSwipeRight()
      } else if (currentX < 0 && onSwipeLeft) {
        onSwipeLeft()
      }
    }

    setCurrentX(0)
    setIsDragging(false)
  }

  return (
    <div
      className={cn('relative transition-transform duration-200', className)}
      style={{
        transform: `translateX(${currentX}px)`,
        opacity: 1 - Math.abs(currentX) / 200
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {children}
    </div>
  )
}

// Hook for detecting touch capabilities
export function useTouchDetection() {
  const [isTouchDevice, setIsTouchDevice] = useState(false)

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0)
  }, [])

  return { isTouchDevice }
}

// Hook for handling mobile gestures in a list
export function useGestures() {
  const handleSwipe = useCallback((direction: 'left' | 'right' | 'up' | 'down') => {
    // Announce gesture to screen readers
    const announcement = document.createElement('div')
    announcement.setAttribute('role', 'status')
    announcement.setAttribute('aria-live', 'polite')
    announcement.className = 'sr-only'
    announcement.textContent = `Swiped ${direction}`
    document.body.appendChild(announcement)

    setTimeout(() => {
      document.body.removeChild(announcement)
    }, 1000)
  }, [])

  return { handleSwipe }
}