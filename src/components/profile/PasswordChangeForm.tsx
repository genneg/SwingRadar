'use client'

import { useState } from 'react'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

interface PasswordChangeFormProps {
  userId: string
}

interface FormData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export function PasswordChangeForm({ userId }: PasswordChangeFormProps) {
  const [formData, setFormData] = useState<FormData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const validatePassword = (password: string): string[] => {
    const errors: string[] = []
    
    if (password.length < 8) {
      errors.push('Must be at least 8 characters long')
    }
    
    if (!/(?=.*[a-z])/.test(password)) {
      errors.push('Must contain at least one lowercase letter')
    }
    
    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push('Must contain at least one uppercase letter')
    }
    
    if (!/(?=.*\d)/.test(password)) {
      errors.push('Must contain at least one number')
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Must contain at least one special character')
    }
    
    return errors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate passwords match
    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match')
      return
    }

    // Validate password strength
    const passwordErrors = validatePassword(formData.newPassword)
    if (passwordErrors.length > 0) {
      setError(`Password requirements not met: ${passwordErrors.join(', ')}`)
      return
    }

    // Check that current password is provided
    if (!formData.currentPassword.trim()) {
      setError('Current password is required')
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
          confirmPassword: formData.confirmPassword,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setSuccess(true)
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        })
        setTimeout(() => setSuccess(false), 5000)
      } else {
        setError(data.error || 'Failed to change password')
      }
    } catch (error) {
      setError('An error occurred while changing password')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  const getPasswordStrength = () => {
    const { newPassword } = formData
    if (!newPassword) return 0
    
    let strength = 0
    if (newPassword.length >= 8) strength += 1
    if (/[a-z]/.test(newPassword)) strength += 1
    if (/[A-Z]/.test(newPassword)) strength += 1
    if (/\d/.test(newPassword)) strength += 1
    if (/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) strength += 1
    
    return strength
  }

  const getPasswordStrengthColor = () => {
    const strength = getPasswordStrength()
    if (strength <= 2) return 'bg-red-500'
    if (strength <= 3) return 'bg-yellow-500'
    if (strength <= 4) return 'bg-blue-500'
    return 'bg-green-500'
  }

  const getPasswordStrengthText = () => {
    const strength = getPasswordStrength()
    if (strength <= 2) return 'Weak'
    if (strength <= 3) return 'Fair'
    if (strength <= 4) return 'Good'
    return 'Strong'
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {success && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-600">Password changed successfully!</p>
        </div>
      )}

      <div>
        <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
          Current Password
        </label>
        <Input
          id="currentPassword"
          type="password"
          value={formData.currentPassword}
          onChange={(e) => handleInputChange('currentPassword', e.target.value)}
          placeholder="Enter current password"
          required
        />
      </div>

      <div>
        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
          New Password
        </label>
        <Input
          id="newPassword"
          type="password"
          value={formData.newPassword}
          onChange={(e) => handleInputChange('newPassword', e.target.value)}
          placeholder="Enter new password"
          required
          minLength={8}
        />
        
        {/* Password Strength Indicator */}
        {formData.newPassword && (
          <div className="mt-2">
            <div className="flex items-center space-x-2">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                  style={{ width: `${(getPasswordStrength() / 5) * 100}%` }}
                />
              </div>
              <span className="text-sm text-gray-600">{getPasswordStrengthText()}</span>
            </div>
          </div>
        )}
        
        <p className="text-xs text-gray-500 mt-1">
          Password must be at least 8 characters with uppercase, lowercase, number, and special character
        </p>
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
          Confirm New Password
        </label>
        <Input
          id="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
          placeholder="Confirm new password"
          required
        />
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="flex items-center"
      >
        {loading && <LoadingSpinner size="sm" className="mr-2" />}
        Change Password
      </Button>
    </form>
  )
}