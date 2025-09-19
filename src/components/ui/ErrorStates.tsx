'use client'

import { AlertTriangle, RefreshCw, Wifi, WifiOff, Server, Clock } from 'lucide-react'
import { Button } from './Button'
import { cn } from '@/lib/utils'

interface ErrorStateProps {
  className?: string
  title?: string
  message?: string
  retry?: () => void
  retryText?: string
  showRetry?: boolean
}

/**
 * Generic error state component
 */
export function ErrorState({
  className,
  title = 'Something went wrong',
  message = 'An unexpected error occurred. Please try again.',
  retry,
  retryText = 'Try again',
  showRetry = true
}: ErrorStateProps) {
  return (
    <div className={cn(
      'flex flex-col items-center justify-center p-8 text-center bg-gray-50 rounded-lg border border-gray-200',
      className
    )}>
      <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-4 max-w-md">{message}</p>
      {showRetry && retry && (
        <Button 
          onClick={retry}
          variant="outline"
          size="sm"
          className="flex items-center space-x-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>{retryText}</span>
        </Button>
      )}
    </div>
  )
}

/**
 * Network error state
 */
export function NetworkError({
  className,
  retry,
  retryText = 'Retry',
  showRetry = true
}: Omit<ErrorStateProps, 'title' | 'message'>) {
  return (
    <div className={cn(
      'flex flex-col items-center justify-center p-8 text-center bg-red-50 rounded-lg border border-red-200',
      className
    )}>
      <WifiOff className="w-12 h-12 text-red-500 mb-4" />
      <h3 className="text-lg font-semibold text-red-900 mb-2">Connection Error</h3>
      <p className="text-red-700 mb-4 max-w-md">
        Unable to connect to the server. Please check your internet connection and try again.
      </p>
      {showRetry && retry && (
        <Button 
          onClick={retry}
          variant="outline"
          size="sm"
          className="flex items-center space-x-2 border-red-300 text-red-700 hover:bg-red-100"
        >
          <Wifi className="w-4 h-4" />
          <span>{retryText}</span>
        </Button>
      )}
    </div>
  )
}

/**
 * Server error state
 */
export function ServerError({
  className,
  retry,
  retryText = 'Retry',
  showRetry = true
}: Omit<ErrorStateProps, 'title' | 'message'>) {
  return (
    <div className={cn(
      'flex flex-col items-center justify-center p-8 text-center bg-orange-50 rounded-lg border border-orange-200',
      className
    )}>
      <Server className="w-12 h-12 text-orange-500 mb-4" />
      <h3 className="text-lg font-semibold text-orange-900 mb-2">Server Error</h3>
      <p className="text-orange-700 mb-4 max-w-md">
        The server is currently experiencing issues. Please try again in a moment.
      </p>
      {showRetry && retry && (
        <Button 
          onClick={retry}
          variant="outline"
          size="sm"
          className="flex items-center space-x-2 border-orange-300 text-orange-700 hover:bg-orange-100"
        >
          <RefreshCw className="w-4 h-4" />
          <span>{retryText}</span>
        </Button>
      )}
    </div>
  )
}

/**
 * Timeout error state
 */
export function TimeoutError({
  className,
  retry,
  retryText = 'Retry',
  showRetry = true
}: Omit<ErrorStateProps, 'title' | 'message'>) {
  return (
    <div className={cn(
      'flex flex-col items-center justify-center p-8 text-center bg-yellow-50 rounded-lg border border-yellow-200',
      className
    )}>
      <Clock className="w-12 h-12 text-yellow-500 mb-4" />
      <h3 className="text-lg font-semibold text-yellow-900 mb-2">Request Timeout</h3>
      <p className="text-yellow-700 mb-4 max-w-md">
        The request took too long to complete. Please try again.
      </p>
      {showRetry && retry && (
        <Button 
          onClick={retry}
          variant="outline"
          size="sm"
          className="flex items-center space-x-2 border-yellow-300 text-yellow-700 hover:bg-yellow-100"
        >
          <RefreshCw className="w-4 h-4" />
          <span>{retryText}</span>
        </Button>
      )}
    </div>
  )
}

/**
 * Not found error state
 */
export function NotFoundError({
  className,
  title = 'Not Found',
  message = 'The requested resource could not be found.',
  showRetry = false
}: ErrorStateProps) {
  return (
    <div className={cn(
      'flex flex-col items-center justify-center p-8 text-center bg-gray-50 rounded-lg border border-gray-200',
      className
    )}>
      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-4">
        <span className="text-2xl text-gray-400">404</span>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-4 max-w-md">{message}</p>
      {showRetry && (
        <Button 
          variant="outline"
          size="sm"
          onClick={() => window.history.back()}
        >
          Go Back
        </Button>
      )}
    </div>
  )
}

/**
 * Permission denied error state
 */
export function PermissionDeniedError({
  className,
  title = 'Access Denied',
  message = 'You do not have permission to access this resource.',
  showRetry = false
}: ErrorStateProps) {
  return (
    <div className={cn(
      'flex flex-col items-center justify-center p-8 text-center bg-red-50 rounded-lg border border-red-200',
      className
    )}>
      <div className="w-12 h-12 bg-red-200 rounded-full flex items-center justify-center mb-4">
        <span className="text-2xl text-red-600">🔒</span>
      </div>
      <h3 className="text-lg font-semibold text-red-900 mb-2">{title}</h3>
      <p className="text-red-700 mb-4 max-w-md">{message}</p>
      {showRetry && (
        <Button 
          variant="outline"
          size="sm"
          onClick={() => window.history.back()}
          className="border-red-300 text-red-700 hover:bg-red-100"
        >
          Go Back
        </Button>
      )}
    </div>
  )
}

/**
 * Empty state component
 */
export function EmptyState({
  className,
  title = 'No results found',
  message = 'Try adjusting your search or filters.',
  action,
  actionText = 'Reset filters',
  icon
}: ErrorStateProps & { 
  action?: () => void
  actionText?: string
  icon?: React.ReactNode
}) {
  return (
    <div className={cn(
      'flex flex-col items-center justify-center p-8 text-center bg-gray-50 rounded-lg border border-gray-200',
      className
    )}>
      {icon || <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-4">
        <span className="text-2xl text-gray-400">📭</span>
      </div>}
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-4 max-w-md">{message}</p>
      {action && (
        <Button 
          onClick={action}
          variant="outline"
          size="sm"
        >
          {actionText}
        </Button>
      )}
    </div>
  )
}

/**
 * Inline error component
 */
export function InlineError({
  className,
  message,
  retry,
  retryText = 'Retry'
}: {
  className?: string
  message: string
  retry?: () => void
  retryText?: string
}) {
  return (
    <div className={cn(
      'flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg',
      className
    )}>
      <div className="flex items-center space-x-2">
        <AlertTriangle className="w-4 h-4 text-red-500" />
        <span className="text-sm text-red-700">{message}</span>
      </div>
      {retry && (
        <Button
          onClick={retry}
          variant="ghost"
          size="sm"
          className="text-red-600 hover:text-red-700 hover:bg-red-100"
        >
          {retryText}
        </Button>
      )}
    </div>
  )
}

/**
 * Toast error component
 */
export function ErrorToast({
  className,
  title,
  message,
  onClose
}: {
  className?: string
  title?: string
  message: string
  onClose?: () => void
}) {
  return (
    <div className={cn(
      'flex items-start space-x-3 p-4 bg-red-50 border border-red-200 rounded-lg shadow-sm',
      className
    )}>
      <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
      <div className="flex-1">
        {title && (
          <h4 className="text-sm font-medium text-red-800 mb-1">{title}</h4>
        )}
        <p className="text-sm text-red-700">{message}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-red-400 hover:text-red-500 flex-shrink-0"
        >
          <span className="sr-only">Close</span>
          <span className="text-lg">×</span>
        </button>
      )}
    </div>
  )
}

/**
 * Smart error component that chooses the appropriate error state
 */
export function SmartError({
  error,
  retry,
  className
}: {
  error: Error | string
  retry?: () => void
  className?: string
}) {
  const errorMessage = typeof error === 'string' ? error : error.message
  const errorName = typeof error === 'string' ? '' : error.name

  // Network errors
  if (errorName === 'NetworkError' || errorMessage.includes('Network')) {
    return <NetworkError className={className} retry={retry} />
  }

  // Timeout errors
  if (errorName === 'TimeoutError' || errorMessage.includes('timeout')) {
    return <TimeoutError className={className} retry={retry} />
  }

  // Server errors (5xx)
  if (errorMessage.includes('500') || errorMessage.includes('Server')) {
    return <ServerError className={className} retry={retry} />
  }

  // Not found errors
  if (errorMessage.includes('404') || errorMessage.includes('not found')) {
    return <NotFoundError className={className} />
  }

  // Permission errors
  if (errorMessage.includes('401') || errorMessage.includes('403') || errorMessage.includes('Unauthorized')) {
    return <PermissionDeniedError className={className} />
  }

  // Default error
  return (
    <ErrorState 
      className={className}
      message={errorMessage}
      retry={retry}
    />
  )
}

export default {
  ErrorState,
  NetworkError,
  ServerError,
  TimeoutError,
  NotFoundError,
  PermissionDeniedError,
  EmptyState,
  InlineError,
  ErrorToast,
  SmartError
}