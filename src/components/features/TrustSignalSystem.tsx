import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import {
  CheckCircleIcon,
  ShieldIcon,
  GlobeIcon,
  CalendarIcon,
  UsersIcon,
  AwardIcon,
  LinkIcon,
  AlertTriangleIcon,
  ClockIcon
} from '@/components/ui/Icon'

interface TrustSignal {
  type: 'verification' | 'source' | 'security' | 'community' | 'authority'
  label: string
  description: string
  icon: string
  status: 'verified' | 'pending' | 'unverified'
  lastUpdated?: string
  details?: string
  link?: string
}

interface EventTrustData {
  eventId: string
  verificationStatus: 'verified' | 'pending' | 'unverified'
  sourceLinks: Array<{
    type: 'official' | 'social' | 'partner' | 'media'
    url: string
    label: string
    verified: boolean
  }>
  communityMetrics: {
    reviewCount: number
    averageRating: number
    attendanceReports: number
    photoUploads: number
  }
  securityMeasures: string[]
  authorityBadges: string[]
}

interface TrustSignalSystemProps {
  eventData: EventTrustData
  compact?: boolean
  showDetails?: boolean
}

export function TrustSignalSystem({
  eventData,
  compact = false,
  showDetails = true
}: TrustSignalSystemProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null)

  const getTrustSignals = (): TrustSignal[] => {
    const signals: TrustSignal[] = []

    // Verification Status
    signals.push({
      type: 'verification',
      label: 'Event Verification',
      description: 'Event details verified by our team',
      icon: eventData.verificationStatus === 'verified' ? '✅' : '⏳',
      status: eventData.verificationStatus,
      lastUpdated: '2024-01-15',
      details: eventData.verificationStatus === 'verified'
        ? 'All event details have been verified including dates, venue, and organizer information'
        : 'Verification in progress - some details awaiting confirmation'
    })

    // Source Links
    if (eventData.sourceLinks.length > 0) {
      const officialSources = eventData.sourceLinks.filter(link => link.type === 'official')
      signals.push({
        type: 'source',
        label: 'Official Sources',
        description: `${officialSources.length} official source${officialSources.length > 1 ? 's' : ''} linked`,
        icon: '🔗',
        status: officialSources.every(link => link.verified) ? 'verified' : 'pending',
        details: 'Connected to official event websites and social media channels',
        link: officialSources[0]?.url
      })
    }

    // Community Trust
    const communityTrust = eventData.communityMetrics.reviewCount > 10 &&
                         eventData.communityMetrics.averageRating >= 4.0
    signals.push({
      type: 'community',
      label: 'Community Trust',
      description: `${eventData.communityMetrics.reviewCount} reviews, ${eventData.communityMetrics.averageRating.toFixed(1)}★ average`,
      icon: communityTrust ? '👥' : '⭐',
      status: communityTrust ? 'verified' : 'pending',
      details: 'Based on community reviews, attendance reports, and photo verification'
    })

    // Security Measures
    signals.push({
      type: 'security',
      label: 'Security Measures',
      description: `${eventData.securityMeasures.length} safety protocols`,
      icon: '🛡️',
      status: 'verified',
      details: eventData.securityMeasures.join(', ')
    })

    // Authority Badges
    if (eventData.authorityBadges.length > 0) {
      signals.push({
        type: 'authority',
        label: 'Authority Recognition',
        description: `${eventData.authorityBadges.length} recognized authorities`,
        icon: '🏆',
        status: 'verified',
        details: 'Recognized by blues dance organizations and authorities'
      })
    }

    return signals
  }

  const getTrustScore = () => {
    const signals = getTrustSignals()
    const verifiedCount = signals.filter(s => s.status === 'verified').length
    return Math.round((verifiedCount / signals.length) * 100)
  }

  const trustSignals = getTrustSignals()
  const trustScore = getTrustScore()

  const TrustBadge = ({ signal }: { signal: TrustSignal }) => (
    <div
      className={`trust-badge-item p-4 rounded-lg border transition-all duration-300 cursor-pointer ${
        signal.status === 'verified'
          ? 'bg-green-50 border-green-200 hover:bg-green-100'
          : signal.status === 'pending'
            ? 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100'
            : 'bg-red-50 border-red-200 hover:bg-red-100'
      }`}
      onClick={() => setExpandedSection(expandedSection === signal.label ? null : signal.label)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
            signal.status === 'verified' ? 'bg-green-500 text-white' :
            signal.status === 'pending' ? 'bg-yellow-500 text-white' :
            'bg-red-500 text-white'
          }`}>
            {signal.icon}
          </div>
          <div>
            <h4 className="font-semibold text-navy-900">{signal.label}</h4>
            <p className="text-sm text-navy-600">{signal.description}</p>
          </div>
        </div>
        <div className={`px-2 py-1 rounded-full text-xs font-bold ${
          signal.status === 'verified' ? 'bg-green-100 text-green-700' :
          signal.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
          'bg-red-100 text-red-700'
        }`}>
          {signal.status.toUpperCase()}
        </div>
      </div>

      {expandedSection === signal.label && signal.details && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <p className="text-sm text-navy-700 mb-2">{signal.details}</p>
          {signal.link && (
            <a
              href={signal.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 text-sm text-bordeaux-600 hover:text-bordeaux-700"
            >
              <LinkIcon className="w-4 h-4" />
              <span>View Source</span>
            </a>
          )}
          {signal.lastUpdated && (
            <p className="text-xs text-navy-500 mt-2">
              Last updated: {new Date(signal.lastUpdated).toLocaleDateString()}
            </p>
          )}
        </div>
      )}
    </div>
  )

  if (compact) {
    return (
      <div className="trust-signals-compact">
        <div className="flex items-center space-x-2 mb-3">
          <div className="flex items-center space-x-1">
            {trustSignals.slice(0, 3).map((signal, index) => (
              <div
                key={index}
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                  signal.status === 'verified' ? 'bg-green-500' :
                  signal.status === 'pending' ? 'bg-yellow-500' :
                  'bg-red-500'
                } text-white`}
                title={signal.label}
              >
                {signal.icon}
              </div>
            ))}
          </div>
          <div className="text-sm text-navy-600">
            Trust Score: {trustScore}%
          </div>
        </div>
      </div>
    )
  }

  return (
    <Card className="trust-signals-system vintage-trust-card">
      <CardContent className="p-6">
        {/* Trust Score Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="jazz-font text-xl font-bold text-navy-900 flex items-center">
              <ShieldIcon className="w-6 h-6 mr-2 text-gold-600" />
              Trust & Verification
            </h3>
            <Badge
              variant={trustScore >= 80 ? 'primary' : trustScore >= 60 ? 'secondary' : 'danger'}
              className="text-lg px-3 py-1"
            >
              {trustScore}% Trusted
            </Badge>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
            <div
              className={`h-3 rounded-full transition-all duration-500 ${
                trustScore >= 80 ? 'bg-gradient-to-r from-green-500 to-green-600' :
                trustScore >= 60 ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' :
                'bg-gradient-to-r from-red-500 to-red-600'
              }`}
              style={{ width: `${trustScore}%` }}
            />
          </div>
          <p className="text-sm text-navy-600">
            Based on {trustSignals.length} verification criteria
          </p>
        </div>

        {/* Trust Signals Grid */}
        <div className="grid grid-cols-1 gap-4 mb-6">
          {trustSignals.map((signal, index) => (
            <TrustBadge key={index} signal={signal} />
          ))}
        </div>

        {/* Detailed Information Section */}
        {showDetails && (
          <div className="border-t pt-6">
            {/* Source Links */}
            {eventData.sourceLinks.length > 0 && (
              <div className="mb-6">
                <h4 className="font-semibold text-navy-900 mb-3 flex items-center">
                  <GlobeIcon className="w-5 h-5 mr-2 text-bordeaux-600" />
                  Official Sources
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {eventData.sourceLinks.map((source, index) => (
                    <a
                      key={index}
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 bg-white border border-cream-200 rounded-lg hover:border-gold-400 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          source.verified ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {source.verified ? '✓' : '?'}
                        </div>
                        <span className="text-sm font-medium text-navy-900">
                          {source.label}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className="text-xs">
                          {source.type}
                        </Badge>
                        <LinkIcon className="w-4 h-4 text-navy-400" />
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Community Metrics */}
            <div className="mb-6">
              <h4 className="font-semibold text-navy-900 mb-3 flex items-center">
                <UsersIcon className="w-5 h-5 mr-2 text-bordeaux-600" />
                Community Verification
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-cream-50 rounded-lg">
                  <div className="text-xl font-bold text-navy-900">
                    {eventData.communityMetrics.reviewCount}
                  </div>
                  <div className="text-xs text-navy-600">Reviews</div>
                </div>
                <div className="text-center p-3 bg-cream-50 rounded-lg">
                  <div className="text-xl font-bold text-navy-900">
                    {eventData.communityMetrics.averageRating.toFixed(1)}★
                  </div>
                  <div className="text-xs text-navy-600">Avg Rating</div>
                </div>
                <div className="text-center p-3 bg-cream-50 rounded-lg">
                  <div className="text-xl font-bold text-navy-900">
                    {eventData.communityMetrics.attendanceReports}
                  </div>
                  <div className="text-xs text-navy-600">Reports</div>
                </div>
                <div className="text-center p-3 bg-cream-50 rounded-lg">
                  <div className="text-xl font-bold text-navy-900">
                    {eventData.communityMetrics.photoUploads}
                  </div>
                  <div className="text-xs text-navy-600">Photos</div>
                </div>
              </div>
            </div>

            {/* Security Measures */}
            <div>
              <h4 className="font-semibold text-navy-900 mb-3 flex items-center">
                <ShieldIcon className="w-5 h-5 mr-2 text-bordeaux-600" />
                Safety & Security
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {eventData.securityMeasures.map((measure, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg"
                  >
                    <CheckCircleIcon className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-navy-700">{measure}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Trust Disclaimer */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start space-x-3">
            <AlertTriangleIcon className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-blue-800 font-medium mb-1">
                Trust Information
              </p>
              <p className="text-xs text-blue-700">
                Trust scores are calculated based on verification status, community feedback,
                and official sources. We continuously monitor and update trust signals.
                Always verify event details directly with organizers.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}