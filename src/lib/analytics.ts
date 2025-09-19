// Google Analytics 4 utilities for tracking events and conversions

interface GAEvent {
  action: string
  category: string
  label?: string
  value?: number
  custom_parameters?: Record<string, any>
}

interface GTMEvent {
  event: string
  event_category?: string
  event_action?: string
  event_label?: string
  value?: number
  [key: string]: any
}

// Check if Google Analytics is loaded
export const isGALoaded = (): boolean => {
  return typeof window !== 'undefined' && typeof window.gtag === 'function'
}

// Check if Google Tag Manager is loaded
export const isGTMLoaded = (): boolean => {
  return typeof window !== 'undefined' && typeof window.dataLayer !== 'undefined'
}

// Send event to Google Analytics 4
export const trackEvent = (event: GAEvent): void => {
  if (!isGALoaded()) {
    console.warn('[Analytics] Google Analytics not loaded')
    return
  }

  try {
    window.gtag('event', event.action, {
      event_category: event.category,
      event_label: event.label,
      value: event.value,
      ...event.custom_parameters,
    })

    if (process.env.NODE_ENV === 'development') {
      console.log('[GA4 Event]', event)
    }
  } catch (error) {
    console.error('[Analytics] Failed to track event:', error)
  }
}

// Send event to Google Tag Manager
export const trackGTMEvent = (event: GTMEvent): void => {
  if (!isGTMLoaded()) {
    console.warn('[Analytics] Google Tag Manager not loaded')
    return
  }

  try {
    window.dataLayer.push(event)

    if (process.env.NODE_ENV === 'development') {
      console.log('[GTM Event]', event)
    }
  } catch (error) {
    console.error('[Analytics] Failed to track GTM event:', error)
  }
}

// Track page views
export const trackPageView = (url: string, title?: string): void => {
  if (!isGALoaded()) return

  try {
    window.gtag('config', process.env.NEXT_PUBLIC_GA_ID!, {
      page_path: url,
      page_title: title || document.title,
    })

    // Also send to GTM if available
    if (isGTMLoaded()) {
      trackGTMEvent({
        event: 'page_view',
        page_path: url,
        page_title: title || document.title,
      })
    }
  } catch (error) {
    console.error('[Analytics] Failed to track page view:', error)
  }
}

// Specific event tracking functions for the app
export const analytics = {
  // Event discovery tracking
  searchEvents: (query: string, filters?: any) => {
    trackEvent({
      action: 'search',
      category: 'Events',
      label: query,
      custom_parameters: {
        search_term: query,
        filters_applied: filters ? Object.keys(filters).length : 0,
        ...filters,
      },
    })
  },

  viewEvent: (eventId: string, eventName: string) => {
    trackEvent({
      action: 'view_item',
      category: 'Events',
      label: eventName,
      custom_parameters: {
        event_id: eventId,
        event_name: eventName,
        content_type: 'event',
      },
    })
  },

  // Teacher/Musician tracking
  followTeacher: (teacherId: string, teacherName: string) => {
    trackEvent({
      action: 'follow',
      category: 'Teachers',
      label: teacherName,
      value: 1,
      custom_parameters: {
        teacher_id: teacherId,
        teacher_name: teacherName,
        content_type: 'teacher',
      },
    })
  },

  unfollowTeacher: (teacherId: string, teacherName: string) => {
    trackEvent({
      action: 'unfollow',
      category: 'Teachers',
      label: teacherName,
      value: -1,
      custom_parameters: {
        teacher_id: teacherId,
        teacher_name: teacherName,
        content_type: 'teacher',
      },
    })
  },

  followMusician: (musicianId: string, musicianName: string) => {
    trackEvent({
      action: 'follow',
      category: 'Musicians',
      label: musicianName,
      value: 1,
      custom_parameters: {
        musician_id: musicianId,
        musician_name: musicianName,
        content_type: 'musician',
      },
    })
  },

  // User engagement
  signUp: (method?: string) => {
    trackEvent({
      action: 'sign_up',
      category: 'User',
      label: method || 'email',
      value: 1,
      custom_parameters: {
        method: method || 'email',
      },
    })
  },

  login: (method?: string) => {
    trackEvent({
      action: 'login',
      category: 'User',
      label: method || 'email',
      custom_parameters: {
        method: method || 'email',
      },
    })
  },

  // Content engagement
  shareEvent: (eventId: string, platform: string) => {
    trackEvent({
      action: 'share',
      category: 'Events',
      label: platform,
      custom_parameters: {
        event_id: eventId,
        method: platform,
        content_type: 'event',
      },
    })
  },

  clickExternalLink: (url: string, linkText?: string) => {
    trackEvent({
      action: 'click',
      category: 'External Links',
      label: linkText || url,
      custom_parameters: {
        link_url: url,
        link_text: linkText,
        outbound: true,
      },
    })
  },

  // Error tracking
  trackError: (error: string, page: string, action?: string) => {
    trackEvent({
      action: 'exception',
      category: 'Errors',
      label: error,
      custom_parameters: {
        description: error,
        page: page,
        action: action,
        fatal: false,
      },
    })
  },

  // Performance tracking
  trackTiming: (category: string, variable: string, value: number, label?: string) => {
    trackEvent({
      action: 'timing_complete',
      category: 'Performance',
      label: label || variable,
      value: Math.round(value),
      custom_parameters: {
        timing_category: category,
        timing_var: variable,
        timing_value: Math.round(value),
      },
    })
  },

  // Custom events for blues dance app
  addToCalendar: (eventId: string, platform: string) => {
    trackEvent({
      action: 'add_to_calendar',
      category: 'Events',
      label: platform,
      value: 1,
      custom_parameters: {
        event_id: eventId,
        calendar_platform: platform,
      },
    })
  },

  filterEvents: (filterType: string, filterValue: string) => {
    trackEvent({
      action: 'filter',
      category: 'Events',
      label: `${filterType}:${filterValue}`,
      custom_parameters: {
        filter_type: filterType,
        filter_value: filterValue,
      },
    })
  },

  bookmarkEvent: (eventId: string, action: 'add' | 'remove') => {
    trackEvent({
      action: action === 'add' ? 'add_to_wishlist' : 'remove_from_wishlist',
      category: 'Events',
      label: eventId,
      value: action === 'add' ? 1 : -1,
      custom_parameters: {
        event_id: eventId,
        action: action,
      },
    })
  },
}

// Enhanced ecommerce tracking (for future features)
export const ecommerce = {
  viewItem: (item: any) => {
    if (!isGALoaded()) return

    window.gtag('event', 'view_item', {
      currency: 'EUR',
      value: item.price || 0,
      items: [item],
    })
  },

  purchase: (transactionId: string, items: any[], value: number) => {
    if (!isGALoaded()) return

    window.gtag('event', 'purchase', {
      transaction_id: transactionId,
      value: value,
      currency: 'EUR',
      items: items,
    })
  },
}

// Declare global gtag function
declare global {
  interface Window {
    gtag: (...args: any[]) => void
    dataLayer: any[]
  }
}