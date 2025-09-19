import type { NextApiRequest, NextApiResponse } from 'next'

const SITE_URL = 'https://blues-festival-finder.vercel.app'

function generateRobotsTxt(): string {
  return `# Blues Festival Finder - robots.txt
# Website: ${SITE_URL}

User-agent: *
Allow: /

# Sitemap locations
Sitemap: ${SITE_URL}/api/sitemap.xml
Sitemap: ${SITE_URL}/api/sitemap-index.xml

# Crawl delay to avoid server overload
Crawl-delay: 1

# Block API routes and private paths
Disallow: /api/
Disallow: /_next/
Disallow: /auth/
Disallow: /dashboard/
Disallow: /profile/
Disallow: /admin/
Disallow: /demo-*
Disallow: /test-*
Disallow: /*.json$
Disallow: /*.js$
Disallow: /*.css$

# Allow specific API endpoints for search engines
User-agent: Googlebot
Allow: /api/events/
Allow: /api/teachers/
Allow: /api/musicians/
Allow: /api/sitemap.xml
Allow: /api/sitemap-index.xml
Allow: /api/rss.xml

User-agent: Bingbot
Allow: /api/events/
Allow: /api/teachers/
Allow: /api/musicians/
Allow: /api/sitemap.xml
Allow: /api/sitemap-index.xml

# Block bad bots and crawlers
User-agent: SemrushBot
Disallow: /

User-agent: AhrefsBot
Disallow: /

User-agent: MJ12bot
Disallow: /

User-agent: DotBot
Disallow: /

User-agent: BLEXBot
Disallow: /

User-agent: YandexBot
Crawl-delay: 2

# Allow social media crawlers for better sharing
User-agent: facebookexternalhit
Allow: /

User-agent: Twitterbot
Allow: /

User-agent: LinkedInBot
Allow: /

User-agent: WhatsApp
Allow: /

User-agent: TelegramBot
Allow: /

# Block file types that shouldn't be crawled
User-agent: *
Disallow: /*.pdf$
Disallow: /*.doc$
Disallow: /*.docx$
Disallow: /*.xls$
Disallow: /*.xlsx$
Disallow: /*.zip$
Disallow: /*.rar$

# Allow important file types
Allow: /sitemap.xml
Allow: /robots.txt
Allow: /favicon.ico
Allow: /manifest.json
Allow: /llms.txt

# LLM optimization file for AI search engines
User-agent: *
Allow: /llms.txt

# Claude and other AI assistants
User-agent: Claude-Web
Allow: /
Crawl-delay: 1

User-agent: GPTBot
Allow: /
Crawl-delay: 1

User-agent: ChatGPT-User
Allow: /

User-agent: CCBot
Allow: /
Crawl-delay: 2

# Search engine specific rules
User-agent: DuckDuckBot
Allow: /
Crawl-delay: 1

User-agent: Slurp
Allow: /
Crawl-delay: 2

# Mobile crawlers
User-agent: Googlebot-Mobile
Allow: /

User-agent: Bingbot-Mobile
Allow: /

# Image and video crawlers
User-agent: Googlebot-Image
Allow: /images/
Allow: /*.jpg
Allow: /*.jpeg
Allow: /*.png
Allow: /*.gif
Allow: /*.webp
Allow: /*.svg

User-agent: Googlebot-Video
Allow: /videos/
Allow: /*.mp4
Allow: /*.webm

# Additional directives
# Host: ${SITE_URL}
`
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const robotsTxt = generateRobotsTxt()

    res.setHeader('Content-Type', 'text/plain; charset=utf-8')
    res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400') // 24 hours cache
    res.status(200).end(robotsTxt)
  } catch (error) {
    console.error('[Robots.txt] Generation error:', error)
    res.status(500).end('Error generating robots.txt')
  }
}

export const config = {
  api: {
    responseLimit: '1mb',
  },
}