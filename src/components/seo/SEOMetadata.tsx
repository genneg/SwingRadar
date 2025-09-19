import type { Metadata } from 'next'

interface SEOProps {
  title?: string
  description?: string
  keywords?: string[]
  ogImage?: string
  ogUrl?: string
  canonicalUrl?: string
  noIndex?: boolean
  type?: 'website' | 'article'
  publishedTime?: string
  modifiedTime?: string
  authors?: string[]
  section?: string
  tags?: string[]
}

export function generateMetadata(props: SEOProps): Metadata {
  const {
    title = 'SwingRadar',
    description = 'Detect swing culture worldwide with precision radar. Discover swing dance festivals across Blues, Swing, Balboa, Shag, and Boogie Woogie. Track your favorite instructors and musicians.',
    keywords = ['swing radar', 'swing dance detection', 'blues dance', 'lindy hop', 'balboa', 'shag', 'boogie woogie', 'festivals radar', 'dance event tracking', 'vintage swing culture radar'],
    ogImage = 'https://www.swingradar.com/og-default.jpg',
    ogUrl,
    canonicalUrl,
    noIndex = false,
    type = 'website',
    publishedTime,
    modifiedTime,
    authors,
    section,
    tags
  } = props

  const siteUrl = 'https://www.swingradar.com'
  const fullUrl = canonicalUrl || ogUrl || siteUrl
  const fullOgUrl = ogUrl ? `${siteUrl}${ogUrl}` : siteUrl

  const metadata: Metadata = {
    title: {
      default: title,
      template: '%s | SwingRadar'
    },
    description,
    keywords: keywords.join(', '),
    authors: authors ? [{ name: authors[0] }] : undefined,
    creator: 'SwingRadar',
    publisher: 'SwingRadar',
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      type,
      title,
      description,
      url: fullOgUrl,
      siteName: 'SwingRadar',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
      creator: '@SwingRadar',
      site: '@SwingRadar',
    },
    alternates: {
      canonical: fullUrl,
    },
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
      yandex: process.env.YANDEX_SITE_VERIFICATION,
      yahoo: process.env.YAHOO_SITE_VERIFICATION,
    },
  }

  // Article specific metadata
  if (type === 'article' && publishedTime) {
    metadata.openGraph = {
      ...metadata.openGraph,
      publishedTime,
      modifiedTime: modifiedTime || publishedTime,
      authors: authors?.map(author => ({ name: author })),
      section,
      tags,
    }
  }

  return metadata
}

// Default metadata exports for common page types
export const defaultMetadata = generateMetadata({})

export function generateEventMetadata(event: {
  name: string
  description?: string
  city: string
  country: string
  startDate: string
  imageUrl?: string
  danceStyles?: string[]
}): Metadata {
  const styles = event.danceStyles || ['blues', 'swing']
  const styleText = styles.length > 1 ? styles.slice(0, -1).join(', ') + ' and ' + styles.slice(-1) : styles[0]

  const title = `${event.name} - ${styleText.charAt(0).toUpperCase() + styleText.slice(1)} Dance Festival`
  const description = event.description ||
    `Join ${event.name} in ${event.city}, ${event.country}. Experience the best ${styleText} dance festival with workshops, social dancing, and live music. Detect swing culture with SwingRadar precision.`

  return generateMetadata({
    title,
    description,
    keywords: [
      event.name,
      ...styles.map(style => `${style} festival`),
      ...styles.map(style => `${style} dance`),
      'swing dance festival',
      'swing radar',
      'festival detection',
      event.city,
      event.country,
      'dance workshop',
      'social dancing',
      'live music',
      'vintage swing culture'
    ],
    ogImage: event.imageUrl || 'https://www.swingradar.com/og-event.jpg',
    type: 'article',
    publishedTime: event.startDate,
    tags: [...styles.map(style => `${style} festival`), 'dance event', 'workshop', 'swing culture']
  })
}

export function generateTeacherMetadata(teacher: {
  name: string
  bio?: string
  specialties?: string[]
  imageUrl?: string
}): Metadata {
  const specialties = teacher.specialties || ['swing dance']
  const primaryStyle = specialties[0] || 'swing dance'

  const title = `${teacher.name} - ${primaryStyle.charAt(0).toUpperCase() + primaryStyle.slice(1)} Instructor`
  const description = teacher.bio ||
    `Track ${teacher.name} on SwingRadar.${specialties ? ` Specializing in ${specialties.join(', ')}.` : ''} Follow your favorite swing dance instructor with precision radar alerts and never miss their festival appearances.`

  return generateMetadata({
    title,
    description,
    keywords: [
      teacher.name,
      'swing dance instructor',
      'dance teacher',
      'swing radar',
      'track swing teachers',
      'radar swing instructors',
      ...(specialties || []),
      'blues dance',
      'lindy hop',
      'balboa',
      'vintage swing culture'
    ],
    ogImage: teacher.imageUrl || 'https://www.swingradar.com/og-teacher.jpg',
    type: 'profile',
    authors: [teacher.name]
  })
}