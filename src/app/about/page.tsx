import type { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { generateMetadata } from '@/components/seo/SEOMetadata'

export const metadata: Metadata = generateMetadata({
  title: 'About SwingRadar | Precision Radar for Global Swing Dance Culture',
  description: 'Discover SwingRadar, your precision radar for swing dance culture worldwide. Detect festivals, instructors, and musicians across Blues, Swing, Balboa, Shag, and Boogie Woogie.',
  keywords: [
    'about swingradar',
    'swing dance community',
    'blues swing balboa shag boogie festivals',
    'dance festival discovery',
    'swing dance platform',
    'vintage dance community',
    'multi-style dance events'
  ],
  ogUrl: '/about'
})

export default function AboutPage() {
  return (
    <div className="app-container">
      <div className="max-w-md mx-auto bg-background min-h-screen relative">
        <div className="content-wrapper">
          {/* Hero Section */}
          <div className="hero-multi-style rounded-2xl p-8 mb-6">
            <div className="hero-overlay vintage-pattern"></div>
            <div className="relative z-10 text-center">
              <div className="radar-screen w-16 h-16 mx-auto mb-4 animate-radar-sweep">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-green-600 to-green-700 border-2 border-green-500"></div>
                <div className="absolute inset-2 rounded-full bg-gradient-to-br from-green-400 to-green-500 opacity-30"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-8 bg-green-300 rounded-full animate-radar-sweep"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-45 w-1 h-6 bg-green-300 rounded-full opacity-60"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-90 w-1 h-6 bg-green-300 rounded-full opacity-40"></div>
                <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-xs text-green-300 font-bold">📡</div>
              </div>

              <h1 className="font-jazz text-4xl mb-3 text-gradient-gold leading-tight font-bold">
                About SwingRadar
              </h1>
              <p className="text-white/90 mb-4 leading-relaxed max-w-sm mx-auto font-medium">
                Detect swing culture worldwide. Your precision radar for swing dance across the globe.
              </p>

              {/* Dance Styles Showcase */}
              <div className="flex flex-wrap justify-center gap-2 mb-4">
                <div className="px-3 py-1 rounded-full bg-navy-800/30 text-amber-400 text-xs border border-amber-400/20">🎺 Blues</div>
                <div className="px-3 py-1 rounded-full bg-emerald-800/30 text-emerald-400 text-xs border border-emerald-400/20">🎷 Swing</div>
                <div className="px-3 py-1 rounded-full bg-orange-800/30 text-amber-400 text-xs border border-amber-400/20">💃 Balboa</div>
                <div className="px-3 py-1 rounded-full bg-teal-800/30 text-teal-400 text-xs border border-teal-400/20">🕺 Shag</div>
                <div className="px-3 py-1 rounded-full bg-purple-800/30 text-purple-400 text-xs border border-purple-400/20">🎹 Boogie Woogie</div>
              </div>
            </div>
          </div>

          {/* Mission Section */}
          <div className="card p-6 mb-6">
            <h2 className="font-jazz text-xl text-gold-600 mb-4">📡 Our Mission</h2>
            <div className="space-y-4">
              <p className="text-white/90 leading-relaxed">
                SwingRadar was born from the passion of swing dancers who found themselves constantly scanning multiple websites, social media platforms, and forums just to detect information about festivals across Blues, Swing, Balboa, Shag, and Boogie Woogie. We believe that detecting your next dance adventure shouldn't require endless searching.
              </p>
              <p className="text-white/90 leading-relaxed">
                Our mission is to create the most comprehensive, up-to-date, and precise radar for swing dance culture detection, making it easier than ever for dancers to connect with events, instructors, and musicians across all vintage dance styles they love.
              </p>
              <div className="mt-4 p-4 bg-gold-600/10 rounded-lg border border-gold-600/20">
                <p className="text-gold-400 text-sm font-medium italic">
                  "Detect swing culture with precision radar technology and vintage aesthetics."
                </p>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="space-y-4 mb-6">
            <div className="card p-6">
              <div className="flex items-center mb-3">
                <svg className="w-6 h-6 text-gold-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <h3 className="font-playfair text-lg text-gold-600">Precision Detection</h3>
              </div>
              <p className="text-white/80">
                Detect festivals by location, dates, teachers, musicians, and more with our advanced radar detection and filtering system.
              </p>
            </div>

            <div className="card p-6">
              <div className="flex items-center mb-3">
                <svg className="w-6 h-6 text-gold-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <h3 className="font-jazz text-lg text-gold-600">Track Your Targets</h3>
              </div>
              <p className="text-white/80">
                Track instructors and musicians across all styles to get radar alerts when they announce new workshops and performances.
              </p>
            </div>

            <div className="card p-6">
              <div className="flex items-center mb-3">
                <svg className="w-6 h-6 text-gold-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <h3 className="font-jazz text-lg text-gold-600">Real-Time Scanning</h3>
              </div>
              <p className="text-white/80">
                Our automated radar scanning ensures you always have the latest festival information and announcements in real-time.
              </p>
            </div>

            <div className="card p-6">
              <div className="flex items-center mb-3">
                <svg className="w-6 h-6 text-gold-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <h3 className="font-playfair text-lg text-gold-600">Mobile-First Design</h3>
              </div>
              <p className="text-white/80">
                Perfect experience on all devices, because we know you're often searching for festivals on the go.
              </p>
            </div>
          </div>

          {/* Story Section */}
          <div className="card p-6 mb-6">
            <h2 className="font-playfair text-xl text-gold-600 mb-4">Our Story</h2>
            <div className="space-y-4">
              <p className="text-white/90 leading-relaxed">
                Founded in 2025, SwingRadar emerged from the frustration of dancers spending hours trying to scan information about festivals from scattered sources. As passionate swing dancers ourselves, we understood the challenge of missing amazing events simply because the information wasn't easily detectable.
              </p>
              <p className="text-white/90 leading-relaxed">
                We started by manually scanning festival information and quickly realized that this detection problem affected thousands of dancers worldwide. What began as a simple detection system soon evolved into a comprehensive radar platform that now serves the global swing dance community.
              </p>
              <p className="text-white/90 leading-relaxed">
                Today, we're proud to be the go-to radar system for swing dancers seeking their next adventure, whether it's a weekend workshop in their hometown or an international festival in a dream destination.
              </p>
            </div>
          </div>

          {/* Community Section */}
          <div className="card p-6 mb-6">
            <h2 className="font-playfair text-xl text-gold-600 mb-4">Join Our Community</h2>
            <p className="text-white/90 leading-relaxed mb-6">
              SwingRadar is more than just a detection platform—it's a community of passionate dancers helping each other detect amazing experiences across all swing dance styles. Join thousands of swing dancers who rely on our radar to scan the global swing dance scene.
            </p>
            <div className="grid grid-cols-2 gap-4 text-center mb-4">
              <div className="stats-card">
                <div className="text-2xl font-bold text-gold-600">800+</div>
                <div className="text-white/60 text-xs">Events Listed</div>
              </div>
              <div className="stats-card">
                <div className="text-2xl font-bold text-gold-600">2500+</div>
                <div className="text-white/60 text-xs">Active Users</div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="stats-card">
                <div className="text-lg font-bold text-copper-600">5</div>
                <div className="text-white/60 text-xs">Dance Styles</div>
              </div>
              <div className="stats-card">
                <div className="text-lg font-bold text-emerald-600">60+</div>
                <div className="text-white/60 text-xs">Countries</div>
              </div>
              <div className="stats-card">
                <div className="text-lg font-bold text-purple-600">1000+</div>
                <div className="text-white/60 text-xs">Instructors</div>
              </div>
            </div>
          </div>

          {/* Values Section */}
          <div className="card p-6 mb-6">
            <h2 className="font-playfair text-xl text-gold-600 mb-4">Our Values</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gold-600 mb-2">🎭 Community First</h3>
                <p className="text-white/80">We prioritize the needs of the swing dance community across all styles in every decision we make.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gold-600 mb-2">🎯 Accuracy & Reliability</h3>
                <p className="text-white/80">We're committed to providing accurate, up-to-date information you can trust across all vintage dance styles.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gold-600 mb-2">🌍 Accessibility</h3>
                <p className="text-white/80">Information about swing dance culture should be accessible to everyone, everywhere, regardless of style preference.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gold-600 mb-2">⚡ Continuous Innovation</h3>
                <p className="text-white/80">We constantly evolve with vintage style and modern convenience, based on community feedback.</p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="card p-6 text-center">
            <h2 className="font-jazz text-xl text-gradient-gold mb-4">
              📡 Ready to detect your next dance adventure?
            </h2>
            <p className="text-white/80 mb-6">
              Join thousands of swing dancers who use SwingRadar to scan the global swing dance scene across Blues, Swing, Balboa, Shag, and Boogie Woogie.
            </p>
            <div className="space-y-3">
              <Link href="/auth/signup">
                <button className="btn-primary w-full">
                  🎭 Start Detection
                </button>
              </Link>
              <Link href="/search">
                <button className="btn-secondary w-full">
                  📡 Scan Events
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}