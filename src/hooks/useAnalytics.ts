'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { trackPageView, analytics } from '@/lib/analytics'

// Hook for automatic page tracking
export function usePageTracking() {
  const router = useRouter()

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      trackPageView(url)
    }

    // Track initial page load
    trackPageView(router.asPath)

    // Listen for route changes
    router.events.on('routeChangeComplete', handleRouteChange)

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router])
}

// Hook for event tracking with common patterns
export function useEventTracking() {
  // Search tracking with debounce
  const trackSearch = (query: string, filters?: any, delay = 500) => {
    const timeoutId = setTimeout(() => {
      analytics.searchEvents(query, filters)
    }, delay)

    return () => clearTimeout(timeoutId)
  }

  // View tracking for events
  const trackView = (type: 'event' | 'teacher' | 'musician', id: string, name: string) => {
    switch (type) {
      case 'event':
        analytics.viewEvent(id, name)
        break
      case 'teacher':
        // Track teacher profile view
        analytics.trackEvent({
          action: 'view_profile',
          category: 'Teachers',
          label: name,
          custom_parameters: {
            teacher_id: id,
            teacher_name: name,
          },
        })
        break
      case 'musician':
        // Track musician profile view
        analytics.trackEvent({
          action: 'view_profile',
          category: 'Musicians',
          label: name,
          custom_parameters: {
            musician_id: id,
            musician_name: name,
          },
        })
        break
    }
  }

  // Follow/Unfollow tracking
  const trackFollow = (
    type: 'teacher' | 'musician',
    id: string,
    name: string,
    action: 'follow' | 'unfollow'
  ) => {
    if (type === 'teacher') {
      if (action === 'follow') {
        analytics.followTeacher(id, name)
      } else {
        analytics.unfollowTeacher(id, name)
      }
    } else {
      if (action === 'follow') {
        analytics.followMusician(id, name)
      } else {
        // Add unfollow musician method to analytics
        analytics.trackEvent({
          action: 'unfollow',
          category: 'Musicians',
          label: name,
          value: -1,
          custom_parameters: {
            musician_id: id,
            musician_name: name,
            content_type: 'musician',
          },
        })
      }
    }
  }

  // Engagement tracking
  const trackEngagement = (action: string, details?: any) => {
    const engagementActions = {
      share: (eventId: string, platform: string) =>
        analytics.shareEvent(eventId, platform),

      bookmark: (eventId: string, action: 'add' | 'remove') =>
        analytics.bookmarkEvent(eventId, action),

      calendar: (eventId: string, platform: string) =>
        analytics.addToCalendar(eventId, platform),

      external_link: (url: string, text?: string) =>
        analytics.clickExternalLink(url, text),

      filter: (type: string, value: string) =>
        analytics.filterEvents(type, value),
    }

    const trackingFunction = engagementActions[action as keyof typeof engagementActions]
    if (trackingFunction) {
      trackingFunction(...(details || []))
    } else {
      console.warn(`[Analytics] Unknown engagement action: ${action}`)
    }
  }

  // Error tracking
  const trackError = (error: Error | string, context?: string) => {
    const errorMessage = error instanceof Error ? error.message : error
    const currentPage = typeof window !== 'undefined' ? window.location.pathname : 'unknown'

    analytics.trackError(errorMessage, currentPage, context)
  }

  // Performance tracking
  const trackPerformance = (metric: string, value: number, category = 'Page Load') => {
    analytics.trackTiming(category, metric, value)
  }

  // User action tracking
  const trackUserAction = (action: 'signup' | 'login' | 'logout', method?: string) => {
    switch (action) {
      case 'signup':
        analytics.signUp(method)
        break
      case 'login':
        analytics.login(method)
        break
      case 'logout':
        analytics.trackEvent({
          action: 'logout',
          category: 'User',
          label: method || 'web',
          custom_parameters: { method: method || 'web' },
        })
        break
    }
  }

  return {
    trackSearch,
    trackView,
    trackFollow,
    trackEngagement,
    trackError,
    trackPerformance,
    trackUserAction,
  }
}

// Hook for conversion tracking
export function useConversionTracking() {
  const trackConversion = (type: string, value?: number, details?: any) => {
    analytics.trackEvent({
      action: 'conversion',
      category: 'Conversions',
      label: type,
      value: value || 1,
      custom_parameters: {
        conversion_type: type,
        ...details,
      },
    })
  }

  const trackGoal = (goalName: string, value?: number) => {
    analytics.trackEvent({
      action: 'goal_completion',
      category: 'Goals',
      label: goalName,
      value: value || 1,
      custom_parameters: {
        goal_name: goalName,
      },
    })
  }

  // Blues dance specific conversions
  const trackBluesConversion = {
    eventRegistration: (eventId: string, eventName: string, price?: number) => {
      trackConversion('event_registration', price, {
        event_id: eventId,
        event_name: eventName,
      })
    },

    teacherConnect: (teacherId: string, teacherName: string) => {
      trackConversion('teacher_connect', 1, {
        teacher_id: teacherId,
        teacher_name: teacherName,
      })
    },

    newsletterSignup: (source: string) => {
      trackConversion('newsletter_signup', 1, {
        source: source,
      })
    },

    communityJoin: (platform: string) => {
      trackConversion('community_join', 1, {
        platform: platform,
      })
    },
  }

  return {
    trackConversion,
    trackGoal,
    trackBluesConversion,
  }
}

// Utility hook for GDPR/privacy compliance
export function useAnalyticsConsent() {
  useEffect(() => {
    // Check for saved consent preference
    const consent = localStorage.getItem('analytics-consent')

    if (consent === 'granted') {
      // Enable analytics
      if (typeof window.gtag === 'function') {
        window.gtag('consent', 'update', {
          analytics_storage: 'granted',
          ad_storage: 'denied', // Keep ads denied for privacy
        })
      }
    } else if (consent === 'denied') {
      // Disable analytics
      if (typeof window.gtag === 'function') {
        window.gtag('consent', 'update', {
          analytics_storage: 'denied',
          ad_storage: 'denied',
        })
      }
    }
  }, [])

  const grantConsent = () => {
    localStorage.setItem('analytics-consent', 'granted')
    if (typeof window.gtag === 'function') {
      window.gtag('consent', 'update', {
        analytics_storage: 'granted',
        ad_storage: 'denied',
      })
    }
  }

  const denyConsent = () => {
    localStorage.setItem('analytics-consent', 'denied')
    if (typeof window.gtag === 'function') {
      window.gtag('consent', 'update', {
        analytics_storage: 'denied',
        ad_storage: 'denied',
      })
    }
  }

  const getConsentStatus = () => {
    return localStorage.getItem('analytics-consent')
  }

  return {
    grantConsent,
    denyConsent,
    getConsentStatus,
  }
}