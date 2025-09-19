import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Swing Dance Festivals 2025 | Blues, Swing, Balboa, Shag, Boogie Events',
  description: 'Discover the best swing dance festivals worldwide in 2025. Browse Blues, Lindy Hop, Balboa, Collegiate Shag, and Boogie Woogie events. Your radar for swing culture detection.',
  keywords: [
    'swing dance festivals 2025',
    'blues dance festivals',
    'lindy hop festivals',
    'balboa dance events',
    'collegiate shag workshops',
    'boogie woogie festivals',
    'swing radar',
    'swing dance events worldwide',
    'vintage swing culture',
    'dance festival calendar',
    'swing dance workshops',
    'blues weekends',
    'lindy hop camps',
    'balboa festivals'
  ],
  openGraph: {
    title: 'Swing Dance Festivals 2025 | Blues, Swing, Balboa, Shag, Boogie Events',
    description: 'Discover the best swing dance festivals worldwide in 2025. Browse Blues, Lindy Hop, Balboa, Collegiate Shag, and Boogie Woogie events. Your radar for swing culture detection.',
    url: 'https://www.swingradar.com/events',
    type: 'website',
    images: [{
      url: 'https://www.swingradar.com/og-events.jpg',
      width: 1200,
      height: 630,
      alt: 'SwingRadar - Swing Dance Festivals 2025'
    }]
  },
  twitter: {
    title: 'Swing Dance Festivals 2025 | Blues, Swing, Balboa, Shag, Boogie Events',
    description: 'Discover the best swing dance festivals worldwide in 2025. Browse Blues, Lindy Hop, Balboa, Collegiate Shag, and Boogie Woogie events.',
    images: ['https://www.swingradar.com/og-events.jpg']
  },
  alternates: {
    canonical: 'https://www.swingradar.com/events'
  }
}

export default function EventsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}