'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

import { Button } from '@/components/ui/Button'
import { Navigation, mainNavItems } from './Navigation'
import { cn } from '@/lib/utils'

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const isActive = (href: string) => {
    if (!isMounted) return false // Prevent hydration mismatch
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-navy-900 via-navy-800 to-navy-900 shadow-elegant border-b border-gold-600/30 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Enhanced Logo with Vintage Design */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="vinyl-record w-12 h-12 animate-vinyl-spin group-hover:animate-art-deco-spin transition-all duration-300">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-gold-600 font-bold text-lg">♪</span>
                  </div>
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gold-600 rounded-full animate-pulse"></div>
              </div>
              <div className="hidden sm:block">
                <div className="font-jazz text-2xl font-bold text-gradient-gold leading-tight">
                  SwingRadar
                </div>
                <div className="font-vintage text-sm text-cream-200 tracking-widest -mt-1">
                  DETECT SWING CULTURE
                </div>
              </div>
              <div className="sm:hidden">
                <span className="font-jazz text-xl font-bold text-gradient-gold">
                  SR
                </span>
              </div>
            </Link>
          </div>

          {/* Enhanced Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            {mainNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'relative font-vintage text-sm font-medium tracking-wide uppercase transition-all duration-300 hover:text-gold-600 px-3 py-2',
                  isActive(item.href)
                    ? 'text-gold-600'
                    : 'text-cream-200 hover:scale-105'
                )}
              >
                <span className="relative z-10">{item.label}</span>
                {isActive(item.href) && (
                  <>
                    <div className="absolute inset-0 bg-gold-600/20 rounded-md -z-1 animate-jazz-glow"></div>
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gold-600 to-transparent"></div>
                  </>
                )}
                <div className="absolute inset-0 bg-gold-600/10 rounded-md opacity-0 hover:opacity-100 transition-opacity duration-300 -z-1"></div>
              </Link>
            ))}
          </nav>

          {/* Enhanced Search Button */}
          <div className="hidden md:flex items-center space-x-3">
            <Link href="/search">
              <button className="btn-ghost flex items-center space-x-2 px-4 py-2 text-cream-200 hover:text-gold-600 border border-gold-600/30 hover:border-gold-600 rounded-lg transition-all duration-300">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="font-vintage text-sm tracking-wide">SEARCH</span>
              </button>
            </Link>
          </div>

          {/* Enhanced User Actions */}
          <div className="flex items-center space-x-3">
            {/* Dashboard Link for logged in users */}
            <Link href="/dashboard" className="hidden md:inline-flex">
              <button className="btn-ghost flex items-center space-x-2 px-3 py-2 text-cream-200 hover:text-copper-600 border border-copper-600/30 hover:border-copper-600 rounded-lg transition-all duration-300">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                <span className="font-vintage text-sm tracking-wide">STUDIO</span>
              </button>
            </Link>

            <Link href="/auth/signin">
              <button className="btn-ghost hidden md:inline-flex px-4 py-2 text-cream-200 hover:text-gold-600 font-vintage text-sm tracking-wide transition-all duration-300">
                SIGN IN
              </button>
            </Link>
            
            <Link href="/auth/signup">
              <button className="btn-primary px-6 py-2 font-vintage text-sm tracking-wide shadow-gold-lg hover:shadow-gold-xl transition-all duration-300 hover:scale-105">
                🎭 JOIN US
              </button>
            </Link>

            {/* Enhanced Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-3 text-cream-200 hover:text-gold-600 border border-gold-600/30 hover:border-gold-600 rounded-lg transition-all duration-300 hover:scale-105"
              aria-label="Toggle mobile menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Enhanced Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-6 border-t border-gold-600/30 bg-gradient-to-b from-navy-800 to-navy-900 backdrop-blur-md">
            <nav className="flex flex-col space-y-2">
              {mainNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'px-4 py-3 font-vintage text-base font-medium tracking-wide uppercase transition-all duration-300 rounded-lg mx-2',
                    isActive(item.href)
                      ? 'bg-gold-600/20 text-gold-600 border-l-4 border-gold-600 shadow-gold'
                      : 'text-cream-200 hover:text-gold-600 hover:bg-gold-600/10 hover:border-l-4 hover:border-gold-600/50'
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              
              <div className="pt-4 mt-4 border-t border-gold-600/30">
                <Link
                  href="/search"
                  className="flex items-center px-4 py-3 font-vintage text-base font-medium text-cream-200 hover:text-gold-600 hover:bg-gold-600/10 rounded-lg transition-all duration-300 mx-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span className="tracking-wide">SEARCH EVENTS</span>
                </Link>
                <Link
                  href="/dashboard"
                  className="flex items-center px-4 py-3 font-vintage text-base font-medium text-cream-200 hover:text-copper-600 hover:bg-copper-600/10 rounded-lg transition-all duration-300 mx-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  <span className="tracking-wide">STUDIO</span>
                </Link>
              </div>
              
              <div className="pt-4 mt-4 border-t border-gold-600/30 space-y-3 mx-2">
                <Link href="/auth/signin" className="block">
                  <button className="w-full btn-ghost flex items-center justify-center space-x-2 px-4 py-3 text-cream-200 hover:text-gold-600 border border-gold-600/30 hover:border-gold-600 rounded-lg transition-all duration-300">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    <span className="font-vintage tracking-wide">SIGN IN</span>
                  </button>
                </Link>
                <Link href="/auth/signup" className="block">
                  <button className="w-full btn-primary flex items-center justify-center space-x-2 px-4 py-3 font-vintage tracking-wide shadow-gold-lg">
                    <span>🎭</span>
                    <span>JOIN THE COMMUNITY</span>
                  </button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}