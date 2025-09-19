'use client'

import { useState, useCallback, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface TourStep {
  target: string
  title: string
  content: string
  position?: 'top' | 'bottom' | 'left' | 'right'
  onNext?: () => void
  onPrevious?: () => void
}

interface ChecklistItem {
  id: string
  title: string
  description: string
  completed: boolean
  optional?: boolean
  action?: () => void
}

interface HelpSystemProps {
  tooltips?: boolean
  guidedTours?: string[]
  beginnerChecklist?: boolean
  className?: string
}

export function HelpSystem({
  tooltips = false,
  guidedTours = ['search', 'filters', 'events'],
  beginnerChecklist = true,
  className
}: HelpSystemProps) {
  const [activeTour, setActiveTour] = useState<string | null>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [showHelp, setShowHelp] = useState(false)
  const [checklist, setChecklist] = useState<ChecklistItem[]>([])
  const [tooltipVisible, setTooltipVisible] = useState<Record<string, boolean>>({})

  // Initialize beginner checklist
  useEffect(() => {
    if (beginnerChecklist) {
      setChecklist([
        {
          id: 'search',
          title: 'Try the Search',
          description: 'Search for blues festivals, teachers, or events',
          completed: false,
          action: () => {
            const searchInput = document.querySelector('input[type="search"]') as HTMLInputElement
            if (searchInput) {
              searchInput.focus()
              searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' })
            }
          }
        },
        {
          id: 'filters',
          title: 'Use Filters',
          description: 'Apply filters to narrow down your search results',
          completed: false,
          action: () => {
            const filterPanel = document.querySelector('[data-role="filter-panel"]') as HTMLElement
            if (filterPanel) {
              filterPanel.scrollIntoView({ behavior: 'smooth', block: 'center' })
              filterPanel.click()
            }
          }
        },
        {
          id: 'events',
          title: 'Browse Events',
          description: 'Explore available blues dance festivals and workshops',
          completed: false,
          action: () => {
            const eventSection = document.querySelector('#events') as HTMLElement
            if (eventSection) {
              eventSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }
          }
        },
        {
          id: 'follow',
          title: 'Follow Artists',
          description: 'Follow your favorite teachers and musicians',
          completed: false,
          optional: true
        },
        {
          id: 'save',
          title: 'Save Events',
          description: 'Save interesting events to your wishlist',
          completed: false,
          optional: true
        }
      ])
    }
  }, [beginnerChecklist])

  const tours: Record<string, TourStep[]> = {
    search: [
      {
        target: '[data-tour="search-input"]',
        title: 'Search Bar',
        content: 'Start typing to search for blues festivals, teachers, musicians, or locations. Try searching for "Blues Festival" or your favorite teacher!',
        position: 'bottom'
      },
      {
        target: '[data-tour="search-suggestions"]',
        title: 'Smart Suggestions',
        content: 'Get intelligent suggestions as you type. Find events, teachers, and locations with auto-complete.',
        position: 'bottom'
      },
      {
        target: '[data-tour="search-history"]',
        title: 'Search History',
        content: 'Your recent searches are saved here for quick access.',
        position: 'left'
      }
    ],
    filters: [
      {
        target: '[data-tour="filter-panel"]',
        title: 'Filter Panel',
        content: 'Use these filters to narrow down your results. You can filter by date, location, price, and more.',
        position: 'left'
      },
      {
        target: '[data-tour="filter-presets"]',
        title: 'Quick Presets',
        content: 'Try these popular filter combinations to quickly find what you\'re looking for.',
        position: 'bottom'
      },
      {
        target: '[data-tour="price-filter"]',
        title: 'Price Range',
        content: 'Set your budget using the price range slider.',
        position: 'top'
      }
    ],
    events: [
      {
        target: '[data-tour="event-card"]',
        title: 'Event Cards',
        content: 'Each card shows important event information including dates, prices, and teachers.',
        position: 'top'
      },
      {
        target: '[data-tour="event-pricing"]',
        title: 'Pricing Information',
        content: 'See price ranges and availability at a glance.',
        position: 'left'
      },
      {
        target: '[data-tour="event-teachers"]',
        title: 'Teachers & Musicians',
        content: 'Find out which teachers and musicians will be at each event.',
        position: 'bottom'
      },
      {
        target: '[data-tour="event-save"]',
        title: 'Save Events',
        content: 'Click the heart icon to save events to your wishlist.',
        position: 'left'
      }
    ]
  }

  const startTour = useCallback((tourName: string) => {
    setActiveTour(tourName)
    setCurrentStep(0)
    setShowHelp(false)
  }, [])

  const nextStep = useCallback(() => {
    if (activeTour && tours[activeTour]) {
      if (currentStep < tours[activeTour].length - 1) {
        setCurrentStep(currentStep + 1)
      } else {
        setActiveTour(null)
        setCurrentStep(0)
      }
    }
  }, [activeTour, currentStep, tours])

  const previousStep = useCallback(() => {
    if (activeTour && currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }, [activeTour, currentStep])

  const endTour = useCallback(() => {
    setActiveTour(null)
    setCurrentStep(0)
  }, [])

  const toggleChecklistItem = useCallback((itemId: string) => {
    setChecklist(prev => prev.map(item =>
      item.id === itemId ? { ...item, completed: !item.completed } : item
    ))
  }, [])

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setActiveTour(null)
      setShowHelp(false)
    }
    if (e.key === 'ArrowRight' && activeTour) {
      nextStep()
    }
    if (e.key === 'ArrowLeft' && activeTour) {
      previousStep()
    }
  }, [activeTour, nextStep, previousStep])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return (
    <>
      {/* Help button */}
      <button
        onClick={() => setShowHelp(!showHelp)}
        className={cn(
          'fixed bottom-6 left-6 z-40 w-14 h-14 bg-gold-600 hover:bg-gold-500 text-navy-900 rounded-full shadow-lg',
          'flex items-center justify-center transition-all duration-200 hover:scale-110',
          'focus:outline-none focus:ring-2 focus:ring-gold-500 focus:ring-offset-2',
          'animate-bounce hover:animate-none'
        )}
        aria-label="Open help center"
      >
        <span className="text-2xl">❓</span>
      </button>

      {/* Help overlay */}
      {showHelp && (
        <div className="fixed inset-0 z-[100] bg-navy-900/95 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto p-6 h-full overflow-y-auto">
            <div className="bg-gradient-to-br from-cream-50 to-bordeaux-50 rounded-xl p-8 my-8 border border-gold-400/30">
              <div className="flex items-center justify-between mb-8">
                <h2 className="jazz-font text-3xl text-navy-900">Help Center</h2>
                <button
                  onClick={() => setShowHelp(false)}
                  className="vintage-button bg-gold-600 hover:bg-gold-500 text-navy-900 px-6 py-2 rounded-lg"
                  aria-label="Close help"
                >
                  Close
                </button>
              </div>

              {/* Guided Tours */}
              <div className="mb-8">
                <h3 className="jazz-font text-xl text-navy-900 mb-4">Guided Tours</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {guidedTours.map((tour) => (
                    <button
                      key={tour}
                      onClick={() => startTour(tour)}
                      className="bg-white p-6 rounded-lg border border-gold-300 hover:border-gold-400 transition-colors text-left"
                    >
                      <h4 className="jazz-font text-lg text-navy-900 mb-2 capitalize">{tour} Tour</h4>
                      <p className="text-navy-600 text-sm">Learn how to use {tour} features</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Beginner Checklist */}
              {beginnerChecklist && (
                <div className="mb-8">
                  <h3 className="jazz-font text-xl text-navy-900 mb-4">Getting Started Checklist</h3>
                  <div className="space-y-3">
                    {checklist.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-4 bg-white rounded-lg border border-gold-200">
                        <div className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={item.completed}
                            onChange={() => toggleChecklistItem(item.id)}
                            className="w-5 h-5 text-gold-600 rounded focus:ring-gold-500"
                          />
                          <div>
                            <h4 className="jazz-font text-navy-900">{item.title}</h4>
                            <p className="text-sm text-navy-600">{item.description}</p>
                            {item.optional && (
                              <span className="text-xs text-gold-600">Optional</span>
                            )}
                          </div>
                        </div>
                        {item.action && (
                          <button
                            onClick={item.action}
                            className="vintage-button bg-gold-100 hover:bg-gold-200 text-navy-900 px-3 py-1 rounded text-sm"
                          >
                            Go
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Keyboard Shortcuts */}
              <div className="mb-8">
                <h3 className="jazz-font text-xl text-navy-900 mb-4">Quick Tips</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-lg border border-gold-200">
                    <h4 className="jazz-font text-navy-900 mb-2">🔍 Search Tips</h4>
                    <ul className="text-sm text-navy-600 space-y-1">
                      <li>• Press / to focus search instantly</li>
                      <li>• Use quotes for exact phrases</li>
                      <li>• Try searching by teacher name</li>
                    </ul>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-gold-200">
                    <h4 className="jazz-font text-navy-900 mb-2">📱 Mobile Tips</h4>
                    <ul className="text-sm text-navy-600 space-y-1">
                      <li>• Swipe left/right to navigate</li>
                      <li>• Pull down to refresh</li>
                      <li>• Double tap to like events</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Active Tour Overlay */}
      {activeTour && tours[activeTour] && (
        <TourOverlay
          steps={tours[activeTour]}
          currentStep={currentStep}
          onNext={nextStep}
          onPrevious={previousStep}
          onEnd={endTour}
        />
      )}

      {/* Contextual tooltips removed - only help button remains */}
    </>
  )
}

interface TourOverlayProps {
  steps: TourStep[]
  currentStep: number
  onNext: () => void
  onPrevious: () => void
  onEnd: () => void
}

function TourOverlay({ steps, currentStep, onNext, onPrevious, onEnd }: TourOverlayProps) {
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0, height: 0 })

  useEffect(() => {
    const targetElement = document.querySelector(steps[currentStep].target) as HTMLElement
    if (targetElement) {
      const rect = targetElement.getBoundingClientRect()
      setPosition({
        top: rect.top + window.pageYOffset,
        left: rect.left + window.pageXOffset,
        width: rect.width,
        height: rect.height
      })

      // Highlight target element
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
      targetElement.classList.add('tour-highlight')

      return () => {
        targetElement.classList.remove('tour-highlight')
      }
    }
  }, [steps, currentStep])

  const step = steps[currentStep]

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-[90] bg-black/50" onClick={onEnd} />

      {/* Highlight */}
      <div
        className="fixed z-[91] bg-gold-400/30 border-2 border-gold-500 rounded-lg pointer-events-none transition-all duration-300"
        style={{
          top: position.top - 8,
          left: position.left - 8,
          width: position.width + 16,
          height: position.height + 16
        }}
      />

      {/* Tooltip */}
      <div
        className="fixed z-[92] bg-white rounded-xl shadow-2xl border-2 border-gold-400 p-6 max-w-sm"
        style={{
          top: step.position === 'bottom' ? position.top + position.height + 16 : position.top - 200,
          left: position.left + position.width / 2 - 150
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="jazz-font text-xl text-navy-900 font-bold">{step.title}</h3>
          <button
            onClick={onEnd}
            className="ml-2 p-1 hover:bg-gold-100 rounded-full transition-colors"
            aria-label="End tour"
          >
            <span className="text-navy-600">×</span>
          </button>
        </div>

        <p className="text-navy-700 mb-6 leading-relaxed">{step.content}</p>

        <div className="flex items-center justify-between">
          <div className="text-sm text-navy-500">
            {currentStep + 1} of {steps.length}
          </div>

          <div className="flex space-x-2">
            {currentStep > 0 && (
              <button
                onClick={onPrevious}
                className="vintage-button bg-gold-100 hover:bg-gold-200 text-navy-900 px-4 py-2 rounded-lg"
              >
                Previous
              </button>
            )}
            <button
              onClick={currentStep < steps.length - 1 ? onNext : onEnd}
              className="vintage-button bg-gold-600 hover:bg-gold-500 text-navy-900 px-4 py-2 rounded-lg"
            >
              {currentStep < steps.length - 1 ? 'Next' : 'Finish'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

// Hook for managing help system state
export function useHelpSystem() {
  const [helpEnabled, setHelpEnabled] = useState(false)
  const [toursCompleted, setToursCompleted] = useState<Set<string>>(new Set())

  const completeTour = useCallback((tourName: string) => {
    setToursCompleted(prev => new Set(prev).add(tourName))
  }, [])

  const hasCompletedTour = useCallback((tourName: string) => {
    return toursCompleted.has(tourName)
  }, [toursCompleted])

  const toggleHelp = useCallback(() => {
    setHelpEnabled(prev => !prev)
  }, [])

  return {
    helpEnabled,
    toursCompleted,
    completeTour,
    hasCompletedTour,
    toggleHelp
  }
}

// Component for contextual help tooltips
export function ContextualHelp({
  content,
  trigger = 'hover',
  position = 'top',
  className
}: {
  content: string
  trigger?: 'hover' | 'click'
  position?: 'top' | 'bottom' | 'left' | 'right'
  className?: string
}) {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <div className="relative inline-block">
      <button
        className={cn(
          'w-5 h-5 rounded-full bg-gold-400 text-navy-900 text-xs font-bold hover:bg-gold-500 transition-colors',
          'flex items-center justify-center',
          className
        )}
        onMouseEnter={trigger === 'hover' ? () => setIsVisible(true) : undefined}
        onMouseLeave={trigger === 'hover' ? () => setIsVisible(false) : undefined}
        onClick={trigger === 'click' ? () => setIsVisible(!isVisible) : undefined}
        aria-label="Help"
      >
        ?
      </button>

      {isVisible && (
        <div
          className={cn(
            'absolute z-50 bg-white rounded-lg shadow-lg border border-gold-300 p-3 max-w-xs text-sm',
            'animate-in fade-in-50 zoom-in-95',
            position === 'top' && 'bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2',
            position === 'bottom' && 'top-full left-1/2 transform -translate-x-1/2 translate-y-2',
            position === 'left' && 'right-full top-1/2 transform -translate-y-1/2 -translate-x-2',
            position === 'right' && 'left-full top-1/2 transform -translate-y-1/2 translate-x-2'
          )}
        >
          <p className="text-navy-700">{content}</p>
          <div
            className={cn(
              'absolute w-3 h-3 bg-white border border-gold-300 transform rotate-45',
              position === 'top' && 'bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 border-t-0 border-l-0',
              position === 'bottom' && 'top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-b-0 border-r-0',
              position === 'left' && 'right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2 border-l-0 border-t-0',
              position === 'right' && 'left-0 top-1/2 transform -translate-y-1/2 -translate-x-1/2 border-r-0 border-b-0'
            )}
          />
        </div>
      )}
    </div>
  )
}