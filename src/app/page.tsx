import Link from 'next/link'
import { Suspense } from 'react'
import InternalLinking from '@/components/seo/InternalLinking'
import HomepageClient from '@/components/homepage/HomepageClient'
import {
  MainContent,
  AccessibleHeading,
  Landmark
} from '@/components/ui/SkipNavigation'
import { ContentClarity } from '@/components/ui/ContentClarity'
import { ArtDecoLoader } from '@/components/ui/VintageLoadingStates'

export default function Home() {
  const renderContent = () => {
    return (
      <div className="space-y-12">
        {/* Enhanced Hero Section with Vintage Aesthetics */}
        <div className="hero-section vintage-spotlight relative overflow-hidden rounded-2xl p-6 md:p-12 mb-8">
          <div className="hero-overlay vintage-pattern"></div>
          
          {/* Art Deco Corner Decorations */}
          <div className="art-deco-corner absolute top-4 left-4 w-6 h-6 z-20"></div>
          <div className="art-deco-corner absolute bottom-4 right-4 w-6 h-6 z-20" style={{transform: 'rotate(180deg)'}}></div>
          
          {/* Musical Note Decorations */}
          <div className="musical-notes absolute top-8 right-8 z-20"></div>
          
          {/* Main Content */}
          <div className="relative z-10 text-center">
            {/* Main Title with Jazz Typography */}
            <h1 className="font-jazz text-4xl md:text-6xl lg:text-7xl mb-4 text-gradient-gold leading-tight font-bold tracking-wide">
              SwingRadar
            </h1>
            <h2 className="font-vintage text-3xl md:text-4xl lg:text-5xl mb-6 text-cream-200 leading-tight tracking-wider">
              YOUR RADAR FOR SWING DANCE
            </h2>

            {/* Subtitle with enhanced styling */}
            <div className="jazz-lines relative mb-8 py-4">
              <p className="text-cream-100 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto font-medium">
                Detect authentic festivals and track legendary artists across Blues, Swing, Balboa, Shag, and Boogie Woogie worldwide. Your precision radar for swing dance culture with vintage style and modern technology.
              </p>
            </div>

            {/* Dance Styles Showcase */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              <div className="style-blues px-4 py-2 rounded-full bg-navy-800/50 border border-amber-400/30 text-amber-400 text-sm font-medium">
                🎺 Blues
              </div>
              <div className="style-swing px-4 py-2 rounded-full bg-emerald-800/50 border border-emerald-400/30 text-emerald-400 text-sm font-medium">
                🎷 Swing
              </div>
              <div className="style-balboa px-4 py-2 rounded-full bg-orange-800/50 border border-amber-400/30 text-amber-400 text-sm font-medium">
                💃 Balboa
              </div>
              <div className="style-shag px-4 py-2 rounded-full bg-teal-800/50 border border-teal-400/30 text-teal-400 text-sm font-medium">
                🕺 Shag
              </div>
              <div className="style-boogie px-4 py-2 rounded-full bg-purple-800/50 border border-purple-400/30 text-purple-400 text-sm font-medium">
                🎹 Boogie Woogie
              </div>
            </div>
            
            {/* Enhanced CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/search">
                <button className="btn-primary text-lg px-8 py-3 font-semibold tracking-wide shadow-gold-lg hover:shadow-gold-xl transition-all duration-300 hover:scale-105">
                  📡 Start Detection
                </button>
              </Link>
              <Link href="/teachers">
                <button className="btn-secondary text-lg px-8 py-3 font-semibold tracking-wide border-cream-300 text-cream-200 hover:bg-cream-100 hover:text-navy-900 transition-all duration-300">
                  👥 Meet Artists
                </button>
              </Link>
            </div>
            
          </div>
          
          {/* Floating Art Deco Elements */}
          <div className="absolute top-1/4 left-8 w-4 h-4 border-2 border-gold-600 rotate-45 animate-jazz-glow opacity-60"></div>
          <div className="absolute bottom-1/3 right-12 w-3 h-3 bg-copper-600 rounded-full animate-vintage-bounce opacity-70"></div>
        </div>

        {/* Client-side dynamic content */}
        <Suspense fallback={
          <div className="space-y-8">
            <ArtDecoLoader
              text="Loading SwingRadar content..."
              size="lg"
              className="py-8"
            />
          </div>
        }>
          <HomepageClient />
        </Suspense>

        {/* Internal Linking Section */}
        <div className="mb-12">
          <InternalLinking
            title="Explore the World of Swing Dance"
            columns={2}
            showDescriptions={true}
          />
        </div>
      </div>
    );
  };

  return (
    <MainContent>
      <div className="app-container">
        <div className="max-w-md mx-auto bg-background min-h-screen relative">
          {/* Main Content */}
          <div className="content-wrapper">
            <ContentClarity>
              {renderContent()}
            </ContentClarity>
          </div>

        </div>
      </div>
    </MainContent>
  )
}