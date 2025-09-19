import { forwardRef } from 'react'

import { cn } from '@/lib/utils'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'neutral' | 'gold' | 'elegant' | 'jazz' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  dot?: boolean
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'neutral', size = 'md', dot = false, children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center font-medium rounded-full'
    
    const variants = {
      primary: 'bg-gold-600/20 text-gold-600 border border-gold-600/30',
      secondary: 'bg-gold-600/10 text-gray-100 border border-gold-600/20',
      success: 'bg-success-600/20 text-success-400 border border-success-600/30',
      warning: 'bg-warning-600/20 text-warning-400 border border-warning-600/30',
      error: 'bg-error-600/20 text-error-400 border border-error-600/30',
      neutral: 'bg-gray-600/20 text-gray-300 border border-gray-600/30',
      gold: 'bg-gradient-to-r from-gold-600 to-gold-700 text-navy-900 border border-gold-600',
      elegant: 'bg-navy-800/50 text-gold-600 border border-gold-600/30 backdrop-blur-sm',
      jazz: 'bg-gradient-to-r from-purple-600/20 to-blue-600/20 text-purple-300 border border-purple-400/30',
      outline: 'bg-transparent text-gray-300 border border-gray-600/50'
    }
    
    const sizes = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-2.5 py-0.5 text-xs',
      lg: 'px-3 py-1 text-sm'
    }

    const dotVariants = {
      primary: 'bg-gold-600',
      secondary: 'bg-gold-600',
      success: 'bg-success-500',
      warning: 'bg-warning-500',
      error: 'bg-error-500',
      neutral: 'bg-gray-500',
      gold: 'bg-navy-900',
      elegant: 'bg-gold-600',
      jazz: 'bg-purple-500'
    }

    return (
      <span
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {dot && (
          <span className={cn('w-1.5 h-1.5 rounded-full mr-1.5', dotVariants[variant])} />
        )}
        {children}
      </span>
    )
  }
)

Badge.displayName = 'Badge'

export { Badge }
export type { BadgeProps }