import { NextRequest } from 'next/server'
import { apiResponse } from '@/lib/api/utils'

export async function GET(request: NextRequest) {
  // Mock data for testing
  const mockEvents = [
    {
      id: "1",
      name: "Chicago Blues Festival 2024",
      description: "The premier blues festival in Chicago featuring legendary artists",
      startDate: new Date("2024-06-15"),
      endDate: new Date("2024-06-17"),
      country: "USA",
      city: "Chicago",
      website: "https://chicagoblues.com",
      style: "Blues",
      aiQualityScore: 95,
      aiCompletenessScore: 88,
      extractionMethod: "web_scraping",
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
      venue: {
        name: "Grant Park",
        address: "337 E Randolph St",
        city: "Chicago",
        country: "USA"
      },
      pricing: [
        { price: 75, currency: "USD", type: "early_bird" },
        { price: 95, currency: "USD", type: "regular" }
      ]
    },
    {
      id: "2", 
      name: "NYC Blues Weekend",
      description: "A weekend of amazing blues music and dance in New York",
      startDate: new Date("2024-07-20"),
      endDate: new Date("2024-07-22"),
      country: "USA",
      city: "New York",
      website: "https://nycblues.com",
      style: "Blues",
      aiQualityScore: 90,
      aiCompletenessScore: 85,
      extractionMethod: "api_import",
      createdAt: new Date("2024-01-15"),
      updatedAt: new Date("2024-01-15"),
      venue: {
        name: "Lincoln Center",
        address: "10 Lincoln Center Plaza",
        city: "New York",
        country: "USA"
      },
      pricing: [
        { price: 85, currency: "USD", type: "weekend_pass" }
      ]
    },
    {
      id: "3",
      name: "LA Blues Intensive",
      description: "Intensive blues workshops with world-renowned instructors",
      startDate: new Date("2024-08-10"),
      endDate: new Date("2024-08-12"),
      country: "USA", 
      city: "Los Angeles",
      website: "https://lablues.com",
      style: "Blues",
      aiQualityScore: 92,
      aiCompletenessScore: 90,
      extractionMethod: "manual_entry",
      createdAt: new Date("2024-02-01"),
      updatedAt: new Date("2024-02-01"),
      venue: {
        name: "Hollywood Dance Center", 
        address: "1234 Hollywood Blvd",
        city: "Los Angeles",
        country: "USA"
      },
      pricing: [
        { price: 120, currency: "USD", type: "intensive_pass" },
        { price: 45, currency: "USD", type: "single_day" }
      ]
    }
  ]

  return apiResponse({
    events: mockEvents,
    pagination: {
      page: 1,
      limit: 10,
      total: 3,
      totalPages: 1,
      hasNext: false,
      hasPrev: false
    }
  })
}