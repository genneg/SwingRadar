'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Button } from './Button'

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">BF</span>
              </div>
              <span className="text-xl font-bold text-gray-900 hidden sm:block">
                Blues Festival Finder
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/events" className="text-gray-600 hover:text-primary-600 transition-colors">
              Events
            </Link>
            <Link href="/teachers" className="text-gray-600 hover:text-primary-600 transition-colors">
              Teachers
            </Link>
            <Link href="/musicians" className="text-gray-600 hover:text-primary-600 transition-colors">
              Musicians
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-primary-600 transition-colors">
              About
            </Link>
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="hidden md:inline-flex">
              Sign In
            </Button>
            <Button variant="primary" size="sm">
              Get Started
            </Button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-3">
              <Link
                href="/events"
                className="text-gray-600 hover:text-primary-600 transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Events
              </Link>
              <Link
                href="/teachers"
                className="text-gray-600 hover:text-primary-600 transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Teachers
              </Link>
              <Link
                href="/musicians"
                className="text-gray-600 hover:text-primary-600 transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Musicians
              </Link>
              <Link
                href="/about"
                className="text-gray-600 hover:text-primary-600 transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
              <div className="pt-3 border-t border-gray-200">
                <Button variant="ghost" size="sm" className="w-full mb-2">
                  Sign In
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}