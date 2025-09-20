'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactNode, useState, lazy, Suspense } from 'react'

// Dynamically import ReactQueryDevtools to avoid including it in production bundle
const ReactQueryDevtools = lazy(() => import('@tanstack/react-query-devtools').then(mod => ({ default: mod.ReactQueryDevtools })))

interface QueryProviderProps {
  children: ReactNode
}

/**
 * React Query Provider component with optimized configuration
 */
export function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        // Stale time: how long before data is considered stale
        staleTime: 5 * 60 * 1000, // 5 minutes

        // Garbage collection time: how long inactive data stays in cache
        gcTime: 10 * 60 * 1000, // 10 minutes

        // Retry configuration
        retry: (failureCount, error: any) => {
          // Don't retry on 4xx errors (except 408, 429)
          if (error?.status >= 400 && error?.status < 500) {
            if (error.status === 408 || error.status === 429) {
              return failureCount < 3
            }
            return false
          }

          // Retry on network errors and 5xx errors
          return failureCount < 3
        },

        // Retry delay with exponential backoff
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

        // Refetch configuration
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        refetchOnMount: true,

        // Network mode
        networkMode: 'online',
      },
      mutations: {
        // Retry configuration for mutations
        retry: (failureCount, error: any) => {
          // Don't retry on 4xx errors (except 408, 429)
          if (error?.status >= 400 && error?.status < 500) {
            if (error.status === 408 || error.status === 429) {
              return failureCount < 2
            }
            return false
          }

          // Retry on network errors and 5xx errors
          return failureCount < 2
        },

        // Mutation retry delay
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),

        // Network mode
        networkMode: 'online',
      },
    },
  }))

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && (
        <Suspense fallback={null}>
          <ReactQueryDevtools
            initialIsOpen={false}
            buttonPosition="bottom-right"
          />
        </Suspense>
      )}
    </QueryClientProvider>
  )
}

/**
 * Hook to get the query client instance
 */
export { useQueryClient } from '@tanstack/react-query'