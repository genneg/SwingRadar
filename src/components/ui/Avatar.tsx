import React, { forwardRef } from 'react'

import { cn } from '@/lib/utils'

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string
  alt?: string
  name?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  fallback?: string
  loading?: boolean
}

const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt, name, size = 'md', fallback, loading = false, ...props }, ref) => {
    const sizes = {
      xs: 'w-6 h-6 text-xs',
      sm: 'w-8 h-8 text-sm',
      md: 'w-10 h-10 text-base',
      lg: 'w-12 h-12 text-lg',
      xl: 'w-16 h-16 text-xl',
      '2xl': 'w-20 h-20 text-2xl'
    }

    const getInitials = (name?: string) => {
      if (!name) return '?'
      return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    }

    if (loading) {
      return (
        <div
          ref={ref}
          className={cn(
            'rounded-full bg-neutral-200 animate-pulse',
            sizes[size],
            className
          )}
          {...props}
        />
      )
    }

    return (
      <div
        ref={ref}
        className={cn(
          'relative rounded-full overflow-hidden bg-neutral-100 flex items-center justify-center',
          sizes[size],
          className
        )}
        {...props}
      >
        {src ? (
          <img
            src={src}
            alt={alt || 'Avatar'}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Hide image on error and show fallback
              e.currentTarget.style.display = 'none'
            }}
          />
        ) : (
          <span className="font-medium text-neutral-600 select-none">
            {getInitials(fallback || alt)}
          </span>
        )}
      </div>
    )
  }
)

Avatar.displayName = 'Avatar'

// Avatar Group Component
interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  max?: number
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  children: React.ReactNode
}

const AvatarGroup = forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({ className, max = 5, size = 'md', children, ...props }, ref) => {
    const childrenArray = React.Children.toArray(children)
    const visibleChildren = childrenArray.slice(0, max)
    const remainingCount = childrenArray.length - max

    const spacingClasses = {
      xs: '-space-x-1',
      sm: '-space-x-1',
      md: '-space-x-2',
      lg: '-space-x-2',
      xl: '-space-x-3',
      '2xl': '-space-x-3'
    }

    return (
      <div
        ref={ref}
        className={cn('flex items-center', spacingClasses[size], className)}
        {...props}
      >
        {visibleChildren.map((child, index) =>
          React.cloneElement(child as React.ReactElement, {
            key: index,
            size,
            className: cn(
              'ring-2 ring-white relative',
              (child as React.ReactElement).props?.className
            )
          })
        )}
        {remainingCount > 0 && (
          <div
            className={cn(
              'rounded-full bg-neutral-200 text-neutral-600 flex items-center justify-center font-medium ring-2 ring-white relative',
              size === 'xs' && 'w-6 h-6 text-xs',
              size === 'sm' && 'w-8 h-8 text-sm',
              size === 'md' && 'w-10 h-10 text-base',
              size === 'lg' && 'w-12 h-12 text-lg',
              size === 'xl' && 'w-16 h-16 text-xl',
              size === '2xl' && 'w-20 h-20 text-2xl'
            )}
          >
            +{remainingCount}
          </div>
        )}
      </div>
    )
  }
)

AvatarGroup.displayName = 'AvatarGroup'

export { Avatar, AvatarGroup }
export type { AvatarProps, AvatarGroupProps }