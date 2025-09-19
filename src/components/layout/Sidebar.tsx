'use client'

import Link from 'next/link'
import { useState } from 'react'

import { cn } from '@/lib/utils'

import { Navigation, dashboardNavItems, NavItem } from './Navigation'

interface SidebarProps {
  className?: string
  title?: string
  items?: NavItem[]
  showHelp?: boolean
}

export function Sidebar({ 
  className, 
  title = "Dashboard", 
  items = dashboardNavItems,
  showHelp = true 
}: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        'bg-white border-r border-gray-200 transition-all duration-300 flex flex-col h-full',
        collapsed ? 'w-16' : 'w-64',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
        {!collapsed && (
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <svg
            className={cn('w-4 h-4 transition-transform', collapsed && 'rotate-180')}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-4 flex-1 overflow-y-auto">
        {collapsed ? (
          <div className="space-y-2">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center justify-center p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                title={item.label}
              >
                {item.icon}
              </Link>
            ))}
          </div>
        ) : (
          <Navigation
            items={items}
            orientation="vertical"
          />
        )}
      </nav>

      {/* Quick Actions (when not collapsed) */}
      {!collapsed && (
        <div className="p-4 border-t border-gray-200 flex-shrink-0">
          <div className="space-y-2">
            <Link
              href="/search"
              className="flex items-center w-full p-2 text-sm text-gray-600 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Quick Search
            </Link>
            <Link
              href="/events"
              className="flex items-center w-full p-2 text-sm text-gray-600 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Browse Events
            </Link>
          </div>
        </div>
      )}

      {/* Help Section */}
      {!collapsed && showHelp && (
        <div className="p-4 flex-shrink-0">
          <div className="bg-gradient-to-br from-primary-50 to-blues-50 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <svg className="w-5 h-5 text-primary-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-sm font-medium text-gray-900">
                Need Help?
              </h3>
            </div>
            <p className="text-xs text-gray-600 mb-3">
              Check out our guides and tutorials or contact support.
            </p>
            <div className="flex flex-col space-y-2">
              <Link 
                href="/help" 
                className="text-xs text-primary-600 hover:text-primary-700 font-medium transition-colors"
              >
                Help Center →
              </Link>
              <Link 
                href="/contact" 
                className="text-xs text-primary-600 hover:text-primary-700 font-medium transition-colors"
              >
                Contact Support →
              </Link>
            </div>
          </div>
        </div>
      )}
    </aside>
  )
}