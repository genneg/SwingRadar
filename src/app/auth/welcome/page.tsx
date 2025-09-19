'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, Users, Calendar, Music, Bell, ArrowRight, Sparkles } from 'lucide-react'

export default function WelcomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Redirect if not authenticated
    if (status === 'loading') return
    if (!session) {
      router.push('/auth/signin')
    }
  }, [session, status, router])

  const handleGetStarted = () => {
    setIsLoading(true)
    router.push('/dashboard')
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Welcome to Festival Scout, {session.user?.name?.split(' ')[0]}! 🎉
          </h1>
          <p className="text-xl text-blue-200 max-w-2xl mx-auto">
            You're now part of the blues dance community's premier festival discovery platform. 
            Let's get you started on your journey!
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-8 lg:p-12">
            {/* Welcome Message */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8 flex items-center space-x-3">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-medium text-green-800">Account created successfully!</h3>
                <p className="text-green-700">You can now access all Festival Scout features.</p>
              </div>
            </div>

            {/* Features Grid */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                What you can do with Festival Scout
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center p-6 bg-blue-50 rounded-xl">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Discover Events</h3>
                  <p className="text-sm text-gray-600">
                    Find blues dance festivals worldwide with advanced search and filtering
                  </p>
                </div>

                <div className="text-center p-6 bg-purple-50 rounded-xl">
                  <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Follow Teachers</h3>
                  <p className="text-sm text-gray-600">
                    Track your favorite instructors and get notified when they teach at festivals
                  </p>
                </div>

                <div className="text-center p-6 bg-green-50 rounded-xl">
                  <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Music className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Track Musicians</h3>
                  <p className="text-sm text-gray-600">
                    Follow musicians and discover where they'll be performing next
                  </p>
                </div>

                <div className="text-center p-6 bg-yellow-50 rounded-xl">
                  <div className="w-12 h-12 bg-yellow-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Bell className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Get Notifications</h3>
                  <p className="text-sm text-gray-600">
                    Receive personalized updates about new events and registration deadlines
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Start Steps */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Quick Start Guide
              </h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">1</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Explore your personalized dashboard</h4>
                    <p className="text-sm text-gray-600">View recommended events, save favorites, and manage your preferences</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">2</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Search for festivals and events</h4>
                    <p className="text-sm text-gray-600">Use our advanced filters to find events by location, date, teachers, and more</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">3</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Follow your favorite teachers and musicians</h4>
                    <p className="text-sm text-gray-600">Build your personalized network and never miss when they're performing</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">4</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Set up notifications</h4>
                    <p className="text-sm text-gray-600">Customize your notification preferences to stay updated on what matters to you</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <button
                onClick={handleGetStarted}
                disabled={isLoading}
                className="w-full flex items-center justify-center px-6 py-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                ) : (
                  <ArrowRight className="w-5 h-5 mr-3" />
                )}
                Go to Dashboard
              </button>

              <div className="grid md:grid-cols-2 gap-4">
                <Link
                  href="/search"
                  className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Browse Events
                </Link>

                <Link
                  href="/profile/preferences"
                  className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  <Bell className="w-4 h-4 mr-2" />
                  Set Preferences
                </Link>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-8 py-6 border-t">
            <p className="text-center text-sm text-gray-600">
              Need help getting started?{' '}
              <a href="mailto:support@festivalscout.com" className="text-blue-600 hover:text-blue-500">
                Contact our support team
              </a>{' '}
              or check out our{' '}
              <Link href="/help" className="text-blue-600 hover:text-blue-500">
                help documentation
              </Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}