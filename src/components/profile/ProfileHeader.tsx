'use client'

import { useState } from 'react'
import { User, Camera, Edit3, Settings } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { EditProfileForm } from './EditProfileForm'

interface ProfileHeaderProps {
  user: {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
  }
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  const [showEditModal, setShowEditModal] = useState(false)

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex items-center space-x-4 mb-4 md:mb-0">
          {/* Avatar */}
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl font-bold overflow-hidden">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name || 'Profile'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-8 h-8" />
              )}
            </div>
            <button
              className="absolute bottom-0 right-0 w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center text-white hover:bg-gray-700 transition-colors"
              title="Change avatar"
            >
              <Camera className="w-3 h-3" />
            </button>
          </div>

          {/* User Info */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {user.name || 'User'}
            </h1>
            <p className="text-gray-600">{user.email}</p>
            <div className="flex items-center mt-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-500">Active</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowEditModal(true)}
            className="flex items-center"
          >
            <Edit3 className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
          <Link href="/profile/settings">
            <Button variant="outline" size="sm" className="flex items-center">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </Link>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal
        open={showEditModal}
        onOpenChange={setShowEditModal}
        title="Edit Profile"
      >
        <EditProfileForm
          user={user}
          onSuccess={() => setShowEditModal(false)}
          onCancel={() => setShowEditModal(false)}
        />
      </Modal>
    </div>
  )
}