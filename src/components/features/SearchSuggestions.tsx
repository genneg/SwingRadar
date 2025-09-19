'use client'

import React from 'react'

// Helper Components for Search Suggestions

interface SuggestionItemProps {
  text: string
  type: string
  icon: string
  isSelected: boolean
  onClick: () => void
  highlightQuery: string
  enableHighlighting: boolean
}

export function SuggestionItem({ 
  text, 
  type, 
  icon, 
  isSelected, 
  onClick, 
  highlightQuery, 
  enableHighlighting 
}: SuggestionItemProps) {
  const getIcon = () => {
    switch (icon) {
      case 'clock':
        return (
          <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      case 'calendar':
        return (
          <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        )
      case 'user':
        return (
          <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        )
      case 'music':
        return (
          <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
          </svg>
        )
      case 'location':
        return (
          <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        )
      default:
        return (
          <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        )
    }
  }

  const highlightText = (text: string, query: string) => {
    if (!enableHighlighting || !query) return text
    
    const parts = text.split(new RegExp(`(${query})`, 'gi'))
    return (
      <>
        {parts.map((part, index) => 
          part.toLowerCase() === query.toLowerCase() ? (
            <mark key={index} className="bg-yellow-200 text-gray-900">{part}</mark>
          ) : (
            part
          )
        )}
      </>
    )
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full px-3 py-2 text-left text-sm flex items-center space-x-2 focus:outline-none first:rounded-t-lg last:rounded-b-lg ${
        isSelected 
          ? 'bg-primary-50 text-primary-900' 
          : 'hover:bg-gray-50 text-gray-700'
      }`}
    >
      {getIcon()}
      <span>{highlightText(text, highlightQuery)}</span>
    </button>
  )
}

interface SuggestionGroupProps {
  title: string
  items: string[]
  type: string
  icon: string
  startIndex: number
  selectedIndex: number
  onItemClick: (item: string, type: string) => void
  highlightQuery: string
  enableHighlighting: boolean
}

export function SuggestionGroup({ 
  title, 
  items, 
  type, 
  icon, 
  startIndex, 
  selectedIndex, 
  onItemClick, 
  highlightQuery, 
  enableHighlighting 
}: SuggestionGroupProps) {
  if (items.length === 0) return null

  return (
    <div className="border-b border-gray-100 last:border-b-0">
      <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
        {title}
      </div>
      {items.map((item, index) => (
        <SuggestionItem
          key={`${type}-${index}`}
          text={item}
          type={type}
          icon={icon}
          isSelected={selectedIndex === startIndex + index}
          onClick={() => onItemClick(item, type)}
          highlightQuery={highlightQuery}
          enableHighlighting={enableHighlighting}
        />
      ))}
    </div>
  )
}