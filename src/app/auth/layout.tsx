import type { Metadata } from 'next'
import Link from 'next/link'
import { Music, Calendar, Users } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Authentication - SwingRadar',
  description: 'Sign in or create your SwingRadar account to follow teachers, festivals, and locations',
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-900 via-bordeaux-900 to-gold-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gold-600 rounded-full flex items-center justify-center jazz-glow">
              <Music className="w-8 h-8 text-navy-900" />
            </div>
          </div>
          <h2 className="jazz-font text-3xl text-cream-100">Welcome to SwingRadar</h2>
          <p className="mt-2 text-cream-200">DETECT SWING CULTURE - Sign in to your account</p>
        </div>

        {/* Enhanced Features Banner */}
        <div className="bg-cream-100/10 backdrop-blur-sm rounded-lg p-4 border border-gold-400/30">
          <div className="flex flex-wrap items-center justify-center gap-4 text-cream-100 text-sm">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gold-400" />
              <span>Follow Festivals</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-gold-400" />
              <span>Follow Teachers</span>
            </div>
            <div className="flex items-center space-x-2">
              <Music className="w-4 h-4 text-gold-400" />
              <span>Follow Musicians</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-gold-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
              <span>Follow Cities</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-gradient-to-br from-cream-50 to-bordeaux-50 rounded-xl shadow-2xl p-8 border border-gold-400/20">
          {children}
        </div>

        {/* Security & Trust Indicators */}
        <div className="bg-cream-100/5 rounded-lg p-3 border border-gold-400/20">
          <div className="flex items-center justify-center space-x-4 text-cream-200 text-xs">
            <div className="flex items-center space-x-1">
              <svg className="w-3 h-3 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <span>SSL Secured</span>
            </div>
            <div className="flex items-center space-x-1">
              <svg className="w-3 h-3 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Privacy Protected</span>
            </div>
            <div className="flex items-center space-x-1">
              <svg className="w-3 h-3 text-gold-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Trusted Platform</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-cream-200 text-sm">
          <p>© 2024 SwingRadar. All rights reserved.</p>
          <div className="mt-2 space-x-4">
            <Link href="/" className="hover:text-gold-400 transition-colors">
              Home
            </Link>
            <Link href="/privacy" className="hover:text-gold-400 transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-gold-400 transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}