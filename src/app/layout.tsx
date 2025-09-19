import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import { AuthProvider } from '@/components/providers/AuthProvider'
import { QueryProvider } from '@/components/providers/QueryProvider'
import { Header, Footer } from '@/components/layout'
import BreadcrumbNavigation from '@/components/ui/BreadcrumbNavigation'
import { OfflineBanner } from '@/components/ui/NetworkStatus'
import { Phase4Integration } from '@/components/features/Phase4Integration'
import { OrganizationSchema, WebsiteSchema, SwingRadarOrganizationSchema } from '@/components/seo/SchemaMarkup'
import { WebVitalsReporter } from '@/components/performance/WebVitalsReporter'
import '@/styles/globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'SwingRadar - Detect Swing Culture Worldwide',
  description: 'Detect swing culture with precision worldwide. Discover Blues, Swing, Balboa, Shag, and Boogie Woogie festivals on your radar. Track your favorite instructors and musicians.',
  keywords: [
    'swing radar',
    'swing dance detection',
    'swing dance festivals',
    'blues dance festivals radar',
    'lindy hop festival tracking',
    'balboa dance event detection',
    'collegiate shag radar',
    'boogie woogie detection',
    'vintage swing culture radar',
    'swing dance instructor tracking',
    'radar swing teachers',
    'dance festivals radar 2025',
    'Art Deco radar platform'
  ],
  authors: [{ name: 'SwingRadar Team' }],
  creator: 'SwingRadar',
  publisher: 'SwingRadar',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.swingradar.com',
    siteName: 'SwingRadar',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@SwingRadar',
    creator: '@SwingRadar',
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    yandex: process.env.YANDEX_SITE_VERIFICATION,
  },
  alternates: {
    canonical: 'https://www.swingradar.com',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        {/* Enhanced SwingRadar Organization Schema */}
        <SwingRadarOrganizationSchema />

        {/* Website Schema */}
        <WebsiteSchema
          site={{
            name: 'SwingRadar',
            description: 'Detect swing culture worldwide - discover swing dance festivals with precision radar across Blues, Swing, Balboa, Shag, and Boogie Woogie',
            url: 'https://blues-festival-finder.vercel.app'
          }}
        />
      </head>
      <body className={`${inter.className} bg-gradient-to-br from-navy-900 via-primary-900 to-primary-950 text-gray-100`}>
        <QueryProvider>
          <AuthProvider>
            <Phase4Integration>
              <WebVitalsReporter debug={process.env.NODE_ENV === 'development'} />
              <div className="min-h-screen flex flex-col">
                <OfflineBanner />
                <Header />
                <div className="bg-navy-800/30 border-b border-gold-600/20">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <BreadcrumbNavigation className="text-sm" />
                  </div>
                </div>
                <main className="flex-1">
                  {children}
                </main>
                <Footer />
              </div>
            </Phase4Integration>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  )
}