import type { NextApiRequest, NextApiResponse } from 'next'

interface PerformanceData {
  name: string
  value: number
  id: string
  timestamp: number
  url: string
  userAgent: string
}

interface ResponseData {
  success: boolean
  message?: string
  error?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    })
  }

  try {
    const performanceData: PerformanceData = req.body

    // Validate required fields
    if (!performanceData.name || typeof performanceData.value !== 'number') {
      return res.status(400).json({
        success: false,
        error: 'Invalid performance data'
      })
    }

    // In a real application, you would:
    // 1. Store this data in a database (e.g., PostgreSQL, MongoDB)
    // 2. Send to analytics services (e.g., Google Analytics, Mixpanel)
    // 3. Use for performance monitoring dashboards

    // For now, we'll log the data (in production, remove console.log)
    if (process.env.NODE_ENV === 'development') {
      console.log('[Performance Analytics]', {
        metric: performanceData.name,
        value: performanceData.value,
        url: performanceData.url,
        timestamp: new Date(performanceData.timestamp).toISOString()
      })
    }

    // Example: Store in database (uncomment when database is ready)
    /*
    const { PrismaClient } = require('@prisma/client')
    const prisma = new PrismaClient()

    await prisma.performanceMetric.create({
      data: {
        name: performanceData.name,
        value: performanceData.value,
        url: performanceData.url,
        userAgent: performanceData.userAgent,
        timestamp: new Date(performanceData.timestamp),
      }
    })

    await prisma.$disconnect()
    */

    // Example: Send to external analytics service
    if (process.env.ANALYTICS_WEBHOOK_URL) {
      await fetch(process.env.ANALYTICS_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          source: 'blues-festival-finder',
          type: 'performance',
          data: performanceData,
        }),
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Performance data recorded'
    })

  } catch (error) {
    console.error('[Performance Analytics Error]:', error)

    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
}

// Configure API route
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
}