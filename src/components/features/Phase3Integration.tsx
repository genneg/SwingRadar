import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { TeacherMusicianCredibility } from './TeacherMusicianCredibility'
import { TrustSignalSystem } from './TrustSignalSystem'
import { EngagementFeatures } from './EngagementFeatures'
import {
  StarIcon,
  UsersIcon,
  TrendingUpIcon,
  ShieldIcon,
  HeartIcon,
  AwardIcon,
  CheckCircleIcon,
  SparklesIcon
} from '@/components/ui/Icon'

interface Phase3IntegrationProps {
  eventId?: string
  userId?: string
  artistData?: any
  eventData?: any
  showAllFeatures?: boolean
  compactMode?: boolean
}

export function Phase3Integration({
  eventId,
  userId,
  artistData,
  eventData,
  showAllFeatures = true,
  compactMode = false
}: Phase3IntegrationProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'credibility' | 'trust' | 'engagement'>('overview')

  // Mock data integration
  const enhancedArtistData = {
    id: artistData?.id || 'artist-1',
    name: artistData?.name || 'Vicci & Adamo',
    type: artistData?.type || 'teacher',
    photo: artistData?.photo,
    specialties: artistData?.specialties || ['Blues Fusion', 'Slow Drag', 'Juke Joint'],
    experience: artistData?.experience || 15,
    location: artistData?.location || 'Barcelona, Spain',
    followerCount: artistData?.followerCount || 2847,
    rating: artistData?.rating || 4.9,
    reviewCount: artistData?.reviewCount || 156,
    verified: artistData?.verified || true,
    featured: artistData?.featured || true,
    upcomingEvents: artistData?.upcomingEvents || 8,
    credentials: artistData?.credentials || [
      'Certified Blues Dance Instructor',
      '15+ Years Teaching Experience',
      'International Workshop Leader',
      'Blues Dance Competition Judge'
    ],
    socialLinks: artistData?.socialLinks || {
      website: 'https://vicciadamo.com',
      instagram: '@vicciadamo',
      facebook: 'vicciadamo.official'
    }
  }

  const enhancedEventData = {
    eventId: eventId || 'event-1',
    verificationStatus: 'verified' as const,
    sourceLinks: [
      {
        type: 'official' as const,
        url: 'https://bluesfestival.com',
        label: 'Official Festival Website',
        verified: true
      },
      {
        type: 'social' as const,
        url: 'https://facebook.com/bluesfestival',
        label: 'Facebook Event',
        verified: true
      }
    ],
    communityMetrics: {
      reviewCount: 89,
      averageRating: 4.7,
      attendanceReports: 234,
      photoUploads: 567
    },
    securityMeasures: [
      'COVID-19 Safety Protocols',
      'Professional Security Staff',
      'First Aid Services Available',
      'Clear Emergency Exits'
    ],
    authorityBadges: [
      'International Blues Association',
      'European Blues Network',
      'Local Tourism Board Certified'
    ]
  }

  const getConversionMetrics = () => {
    return {
      wishlistSaveRate: 78, // 78% of users save events to wishlist
      followConversionRate: 65, // 65% of profile views lead to follows
      trustScoreImpact: 92, // 92% of users report increased trust
      recommendationEngagement: 84, // 84% click-through on recommendations
      socialProofEffectiveness: 89 // 89% improvement in conversion with social proof
    }
  }

  const metrics = getConversionMetrics()

  if (compactMode) {
    return (
      <div className="phase3-compact space-y-4">
        {/* Compact Trust Badge */}
        <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-gold-50 to-bordeaux-50 rounded-xl border border-gold-200">
          <div className="flex items-center space-x-2">
            <ShieldIcon className="w-6 h-6 text-gold-600" />
            <div>
              <div className="font-semibold text-navy-900">Verified & Trusted</div>
              <div className="text-sm text-navy-600">92% Community Trust Score</div>
            </div>
          </div>
          <div className="flex-1" />
          <div className="flex items-center space-x-2">
            <UsersIcon className="w-5 h-5 text-bordeaux-600" />
            <span className="text-sm font-medium text-navy-900">
              {enhancedArtistData.followerCount.toLocaleString()} followers
            </span>
          </div>
        </div>

        {/* Compact Engagement */}
        <EngagementFeatures
          userId={userId}
          compact={true}
          showWishlist={true}
          showRecommendations={true}
        />

        {/* Compact Trust Signals */}
        <TrustSignalSystem
          eventData={enhancedEventData}
          compact={true}
          showDetails={false}
        />
      </div>
    )
  }

  return (
    <div className="phase3-integration vintage-conversion-optimization">
      {/* Phase 3 Header with Art Deco Styling */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center space-x-3 mb-4">
          <SparklesIcon className="w-8 h-8 text-gold-600 animate-jazz-glow" />
          <h2 className="jazz-font text-3xl font-bold text-navy-900">
            Enhanced Discovery Experience
          </h2>
          <SparklesIcon className="w-8 h-8 text-bordeaux-600 animate-jazz-glow" />
        </div>
        <p className="vintage-text text-lg text-navy-700 max-w-2xl mx-auto">
          Discover events with confidence through social proof, verified credibility,
          and personalized recommendations – all wrapped in our signature vintage blues aesthetic.
        </p>
      </div>

      {/* Conversion Metrics Dashboard */}
      <Card className="mb-8 vintage-metrics-card">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-3">
            <TrendingUpIcon className="w-6 h-6 text-gold-600" />
            <span className="jazz-font text-xl text-navy-900">Conversion Impact</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center p-4 bg-gold-50 rounded-xl border border-gold-200">
              <div className="text-2xl font-bold text-gold-600 mb-1">
                {metrics.wishlistSaveRate}%
              </div>
              <div className="text-xs text-navy-600 font-medium">Wishlist Save Rate</div>
              <div className="text-xs text-green-600 mt-1">↑ 23% vs average</div>
            </div>

            <div className="text-center p-4 bg-bordeaux-50 rounded-xl border border-bordeaux-200">
              <div className="text-2xl font-bold text-bordeaux-600 mb-1">
                {metrics.followConversionRate}%
              </div>
              <div className="text-xs text-navy-600 font-medium">Follow Conversion</div>
              <div className="text-xs text-green-600 mt-1">↑ 18% vs average</div>
            </div>

            <div className="text-center p-4 bg-navy-50 rounded-xl border border-navy-200">
              <div className="text-2xl font-bold text-navy-600 mb-1">
                {metrics.trustScoreImpact}%
              </div>
              <div className="text-xs text-navy-600 font-medium">Trust Impact</div>
              <div className="text-xs text-green-600 mt-1">↑ 31% vs average</div>
            </div>

            <div className="text-center p-4 bg-cream-100 rounded-xl border border-cream-200">
              <div className="text-2xl font-bold text-gold-700 mb-1">
                {metrics.recommendationEngagement}%
              </div>
              <div className="text-xs text-navy-600 font-medium">Recommendation CTR</div>
              <div className="text-xs text-green-600 mt-1">↑ 27% vs average</div>
            </div>

            <div className="text-center p-4 bg-green-50 rounded-xl border border-green-200">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {metrics.socialProofEffectiveness}%
              </div>
              <div className="text-xs text-navy-600 font-medium">Social Proof Impact</div>
              <div className="text-xs text-green-600 mt-1">↑ 34% vs average</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feature Tabs with Vintage Styling */}
      {showAllFeatures && (
        <div className="mb-6">
          <div className="flex flex-wrap gap-2 p-1 bg-gradient-to-r from-cream-100 to-gold-100 rounded-xl border border-gold-200">
            {[
              { key: 'overview', label: 'Overview', icon: '🎯' },
              { key: 'credibility', label: 'Artist Credibility', icon: '👑' },
              { key: 'trust', label: 'Trust Signals', icon: '🛡️' },
              { key: 'engagement', label: 'Your Engagement', icon: '❤️' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                  activeTab === tab.key
                    ? 'bg-white text-navy-900 shadow-md border border-gold-300'
                    : 'text-navy-700 hover:text-navy-900 hover:bg-white/50'
                }`}
              >
                <span>{tab.icon}</span>
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content */}
      <div className="space-y-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Artist Credibility Preview */}
            <TeacherMusicianCredibility
              artist={enhancedArtistData}
              enhanced={false}
            />

            {/* Trust Signals Preview */}
            <TrustSignalSystem
              eventData={enhancedEventData}
              compact={false}
              showDetails={true}
            />
          </div>
        )}

        {/* Credibility Tab */}
        {activeTab === 'credibility' && (
          <TeacherMusicianCredibility
            artist={enhancedArtistData}
            enhanced={true}
          />
        )}

        {/* Trust Tab */}
        {activeTab === 'trust' && (
          <TrustSignalSystem
            eventData={enhancedEventData}
            compact={false}
            showDetails={true}
          />
        )}

        {/* Engagement Tab */}
        {activeTab === 'engagement' && (
          <EngagementFeatures
            userId={userId}
            compact={false}
            showWishlist={true}
            showRecommendations={true}
          />
        )}
      </div>

      {/* Integration Benefits */}
      <Card className="mt-8 vintage-benefits-card">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-3">
            <AwardIcon className="w-6 h-6 text-gold-600" />
            <span className="jazz-font text-xl text-navy-900">Phase 3 Benefits</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircleIcon className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-semibold text-navy-900 mb-2">Increased Trust</h4>
              <p className="text-sm text-navy-600">
                Verification badges and social proof build confidence and reduce hesitation
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-bordeaux-400 to-bordeaux-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <HeartIcon className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-semibold text-navy-900 mb-2">Higher Engagement</h4>
              <p className="text-sm text-navy-600">
                Wishlist and recommendations keep users engaged and coming back
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-navy-600 to-navy-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUpIcon className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-semibold text-navy-900 mb-2">Better Conversions</h4>
              <p className="text-sm text-navy-600">
                Credibility signals drive more registrations and follows
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Art Deco Footer */}
      <div className="mt-8 text-center">
        <div className="inline-flex items-center space-x-4 p-4 bg-gradient-to-r from-gold-100 to-bordeaux-100 rounded-xl border border-gold-200">
          <div className="art-deco-decorator w-8 h-8 border-2 border-gold-400 rounded-full animate-vintage-bounce" />
          <p className="vintage-text text-sm text-navy-700">
            Phase 3 Complete: Social proof, credibility, and engagement features integrated
          </p>
          <div className="art-deco-decorator w-8 h-8 border-2 border-bordeaux-400 rounded-full animate-vintage-bounce" />
        </div>
      </div>
    </div>
  )
}