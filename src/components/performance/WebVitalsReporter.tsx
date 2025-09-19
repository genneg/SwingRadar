'use client'

import { useEffect } from 'react'

interface PerformanceMetric {
  name: string
  value: number
  id: string
}

interface WebVitalsReporterProps {
  debug?: boolean
}

export function WebVitalsReporter({ debug = false }: WebVitalsReporterProps) {
  useEffect(() => {
    if (typeof window === 'undefined') return

    // Simple performance monitoring without external dependencies
    const reportMetric = (metric: PerformanceMetric) => {
      if (debug) {
        console.log(`[Performance] ${metric.name}: ${metric.value}ms`)
      }

      // Send to analytics if available
      if (typeof gtag !== 'undefined') {
        gtag('event', 'web_vitals', {
          event_category: 'Performance',
          event_label: metric.name,
          value: Math.round(metric.value),
          non_interaction: true,
        })
      }

      // Send to custom analytics endpoint
      if (process.env.NODE_ENV === 'production') {
        fetch('/api/analytics/performance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...metric,
            timestamp: Date.now(),
            url: window.location.pathname,
            userAgent: navigator.userAgent,
          }),
        }).catch(() => {
          // Silent fail in production
        })
      }
    }

    // Monitor Core Web Vitals using Performance Observer API
    if (typeof PerformanceObserver !== 'undefined') {
      // Largest Contentful Paint (LCP)
      try {
        const lcpObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries()
          const lastEntry = entries[entries.length - 1]
          if (lastEntry) {
            reportMetric({
              name: 'LCP',
              value: lastEntry.startTime,
              id: 'lcp-' + Date.now(),
            })
          }
        })
        lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true })
      } catch (error) {
        if (debug) console.warn('LCP observer failed:', error)
      }

      // First Input Delay (FID)
      try {
        const fidObserver = new PerformanceObserver((entryList) => {
          entryList.getEntries().forEach((entry: any) => {
            if (entry.name === 'first-input') {
              reportMetric({
                name: 'FID',
                value: entry.processingStart - entry.startTime,
                id: 'fid-' + Date.now(),
              })
            }
          })
        })
        fidObserver.observe({ type: 'first-input', buffered: true })
      } catch (error) {
        if (debug) console.warn('FID observer failed:', error)
      }

      // Cumulative Layout Shift (CLS)
      try {
        let clsValue = 0
        let clsEntries: any[] = []

        const clsObserver = new PerformanceObserver((entryList) => {
          for (const entry of entryList.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              clsValue += (entry as any).value
              clsEntries.push(entry)
            }
          }
        })
        clsObserver.observe({ type: 'layout-shift', buffered: true })

        // Report CLS after page visibility changes
        document.addEventListener('visibilitychange', () => {
          if (document.visibilityState === 'hidden' && clsValue > 0) {
            reportMetric({
              name: 'CLS',
              value: clsValue,
              id: 'cls-' + Date.now(),
            })
          }
        })
      } catch (error) {
        if (debug) console.warn('CLS observer failed:', error)
      }
    }

    // First Contentful Paint (FCP) using Navigation Timing
    if (performance && performance.getEntriesByType) {
      const paintEntries = performance.getEntriesByType('paint')
      const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint')
      if (fcpEntry) {
        reportMetric({
          name: 'FCP',
          value: fcpEntry.startTime,
          id: 'fcp-' + Date.now(),
        })
      }
    }

    // Time to First Byte (TTFB) using Navigation Timing
    if (performance && performance.timing) {
      const ttfb = performance.timing.responseStart - performance.timing.navigationStart
      if (ttfb > 0) {
        reportMetric({
          name: 'TTFB',
          value: ttfb,
          id: 'ttfb-' + Date.now(),
        })
      }
    }

    // Monitor resource loading performance
    if (performance && performance.getEntriesByType) {
      const resourceEntries = performance.getEntriesByType('resource')
      let totalResourceTime = 0
      let slowResources = 0

      resourceEntries.forEach((resource: any) => {
        const duration = resource.responseEnd - resource.startTime
        totalResourceTime += duration

        // Flag resources taking longer than 1 second
        if (duration > 1000) {
          slowResources++
          if (debug) {
            console.warn(`Slow resource detected: ${resource.name} (${duration}ms)`)
          }
        }
      })

      if (resourceEntries.length > 0) {
        reportMetric({
          name: 'Average Resource Time',
          value: totalResourceTime / resourceEntries.length,
          id: 'art-' + Date.now(),
        })

        if (slowResources > 0) {
          reportMetric({
            name: 'Slow Resources Count',
            value: slowResources,
            id: 'src-' + Date.now(),
          })
        }
      }
    }
  }, [debug])

  return null // This component doesn't render anything
}

// Performance marks for custom timing
export const performanceMarks = {
  mark: (name: string) => {
    if (typeof performance !== 'undefined' && performance.mark) {
      performance.mark(name)
    }
  },

  measure: (name: string, startMark: string) => {
    if (typeof performance !== 'undefined' && performance.measure) {
      try {
        performance.measure(name, startMark)
        const measures = performance.getEntriesByName(name, 'measure')
        return measures[measures.length - 1]?.duration || 0
      } catch (error) {
        console.warn('Performance measure failed:', error)
        return 0
      }
    }
    return 0
  },
}

declare global {
  function gtag(...args: any[]): void
}