'use client'

import { useEffect } from 'react'

import { cn } from '@/lib/utils'

interface ModalProps {
  open?: boolean
  isOpen?: boolean // Alias for open for compatibility
  onOpenChange?: (open: boolean) => void
  onClose?: () => void
  onOpen?: () => void
  title?: string
  description?: string
  children: React.ReactNode
  className?: string
  maxWidth?: string
}

export function Modal({ 
  open, 
  isOpen, 
  onOpenChange, 
  onClose, 
  onOpen, 
  title, 
  description, 
  children, 
  className, 
  maxWidth 
}: ModalProps) {
  // Handle compatibility with isOpen prop - fallback to false if neither is provided
  const isModalOpen = isOpen !== undefined ? isOpen : (open !== undefined ? open : false)
  
  const handleClose = () => {
    onClose?.()
    onOpenChange?.(false)
  }
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose()
      }
    }

    if (isModalOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isModalOpen, handleClose])

  if (!isModalOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div
        className={cn(
          'relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto',
          className
        )}
      >
        {/* Header */}
        {(title || description) && (
          <div className="px-6 py-4 border-b border-gray-200">
            {title && (
              <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            )}
            {description && (
              <p className="text-sm text-gray-600 mt-1">{description}</p>
            )}
            
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        
        {/* Content */}
        <div className="px-6 py-4">
          {children}
        </div>
      </div>
    </div>
  )
}