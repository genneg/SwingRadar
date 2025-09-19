import { NextRequest } from 'next/server'
import { GET } from '@/app/api/events/route'
import { mockEvent } from '../../test-utils/test-utils'

// Mock the database
jest.mock('@festival-scout/database', () => ({
  db: {
    event: {
      findMany: jest.fn(),
      count: jest.fn(),
    },
  },
}))

import { db } from '@festival-scout/database'

describe('/api/events', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns events successfully', async () => {
    const mockEvents = [mockEvent]
    ;(db.event.findMany as jest.Mock).mockResolvedValue(mockEvents)
    ;(db.event.count as jest.Mock).mockResolvedValue(1)

    const request = new NextRequest('http://localhost:3000/api/events')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.events).toEqual(mockEvents)
    expect(data.total).toBe(1)
    expect(data.page).toBe(1)
    expect(data.limit).toBe(20)
  })

  it('handles pagination parameters', async () => {
    const mockEvents = [mockEvent]
    ;(db.event.findMany as jest.Mock).mockResolvedValue(mockEvents)
    ;(db.event.count as jest.Mock).mockResolvedValue(1)

    const request = new NextRequest('http://localhost:3000/api/events?page=2&limit=10')
    const response = await GET(request)
    const data = await response.json()

    expect(db.event.findMany).toHaveBeenCalledWith({
      skip: 10,
      take: 10,
      include: {
        venue: true,
        teachers: true,
        musicians: true,
      },
      orderBy: {
        startDate: 'asc',
      },
    })

    expect(data.page).toBe(2)
    expect(data.limit).toBe(10)
  })

  it('handles search parameter', async () => {
    const mockEvents = [mockEvent]
    ;(db.event.findMany as jest.Mock).mockResolvedValue(mockEvents)
    ;(db.event.count as jest.Mock).mockResolvedValue(1)

    const request = new NextRequest('http://localhost:3000/api/events?search=blues')
    const response = await GET(request)

    expect(db.event.findMany).toHaveBeenCalledWith({
      skip: 0,
      take: 20,
      where: {
        OR: [
          { name: { contains: 'blues', mode: 'insensitive' } },
          { description: { contains: 'blues', mode: 'insensitive' } },
          { venue: { name: { contains: 'blues', mode: 'insensitive' } } },
        ],
      },
      include: {
        venue: true,
        teachers: true,
        musicians: true,
      },
      orderBy: {
        startDate: 'asc',
      },
    })
  })

  it('handles date filtering', async () => {
    const mockEvents = [mockEvent]
    ;(db.event.findMany as jest.Mock).mockResolvedValue(mockEvents)
    ;(db.event.count as jest.Mock).mockResolvedValue(1)

    const startDate = '2024-06-01'
    const endDate = '2024-06-30'
    const request = new NextRequest(`http://localhost:3000/api/events?startDate=${startDate}&endDate=${endDate}`)
    const response = await GET(request)

    expect(db.event.findMany).toHaveBeenCalledWith({
      skip: 0,
      take: 20,
      where: {
        startDate: {
          gte: new Date(startDate),
        },
        endDate: {
          lte: new Date(endDate),
        },
      },
      include: {
        venue: true,
        teachers: true,
        musicians: true,
      },
      orderBy: {
        startDate: 'asc',
      },
    })
  })

  it('handles location filtering', async () => {
    const mockEvents = [mockEvent]
    ;(db.event.findMany as jest.Mock).mockResolvedValue(mockEvents)
    ;(db.event.count as jest.Mock).mockResolvedValue(1)

    const request = new NextRequest('http://localhost:3000/api/events?location=New York')
    const response = await GET(request)

    expect(db.event.findMany).toHaveBeenCalledWith({
      skip: 0,
      take: 20,
      where: {
        venue: {
          address: {
            contains: 'New York',
            mode: 'insensitive',
          },
        },
      },
      include: {
        venue: true,
        teachers: true,
        musicians: true,
      },
      orderBy: {
        startDate: 'asc',
      },
    })
  })

  it('handles database errors gracefully', async () => {
    ;(db.event.findMany as jest.Mock).mockRejectedValue(new Error('Database error'))

    const request = new NextRequest('http://localhost:3000/api/events')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBe('Internal server error')
  })

  it('validates pagination parameters', async () => {
    const mockEvents = [mockEvent]
    ;(db.event.findMany as jest.Mock).mockResolvedValue(mockEvents)
    ;(db.event.count as jest.Mock).mockResolvedValue(1)

    // Test invalid page number
    const request = new NextRequest('http://localhost:3000/api/events?page=0')
    const response = await GET(request)

    expect(db.event.findMany).toHaveBeenCalledWith({
      skip: 0,
      take: 20,
      include: {
        venue: true,
        teachers: true,
        musicians: true,
      },
      orderBy: {
        startDate: 'asc',
      },
    })
  })

  it('limits maximum page size', async () => {
    const mockEvents = [mockEvent]
    ;(db.event.findMany as jest.Mock).mockResolvedValue(mockEvents)
    ;(db.event.count as jest.Mock).mockResolvedValue(1)

    // Test limit exceeding maximum
    const request = new NextRequest('http://localhost:3000/api/events?limit=1000')
    const response = await GET(request)
    const data = await response.json()

    expect(data.limit).toBe(100) // Should be capped at 100
  })

  it('handles empty results', async () => {
    ;(db.event.findMany as jest.Mock).mockResolvedValue([])
    ;(db.event.count as jest.Mock).mockResolvedValue(0)

    const request = new NextRequest('http://localhost:3000/api/events')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.events).toEqual([])
    expect(data.total).toBe(0)
  })
})