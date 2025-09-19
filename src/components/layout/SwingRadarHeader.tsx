'use client'

import { useState } from 'react'
import Link from 'next/link'
import { DanceStyle, getDanceStyleConfig, getAllDanceStyles } from '@/lib/types/dance'
import { Menu, X, Music } from 'lucide-react'

interface SwingRadarHeaderProps {
  currentPath?: string
  showStyleNavigation?: boolean
  className?: string
}

export function SwingRadarHeader({
  currentPath = '/',
  showStyleNavigation = true,
  className = ''
}: SwingRadarHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeStyle, setActiveStyle] = useState<DanceStyle | null>(null)

  const mainNavItems = [
    { href: '/', label: 'Radar', icon: '📡' },
    { href: '/search', label: 'Detect', icon: '🔍' },
    { href: '/teachers', label: 'Artists', icon: '👥' },
    { href: '/musicians', label: 'Musicians', icon: '🎵' },
    { href: '/events', label: 'Events', icon: '📅' }
  ]

  return (
    <header className={`relative z-40 ${className}`}>
      {/* Main Header */}
      <div className="hero-section border-b border-gold-600/20">
        <div className="hero-overlay vintage-pattern"></div>
        <div className="relative z-10 px-6 py-4">
          {/* Logo and Brand */}
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              {/* Vintage Radar Logo */}
              <div className="radar-screen w-12 h-12 relative animate-radar-sweep">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-green-600 to-green-700 border-2 border-green-500"></div>
                <div className="absolute inset-2 rounded-full bg-gradient-to-br from-green-400 to-green-500 opacity-30"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-6 bg-green-300 rounded-full animate-radar-sweep"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-45 w-1 h-4 bg-green-300 rounded-full opacity-60"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-90 w-1 h-4 bg-green-300 rounded-full opacity-40"></div>
                <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-xs text-green-300 font-bold">📡</div>
              </div>

              {/* Brand Text */}
              <div>
                <h1 className="font-jazz text-2xl font-bold text-gradient-gold leading-tight">
                  SwingRadar
                </h1>
                <p className="text-xs text-cream-300 font-medium">
                  Detect Swing Culture
                </p>
              </div>
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-full bg-gold-600/20 hover:bg-gold-600/30 transition-colors"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5 text-gold-400" />
              ) : (
                <Menu className="w-5 h-5 text-gold-400" />
              )}
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-6">
              {mainNavItems.map((item) => {
                const isActive = currentPath === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 font-medium text-sm ${
                      isActive
                        ? 'bg-gold-600 text-navy-900'
                        : 'text-cream-200 hover:bg-gold-600/20 hover:text-gold-400'
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </nav>
          </div>

          {/* Dance Styles Navigation */}
          {showStyleNavigation && (
            <div className="mt-4 pt-4 border-t border-gold-600/20">
              <div className="flex flex-wrap justify-center gap-2">
                <div className="text-xs text-gold-400 font-medium mr-3 flex items-center">
                  🎭 Detection Range:
                </div>
                {getAllDanceStyles().map((style) => {
                  const config = getDanceStyleConfig(style)
                  const isActive = activeStyle === style

                  return (
                    <button
                      key={style}
                      onClick={() => setActiveStyle(isActive ? null : style)}
                      className={`filter-style-indicator style-${style} text-xs transition-all duration-300 ${
                        isActive ? 'active' : ''
                      }`}
                    >
                      {config.icon} {config.displayName}
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 z-50">
          <div className="card-elegant m-4 p-6">
            <nav className="space-y-4">
              {mainNavItems.map((item) => {
                const isActive = currentPath === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 ${
                      isActive
                        ? 'bg-gold-600 text-navy-900'
                        : 'text-cream-200 hover:bg-gold-600/20 hover:text-gold-400'
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </Link>
                )
              })}
            </nav>

            {/* Mobile Dance Styles */}
            {showStyleNavigation && (
              <div className="mt-6 pt-6 border-t border-gold-600/20">
                <p className="text-xs text-gold-400 font-medium mb-3">
                  🎭 Detection Range:
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {getAllDanceStyles().map((style) => {
                    const config = getDanceStyleConfig(style)

                    return (
                      <Link
                        key={style}
                        href={`/search?style=${style}`}
                        onClick={() => setIsMenuOpen(false)}
                        className={`filter-style-indicator style-${style} text-xs p-3 text-center transition-all duration-300`}
                      >
                        {config.icon} {config.displayName}
                      </Link>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm -z-10"
            onClick={() => setIsMenuOpen(false)}
          />
        </div>
      )}
    </header>
  )
}