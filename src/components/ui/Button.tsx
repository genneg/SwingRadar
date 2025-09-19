import { forwardRef } from 'react'

import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'outline' | 'ghost' | 'success' | 'warning' | 'error' | 'gold' | 'elegant' | 'jazz'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'icon'
  loading?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  asChild?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant = 'default', 
    size = 'md', 
    loading, 
    icon, 
    iconPosition = 'left',
    children, 
    disabled, 
    ...props 
  }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none relative'
    
    const variants = {
      default: 'bg-neutral-100 text-neutral-900 hover:bg-neutral-200 focus:ring-neutral-500',
      primary: 'bg-gradient-to-r from-gold-600 to-gold-700 text-navy-900 hover:from-gold-500 hover:to-gold-600 focus:ring-gold-500 shadow-gold hover:shadow-gold-lg hover:-translate-y-0.5',
      secondary: 'bg-transparent text-gold-600 border border-gold-600 hover:bg-gold-600/10 focus:ring-gold-500 hover:shadow-gold hover:-translate-y-0.5',
      outline: 'border-2 border-gold-600 text-gold-600 hover:bg-gold-600/10 focus:ring-gold-500 hover:-translate-y-0.5',
      ghost: 'text-gray-100 hover:bg-gold-600/10 hover:text-gold-600 focus:ring-gold-500 hover:-translate-y-0.5',
      success: 'bg-success-600 text-white hover:bg-success-700 focus:bg-success-700 focus:ring-success-500 hover:shadow-lg hover:-translate-y-0.5',
      warning: 'bg-warning-600 text-white hover:bg-warning-700 focus:bg-warning-700 focus:ring-warning-500 hover:shadow-lg hover:-translate-y-0.5',
      error: 'bg-error-600 text-white hover:bg-error-700 focus:bg-error-700 focus:ring-error-500 hover:shadow-lg hover:-translate-y-0.5',
      gold: 'bg-gradient-to-r from-gold-600 to-gold-700 text-navy-900 hover:from-gold-500 hover:to-gold-600 focus:ring-gold-500 shadow-gold-lg hover:shadow-gold-xl hover:-translate-y-1',
      elegant: 'bg-gradient-to-r from-navy-800 to-navy-900 text-gold-600 border border-gold-600/30 hover:border-gold-600/60 hover:bg-gradient-to-r hover:from-navy-700 hover:to-navy-800 focus:ring-gold-500 hover:shadow-elegant hover:-translate-y-0.5',
      jazz: 'bg-gradient-to-r from-purple-800 to-blue-800 text-gold-400 border border-gold-400/30 hover:border-gold-400/60 hover:bg-gradient-to-r hover:from-purple-700 hover:to-blue-700 focus:ring-gold-400 hover:shadow-elegant hover:-translate-y-0.5'
    }
    
    const sizes = {
      xs: 'px-2 py-1 text-xs h-6',
      sm: 'px-3 py-1.5 text-sm h-8',
      md: 'px-4 py-2 text-base h-10',
      lg: 'px-6 py-3 text-lg h-12',
      xl: 'px-8 py-4 text-xl h-14',
      icon: 'p-2 h-10 w-10'
    }

    const iconSizes = {
      xs: 'w-3 h-3',
      sm: 'w-4 h-4',
      md: 'w-4 h-4',
      lg: 'w-5 h-5',
      xl: 'w-6 h-6',
      icon: 'w-5 h-5'
    }

    const LoadingSpinner = () => (
      <svg className={cn('animate-spin', iconSizes[size])} fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
    )

    const renderIcon = () => {
      if (loading) {
        return <LoadingSpinner />
      }
      if (icon) {
        return <span className={cn(iconSizes[size])}>{icon}</span>
      }
      return null
    }

    const hasContent = children || icon || loading

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          className
        )}
        disabled={disabled ?? loading}
        {...props}
      >
        {hasContent && (
          <>
            {(icon || loading) && iconPosition === 'left' && (
              <span className={cn(children && 'mr-2')}>
                {renderIcon()}
              </span>
            )}
            {children}
            {icon && iconPosition === 'right' && (
              <span className={cn(children && 'ml-2')}>
                {renderIcon()}
              </span>
            )}
          </>
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button }
export type { ButtonProps }