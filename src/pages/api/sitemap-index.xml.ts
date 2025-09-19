import type { NextApiRequest, NextApiResponse } from 'next'

const SITE_URL = 'https://blues-festival-finder.vercel.app'

interface SitemapIndex {
  loc: string
  lastmod?: string
}

function generateSitemapIndexXML(sitemaps: SitemapIndex[]): string {
  const sitemapElements = sitemaps
    .map(
      (sitemap) => `
  <sitemap>
    <loc>${sitemap.loc}</loc>
    ${sitemap.lastmod ? `<lastmod>${sitemap.lastmod}</lastmod>` : ''}
  </sitemap>`
    )
    .join('')

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${sitemapElements}
</sitemapindex>`
}

function getCurrentDate(): string {
  return new Date().toISOString().split('T')[0]
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const sitemaps: SitemapIndex[] = []
    const currentDate = getCurrentDate()

    // Main sitemap with all content
    sitemaps.push({
      loc: `${SITE_URL}/api/sitemap.xml`,
      lastmod: currentDate,
    })

    // Future: Add specialized sitemaps for large content sets
    // sitemaps.push({
    //   loc: `${SITE_URL}/api/sitemap-events.xml`,
    //   lastmod: currentDate,
    // })

    // sitemaps.push({
    //   loc: `${SITE_URL}/api/sitemap-teachers.xml`,
    //   lastmod: currentDate,
    // })

    // sitemaps.push({
    //   loc: `${SITE_URL}/api/sitemap-musicians.xml`,
    //   lastmod: currentDate,
    // })

    // Generate RSS feeds (future SEO enhancement)
    // sitemaps.push({
    //   loc: `${SITE_URL}/api/rss.xml`,
    //   lastmod: currentDate,
    // })

    const sitemapIndexXML = generateSitemapIndexXML(sitemaps)

    res.setHeader('Content-Type', 'application/xml')
    res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600')
    res.status(200).end(sitemapIndexXML)
  } catch (error) {
    console.error('[Sitemap Index] Generation error:', error)
    res.status(500).json({ error: 'Failed to generate sitemap index' })
  }
}

export const config = {
  api: {
    responseLimit: '1mb',
  },
}