'use client'

import { useEffect } from 'react'

interface WebVitalsMetric {
  id: string
  name: string
  value: number
  delta: number
  entries: any[]
}

interface WebVitalsHookOptions {
  debug?: boolean
  reportToAnalytics?: boolean
}

export function useWebVitals({ debug = false, reportToAnalytics = true }: WebVitalsHookOptions = {}) {
  useEffect(() => {
    if (typeof window === 'undefined') return

    // Function to send metrics to analytics
    const sendToAnalytics = (metric: WebVitalsMetric) => {
      if (!reportToAnalytics) return

      // Send to Google Analytics 4 if available
      if (typeof gtag !== 'undefined') {
        gtag('event', metric.name, {
          event_category: 'Web Vitals',
          event_label: metric.id,
          value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
          non_interaction: true,
        })
      }

      // Log to console in debug mode
      if (debug) {
        console.log(`[Web Vitals] ${metric.name}:`, {
          value: metric.value,
          delta: metric.delta,
          id: metric.id,
          entries: metric.entries,
        })
      }

      // Send to custom analytics endpoint if needed
      if (process.env.NODE_ENV === 'production') {
        fetch('/api/analytics/web-vitals', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            metric: metric.name,
            value: metric.value,
            id: metric.id,
            timestamp: Date.now(),
            url: window.location.href,
            userAgent: navigator.userAgent,
          }),
        }).catch((error) => {
          if (debug) {
            console.error('Failed to send Web Vitals to analytics:', error)
          }
        })
      }
    }

    // Function to handle metric reports
    const onPerfEntry = (metric: WebVitalsMetric) => {
      sendToAnalytics(metric)
    }

    // Import and measure Web Vitals
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry)
      getFID(onPerfEntry)
      getFCP(onPerfEntry)
      getLCP(onPerfEntry)
      getTTFB(onPerfEntry)
    }).catch((error) => {
      if (debug) {
        console.error('Failed to load web-vitals library:', error)
      }
    })
  }, [debug, reportToAnalytics])
}

// Helper function to get Web Vitals thresholds
export const getWebVitalsThresholds = () => ({
  LCP: { good: 2500, needsImprovement: 4000 }, // Largest Contentful Paint
  FID: { good: 100, needsImprovement: 300 },   // First Input Delay
  CLS: { good: 0.1, needsImprovement: 0.25 },  // Cumulative Layout Shift
  FCP: { good: 1800, needsImprovement: 3000 }, // First Contentful Paint
  TTFB: { good: 800, needsImprovement: 1800 }, // Time to First Byte
})

// Helper function to categorize metric performance
export const categorizeMetric = (name: string, value: number): 'good' | 'needs-improvement' | 'poor' => {
  const thresholds = getWebVitalsThresholds()
  const threshold = thresholds[name as keyof typeof thresholds]

  if (!threshold) return 'good'

  if (value <= threshold.good) return 'good'
  if (value <= threshold.needsImprovement) return 'needs-improvement'
  return 'poor'
}

// Performance monitoring utilities
export const performanceUtils = {
  // Mark performance events
  mark: (name: string) => {
    if (typeof performance !== 'undefined' && performance.mark) {
      performance.mark(name)
    }
  },

  // Measure performance between marks
  measure: (name: string, startMark?: string, endMark?: string) => {
    if (typeof performance !== 'undefined' && performance.measure) {
      try {
        performance.measure(name, startMark, endMark)
        const measure = performance.getEntriesByName(name, 'measure')[0]
        return measure?.duration || 0
      } catch (error) {
        console.warn('Performance measure failed:', error)
        return 0
      }
    }
    return 0
  },

  // Get resource timing
  getResourceTiming: (name: string) => {
    if (typeof performance !== 'undefined' && performance.getEntriesByName) {
      return performance.getEntriesByName(name, 'resource')[0]
    }
    return null
  },

  // Monitor long tasks
  observeLongTasks: (callback: (entries: any[]) => void) => {
    if (typeof PerformanceObserver !== 'undefined') {
      try {
        const observer = new PerformanceObserver((list) => {
          callback(list.getEntries())
        })
        observer.observe({ entryTypes: ['longtask'] })
        return observer
      } catch (error) {
        console.warn('Long task observer not supported:', error)
        return null
      }
    }
    return null
  },
}

declare global {
  function gtag(...args: any[]): void
}