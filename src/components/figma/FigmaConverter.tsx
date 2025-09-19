/**
 * Figma Component Converter Utility
 * 
 * This utility helps convert Figma-exported components to match our project structure
 */

import React from 'react'
import { cn } from '@/lib/utils'

// Types for Figma exported components
export interface FigmaComponentProps {
  className?: string
  children?: React.ReactNode
  // Add common props that Figma exports might need
  [key: string]: any
}

/**
 * Wrapper for Figma exported components
 * Helps standardize the integration with our design system
 */
export function FigmaComponentWrapper({ 
  children, 
  className,
  ...props 
}: FigmaComponentProps) {
  return (
    <div 
      className={cn(
        "figma-component", // Add identifying class
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

/**
 * Utility to convert Figma absolute positioning to responsive CSS
 */
export function convertFigmaPosition(figmaStyles: {
  left?: number
  top?: number
  width?: number
  height?: number
}): string {
  const { left, top, width, height } = figmaStyles
  
  let classes = []
  
  // Convert absolute positioning to relative/responsive classes
  if (left !== undefined && top !== undefined) {
    classes.push('relative')
  }
  
  if (width !== undefined) {
    // Convert fixed width to responsive Tailwind classes
    if (width <= 320) classes.push('w-80')
    else if (width <= 640) classes.push('w-full sm:w-auto')
    else classes.push('w-full')
  }
  
  if (height !== undefined) {
    // Convert fixed height to responsive classes
    if (height <= 200) classes.push('h-48')
    else if (height <= 400) classes.push('h-96')
    else classes.push('min-h-screen')
  }
  
  return classes.join(' ')
}

/**
 * Utility to convert Figma colors to Tailwind classes
 */
export function convertFigmaColor(figmaColor: string): string {
  // Common Figma color conversions for our blues theme
  const colorMap: Record<string, string> = {
    '#1E40AF': 'bg-blue-800',
    '#3B82F6': 'bg-blue-500', 
    '#60A5FA': 'bg-blue-400',
    '#DBEAFE': 'bg-blue-100',
    '#1F2937': 'bg-gray-800',
    '#374151': 'bg-gray-700',
    '#6B7280': 'bg-gray-500',
    '#F3F4F6': 'bg-gray-100',
    '#FFFFFF': 'bg-white',
    '#000000': 'bg-black',
    // Add more mappings based on your Figma design
  }
  
  return colorMap[figmaColor.toUpperCase()] || 'bg-gray-500'
}

/**
 * Utility to convert Figma text styles to Tailwind typography
 */
export function convertFigmaText(figmaTextStyle: {
  fontSize?: number
  fontWeight?: number | string
  lineHeight?: number
  letterSpacing?: number
}): string {
  const { fontSize, fontWeight, lineHeight, letterSpacing } = figmaTextStyle
  
  let classes = []
  
  // Font size conversion
  if (fontSize) {
    if (fontSize <= 12) classes.push('text-xs')
    else if (fontSize <= 14) classes.push('text-sm')
    else if (fontSize <= 16) classes.push('text-base')
    else if (fontSize <= 18) classes.push('text-lg')
    else if (fontSize <= 20) classes.push('text-xl')
    else if (fontSize <= 24) classes.push('text-2xl')
    else if (fontSize <= 30) classes.push('text-3xl')
    else if (fontSize <= 36) classes.push('text-4xl')
    else classes.push('text-5xl')
  }
  
  // Font weight conversion
  if (fontWeight) {
    const weight = typeof fontWeight === 'string' ? parseInt(fontWeight) : fontWeight
    if (weight <= 300) classes.push('font-light')
    else if (weight <= 400) classes.push('font-normal')
    else if (weight <= 500) classes.push('font-medium')
    else if (weight <= 600) classes.push('font-semibold')
    else if (weight <= 700) classes.push('font-bold')
    else classes.push('font-extrabold')
  }
  
  // Line height (approximate conversion)
  if (lineHeight && fontSize) {
    const ratio = lineHeight / fontSize
    if (ratio <= 1.2) classes.push('leading-tight')
    else if (ratio <= 1.4) classes.push('leading-snug')
    else if (ratio <= 1.6) classes.push('leading-normal')
    else classes.push('leading-relaxed')
  }
  
  return classes.join(' ')
}

/**
 * Helper to clean up Figma generated class names
 */
export function cleanFigmaClasses(className: string): string {
  return className
    .split(' ')
    .filter(cls => !cls.startsWith('_')) // Remove Figma internal classes
    .filter(cls => !cls.includes('undefined'))
    .join(' ')
}

export default FigmaComponentWrapper