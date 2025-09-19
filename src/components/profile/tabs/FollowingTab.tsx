'use client'

import { useState } from 'react'
import { Heart, Settings } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { FollowingList } from '@/components/features/FollowingList'

interface FollowingTabProps {
  userId: string
}

export function FollowingTab({ userId }: FollowingTabProps) {
  const [view, setView] = useState<'overview' | 'teachers' | 'musicians' | 'festivals'>('overview')

  if (view === 'overview') {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">
            Following Overview
          </h3>
          <a href="/profile/following">
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Manage Following
            </Button>
          </a>
        </div>

        {/* Quick stats and recent following */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <button
            onClick={() => setView('teachers')}
            className="p-4 text-center bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <div className="text-2xl font-bold text-blue-600">0</div>
            <div className="text-sm text-gray-600">Teachers</div>
          </button>
          <button
            onClick={() => setView('musicians')}
            className="p-4 text-center bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
          >
            <div className="text-2xl font-bold text-purple-600">0</div>
            <div className="text-sm text-gray-600">Musicians</div>
          </button>
          <button
            onClick={() => setView('festivals')}
            className="p-4 text-center bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
          >
            <div className="text-2xl font-bold text-green-600">0</div>
            <div className="text-sm text-gray-600">Festivals</div>
          </button>
        </div>

        {/* Recent following */}
        <div>
          <h4 className="text-md font-medium text-gray-900 mb-3">Recent Following</h4>
          <FollowingList
            userId={userId}
            limit={5}
            compact={true}
            showActions={false}
          />
        </div>
      </div>
    )
  }

  // Specific view for teachers, musicians, or festivals
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setView('overview')}
        >
          ← Back to Overview
        </Button>
        
        <h3 className="text-lg font-medium text-gray-900 capitalize">
          Following {view}
        </h3>
      </div>

      <FollowingList
        userId={userId}
        type={view as 'teacher' | 'musician' | 'festival'}
        showSearch={true}
        showFilter={false}
        showActions={true}
      />
    </div>
  )
}