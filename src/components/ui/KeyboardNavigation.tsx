'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { cn } from '@/lib/utils'

interface KeyboardShortcut {
  key: string
  ctrl?: boolean
  alt?: boolean
  shift?: boolean
  action: string
  description: string
  category?: string
}

interface FocusTrapProps {
  active: boolean
  children: React.ReactNode
  onEscape?: () => void
}

interface KeyboardNavigationProps {
  shortcuts?: KeyboardShortcut[]
  focusIndicators?: boolean
  tabOrder?: string[]
  onShortcut?: (shortcut: KeyboardShortcut) => void
  className?: string
}

// Default keyboard shortcuts for the app
const defaultShortcuts: KeyboardShortcut[] = [
  { key: '/', action: 'focusSearch', description: 'Focus search input', category: 'Navigation' },
  { key: 'k', ctrl: true, action: 'openSearch', description: 'Open search modal', category: 'Search' },
  { key: 'Escape', action: 'closeModals', description: 'Close modals and dropdowns', category: 'General' },
  { key: 'ArrowDown', action: 'navigateResults', description: 'Navigate search results down', category: 'Navigation' },
  { key: 'ArrowUp', action: 'navigateResultsUp', description: 'Navigate search results up', category: 'Navigation' },
  { key: 'Enter', action: 'selectResult', description: 'Select focused result', category: 'Navigation' },
  { key: 'h', action: 'toggleHelp', description: 'Toggle help overlay', category: 'Help' },
  { key: 't', action: 'themeToggle', description: 'Toggle theme', category: 'Appearance' },
  { key: 's', shift: true, action: 'saveSearch', description: 'Save current search', category: 'Search' },
  { key: 'f', action: 'focusFilters', description: 'Focus filter panel', category: 'Filters' },
  { key: 'm', action: 'toggleMobileMenu', description: 'Toggle mobile menu', category: 'Navigation' },
]

export function KeyboardNavigation({
  shortcuts = defaultShortcuts,
  focusIndicators = true,
  tabOrder,
  onShortcut,
  className
}: KeyboardNavigationProps) {
  const [activeShortcuts, setActiveShortcuts] = useState<KeyboardShortcut[]>([])
  const [showHelp, setShowHelp] = useState(false)
  const [currentFocus, setCurrentFocus] = useState<string | null>(null)

  const handleGlobalKeydown = useCallback((event: KeyboardEvent) => {
    // Don't trigger shortcuts when typing in inputs
    if (event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement) {
      return
    }

    const matchedShortcut = shortcuts.find(shortcut =>
      event.key.toLowerCase() === shortcut.key.toLowerCase() &&
      (shortcut.ctrl ? event.ctrlKey : !event.ctrlKey) &&
      (shortcut.alt ? event.altKey : !event.altKey) &&
      (shortcut.shift ? event.shiftKey : !event.shiftKey)
    )

    if (matchedShortcut) {
      event.preventDefault()

      // Handle built-in actions
      switch (matchedShortcut.action) {
        case 'focusSearch':
          const searchInput = document.querySelector('input[type="search"], input[placeholder*="search"]') as HTMLInputElement
          if (searchInput) {
            searchInput.focus()
            searchInput.select()
          }
          break
        case 'toggleHelp':
          setShowHelp(prev => !prev)
          break
        case 'closeModals':
          // Close all modals by pressing Escape
          const modals = document.querySelectorAll('[role="dialog"]')
          modals.forEach(modal => {
            const closeButton = modal.querySelector('button[aria-label*="close"], button[aria-label*="Close"]')
            if (closeButton instanceof HTMLButtonElement) {
              closeButton.click()
            }
          })
          break
        case 'themeToggle':
          // Toggle theme if theme functionality exists
          document.documentElement.classList.toggle('dark')
          break
      }

      setActiveShortcuts([matchedShortcut])
      setTimeout(() => setActiveShortcuts([]), 1000)

      onShortcut?.(matchedShortcut)
    }
  }, [shortcuts, onShortcut])

  useEffect(() => {
    if (focusIndicators) {
      document.addEventListener('keydown', handleGlobalKeydown)
      return () => document.removeEventListener('keydown', handleGlobalKeydown)
    }
  }, [handleGlobalKeydown, focusIndicators])

  return (
    <>
      {/* Focus indicators */}
      {focusIndicators && (
        <style jsx>{`
          *:focus {
            outline: 2px solid #fbbf24 !important;
            outline-offset: 2px !important;
            transition: outline-color 0.2s ease;
          }
          *:focus:not(:focus-visible) {
            outline: 2px solid transparent !important;
          }
          *:focus-visible {
            outline: 2px solid #fbbf24 !important;
            outline-offset: 2px !important;
          }
        `}</style>
      )}

      {/* Help overlay */}
      {showHelp && (
        <div className="fixed inset-0 z-[999] bg-navy-900/95 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto p-6 h-full overflow-y-auto">
            <div className="bg-gradient-to-br from-cream-50 to-bordeaux-50 rounded-xl p-8 my-8 border border-gold-400/30">
              <div className="flex items-center justify-between mb-6">
                <h2 className="jazz-font text-3xl text-navy-900">Keyboard Shortcuts</h2>
                <button
                  onClick={() => setShowHelp(false)}
                  className="vintage-button bg-gold-600 hover:bg-gold-500 text-navy-900 px-4 py-2 rounded-lg"
                  aria-label="Close help"
                >
                  Close
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(
                  shortcuts.reduce((acc, shortcut) => {
                    const category = shortcut.category || 'General'
                    if (!acc[category]) acc[category] = []
                    acc[category].push(shortcut)
                    return acc
                  }, {} as Record<string, KeyboardShortcut[]>)
                ).map(([category, categoryShortcuts]) => (
                  <div key={category} className="space-y-3">
                    <h3 className="jazz-font text-lg text-gold-700 font-semibold">{category}</h3>
                    <div className="space-y-2">
                      {categoryShortcuts.map((shortcut, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gold-200">
                          <div className="flex items-center space-x-3">
                            <kbd className="px-2 py-1 bg-navy-100 text-navy-900 rounded text-sm font-mono">
                              {shortcut.ctrl && 'Ctrl+'}
                              {shortcut.alt && 'Alt+'}
                              {shortcut.shift && 'Shift+'}
                              {shortcut.key}
                            </kbd>
                            <span className="text-navy-700">{shortcut.description}</span>
                          </div>
                          {activeShortcuts.includes(shortcut) && (
                            <span className="text-gold-600 animate-pulse">✓</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Visual feedback for active shortcuts */}
      {activeShortcuts.length > 0 && (
        <div className="fixed bottom-4 right-4 z-50">
          <div className="bg-gold-600 text-navy-900 px-4 py-2 rounded-lg shadow-lg jazz-font font-bold animate-pulse">
            {activeShortcuts[0].action}
          </div>
        </div>
      )}
    </>
  )
}

// Focus trap for modals and dropdowns
export function FocusTrap({ active, children, onEscape }: FocusTrapProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!active) return

    const container = containerRef.current
    if (!container) return

    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>

    if (focusableElements.length === 0) return

    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onEscape?.()
        return
      }

      if (event.key === 'Tab') {
        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            event.preventDefault()
            lastElement.focus()
          }
        } else {
          if (document.activeElement === lastElement) {
            event.preventDefault()
            firstElement.focus()
          }
        }
      }
    }

    // Focus first element when trap activates
    firstElement.focus()

    container.addEventListener('keydown', handleKeyDown)

    return () => {
      container.removeEventListener('keydown', handleKeyDown)
    }
  }, [active, onEscape])

  return (
    <div ref={containerRef} className={cn('outline-none', active && 'focus-trap-active')}>
      {children}
    </div>
  )
}

// Hook for managing keyboard navigation
export function useKeyboardNavigation() {
  const announce = useCallback((message: string) => {
    const announcement = document.createElement('div')
    announcement.setAttribute('role', 'status')
    announcement.setAttribute('aria-live', 'polite')
    announcement.className = 'sr-only'
    announcement.textContent = message

    document.body.appendChild(announcement)

    setTimeout(() => {
      document.body.removeChild(announcement)
    }, 1000)
  }, [])

  const focusElement = useCallback((selector: string) => {
    const element = document.querySelector(selector) as HTMLElement
    if (element) {
      element.focus()
      announce(`Focused on ${element.getAttribute('aria-label') || element.textContent || 'element'}`)
    }
  }, [announce])

  const announceAction = useCallback((action: string) => {
    announce(`Action completed: ${action}`)
  }, [announce])

  return {
    announce,
    focusElement,
    announceAction
  }
}

// Component for accessible tabs
export function AccessibleTabs({
  tabs,
  defaultActiveTab,
  onTabChange,
  className
}: {
  tabs: Array<{ id: string; label: string; content: React.ReactNode }>
  defaultActiveTab?: string
  onTabChange?: (tabId: string) => void
  className?: string
}) {
  const [activeTab, setActiveTab] = useState(defaultActiveTab || tabs[0]?.id)

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId)
    onTabChange?.(tabId)
  }

  const handleKeyDown = (event: React.KeyboardEvent, tabId: string, index: number) => {
    const tabsList = tabs.map(t => t.id)
    let newIndex = index

    switch (event.key) {
      case 'ArrowRight':
        newIndex = (index + 1) % tabs.length
        break
      case 'ArrowLeft':
        newIndex = (index - 1 + tabs.length) % tabs.length
        break
      case 'Home':
        newIndex = 0
        break
      case 'End':
        newIndex = tabs.length - 1
        break
      case 'Enter':
      case ' ':
        handleTabClick(tabId)
        return
      default:
        return
    }

    event.preventDefault()
    const newTabElement = document.querySelector(`[role="tab"][data-tab-id="${tabsList[newIndex]}"]`) as HTMLElement
    if (newTabElement) {
      newTabElement.focus()
    }
  }

  return (
    <div className={cn('w-full', className)}>
      {/* Tab list */}
      <div role="tablist" className="flex space-x-1 bg-gold-100 p-1 rounded-lg mb-4">
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`tabpanel-${tab.id}`}
            data-tab-id={tab.id}
            tabIndex={activeTab === tab.id ? 0 : -1}
            onClick={() => handleTabClick(tab.id)}
            onKeyDown={(e) => handleKeyDown(e, tab.id, index)}
            className={cn(
              'flex-1 px-4 py-2 rounded-md font-medium transition-all',
              'focus:outline-none focus:ring-2 focus:ring-gold-500',
              activeTab === tab.id
                ? 'bg-gold-600 text-navy-900 shadow-gold'
                : 'text-navy-700 hover:bg-gold-200'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab panels */}
      {tabs.map((tab) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`tabpanel-${tab.id}`}
          aria-labelledby={`tab-${tab.id}`}
          hidden={activeTab !== tab.id}
          className={cn(
            'transition-all duration-200',
            activeTab === tab.id ? 'block' : 'hidden'
          )}
        >
          {tab.content}
        </div>
      ))}
    </div>
  )
}