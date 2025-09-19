'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface SkipLink {
  href: string
  label: string
}

interface SkipNavigationProps {
  links?: SkipLink[]
  className?: string
}

export function SkipNavigation({
  links = [
    { href: '#main-content', label: 'Skip to main content' },
    { href: '#search', label: 'Skip to search' },
    { href: '#events', label: 'Skip to events listing' }
  ],
  className
}: SkipNavigationProps) {
  const [focusedIndex, setFocusedIndex] = useState(-1)

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      const element = document.querySelector(links[index].href)
      if (element) {
        element.setAttribute('tabindex', '-1')
        element.focus()
        element.removeAttribute('tabindex')
      }
    }
  }

  const handleFocus = (index: number) => {
    setFocusedIndex(index)
  }

  const handleBlur = () => {
    setFocusedIndex(-1)
  }

  return (
    <div
      className={cn(
        // Vintage Art Deco styling with accessibility focus
        'fixed top-4 left-4 z-[100] transition-all duration-200',
        'sr-only focus:not-sr-only focus:outline-none focus:ring-2',
        'focus:ring-gold-500 focus:ring-offset-2 focus:ring-offset-navy-900',
        'bg-gradient-to-r from-gold-600 to-gold-700 text-navy-900',
        'px-6 py-3 rounded-lg font-medium shadow-gold-lg',
        'group'
      )}
      role="navigation"
      aria-label="Skip navigation links"
    >
      <div className="flex flex-col space-y-2">
        {links.map((link, index) => (
          <a
            key={link.href}
            href={link.href}
            className={cn(
              'block transition-all duration-200 hover:text-cream-100',
              'focus:bg-gold-500 focus:text-navy-900',
              'px-4 py-2 rounded-md',
              focusedIndex === index && 'bg-gold-500 text-navy-900'
            )}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onFocus={() => handleFocus(index)}
            onBlur={handleBlur}
            tabIndex={0}
          >
            <span className="jazz-font font-bold">{link.label}</span>
          </a>
        ))}
      </div>
    </div>
  )
}

// Hook for managing skip navigation behavior
export function useSkipNavigation() {
  const [skipNavVisible, setSkipNavVisible] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Show skip navigation when Tab key is pressed first
      if (e.key === 'Tab' && !e.shiftKey) {
        const activeElement = document.activeElement
        if (activeElement === document.body) {
          setSkipNavVisible(true)
        }
      }
    }

    const handleMouseDown = () => {
      // Hide skip navigation when mouse is used
      setSkipNavVisible(false)
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('mousedown', handleMouseDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousedown', handleMouseDown)
    }
  }, [])

  return { skipNavVisible }
}

// Component for marking main content areas
export function MainContent({
  children,
  id = 'main-content',
  tabIndex = -1,
  className
}: {
  children: React.ReactNode
  id?: string
  tabIndex?: number
  className?: string
}) {
  return (
    <main
      id={id}
      tabIndex={tabIndex}
      className={cn(
        'outline-none focus:ring-2 focus:ring-gold-500 focus:ring-offset-2',
        'rounded-lg p-2 -m-2 transition-colors',
        className
      )}
      role="main"
    >
      {children}
    </main>
  )
}

// Component for accessible landmarks
export function Landmark({
  children,
  role,
  label,
  className
}: {
  children: React.ReactNode
  role: 'complementary' | 'contentinfo' | 'navigation' | 'search'
  label: string
  className?: string
}) {
  return (
    <div
      role={role}
      aria-label={label}
      className={className}
    >
      {children}
    </div>
  )
}

// Component for accessible headings
export function AccessibleHeading({
  level = 2,
  children,
  className,
  ...props
}: {
  level?: 1 | 2 | 3 | 4 | 5 | 6
  children: React.ReactNode
  className?: string
} & React.HTMLAttributes<HTMLHeadingElement>) {
  const Tag = `h${level}` as const

  return (
    <Tag
      className={cn(
        'scroll-m-20 tracking-tight vintage-heading',
        level === 1 && 'text-4xl jazz-font font-bold lg:text-5xl',
        level === 2 && 'text-3xl jazz-font font-bold lg:text-4xl',
        level === 3 && 'text-2xl jazz-font font-bold lg:text-3xl',
        level === 4 && 'text-xl jazz-font font-bold lg:text-2xl',
        level === 5 && 'text-lg jazz-font font-bold lg:text-xl',
        level === 6 && 'text-base jazz-font font-bold lg:text-lg',
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  )
}