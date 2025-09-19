'use client'

import { useState } from 'react'
import { signOut } from 'next-auth/react'
import { AlertTriangle, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

interface DangerZoneProps {
  userId: string
}

export function DangerZone({ userId }: DangerZoneProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [confirmationText, setConfirmationText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDeleteAccount = async () => {
    if (confirmationText !== 'DELETE') {
      setError('Please type "DELETE" to confirm')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ confirmation: 'DELETE' }),
      })

      const data = await response.json()

      if (data.success) {
        // Sign out user and redirect to home
        await signOut({ callbackUrl: '/' })
      } else {
        setError(data.error || 'Failed to delete account')
      }
    } catch (error) {
      setError('An error occurred while deleting account')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="p-4 border border-red-200 rounded-lg bg-red-50">
        <div className="flex items-start">
          <AlertTriangle className="w-5 h-5 text-red-500 mr-3 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-red-800">
              Delete Account
            </h3>
            <p className="text-sm text-red-700 mt-1">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <div className="mt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDeleteModal(true)}
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Account
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        title="Delete Account"
      >
        <div className="space-y-4">
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start">
              <AlertTriangle className="w-5 h-5 text-red-500 mr-3 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-red-800">
                  Are you absolutely sure?
                </h3>
                <p className="text-sm text-red-700 mt-1">
                  This action cannot be undone. This will permanently delete your account
                  and remove all your data from our servers.
                </p>
              </div>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-600 mb-2">
              Please type <strong>DELETE</strong> to confirm:
            </p>
            <Input
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              placeholder="Type DELETE to confirm"
              className="font-mono"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteModal(false)
                setConfirmationText('')
                setError(null)
              }}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteAccount}
              disabled={loading || confirmationText !== 'DELETE'}
              className="bg-red-600 hover:bg-red-700 text-white flex items-center"
            >
              {loading && <LoadingSpinner size="sm" className="mr-2" />}
              Delete Account
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}