import type { NextApiRequest, NextApiResponse } from 'next'

interface SitemapUrl {
  loc: string
  lastmod?: string
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority?: number
}

const SITE_URL = 'https://blues-festival-finder.vercel.app'

// Generate sitemap XML
function generateSitemapXML(urls: SitemapUrl[]): string {
  const urlElements = urls
    .map(
      (url) => `
  <url>
    <loc>${url.loc}</loc>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''}
    ${url.changefreq ? `<changefreq>${url.changefreq}</changefreq>` : ''}
    ${url.priority ? `<priority>${url.priority}</priority>` : ''}
  </url>`
    )
    .join('')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urlElements}
</urlset>`
}

// Get current date in ISO format
function getCurrentDate(): string {
  return new Date().toISOString().split('T')[0]
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const urls: SitemapUrl[] = []

    // Static pages with high priority
    const staticPages = [
      { path: '', priority: 1.0, changefreq: 'daily' as const },
      { path: '/about', priority: 0.8, changefreq: 'monthly' as const },
      { path: '/contact', priority: 0.7, changefreq: 'monthly' as const },
      { path: '/search', priority: 0.9, changefreq: 'daily' as const },
      { path: '/events', priority: 0.9, changefreq: 'daily' as const },
      { path: '/teachers', priority: 0.8, changefreq: 'weekly' as const },
      { path: '/musicians', priority: 0.8, changefreq: 'weekly' as const },
    ]

    staticPages.forEach((page) => {
      urls.push({
        loc: `${SITE_URL}${page.path}`,
        lastmod: getCurrentDate(),
        changefreq: page.changefreq,
        priority: page.priority,
      })
    })

    // Dynamic content from database
    try {
      // Import Prisma only when needed to avoid cold start issues
      const { PrismaClient } = require('@prisma/client')
      const prisma = new PrismaClient()

      // Get all events
      const events = await prisma.event.findMany({
        select: {
          id: true,
          updatedAt: true,
          fromDate: true,
        },
        orderBy: {
          updatedAt: 'desc',
        },
      })

      events.forEach((event) => {
        urls.push({
          loc: `${SITE_URL}/events/${event.id}`,
          lastmod: event.updatedAt.toISOString().split('T')[0],
          changefreq: 'weekly',
          priority: 0.8,
        })
      })

      // Get all teachers
      const teachers = await prisma.teacher.findMany({
        select: {
          id: true,
          updatedAt: true,
        },
        orderBy: {
          updatedAt: 'desc',
        },
      })

      teachers.forEach((teacher) => {
        urls.push({
          loc: `${SITE_URL}/teachers/${teacher.id}`,
          lastmod: teacher.updatedAt?.toISOString().split('T')[0] || getCurrentDate(),
          changefreq: 'monthly',
          priority: 0.7,
        })
      })

      // Get all musicians
      const musicians = await prisma.musician.findMany({
        select: {
          id: true,
          updatedAt: true,
        },
        orderBy: {
          updatedAt: 'desc',
        },
      })

      musicians.forEach((musician) => {
        urls.push({
          loc: `${SITE_URL}/musicians/${musician.id}`,
          lastmod: musician.updatedAt?.toISOString().split('T')[0] || getCurrentDate(),
          changefreq: 'monthly',
          priority: 0.7,
        })
      })

      await prisma.$disconnect()
    } catch (dbError) {
      console.error('[Sitemap] Database error:', dbError)
      // Continue with static pages only if database is unavailable
    }

    // Generate and return XML
    const sitemapXML = generateSitemapXML(urls)

    res.setHeader('Content-Type', 'application/xml')
    res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600') // 1 hour cache
    res.status(200).end(sitemapXML)
  } catch (error) {
    console.error('[Sitemap] Generation error:', error)
    res.status(500).json({ error: 'Failed to generate sitemap' })
  }
}

// API route configuration
export const config = {
  api: {
    responseLimit: '8mb', // Allow larger sitemaps
  },
}