import { NextRequest } from 'next/server'
import { existsSync } from 'fs'
import { join } from 'path'

import { db } from '@festival-scout/database'

import { apiResponse, apiError, handleApiError } from '@/lib/api/utils'

export async function GET(request: NextRequest) {
  try {
    const issues: Array<{
      type: string
      id: string
      name: string
      imageUrl: string
      issue: string
    }> = []
    const fixes: Array<{
      type: string
      id: string
      name: string
      action: string
    }> = []

    // Check events
    const events = await db.event.findMany({
      where: {
        image_url: {
          not: null
        }
      },
      select: {
        id: true,
        name: true,
        image_url: true
      }
    })

    for (const event of events) {
      if (event.image_url) {
        // Extract file path from URL
        const filePath = event.image_url.replace('/api/uploads/', '')
        const fullPath = join(process.cwd(), 'uploads', filePath)
        
        if (!existsSync(fullPath)) {
          issues.push({
            type: 'event',
            id: event.id.toString(),
            name: event.name,
            imageUrl: event.image_url,
            issue: 'File does not exist'
          })
        }
      }
    }

    // Check teachers
    const teachers = await db.teacher.findMany({
      where: {
        image_url: {
          not: null
        }
      },
      select: {
        id: true,
        name: true,
        image_url: true
      }
    })

    for (const teacher of teachers) {
      if (teacher.image_url) {
        const filePath = teacher.image_url.replace('/api/uploads/', '')
        const fullPath = join(process.cwd(), 'uploads', filePath)
        
        if (!existsSync(fullPath)) {
          issues.push({
            type: 'teacher',
            id: teacher.id.toString(),
            name: teacher.name,
            imageUrl: teacher.image_url,
            issue: 'File does not exist'
          })
        }
      }
    }

    // Check musicians
    const musicians = await db.musician.findMany({
      where: {
        image_url: {
          not: null
        }
      },
      select: {
        id: true,
        name: true,
        image_url: true
      }
    })

    for (const musician of musicians) {
      if (musician.image_url) {
        const filePath = musician.image_url.replace('/api/uploads/', '')
        const fullPath = join(process.cwd(), 'uploads', filePath)
        
        if (!existsSync(fullPath)) {
          issues.push({
            type: 'musician',
            id: musician.id.toString(),
            name: musician.name,
            imageUrl: musician.image_url,
            issue: 'File does not exist'
          })
        }
      }
    }

    return apiResponse({
      summary: {
        totalIssues: issues.length,
        byType: {
          events: issues.filter(i => i.type === 'event').length,
          teachers: issues.filter(i => i.type === 'teacher').length,
          musicians: issues.filter(i => i.type === 'musician').length
        }
      },
      issues,
      fixes,
      note: 'Missing images will now show placeholder SVGs instead of broken links.'
    })

  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json()
    
    if (action !== 'remove-invalid-references') {
      return apiError('Invalid action. Use "remove-invalid-references"', 400)
    }

    const fixes: Array<{
      type: string
      id: string
      name: string
      action: string
    }> = []

    // Fix events with missing images
    const events = await db.event.findMany({
      where: {
        image_url: {
          not: null
        }
      },
      select: {
        id: true,
        name: true,
        image_url: true
      }
    })

    for (const event of events) {
      if (event.image_url) {
        const filePath = event.image_url.replace('/api/uploads/', '')
        const fullPath = join(process.cwd(), 'uploads', filePath)
        
        if (!existsSync(fullPath)) {
          await db.event.update({
            where: { id: event.id },
            data: { image_url: null }
          })
          
          fixes.push({
            type: 'event',
            id: event.id.toString(),
            name: event.name,
            action: 'Removed invalid image reference'
          })
        }
      }
    }

    // Similar fixes for teachers and musicians can be added here if needed

    return apiResponse({
      message: 'Fixed invalid image references',
      fixes,
      count: fixes.length
    })

  } catch (error) {
    return handleApiError(error)
  }
}