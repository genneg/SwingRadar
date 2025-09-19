'use client'

import { useState, useEffect } from 'react'

import { Input } from '@/components/ui/Input'
import { cn } from '@/lib/utils'

interface TeacherMusicianFilterProps {
  selectedTeachers?: string[]
  selectedMusicians?: string[]
  onTeachersChange?: (teachers: string[]) => void
  onMusiciansChange?: (musicians: string[]) => void
  className?: string
}

interface Teacher {
  id: string
  name: string
}

interface Musician {
  id: string
  name: string
}

export function TeacherMusicianFilter({
  selectedTeachers = [],
  selectedMusicians = [],
  onTeachersChange,
  onMusiciansChange,
  className
}: TeacherMusicianFilterProps) {
  const [teacherQuery, setTeacherQuery] = useState('')
  const [musicianQuery, setMusicianQuery] = useState('')
  const [showTeacherSuggestions, setShowTeacherSuggestions] = useState(false)
  const [showMusicianSuggestions, setShowMusicianSuggestions] = useState(false)
  const [popularTeachers, setPopularTeachers] = useState<Teacher[]>([])
  const [popularMusicians, setPopularMusicians] = useState<Musician[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch teachers and musicians from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const [teachersRes, musiciansRes] = await Promise.all([
          fetch('/api/teachers?limit=10'),
          fetch('/api/musicians?limit=10')
        ])

        const teachersData = await teachersRes.json()
        const musiciansData = await musiciansRes.json()

        if (teachersData.success) {
          setPopularTeachers(teachersData.data.teachers || [])
        }
        if (musiciansData.success) {
          setPopularMusicians(musiciansData.data.musicians || [])
        }
      } catch (error) {
        console.error('Error fetching teachers/musicians:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const filteredTeachers = popularTeachers.filter(teacher => 
    teacher.name.toLowerCase().includes(teacherQuery.toLowerCase()) &&
    !selectedTeachers.includes(teacher.name)
  ).slice(0, 5)

  const filteredMusicians = popularMusicians.filter(musician => 
    musician.name.toLowerCase().includes(musicianQuery.toLowerCase()) &&
    !selectedMusicians.includes(musician.name)
  ).slice(0, 5)

  const addTeacher = (teacher: string) => {
    if (!selectedTeachers.includes(teacher)) {
      onTeachersChange?.([...selectedTeachers, teacher])
    }
    setTeacherQuery('')
    setShowTeacherSuggestions(false)
  }

  const removeTeacher = (teacher: string) => {
    onTeachersChange?.(selectedTeachers.filter(t => t !== teacher))
  }

  const addMusician = (musician: string) => {
    if (!selectedMusicians.includes(musician)) {
      onMusiciansChange?.([...selectedMusicians, musician])
    }
    setMusicianQuery('')
    setShowMusicianSuggestions(false)
  }

  const removeMusician = (musician: string) => {
    onMusiciansChange?.(selectedMusicians.filter(m => m !== musician))
  }

  const handleTeacherKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (teacherQuery.trim() && !selectedTeachers.includes(teacherQuery.trim())) {
        addTeacher(teacherQuery.trim())
      }
    }
  }

  const handleMusicianKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (musicianQuery.trim() && !selectedMusicians.includes(musicianQuery.trim())) {
        addMusician(musicianQuery.trim())
      }
    }
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Teachers Section */}
      <div>
        <h3 className="form-label text-base font-semibold mb-4">Teachers</h3>
        
        {/* Selected Teachers */}
        {selectedTeachers.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {selectedTeachers.map((teacher) => (
              <div
                key={teacher}
                className="inline-flex items-center px-3 py-1.5 bg-primary/20 text-primary rounded-full text-sm font-medium"
              >
                <span>{teacher}</span>
                <button
                  type="button"
                  onClick={() => removeTeacher(teacher)}
                  className="ml-2 text-primary hover:text-white"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Teacher Search */}
        <div className="relative">
          <Input
            type="text"
            placeholder="Search or add teachers..."
            value={teacherQuery}
            onChange={(e) => {
              setTeacherQuery(e.target.value)
              setShowTeacherSuggestions(true)
            }}
            onFocus={() => setShowTeacherSuggestions(true)}
            onBlur={() => {
              setTimeout(() => setShowTeacherSuggestions(false), 200)
            }}
            onKeyDown={handleTeacherKeyDown}
          />
          
          {showTeacherSuggestions && (teacherQuery.length > 0 || filteredTeachers.length > 0) && (
            <div className="absolute z-10 w-full mt-1 bg-navy-900 border border-primary/30 rounded-lg shadow-lg max-h-40 overflow-y-auto">
              {filteredTeachers.map((teacher) => (
                <button
                  key={teacher.id}
                  type="button"
                  onClick={() => addTeacher(teacher.name)}
                  className="w-full px-3 py-2 text-left text-base font-medium text-white hover:bg-primary/20 focus:bg-primary/20 focus:outline-none first:rounded-t-lg last:rounded-b-lg"
                >
                  {teacher.name}
                </button>
              ))}
              {teacherQuery.length > 0 && !filteredTeachers.some(t => t.name.toLowerCase() === teacherQuery.toLowerCase()) && (
                <button
                  type="button"
                  onClick={() => addTeacher(teacherQuery)}
                  className="w-full px-3 py-2 text-left text-base font-medium text-primary hover:bg-primary/20 focus:bg-primary/20 focus:outline-none italic border-t border-primary/30"
                >
                  Add "{teacherQuery}"
                </button>
              )}
            </div>
          )}
        </div>

        {/* Popular Teachers */}
        <div className="mt-3">
          <p className="text-sm font-medium text-primary mb-3">Popular teachers:</p>
          {isLoading ? (
            <div className="flex items-center text-white/60 text-sm">
              <div className="spinner mr-2 !w-3 !h-3"></div>
              Loading teachers...
            </div>
          ) : (
            <div className="flex flex-wrap gap-1">
              {popularTeachers.slice(0, 6).map((teacher) => (
                <button
                  key={teacher.id}
                  type="button"
                  onClick={() => addTeacher(teacher.name)}
                  disabled={selectedTeachers.includes(teacher.name)}
                  className="px-3 py-1.5 text-sm bg-primary/20 hover:bg-primary/30 disabled:bg-white/10 disabled:text-white/50 text-primary rounded-lg transition-colors font-medium"
                >
                  {teacher.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Musicians Section */}
      <div>
        <h3 className="form-label text-base font-semibold mb-4">Musicians</h3>
        
        {/* Selected Musicians */}
        {selectedMusicians.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {selectedMusicians.map((musician) => (
              <div
                key={musician}
                className="inline-flex items-center px-3 py-1.5 bg-primary/20 text-primary rounded-full text-sm font-medium"
              >
                <span>{musician}</span>
                <button
                  type="button"
                  onClick={() => removeMusician(musician)}
                  className="ml-2 text-primary hover:text-white"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Musician Search */}
        <div className="relative">
          <Input
            type="text"
            placeholder="Search or add musicians..."
            value={musicianQuery}
            onChange={(e) => {
              setMusicianQuery(e.target.value)
              setShowMusicianSuggestions(true)
            }}
            onFocus={() => setShowMusicianSuggestions(true)}
            onBlur={() => {
              setTimeout(() => setShowMusicianSuggestions(false), 200)
            }}
            onKeyDown={handleMusicianKeyDown}
          />
          
          {showMusicianSuggestions && (musicianQuery.length > 0 || filteredMusicians.length > 0) && (
            <div className="absolute z-10 w-full mt-1 bg-navy-900 border border-primary/30 rounded-lg shadow-lg max-h-40 overflow-y-auto">
              {filteredMusicians.map((musician) => (
                <button
                  key={musician.id}
                  type="button"
                  onClick={() => addMusician(musician.name)}
                  className="w-full px-3 py-2 text-left text-base font-medium text-white hover:bg-primary/20 focus:bg-primary/20 focus:outline-none first:rounded-t-lg last:rounded-b-lg"
                >
                  {musician.name}
                </button>
              ))}
              {musicianQuery.length > 0 && !filteredMusicians.some(m => m.name.toLowerCase() === musicianQuery.toLowerCase()) && (
                <button
                  type="button"
                  onClick={() => addMusician(musicianQuery)}
                  className="w-full px-3 py-2 text-left text-base font-medium text-primary hover:bg-primary/20 focus:bg-primary/20 focus:outline-none italic border-t border-primary/30"
                >
                  Add "{musicianQuery}"
                </button>
              )}
            </div>
          )}
        </div>

        {/* Popular Musicians */}
        <div className="mt-3">
          <p className="text-sm font-medium text-primary mb-3">Popular musicians:</p>
          {isLoading ? (
            <div className="flex items-center text-white/60 text-sm">
              <div className="spinner mr-2 !w-3 !h-3"></div>
              Loading musicians...
            </div>
          ) : (
            <div className="flex flex-wrap gap-1">
              {popularMusicians.slice(0, 4).map((musician) => (
                <button
                  key={musician.id}
                  type="button"
                  onClick={() => addMusician(musician.name)}
                  disabled={selectedMusicians.includes(musician.name)}
                  className="px-3 py-1.5 text-sm bg-primary/20 hover:bg-primary/30 disabled:bg-white/10 disabled:text-white/50 text-primary rounded-lg transition-colors font-medium"
                >
                  {musician.name.length > 20 ? musician.name.substring(0, 20) + '...' : musician.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}