import { NextRequest } from 'next/server'
import { z } from 'zod'

import { db } from '@/lib/database'

// Mark route as dynamic with short caching
export const dynamic = 'force-dynamic'
export const revalidate = 60 // Cache for 60 seconds

// Simplified search schema for mock data
const searchSchema = z.object({
  page: z.string().optional().default('1'),
  limit: z.string().optional().default('20'),
  query: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  sortBy: z
    .enum(['relevance', 'date', 'distance', 'popularity', 'price'])
    .optional()
    .default('relevance'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
})

export async function GET(request: NextRequest) {
  try {
    // Ensure database connection is healthy
    await db.$connect()

    const url = new URL(request.url)

    // Parse parameters manually to avoid dependency issues
    const page = Math.max(parseInt(url.searchParams.get('page') || '1'), 1)
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '20'), 100)
    const query = url.searchParams.get('query') || ''
    const city = url.searchParams.get('city') || ''
    const country = url.searchParams.get('country') || ''
    const sortBy = url.searchParams.get('sortBy') || 'relevance'
    const sortOrder = url.searchParams.get('sortOrder') || 'desc'
    
    // Parse teacher and musician filters
    const teachersParam = url.searchParams.get('teachers')
    const musiciansParam = url.searchParams.get('musicians')
    const teachers = teachersParam ? teachersParam.split(',').filter(t => t.trim()) : []
    const musicians = musiciansParam ? musiciansParam.split(',').filter(m => m.trim()) : []

    const skip = (page - 1) * limit

    // Use enhanced search with teachers and musicians for serverless compatibility
    try {
      console.log('Using enhanced search with teachers/musicians for query:', query)
      console.log('Teacher filters:', teachers)
      console.log('Musician filters:', musicians)

      // Build search query with teachers and musicians
      let whereClause = ''
      let searchRankCase = '0.0'
      let orderByClause = 'ORDER BY e.from_date ASC'

      // Handle specific teacher/musician filters (from Filter panel)
      if (teachers.length > 0 || musicians.length > 0) {
        const teacherConditions = teachers.map((teacher, index) => 
          `EXISTS (
            SELECT 1 FROM event_teachers et 
            JOIN teachers t ON et.teacher_id = t.id 
            WHERE et.event_id = e.id 
            AND LOWER(t.name) = LOWER('${teacher.replace(/'/g, "''")}')
          )`
        )
        
        const musicianConditions = musicians.map((musician, index) => 
          `EXISTS (
            SELECT 1 FROM event_musicians em 
            JOIN musicians m ON em.musician_id = m.id 
            WHERE em.event_id = e.id 
            AND LOWER(m.name) = LOWER('${musician.replace(/'/g, "''")}')
          )`
        )
        
        const allConditions = [...teacherConditions, ...musicianConditions]
        whereClause = `WHERE (${allConditions.join(' OR ')})`
        
        // Set high relevance for exact teacher/musician matches
        searchRankCase = '90.0'
        orderByClause = 'ORDER BY e.from_date ASC'
      } else if (query) {
        whereClause = `
          WHERE (
            LOWER(e.name) LIKE LOWER('%' || $1 || '%') OR
            LOWER(e.description) LIKE LOWER('%' || $1 || '%') OR
            LOWER(e.city) LIKE LOWER('%' || $1 || '%') OR
            LOWER(e.country) LIKE LOWER('%' || $1 || '%') OR
            LOWER(e.style) LIKE LOWER('%' || $1 || '%') OR
            EXISTS (
              SELECT 1 FROM event_teachers et 
              JOIN teachers t ON et.teacher_id = t.id 
              WHERE et.event_id = e.id 
              AND LOWER(t.name) LIKE LOWER('%' || $1 || '%')
            ) OR
            EXISTS (
              SELECT 1 FROM event_musicians em 
              JOIN musicians m ON em.musician_id = m.id 
              WHERE em.event_id = e.id 
              AND LOWER(m.name) LIKE LOWER('%' || $1 || '%')
            )
          )
        `

        searchRankCase = `
          CASE 
            WHEN LOWER(e.name) = LOWER($1) THEN 100.0
            WHEN LOWER(e.name) LIKE LOWER($1 || '%') THEN 80.0
            WHEN EXISTS (
              SELECT 1 FROM event_teachers et 
              JOIN teachers t ON et.teacher_id = t.id 
              WHERE et.event_id = e.id 
              AND LOWER(t.name) = LOWER($1)
            ) THEN 90.0
            WHEN EXISTS (
              SELECT 1 FROM event_teachers et 
              JOIN teachers t ON et.teacher_id = t.id 
              WHERE et.event_id = e.id 
              AND LOWER(t.name) LIKE LOWER('%' || $1 || '%')
            ) THEN 70.0
            WHEN EXISTS (
              SELECT 1 FROM event_musicians em 
              JOIN musicians m ON em.musician_id = m.id 
              WHERE em.event_id = e.id 
              AND LOWER(m.name) = LOWER($1)
            ) THEN 85.0
            WHEN EXISTS (
              SELECT 1 FROM event_musicians em 
              JOIN musicians m ON em.musician_id = m.id 
              WHERE em.event_id = e.id 
              AND LOWER(m.name) LIKE LOWER('%' || $1 || '%')
            ) THEN 65.0
            WHEN LOWER(e.name) LIKE LOWER('%' || $1 || '%') THEN 60.0
            WHEN LOWER(e.description) LIKE LOWER('%' || $1 || '%') THEN 40.0
            WHEN LOWER(e.city) LIKE LOWER('%' || $1 || '%') THEN 30.0
            WHEN LOWER(e.country) LIKE LOWER('%' || $1 || '%') THEN 20.0
            WHEN LOWER(e.style) LIKE LOWER('%' || $1 || '%') THEN 25.0
            ELSE 0.0
          END
        `

        if (sortBy === 'relevance') {
          orderByClause = `ORDER BY (${searchRankCase}) DESC, e.from_date ASC`
        } else if (sortBy === 'date') {
          orderByClause = `ORDER BY e.from_date ${sortOrder === 'desc' ? 'DESC' : 'ASC'}`
        }
      }

      // Add city filter
      if (city) {
        whereClause = whereClause
          ? whereClause.replace('WHERE (', 'WHERE (') +
            ` AND LOWER(e.city) LIKE LOWER('%' || $${query ? 2 : 1} || '%')`
          : `WHERE LOWER(e.city) LIKE LOWER('%' || $1 || '%')`
      }

      // Add country filter
      if (country) {
        const paramNum = (query ? 1 : 0) + (city ? 1 : 0) + 1
        whereClause = whereClause
          ? whereClause + ` AND LOWER(e.country) LIKE LOWER('%' || $${paramNum} || '%')`
          : `WHERE LOWER(e.country) LIKE LOWER('%' || $1 || '%')`
      }

      // Get total count - use template literals for better compatibility
      let totalResult
      if (teachers.length > 0 || musicians.length > 0) {
        // Direct query for teacher/musician filters
        console.log('Using direct teacher/musician filter count')
        const countQuery = `SELECT COUNT(*) as count FROM events e ${whereClause}`
        totalResult = await db.$queryRawUnsafe(countQuery)
      } else if (query && !city && !country) {
        console.log('Using template literal query for:', query)
        totalResult = await db.$queryRaw`
          SELECT COUNT(*) as count FROM events e 
          WHERE (
            LOWER(e.name) LIKE LOWER('%' || ${query} || '%') OR
            LOWER(e.description) LIKE LOWER('%' || ${query} || '%') OR
            LOWER(e.city) LIKE LOWER('%' || ${query} || '%') OR
            LOWER(e.country) LIKE LOWER('%' || ${query} || '%') OR
            LOWER(e.style) LIKE LOWER('%' || ${query} || '%') OR
            EXISTS (
              SELECT 1 FROM event_teachers et 
              JOIN teachers t ON et.teacher_id = t.id 
              WHERE et.event_id = e.id 
              AND LOWER(t.name) LIKE LOWER('%' || ${query} || '%')
            ) OR
            EXISTS (
              SELECT 1 FROM event_musicians em 
              JOIN musicians m ON em.musician_id = m.id 
              WHERE em.event_id = e.id 
              AND LOWER(m.name) LIKE LOWER('%' || ${query} || '%')
            )
          )
        `
      } else {
        // Fallback to unsafe query for complex cases
        const countQuery = `SELECT COUNT(*) as count FROM events e ${whereClause}`
        totalResult = await db.$queryRawUnsafe(
          countQuery,
          ...(query ? [query] : []),
          ...(city ? [city] : []),
          ...(country ? [country] : [])
        )
      }

      const total = Number(totalResult[0].count)

      // Get events if there are results
      let searchResults = []
      if (total > 0) {
        if (teachers.length > 0 || musicians.length > 0) {
          // Direct query for teacher/musician filters
          console.log('Using direct teacher/musician filter query')
          const eventsQuery = `
            SELECT 
              e.id, e.name, e.description, e.from_date, e.to_date,
              e.city, e.country, e.website, e.style, e.image_url,
              e.ai_quality_score, e.ai_completeness_score, e.extraction_method,
              e.created_at, e.updated_at,
              ${searchRankCase} as search_rank
            FROM events e
            ${whereClause}
            ${orderByClause}
            LIMIT ${limit} OFFSET ${skip}
          `
          
          searchResults = await db.$queryRawUnsafe(eventsQuery)
        } else if (query && !city && !country) {
          // Use template literals for simple query case
          searchResults = await db.$queryRaw`
            SELECT 
              e.id, e.name, e.description, e.from_date, e.to_date,
              e.city, e.country, e.website, e.style, e.image_url,
              e.ai_quality_score, e.ai_completeness_score, e.extraction_method,
              e.created_at, e.updated_at,
              CASE 
                WHEN LOWER(e.name) = LOWER(${query}) THEN 100.0
                WHEN LOWER(e.name) LIKE LOWER(${query} || '%') THEN 80.0
                WHEN EXISTS (
                  SELECT 1 FROM event_teachers et 
                  JOIN teachers t ON et.teacher_id = t.id 
                  WHERE et.event_id = e.id 
                  AND LOWER(t.name) = LOWER(${query})
                ) THEN 90.0
                WHEN EXISTS (
                  SELECT 1 FROM event_teachers et 
                  JOIN teachers t ON et.teacher_id = t.id 
                  WHERE et.event_id = e.id 
                  AND LOWER(t.name) LIKE LOWER('%' || ${query} || '%')
                ) THEN 70.0
                WHEN EXISTS (
                  SELECT 1 FROM event_musicians em 
                  JOIN musicians m ON em.musician_id = m.id 
                  WHERE em.event_id = e.id 
                  AND LOWER(m.name) = LOWER(${query})
                ) THEN 85.0
                WHEN EXISTS (
                  SELECT 1 FROM event_musicians em 
                  JOIN musicians m ON em.musician_id = m.id 
                  WHERE em.event_id = e.id 
                  AND LOWER(m.name) LIKE LOWER('%' || ${query} || '%')
                ) THEN 65.0
                WHEN LOWER(e.name) LIKE LOWER('%' || ${query} || '%') THEN 60.0
                WHEN LOWER(e.description) LIKE LOWER('%' || ${query} || '%') THEN 40.0
                WHEN LOWER(e.city) LIKE LOWER('%' || ${query} || '%') THEN 30.0
                WHEN LOWER(e.country) LIKE LOWER('%' || ${query} || '%') THEN 20.0
                WHEN LOWER(e.style) LIKE LOWER('%' || ${query} || '%') THEN 25.0
                ELSE 0.0
              END as search_rank
            FROM events e
            WHERE (
              LOWER(e.name) LIKE LOWER('%' || ${query} || '%') OR
              LOWER(e.description) LIKE LOWER('%' || ${query} || '%') OR
              LOWER(e.city) LIKE LOWER('%' || ${query} || '%') OR
              LOWER(e.country) LIKE LOWER('%' || ${query} || '%') OR
              LOWER(e.style) LIKE LOWER('%' || ${query} || '%') OR
              EXISTS (
                SELECT 1 FROM event_teachers et 
                JOIN teachers t ON et.teacher_id = t.id 
                WHERE et.event_id = e.id 
                AND LOWER(t.name) LIKE LOWER('%' || ${query} || '%')
              ) OR
              EXISTS (
                SELECT 1 FROM event_musicians em 
                JOIN musicians m ON em.musician_id = m.id 
                WHERE em.event_id = e.id 
                AND LOWER(m.name) LIKE LOWER('%' || ${query} || '%')
              )
            )
            ORDER BY search_rank DESC, e.from_date ASC
            LIMIT ${limit} OFFSET ${skip}
          `
        } else {
          // Fallback to unsafe query for complex cases
          const eventsQuery = `
            SELECT 
              e.id, e.name, e.description, e.from_date, e.to_date,
              e.city, e.country, e.website, e.style, e.image_url,
              e.ai_quality_score, e.ai_completeness_score, e.extraction_method,
              e.created_at, e.updated_at,
              (${searchRankCase}) as search_rank
            FROM events e
            ${whereClause}
            ${orderByClause}
            LIMIT ${limit} OFFSET ${skip}
          `

          searchResults = await db.$queryRawUnsafe(
            eventsQuery,
            ...(query ? [query] : []),
            ...(city ? [city] : []),
            ...(country ? [country] : [])
          )
        }
        console.log(`Enhanced search found ${searchResults.length} events (total: ${total})`)
      }

      // If no results, return early
      if (total === 0) {
        return Response.json({
          data: {
            events: [],
            pagination: {
              page,
              limit,
              total: 0,
              totalPages: 0,
              hasNext: false,
              hasPrev: false,
            },
            searchMeta: {
              query,
              sorting: { sortBy, sortOrder },
              filters: { city, country },
              totalMatches: 0,
              searchType: 'optimized',
            },
          },
          success: true,
          timestamp: new Date().toISOString(),
        })
      }

      // Get related data efficiently for each event
      const events = await Promise.all(
        searchResults.map(async event => {
          const [venues, prices] = await Promise.all([
            db.externalEventVenue.findMany({
              where: {
                event_id: event.id,
              },
              select: {
                name: true,
                address: true,
              },
              take: 1,
            }),
            db.event_prices.findMany({
              where: { event_id: event.id },
              select: {
                amount: true,
                currency: true,
                type: true,
              },
              take: 1,
            }),
          ])

          return {
            ...event,
            venues: venues,
            event_prices: prices,
          }
        })
      )

      // Transform to expected format
      const transformedEvents = events.map(event => {
        const primaryVenue = event.venues?.[0]

        return {
          id: event.id.toString(),
          name: event.name,
          description: event.description,
          startDate: event.from_date,
          endDate: event.to_date,
          country: event.country,
          city: event.city,
          website: event.website,
          style: event.style,
          imageUrl: event.image_url?.startsWith('/uploads/')
            ? `https://tqvvseagpkmdnsiuwabv.supabase.co/storage/v1/object/public/bluesbucket/${event.image_url.replace('/uploads/', '')}`
            : event.image_url,
          aiQualityScore: event.ai_quality_score,
          aiCompletenessScore: event.ai_completeness_score,
          extractionMethod: event.extraction_method,
          createdAt: event.created_at,
          updatedAt: event.updated_at,
          searchRank: event.search_rank, // Include search rank from optimized function
          venue: primaryVenue
            ? {
                name: primaryVenue.name,
                address: primaryVenue.address,
                city: event.city,
                country: event.country,
              }
            : null,
          pricing:
            event.event_prices?.map(price => ({
              price: Number(price.amount),
              currency: price.currency,
              type: price.type,
            })) || [],
        }
      })

      const totalPages = Math.ceil(total / limit)

      return Response.json({
        data: {
          events: transformedEvents,
          pagination: {
            page,
            limit,
            total,
            totalPages,
            hasNext: page < totalPages,
            hasPrev: page > 1,
          },
          searchMeta: {
            query,
            sorting: { sortBy, sortOrder },
            filters: { city, country },
            totalMatches: total,
            searchType: 'optimized',
          },
        },
        success: true,
        timestamp: new Date().toISOString(),
      })
    } catch (optimizedSearchError) {
      console.log(
        'Optimized search failed, falling back to standard search:',
        optimizedSearchError.message
      )

      // Fallback to original Prisma search
      const where: any = {}

      // Text search across multiple fields
      if (query) {
        where.OR = [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { city: { contains: query, mode: 'insensitive' } },
          { country: { contains: query, mode: 'insensitive' } },
          { style: { contains: query, mode: 'insensitive' } },
        ]
      }

      // Filter by city
      if (city) {
        where.city = { contains: city, mode: 'insensitive' }
      }

      // Filter by country
      if (country) {
        where.country = { contains: country, mode: 'insensitive' }
      }

      // Build order by clause
      let orderBy: any = { from_date: 'asc' } // Default sort by date
      if (sortBy === 'date') {
        orderBy = { from_date: sortOrder as 'asc' | 'desc' }
      } else if (sortBy === 'popularity') {
        orderBy = { name: sortOrder as 'asc' | 'desc' } // Simple name sort for now
      }

      const total = await db.event.count({ where })

      // If no results, return early
      if (total === 0) {
        return Response.json({
          data: {
            events: [],
            pagination: {
              page,
              limit,
              total: 0,
              totalPages: 0,
              hasNext: false,
              hasPrev: false,
            },
            searchMeta: {
              query,
              sorting: { sortBy, sortOrder },
              filters: { city, country },
              totalMatches: 0,
              searchType: 'fallback',
            },
          },
          success: true,
          timestamp: new Date().toISOString(),
        })
      }

      const events = await db.event.findMany({
        where,
        take: limit,
        skip: skip,
        select: {
          id: true,
          name: true,
          description: true,
          from_date: true,
          to_date: true,
          country: true,
          city: true,
          website: true,
          style: true,
          image_url: true,
          venues: {
            select: {
              name: true,
              address: true,
            },
            take: 1,
          },
          event_prices: {
            select: {
              amount: true,
              currency: true,
              type: true,
            },
            take: 1,
          },
        },
        orderBy,
      })

      // Transform fallback results
      const transformedFallbackEvents = events.map(event => {
        const primaryVenue = event.venues?.[0]

        return {
          id: event.id.toString(),
          name: event.name,
          description: event.description,
          startDate: event.from_date,
          endDate: event.to_date,
          country: event.country,
          city: event.city,
          website: event.website,
          style: event.style,
          imageUrl: event.image_url?.startsWith('/uploads/')
            ? `https://tqvvseagpkmdnsiuwabv.supabase.co/storage/v1/object/public/bluesbucket/${event.image_url.replace('/uploads/', '')}`
            : event.image_url,
          aiQualityScore: event.ai_quality_score,
          aiCompletenessScore: event.ai_completeness_score,
          extractionMethod: event.extraction_method,
          createdAt: event.created_at,
          updatedAt: event.updated_at,
          venue: primaryVenue
            ? {
                name: primaryVenue.name,
                address: primaryVenue.address,
                city: event.city,
                country: event.country,
              }
            : null,
          pricing:
            event.event_prices?.map(price => ({
              price: Number(price.amount),
              currency: price.currency,
              type: price.type,
            })) || [],
        }
      })

      const totalPages = Math.ceil(total / limit)

      return Response.json({
        data: {
          events: transformedFallbackEvents,
          pagination: {
            page,
            limit,
            total,
            totalPages,
            hasNext: page < totalPages,
            hasPrev: page > 1,
          },
          searchMeta: {
            query,
            sorting: { sortBy, sortOrder },
            filters: { city, country },
            totalMatches: total,
            searchType: 'fallback',
          },
        },
        success: true,
        timestamp: new Date().toISOString(),
      })
    }
  } catch (error) {
    console.error('Search events error:', error)

    // Handle specific database connection errors
    if (error instanceof Error) {
      if (error.message.includes('connection pool') || error.message.includes('timeout')) {
        return Response.json(
          {
            success: false,
            error: 'Database is temporarily unavailable. Please try again in a moment.',
          },
          { status: 503 }
        )
      }

      if (error.message.includes('Database query timeout')) {
        return Response.json(
          {
            success: false,
            error: 'Search request timed out. Please try with more specific filters.',
          },
          { status: 408 }
        )
      }
    }

    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Search failed',
      },
      { status: 500 }
    )
  } finally {
    // Don't disconnect in serverless environments - let connection pooling handle it
    if (process.env.NODE_ENV === 'development') {
      await db.$disconnect().catch(() => {}) // Silent fail for cleanup
    }
  }
}
