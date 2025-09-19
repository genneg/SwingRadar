'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

interface EditProfileFormProps {
  user: {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
  }
  onSuccess: () => void
  onCancel: () => void
}

interface FormData {
  name: string
  email: string
  avatar: string
}

export function EditProfileForm({ user, onSuccess, onCancel }: EditProfileFormProps) {
  const { update: updateSession } = useSession()
  const [formData, setFormData] = useState<FormData>({
    name: user.name || '',
    email: user.email || '',
    avatar: user.image || '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        // Update session with new data
        await updateSession({
          ...user,
          name: formData.name,
          email: formData.email,
          image: formData.avatar,
        })
        
        onSuccess()
      } else {
        setError(data.error || 'Failed to update profile')
      }
    } catch (error) {
      setError('An error occurred while updating profile')
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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Name
        </label>
        <Input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          placeholder="Enter your name"
          required
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          placeholder="Enter your email"
          required
        />
      </div>

      <div>
        <label htmlFor="avatar" className="block text-sm font-medium text-gray-700 mb-1">
          Avatar URL
        </label>
        <Input
          id="avatar"
          type="url"
          value={formData.avatar}
          onChange={(e) => handleInputChange('avatar', e.target.value)}
          placeholder="Enter avatar URL"
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={loading}
          className="flex items-center"
        >
          {loading && <LoadingSpinner className="w-4 h-4 mr-2" />}
          Save Changes
        </Button>
      </div>
    </form>
  )
}