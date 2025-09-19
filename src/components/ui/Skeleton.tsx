import { forwardRef } from 'react'

import { cn } from '@/lib/utils'

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded'
  width?: string | number
  height?: string | number
}

const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant = 'rectangular', width, height, ...props }, ref) => {
    const variants = {
      text: 'rounded',
      circular: 'rounded-full',
      rectangular: 'rounded-none',
      rounded: 'rounded-lg'
    }

    const style = {
      width: typeof width === 'number' ? `${width}px` : width,
      height: typeof height === 'number' ? `${height}px` : height,
    }

    return (
      <div
        ref={ref}
        className={cn(
          'skeleton',
          variants[variant],
          className
        )}
        style={style}
        {...props}
      />
    )
  }
)

Skeleton.displayName = 'Skeleton'

// Predefined skeleton components for common use cases
const SkeletonText = forwardRef<HTMLDivElement, Omit<SkeletonProps, 'variant'>>(
  ({ className, ...props }, ref) => (
    <Skeleton
      ref={ref}
      variant="text"
      className={cn('h-4', className)}
      {...props}
    />
  )
)
SkeletonText.displayName = 'SkeletonText'

const SkeletonAvatar = forwardRef<HTMLDivElement, Omit<SkeletonProps, 'variant'>>(
  ({ className, ...props }, ref) => (
    <Skeleton
      ref={ref}
      variant="circular"
      className={cn('w-10 h-10', className)}
      {...props}
    />
  )
)
SkeletonAvatar.displayName = 'SkeletonAvatar'

const SkeletonCard = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('space-y-3', className)} {...props}>
      <Skeleton variant="rounded" className="h-48 w-full" />
      <div className="space-y-2">
        <Skeleton variant="text" className="h-4 w-3/4" />
        <Skeleton variant="text" className="h-4 w-1/2" />
      </div>
    </div>
  )
)
SkeletonCard.displayName = 'SkeletonCard'

export { Skeleton, SkeletonText, SkeletonAvatar, SkeletonCard }
export type { SkeletonProps }