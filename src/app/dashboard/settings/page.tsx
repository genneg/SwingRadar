'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { 
  Settings, 
  Bell, 
  Mail, 
  Globe, 
  Shield, 
  User, 
  Palette,
  Database,
  Download,
  Trash2
} from 'lucide-react'

// Types for user preferences
interface UserPreferences {
  emailNotifications: boolean
  pushNotifications: boolean
  weeklyDigest: boolean
  eventReminders: boolean
  followingUpdates: boolean
  marketingEmails: boolean
  language: string
  timezone: string
  theme: string
}

export default function DashboardSettingsPage() {
  const [preferences, setPreferences] = useState<UserPreferences>({
    emailNotifications: true,
    pushNotifications: false,
    weeklyDigest: true,
    eventReminders: true,
    followingUpdates: true,
    marketingEmails: false,
    language: 'en',
    timezone: 'UTC',
    theme: 'dark'
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Fetch user preferences from API
  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        setIsLoading(true)
        // TODO: Replace with actual user preferences API
        // For now, using default preferences
        setTimeout(() => {
          setIsLoading(false)
        }, 1000)
      } catch (error) {
        setError('Failed to load preferences')
        console.error('Error fetching preferences:', error)
        setIsLoading(false)
      }
    }

    fetchPreferences()
  }, [])

  const handlePreferenceChange = async (key: keyof UserPreferences, value: boolean | string) => {
    setPreferences(prev => ({ ...prev, [key]: value }))
    
    // Auto-save preferences
    try {
      setIsSaving(true)
      // TODO: API call to save preferences
      await new Promise(resolve => setTimeout(resolve, 500)) // Mock delay
      setSuccess('Preferences saved successfully')
      setTimeout(() => setSuccess(null), 3000)
    } catch (error) {
      setError('Failed to save preferences')
      setTimeout(() => setError(null), 3000)
    } finally {
      setIsSaving(false)
    }
  }

  const SettingSection = ({ 
    icon: Icon, 
    title, 
    description, 
    children 
  }: { 
    icon: any, 
    title: string, 
    description: string, 
    children: React.ReactNode 
  }) => (
    <div className="card p-4 space-y-3">
      <div className="flex items-start gap-3">
        <Icon className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="font-medium text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="space-y-3 ml-8">
        {children}
      </div>
    </div>
  )

  const ToggleOption = ({ 
    label, 
    description, 
    checked, 
    onChange 
  }: { 
    label: string
    description: string
    checked: boolean
    onChange: (checked: boolean) => void
  }) => (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          checked ? 'bg-primary' : 'bg-gray-600'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  )

  if (isLoading) {
    return (
      <div className="app-container">
        <div className="max-w-md mx-auto bg-background min-h-screen">
          <div className="p-6 text-center">
            <LoadingSpinner className="mx-auto mb-4" />
            <p className="text-white/80">Loading settings...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="app-container">
      <div className="max-w-md mx-auto bg-background min-h-screen">
        {/* Header */}
        <div className="p-6 border-b border-border/50">
          <div className="flex items-center gap-3 mb-4">
            <Settings className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-playfair text-foreground">Settings</h1>
          </div>
          
          {success && (
            <Badge variant="success" className="mb-2">
              {success}
            </Badge>
          )}
          
          {error && (
            <Badge variant="error" className="mb-2">
              {error}
            </Badge>
          )}
          
          {isSaving && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <LoadingSpinner size="sm" />
              Saving...
            </div>
          )}
        </div>

        {/* Settings Sections */}
        <div className="p-6 space-y-6">
          {/* Notifications */}
          <SettingSection
            icon={Bell}
            title="Notifications"
            description="Manage how you receive updates and reminders"
          >
            <ToggleOption
              label="Email Notifications"
              description="Receive notifications via email"
              checked={preferences.emailNotifications}
              onChange={(checked) => handlePreferenceChange('emailNotifications', checked)}
            />
            <ToggleOption
              label="Push Notifications"
              description="Receive push notifications on your device"
              checked={preferences.pushNotifications}
              onChange={(checked) => handlePreferenceChange('pushNotifications', checked)}
            />
            <ToggleOption
              label="Event Reminders"
              description="Get reminded about upcoming events"
              checked={preferences.eventReminders}
              onChange={(checked) => handlePreferenceChange('eventReminders', checked)}
            />
            <ToggleOption
              label="Following Updates"
              description="Notifications when people you follow have new events"
              checked={preferences.followingUpdates}
              onChange={(checked) => handlePreferenceChange('followingUpdates', checked)}
            />
          </SettingSection>

          {/* Email Preferences */}
          <SettingSection
            icon={Mail}
            title="Email Preferences"
            description="Control what emails you receive from us"
          >
            <ToggleOption
              label="Weekly Digest"
              description="Weekly summary of new events and updates"
              checked={preferences.weeklyDigest}
              onChange={(checked) => handlePreferenceChange('weeklyDigest', checked)}
            />
            <ToggleOption
              label="Marketing Emails"
              description="Promotional emails and special offers"
              checked={preferences.marketingEmails}
              onChange={(checked) => handlePreferenceChange('marketingEmails', checked)}
            />
          </SettingSection>

          {/* Privacy & Security */}
          <SettingSection
            icon={Shield}
            title="Privacy & Security"
            description="Manage your account security and privacy"
          >
            <Button variant="outline" size="sm" className="w-full justify-start">
              <User className="w-4 h-4 mr-2" />
              Change Password
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Database className="w-4 h-4 mr-2" />
              Download My Data
            </Button>
          </SettingSection>

          {/* Appearance */}
          <SettingSection
            icon={Palette}
            title="Appearance"
            description="Customize how the app looks"
          >
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">Theme</p>
              <div className="flex gap-2">
                <Button 
                  variant={preferences.theme === 'dark' ? 'primary' : 'outline'} 
                  size="sm"
                  onClick={() => handlePreferenceChange('theme', 'dark')}
                >
                  Dark
                </Button>
                <Button 
                  variant={preferences.theme === 'light' ? 'primary' : 'outline'} 
                  size="sm"
                  onClick={() => handlePreferenceChange('theme', 'light')}
                >
                  Light
                </Button>
                <Button 
                  variant={preferences.theme === 'auto' ? 'primary' : 'outline'} 
                  size="sm"
                  onClick={() => handlePreferenceChange('theme', 'auto')}
                >
                  Auto
                </Button>
              </div>
            </div>
          </SettingSection>

          {/* Danger Zone */}
          <SettingSection
            icon={Trash2}
            title="Danger Zone"
            description="Irreversible and destructive actions"
          >
            <Button variant="error" size="sm" className="w-full justify-start">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Account
            </Button>
          </SettingSection>
        </div>
      </div>
    </div>
  )
}