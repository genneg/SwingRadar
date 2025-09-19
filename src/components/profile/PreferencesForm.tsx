'use client'

import { useState, useEffect } from 'react'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

interface PreferencesFormProps {
  userId: string
}

interface Preferences {
  emailNotifications: boolean
  pushNotifications: boolean
  newEventNotifications: boolean
  deadlineReminders: boolean
  weeklyDigest: boolean
  followingUpdates: boolean
  defaultCountry: string | null
  defaultCity: string | null
  searchRadius: number | null
  theme: 'light' | 'dark' | 'auto'
  language: string
  timezone: string | null
}

export function PreferencesForm({ userId }: PreferencesFormProps) {
  const [preferences, setPreferences] = useState<Preferences | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const response = await fetch(`/api/users/${userId}/preferences`)
        const data = await response.json()
        
        if (data.success) {
          setPreferences(data.data)
        } else {
          setError(data.error || 'Failed to load preferences')
        }
      } catch (error) {
        setError('An error occurred while loading preferences')
      } finally {
        setLoading(false)
      }
    }

    fetchPreferences()
  }, [userId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!preferences) return

    setSaving(true)
    setError(null)
    setSuccess(false)

    try {
      const response = await fetch(`/api/users/${userId}/preferences`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preferences),
      })

      const data = await response.json()

      if (data.success) {
        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
      } else {
        setError(data.error || 'Failed to update preferences')
      }
    } catch (error) {
      setError('An error occurred while saving preferences')
    } finally {
      setSaving(false)
    }
  }

  const handleCheckboxChange = (field: keyof Preferences, value: boolean) => {
    setPreferences(prev => prev ? { ...prev, [field]: value } : null)
  }

  const handleInputChange = (field: keyof Preferences, value: string | number) => {
    setPreferences(prev => prev ? { ...prev, [field]: value } : null)
  }

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner />
      </div>
    )
  }

  if (!preferences) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Unable to load preferences</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {success && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-600">Preferences updated successfully!</p>
        </div>
      )}

      {/* Notifications */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-3">Notifications</h3>
        <div className="space-y-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={preferences.emailNotifications}
              onChange={(e) => handleCheckboxChange('emailNotifications', e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="ml-3 text-sm text-gray-700">Email notifications</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={preferences.pushNotifications}
              onChange={(e) => handleCheckboxChange('pushNotifications', e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="ml-3 text-sm text-gray-700">Push notifications</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={preferences.newEventNotifications}
              onChange={(e) => handleCheckboxChange('newEventNotifications', e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="ml-3 text-sm text-gray-700">New event notifications</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={preferences.deadlineReminders}
              onChange={(e) => handleCheckboxChange('deadlineReminders', e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="ml-3 text-sm text-gray-700">Deadline reminders</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={preferences.weeklyDigest}
              onChange={(e) => handleCheckboxChange('weeklyDigest', e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="ml-3 text-sm text-gray-700">Weekly digest</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={preferences.followingUpdates}
              onChange={(e) => handleCheckboxChange('followingUpdates', e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="ml-3 text-sm text-gray-700">Following updates</span>
          </label>
        </div>
      </div>

      {/* Location */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-3">Location</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Default Country
            </label>
            <Input
              type="text"
              value={preferences.defaultCountry || ''}
              onChange={(e) => handleInputChange('defaultCountry', e.target.value)}
              placeholder="e.g., Italy"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Default City
            </label>
            <Input
              type="text"
              value={preferences.defaultCity || ''}
              onChange={(e) => handleInputChange('defaultCity', e.target.value)}
              placeholder="e.g., Rome"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search Radius (km)
            </label>
            <Input
              type="number"
              min="1"
              max="1000"
              value={preferences.searchRadius || ''}
              onChange={(e) => handleInputChange('searchRadius', parseInt(e.target.value) || '')}
              placeholder="100"
            />
          </div>
        </div>
      </div>

      {/* UI Preferences */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-3">Interface</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Theme
            </label>
            <select
              value={preferences.theme}
              onChange={(e) => handleInputChange('theme', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Language
            </label>
            <select
              value={preferences.language}
              onChange={(e) => handleInputChange('language', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="en">English</option>
              <option value="it">Italiano</option>
              <option value="fr">Français</option>
              <option value="es">Español</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Timezone
            </label>
            <Input
              type="text"
              value={preferences.timezone || ''}
              onChange={(e) => handleInputChange('timezone', e.target.value)}
              placeholder="Europe/Rome"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={saving}
          className="flex items-center"
        >
          {saving && <LoadingSpinner size="sm" className="mr-2" />}
          Save Preferences
        </Button>
      </div>
    </form>
  )
}