import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blues Dance FAQ - Everything You Need to Know',
  description: 'Comprehensive FAQ about blues dance festivals, getting started, finding events, and using Blues Festival Finder. Your complete guide to the blues dance community.',
  keywords: [
    'blues dance FAQ',
    'blues dance festivals guide',
    'how to start blues dancing',
    'blues dance for beginners',
    'blues festival guide',
    'blues dance community',
    'blues dance workshops',
    'blues dance events',
    'social dancing tips'
  ],
  openGraph: {
    title: 'Blues Dance FAQ - Everything You Need to Know',
    description: 'Comprehensive FAQ about blues dance festivals, getting started, finding events, and using Blues Festival Finder.',
    type: 'article',
  },
  twitter: {
    title: 'Blues Dance FAQ - Everything You Need to Know',
    description: 'Comprehensive FAQ about blues dance festivals, getting started, finding events, and using Blues Festival Finder.',
  },
}

export default function FAQLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}