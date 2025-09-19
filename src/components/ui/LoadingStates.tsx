'use client'

import { cn } from '@/lib/utils'
import { LoadingSpinner } from './LoadingSpinner'

interface LoadingStateProps {
  className?: string
}

/**
 * Full page loading state
 */
export function PageLoading({ className }: LoadingStateProps) {
  return (
    <div className={cn(
      'flex items-center justify-center min-h-screen bg-gray-50',
      className
    )}>
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>
  )
}

/**
 * Card loading skeleton
 */
export function CardSkeleton({ className }: LoadingStateProps) {
  return (
    <div className={cn(
      'bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse',
      className
    )}>
      <div className="flex items-start space-x-4">
        <div className="w-12 h-12 bg-gray-200 rounded-lg flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-3 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-3 bg-gray-200 rounded w-2/3" />
      </div>
      <div className="mt-4 flex justify-between items-center">
        <div className="h-6 bg-gray-200 rounded w-20" />
        <div className="h-8 bg-gray-200 rounded w-16" />
      </div>
    </div>
  )
}

/**
 * List loading skeleton
 */
export function ListSkeleton({ 
  count = 3, 
  className 
}: LoadingStateProps & { count?: number }) {
  return (
    <div className={cn('space-y-4', className)}>
      {Array.from({ length: count }).map((_, index) => (
        <CardSkeleton key={index} />
      ))}
    </div>
  )
}

/**
 * Table loading skeleton
 */
export function TableSkeleton({ 
  rows = 5, 
  columns = 4, 
  className 
}: LoadingStateProps & { rows?: number; columns?: number }) {
  return (
    <div className={cn('w-full', className)}>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div className="flex space-x-4">
            {Array.from({ length: columns }).map((_, index) => (
              <div
                key={index}
                className="h-4 bg-gray-200 rounded animate-pulse"
                style={{ width: `${100 / columns}%` }}
              />
            ))}
          </div>
        </div>
        
        {/* Rows */}
        <div className="divide-y divide-gray-200">
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <div key={rowIndex} className="px-6 py-4">
              <div className="flex space-x-4">
                {Array.from({ length: columns }).map((_, colIndex) => (
                  <div
                    key={colIndex}
                    className="h-4 bg-gray-200 rounded animate-pulse"
                    style={{ width: `${100 / columns}%` }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/**
 * Event card loading skeleton
 */
export function EventCardSkeleton({ className }: LoadingStateProps) {
  return (
    <div className={cn(
      'bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-pulse',
      className
    )}>
      {/* Image placeholder */}
      <div className="w-full h-48 bg-gray-200" />
      
      {/* Content */}
      <div className="p-6">
        <div className="space-y-3">
          <div className="h-6 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
        </div>
        
        <div className="mt-4 space-y-2">
          <div className="h-3 bg-gray-200 rounded w-full" />
          <div className="h-3 bg-gray-200 rounded w-2/3" />
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gray-200 rounded" />
            <div className="h-4 bg-gray-200 rounded w-20" />
          </div>
          <div className="h-8 bg-gray-200 rounded w-20" />
        </div>
      </div>
    </div>
  )
}

/**
 * Profile loading skeleton
 */
export function ProfileSkeleton({ className }: LoadingStateProps) {
  return (
    <div className={cn(
      'bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse',
      className
    )}>
      <div className="flex items-start space-x-6">
        <div className="w-20 h-20 bg-gray-200 rounded-full flex-shrink-0" />
        <div className="flex-1 space-y-4">
          <div className="space-y-2">
            <div className="h-6 bg-gray-200 rounded w-48" />
            <div className="h-4 bg-gray-200 rounded w-32" />
          </div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded w-full" />
            <div className="h-3 bg-gray-200 rounded w-3/4" />
          </div>
        </div>
      </div>
      
      <div className="mt-6 flex space-x-4">
        <div className="h-10 bg-gray-200 rounded w-24" />
        <div className="h-10 bg-gray-200 rounded w-20" />
      </div>
    </div>
  )
}

/**
 * Search loading skeleton
 */
export function SearchSkeleton({ className }: LoadingStateProps) {
  return (
    <div className={cn('space-y-4', className)}>
      <div className="animate-pulse">
        <div className="h-12 bg-gray-200 rounded-lg" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <EventCardSkeleton key={index} />
        ))}
      </div>
    </div>
  )
}

/**
 * Dashboard loading skeleton
 */
export function DashboardSkeleton({ className }: LoadingStateProps) {
  return (
    <div className={cn('space-y-6', className)}>
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse"
          >
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gray-200 rounded" />
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-16" />
                <div className="h-6 bg-gray-200 rounded w-12" />
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Content sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-48 mb-4" />
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-32 mb-4" />
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="h-8 bg-gray-200 rounded" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Inline loading state
 */
export function InlineLoading({ 
  text = 'Loading...', 
  className 
}: LoadingStateProps & { text?: string }) {
  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <LoadingSpinner size="sm" />
      <span className="text-sm text-gray-600">{text}</span>
    </div>
  )
}

/**
 * Button loading state
 */
export function ButtonLoading({ 
  text = 'Loading...', 
  className 
}: LoadingStateProps & { text?: string }) {
  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <LoadingSpinner size="sm" />
      <span>{text}</span>
    </div>
  )
}

export default {
  PageLoading,
  CardSkeleton,
  ListSkeleton,
  TableSkeleton,
  EventCardSkeleton,
  ProfileSkeleton,
  SearchSkeleton,
  DashboardSkeleton,
  InlineLoading,
  ButtonLoading
}