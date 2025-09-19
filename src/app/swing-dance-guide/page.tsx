import type { Metadata } from 'next'
import Link from 'next/link'
import { generateMetadata } from '@/components/seo/SEOMetadata'
import { DanceStyle, DANCE_STYLE_CONFIGS, getDanceStyleConfig, formatDanceStyle } from '@/lib/types/dance'

export const metadata: Metadata = generateMetadata({
  title: 'Swing Dance Guide - Complete Guide to Swing Dance Styles',
  description: 'Master the art of swing dance with our comprehensive guide covering Lindy Hop, East Coast Swing, Charleston, Balboa, Shag, and more. Perfect for beginners and advanced dancers.',
  keywords: [
    'swing dance guide',
    'lindy hop',
    'east coast swing',
    'charleston',
    'balboa',
    'shag',
    'swing dance styles',
    'vintage dance',
    'swing dancing lessons',
    'swing dance music',
    'swing dance history',
    'swing radar',
    'swing dance festivals',
    'swing dance events'
  ],
  ogUrl: '/swing-dance-guide'
})

interface StyleGuideProps {
  style: DanceStyle
}

function StyleGuideCard({ style }: StyleGuideProps) {
  const config = getDanceStyleConfig(style)

  return (
    <div className="card p-6 mb-6 hover:bg-white/5 transition-all duration-300">
      <div className="flex items-start space-x-4">
        <div className="text-4xl">{config.icon}</div>
        <div className="flex-1">
          <h3 className="font-jazz text-2xl text-gradient-gold mb-3">
            {config.displayName}
          </h3>
          <p className="text-cream-200 mb-4 leading-relaxed">
            {config.description}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <h4 className="font-semibold text-gold-400 mb-2">🎯 Difficulty Levels:</h4>
              <div className="space-y-1">
                {config.difficulty.map(level => (
                  <div key={level} className="text-sm text-cream-300">
                    • {level.charAt(0).toUpperCase() + level.slice(1)}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gold-400 mb-2">🎭 Common Events:</h4>
              <div className="space-y-1">
                {config.commonEventTypes.map(type => (
                  <div key={type} className="text-sm text-cream-300">
                    • {type.charAt(0).toUpperCase() + type.slice(1)}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link href={`/search?danceStyles=${style}`}>
              <button className="btn-primary btn-sm">
                📡 Detect {config.displayName} Events
              </button>
            </Link>
            <Link href={`/search?query=${config.displayName}`}>
              <button className="btn-secondary btn-sm">
                🔍 Search {config.displayName}
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SwingDanceGuidePage() {
  const swingStyles: DanceStyle[] = ['swing', 'blues', 'balboa', 'shag', 'boogie']

  return (
    <div className="app-container">
      <div className="max-w-md mx-auto bg-background min-h-screen relative">
        <div className="content-wrapper">
          {/* Hero Section */}
          <div className="hero-section vintage-spotlight relative overflow-hidden rounded-2xl p-6 md:p-8 mb-6">
            <div className="hero-overlay vintage-pattern"></div>

            {/* Art Deco Corner Decorations */}
            <div className="art-deco-corner absolute top-4 left-4 w-6 h-6 z-20"></div>
            <div className="art-deco-corner absolute bottom-4 right-4 w-6 h-6 z-20" style={{transform: 'rotate(180deg)'}}></div>

            <div className="relative z-10 text-center">
              <div className="radar-screen w-16 h-16 mx-auto mb-4 animate-radar-sweep">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-green-600 to-green-700 border-2 border-green-500"></div>
                <div className="absolute inset-2 rounded-full bg-gradient-to-br from-green-400 to-green-500 opacity-30"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-6 bg-green-300 rounded-full animate-radar-sweep"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-45 w-1 h-4 bg-green-300 rounded-full opacity-60"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-90 w-1 h-4 bg-green-300 rounded-full opacity-40"></div>
                <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-xs text-green-300 font-bold">📡</div>
              </div>

              <h1 className="font-jazz text-4xl md:text-5xl mb-4 text-gradient-gold leading-tight font-bold">
                Swing Dance Style Guide
              </h1>
              <p className="text-cream-100 text-lg leading-relaxed max-w-2xl mx-auto font-medium">
                Your comprehensive radar for mastering all swing dance styles. From vintage Lindy Hop to modern variations, detect the perfect style for your dance journey.
              </p>
            </div>
          </div>

          {/* Introduction Section */}
          <div className="card p-6 mb-6">
            <h2 className="font-jazz text-3xl text-gold-600 mb-4">
              🎭 Welcome to the World of Swing Dance
            </h2>
            <p className="text-cream-200 leading-relaxed mb-4">
              Swing dance is a vibrant family of dances that originated in the African American communities of Harlem, New York, during the late 1920s and early 1930s. Born from the jazz era, these dances evolved alongside the music that inspired them, creating a rich cultural heritage that continues to thrive today.
            </p>
            <p className="text-cream-200 leading-relaxed">
              At SwingRadar, we've designed our precision detection system to help you explore and master all swing dance variations. Whether you're a complete beginner or an experienced dancer, our radar will help you find the perfect events, teachers, and communities for your preferred style.
            </p>
          </div>

          {/* Main Style Cards */}
          <div className="space-y-6 mb-8">
            {swingStyles.map(style => (
              <StyleGuideCard key={style} style={style} />
            ))}
          </div>

          {/* Getting Started Section */}
          <div className="card p-6 mb-6">
            <h2 className="font-jazz text-3xl text-gold-600 mb-4">
              🌱 Getting Started with Swing Dance
            </h2>
            <div className="space-y-4">
              <div className="p-4 bg-gold-600/10 rounded-lg border border-gold-600/20">
                <h3 className="font-semibold text-gold-400 mb-2">🎯 For Beginners</h3>
                <p className="text-cream-200 text-sm">
                  Start with East Coast Swing or basic Lindy Hop. These styles provide the foundation for most other swing variations and are widely taught at festivals and workshops worldwide.
                </p>
              </div>
              <div className="p-4 bg-emerald-600/10 rounded-lg border border-emerald-600/20">
                <h3 className="font-semibold text-emerald-400 mb-2">🎵 Music Connection</h3>
                <p className="text-cream-200 text-sm">
                  Understanding swing music is essential. Listen to artists like Duke Ellington, Count Basie, Ella Fitzgerald, and Benny Goodman to develop your musicality and timing.
                </p>
              </div>
              <div className="p-4 bg-amber-600/10 rounded-lg border border-amber-600/20">
                <h3 className="font-semibold text-amber-400 mb-2">🏫 Learning Resources</h3>
                <p className="text-cream-200 text-sm">
                  Use SwingRadar to find local classes, workshops, and festivals. Our detection system will help you discover the best learning opportunities in your area.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="card p-6 text-center">
            <h2 className="font-jazz text-2xl text-gradient-gold mb-4">
              📡 Ready to Start Your Swing Dance Journey?
            </h2>
            <p className="text-cream-200 mb-6">
              Use our precision radar to discover swing dance events, teachers, and communities that match your interests and skill level.
            </p>
            <div className="space-y-3">
              <Link href="/search">
                <button className="btn-primary w-full">
                  📡 Detect Swing Events Near You
                </button>
              </Link>
              <Link href="/teachers">
                <button className="btn-secondary w-full">
                  👥 Find Swing Dance Teachers
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}