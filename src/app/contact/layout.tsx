import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact SwingRadar | Add Your Festival or Report Issues',
  description: 'Get in touch with SwingRadar team. Add your swing dance festival, report issues, or ask questions about Blues, Swing, Balboa, Shag, and Boogie Woogie events. Email: hello@swingradar.com',
  keywords: [
    'contact swingradar',
    'add swing dance festival',
    'report festival',
    'swingradar support',
    'hello@swingradar.com',
    'submit dance event',
    'swing dance contact',
    'festival submission',
    'dance event help',
    'swingradar feedback',
    'swing radar support'
  ],
  openGraph: {
    title: 'Contact SwingRadar | Add Your Festival or Report Issues',
    description: 'Get in touch with SwingRadar team. Add your swing dance festival, report issues, or ask questions about Blues, Swing, Balboa, Shag, and Boogie Woogie events.',
    url: 'https://www.swingradar.com/contact',
    type: 'website',
    images: [{
      url: 'https://www.swingradar.com/og-contact.jpg',
      width: 1200,
      height: 630,
      alt: 'Contact SwingRadar - Add Your Festival'
    }]
  },
  twitter: {
    title: 'Contact SwingRadar | Add Your Festival or Report Issues',
    description: 'Get in touch with SwingRadar team. Add your swing dance festival, report issues, or ask questions.',
    images: ['https://www.swingradar.com/og-contact.jpg']
  },
  alternates: {
    canonical: 'https://www.swingradar.com/contact'
  }
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}