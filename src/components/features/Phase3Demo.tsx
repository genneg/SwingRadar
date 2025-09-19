'use client'

import { Phase3Integration } from './Phase3Integration'

export default function Phase3Demo() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 via-gold-50 to-bordeaux-50">
      <div className="container mx-auto px-4 py-8">
        {/* Demo Header */}
        <div className="text-center mb-12">
          <h1 className="jazz-font text-4xl md:text-5xl font-bold text-navy-900 mb-4">
            🎭 Phase 3 Demo: Conversion Optimization
          </h1>
          <p className="vintage-text text-lg text-navy-700 max-w-3xl mx-auto">
            Experience the complete integration of social proof, trust signals, and engagement features
            wrapped in our signature vintage Art Deco aesthetic.
          </p>
        </div>

        {/* Phase 3 Integration Component */}
        <Phase3Integration
          eventId="demo-event-1"
          userId="demo-user-1"
          showAllFeatures={true}
          compactMode={false}
        />

        {/* Feature Showcase */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl border border-gold-200 shadow-lg">
            <div className="text-4xl mb-4 text-center">🛡️</div>
            <h3 className="font-bold text-navy-900 mb-2">Trust Signals</h3>
            <p className="text-sm text-navy-600">
              Multi-layer verification with official sources and community validation
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-bordeaux-200 shadow-lg">
            <div className="text-4xl mb-4 text-center">👑</div>
            <h3 className="font-bold text-navy-900 mb-2">Credibility System</h3>
            <p className="text-sm text-navy-600">
              Teacher & musician profiles with ratings, credentials, and trust scores
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gold-200 shadow-lg">
            <div className="text-4xl mb-4 text-center">❤️</div>
            <h3 className="font-bold text-navy-900 mb-2">Engagement Features</h3>
            <p className="text-sm text-navy-600">
              Wishlist, recommendations, and personalized content discovery
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-bordeaux-200 shadow-lg">
            <div className="text-4xl mb-4 text-center">🎷</div>
            <h3 className="font-bold text-navy-900 mb-2">Vintage Design</h3>
            <p className="text-sm text-navy-600">
              Authentic Art Deco aesthetic with jazz-era animations and styling
            </p>
          </div>
        </div>

        {/* Demo Footer */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-4 p-6 bg-gradient-to-r from-navy-800 to-bordeaux-900 text-cream-200 rounded-xl">
            <div className="text-2xl animate-vinyl-spin">🎵</div>
            <p className="vintage-text">
              Phase 3 Complete: Ready for deployment to production
            </p>
            <div className="text-2xl animate-vintage-bounce">🎭</div>
          </div>
        </div>
      </div>
    </div>
  )
}