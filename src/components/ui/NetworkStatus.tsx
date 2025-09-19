'use client'

import { useState, useEffect } from 'react'
import { Wifi, WifiOff, AlertCircle, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useOffline } from '@/hooks/useOffline'

interface NetworkStatusProps {
  className?: string
  showLabel?: boolean
  showIcon?: boolean
  position?: 'top' | 'bottom' | 'inline'
}

/**
 * Network status indicator component
 */
export function NetworkStatus({
  className,
  showLabel = true,
  showIcon = true,
  position = 'inline'
}: NetworkStatusProps) {
  const { isOnline, isOffline } = useOffline()
  const [wasOffline, setWasOffline] = useState(false)

  useEffect(() => {
    if (isOffline && !wasOffline) {
      setWasOffline(true)
    } else if (isOnline && wasOffline) {
      // Show "back online" message briefly
      setTimeout(() => setWasOffline(false), 3000)
    }
  }, [isOnline, isOffline, wasOffline])

  if (isOnline && !wasOffline) return null

  const getStatusColor = () => {
    if (isOnline && wasOffline) return 'text-green-600 bg-green-50 border-green-200'
    if (isOffline) return 'text-red-600 bg-red-50 border-red-200'
    return 'text-gray-600 bg-gray-50 border-gray-200'
  }

  const getStatusIcon = () => {
    if (isOnline && wasOffline) return <CheckCircle2 className="w-4 h-4" />
    if (isOffline) return <WifiOff className="w-4 h-4" />
    return <Wifi className="w-4 h-4" />
  }

  const getStatusText = () => {
    if (isOnline && wasOffline) return 'Back online'
    if (isOffline) return 'Offline'
    return 'Online'
  }

  const baseClasses = cn(
    'flex items-center space-x-2 px-3 py-1.5 rounded-full border text-sm font-medium transition-all duration-200',
    getStatusColor(),
    className
  )

  const content = (
    <div className={baseClasses}>
      {showIcon && getStatusIcon()}
      {showLabel && <span>{getStatusText()}</span>}
    </div>
  )

  if (position === 'top') {
    return (
      <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2">
        {content}
      </div>
    )
  }

  if (position === 'bottom') {
    return (
      <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-2">
        {content}
      </div>
    )
  }

  return content
}

/**
 * Offline banner component
 */
export function OfflineBanner({ className }: { className?: string }) {
  const [isMounted, setIsMounted] = useState(false)
  const { isOffline } = useOffline()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Don't render anything until client-side hydration is complete
  if (!isMounted || !isOffline) return null

  return (
    <div className={cn(
      'bg-yellow-50 border-b border-yellow-200 px-4 py-3',
      className
    )}>
      <div className="flex items-center justify-center space-x-2">
        <AlertCircle className="w-5 h-5 text-yellow-600" />
        <span className="text-sm font-medium text-yellow-800">
          You're currently offline. Some features may not be available.
        </span>
      </div>
    </div>
  )
}

/**
 * Connection quality indicator
 */
export function ConnectionQuality({ className }: { className?: string }) {
  const [quality, setQuality] = useState<'good' | 'slow' | 'poor'>('good')
  const [latency, setLatency] = useState<number | null>(null)

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const start = performance.now()
        await fetch('/api/health', { method: 'HEAD' })
        const end = performance.now()
        const responseTime = end - start
        
        setLatency(responseTime)
        
        if (responseTime < 200) {
          setQuality('good')
        } else if (responseTime < 500) {
          setQuality('slow')
        } else {
          setQuality('poor')
        }
      } catch (error) {
        setQuality('poor')
        setLatency(null)
      }
    }

    checkConnection()
    const interval = setInterval(checkConnection, 30000) // Check every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const getQualityColor = () => {
    switch (quality) {
      case 'good': return 'text-green-600'
      case 'slow': return 'text-yellow-600'
      case 'poor': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getQualityBars = () => {
    const bars = []
    const maxBars = 4
    
    let activeBars = 0
    switch (quality) {
      case 'good': activeBars = 4; break
      case 'slow': activeBars = 2; break
      case 'poor': activeBars = 1; break
    }

    for (let i = 0; i < maxBars; i++) {
      bars.push(
        <div
          key={i}
          className={cn(
            'w-1 bg-current rounded-full transition-opacity duration-200',
            i < activeBars ? 'opacity-100' : 'opacity-30'
          )}
          style={{ height: `${(i + 1) * 3}px` }}
        />
      )
    }

    return bars
  }

  return (
    <div className={cn(
      'flex items-center space-x-2 text-sm',
      getQualityColor(),
      className
    )}>
      <div className="flex items-end space-x-px">
        {getQualityBars()}
      </div>
      <span className="capitalize">{quality}</span>
      {latency && (
        <span className="text-xs text-gray-500">
          ({Math.round(latency)}ms)
        </span>
      )}
    </div>
  )
}

/**
 * Sync status component
 */
export function SyncStatus({ 
  className,
  lastSync,
  syncing = false 
}: { 
  className?: string
  lastSync?: Date
  syncing?: boolean
}) {
  const { isOnline } = useOffline()

  const getRelativeTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (days > 0) return `${days}d ago`
    if (hours > 0) return `${hours}h ago`
    if (minutes > 0) return `${minutes}m ago`
    return 'Just now'
  }

  return (
    <div className={cn(
      'flex items-center space-x-2 text-sm text-gray-600',
      className
    )}>
      <div className={cn(
        'w-2 h-2 rounded-full',
        syncing ? 'bg-blue-500 animate-pulse' : 
        isOnline ? 'bg-green-500' : 'bg-gray-400'
      )} />
      <span>
        {syncing ? 'Syncing...' : 
         lastSync ? `Last sync: ${getRelativeTime(lastSync)}` : 
         'Never synced'}
      </span>
    </div>
  )
}

/**
 * Data usage indicator
 */
export function DataUsage({ 
  className,
  usage = 0,
  limit = 100 
}: { 
  className?: string
  usage?: number
  limit?: number
}) {
  const percentage = Math.min((usage / limit) * 100, 100)
  const isHigh = percentage > 80

  return (
    <div className={cn('text-sm', className)}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-gray-600">Data usage</span>
        <span className={cn(
          'font-medium',
          isHigh ? 'text-red-600' : 'text-gray-900'
        )}>
          {usage}MB / {limit}MB
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={cn(
            'h-2 rounded-full transition-all duration-300',
            isHigh ? 'bg-red-500' : 'bg-blue-500'
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

export default NetworkStatus