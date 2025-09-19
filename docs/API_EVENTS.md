# Events API Documentation

## Overview

The Events API provides endpoints for retrieving festival and event information. All endpoints return JSON responses with a consistent structure.

## Base URL

```
/api/events
```

## Response Format

All API responses follow this structure:

```json
{
  "data": any,
  "success": boolean,
  "message": string | undefined,
  "error": string | undefined,
  "timestamp": string
}
```

## Endpoints

### 1. Get Events List

Get a paginated list of events with optional filtering.

```http
GET /api/events
```

#### Query Parameters

| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| `page` | number | Page number for pagination | 1 |
| `limit` | number | Number of items per page (max 100) | 10 |
| `search` | string | Search in event name, description | - |
| `city` | string | Filter by venue city | - |
| `country` | string | Filter by venue country | - |
| `startDate` | string | Filter events starting from this date (ISO 8601) | - |
| `endDate` | string | Filter events ending before this date (ISO 8601) | - |
| `status` | string | Filter by event status | - |
| `featured` | boolean | Filter featured events | - |
| `teachers` | string | Comma-separated teacher IDs | - |
| `musicians` | string | Comma-separated musician IDs | - |

#### Event Status Values

- `DRAFT` - Event is not published yet
- `PUBLISHED` - Event is live and visible
- `CANCELLED` - Event has been cancelled
- `COMPLETED` - Event has finished
- `ARCHIVED` - Event is archived

#### Example Request

```http
GET /api/events?page=1&limit=20&city=New%20York&featured=true&startDate=2024-01-01
```

#### Example Response

```json
{
  "data": {
    "events": [
      {
        "id": "clx123abc",
        "name": "NYC Blues Festival 2024",
        "slug": "nyc-blues-festival-2024",
        "description": "Annual blues dance festival in the heart of NYC",
        "shortDesc": "Annual blues dance festival",
        "startDate": "2024-06-15T18:00:00Z",
        "endDate": "2024-06-17T23:00:00Z",
        "registrationDeadline": "2024-06-01T23:59:59Z",
        "status": "PUBLISHED",
        "featured": true,
        "capacity": 200,
        "website": "https://nycbluesfestival.com",
        "registrationUrl": "https://nycbluesfestival.com/register",
        "imageUrl": "https://cdn.example.com/event-image.jpg",
        "venue": {
          "id": "venue123",
          "name": "Dance Studio NYC",
          "address": "123 Main St",
          "city": "New York",
          "state": "NY",
          "country": "USA",
          "latitude": 40.7128,
          "longitude": -74.0060
        },
        "teachers": [
          {
            "id": "teacher123",
            "name": "Jane Doe",
            "slug": "jane-doe",
            "bio": "Professional blues dance instructor",
            "avatar": "https://cdn.example.com/jane-avatar.jpg",
            "specialties": ["Blues", "Slow Dance"],
            "role": "Lead Instructor",
            "workshops": ["Fundamentals", "Advanced Technique"],
            "level": "All Levels"
          }
        ],
        "musicians": [
          {
            "id": "musician123",
            "name": "John Smith Band",
            "slug": "john-smith-band",
            "bio": "Traditional blues band from Chicago",
            "avatar": "https://cdn.example.com/band-avatar.jpg",
            "genres": ["Traditional Blues", "Chicago Blues"],
            "role": "Headliner",
            "setTimes": ["Saturday 9:00 PM", "Sunday 7:00 PM"]
          }
        ],
        "prices": [
          {
            "id": "price123",
            "type": "EARLY_BIRD",
            "amount": 120.00,
            "currency": "USD",
            "deadline": "2024-05-15T23:59:59Z",
            "description": "Early bird pricing until May 15",
            "available": true
          }
        ],
        "tags": ["blues", "dance", "weekend", "nyc"],
        "stats": {
          "saves": 45,
          "attendances": 120,
          "reviews": 8
        },
        "createdAt": "2024-01-15T10:00:00Z",
        "updatedAt": "2024-01-20T14:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "totalPages": 8,
      "hasNext": true,
      "hasPrev": false
    }
  },
  "success": true,
  "timestamp": "2024-01-25T12:00:00Z"
}
```

### 2. Get Event Details

Get detailed information about a specific event.

```http
GET /api/events/{id}
```

#### Path Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Event ID or slug |

#### Example Request

```http
GET /api/events/clx123abc
```

or

```http
GET /api/events/nyc-blues-festival-2024
```

#### Example Response

```json
{
  "data": {
    "id": "clx123abc",
    "name": "NYC Blues Festival 2024",
    "slug": "nyc-blues-festival-2024",
    "description": "Annual blues dance festival in the heart of NYC...",
    "shortDesc": "Annual blues dance festival",
    "startDate": "2024-06-15T18:00:00Z",
    "endDate": "2024-06-17T23:00:00Z",
    "registrationDeadline": "2024-06-01T23:59:59Z",
    "publicationDate": "2024-01-15T10:00:00Z",
    "status": "PUBLISHED",
    "featured": true,
    "capacity": 200,
    "website": "https://nycbluesfestival.com",
    "registrationUrl": "https://nycbluesfestival.com/register",
    "imageUrl": "https://cdn.example.com/event-image.jpg",
    "sourceUrl": "https://facebook.com/events/12345",
    "scrapedAt": "2024-01-15T09:00:00Z",
    "verified": true,
    "venue": {
      "id": "venue123",
      "name": "Dance Studio NYC",
      "address": "123 Main St",
      "city": "New York",
      "state": "NY",
      "country": "USA",
      "postalCode": "10001",
      "latitude": 40.7128,
      "longitude": -74.0060,
      "website": "https://dancestudionyc.com",
      "phone": "+1-555-123-4567",
      "email": "info@dancestudionyc.com",
      "capacity": 250,
      "description": "Premier dance studio in Manhattan",
      "hasParking": true,
      "hasAirCon": true,
      "hasWifi": true,
      "wheelchairAccess": true
    },
    "teachers": [
      {
        "id": "teacher123",
        "name": "Jane Doe",
        "slug": "jane-doe",
        "bio": "Professional blues dance instructor with 15 years experience",
        "avatar": "https://cdn.example.com/jane-avatar.jpg",
        "verified": true,
        "website": "https://janedoe.com",
        "email": "jane@janedoe.com",
        "specialties": ["Blues", "Slow Dance", "Technique"],
        "socialMedia": {
          "facebook": "https://facebook.com/janedoe",
          "instagram": "https://instagram.com/janedoe",
          "youtube": "https://youtube.com/janedoe"
        },
        "followerCount": 1250,
        "eventCount": 45,
        "role": "Lead Instructor",
        "workshops": ["Fundamentals", "Advanced Technique", "Performance"],
        "level": "All Levels"
      }
    ],
    "musicians": [
      {
        "id": "musician123",
        "name": "John Smith Band",
        "slug": "john-smith-band",
        "bio": "Traditional blues band from Chicago with authentic sound",
        "avatar": "https://cdn.example.com/band-avatar.jpg",
        "verified": true,
        "website": "https://johnsmithband.com",
        "instruments": ["Guitar", "Harmonica", "Bass", "Drums"],
        "genres": ["Traditional Blues", "Chicago Blues"],
        "socialMedia": {
          "facebook": "https://facebook.com/johnsmithband",
          "spotify": "https://spotify.com/artist/johnsmith",
          "bandcamp": "https://johnsmithband.bandcamp.com"
        },
        "followerCount": 890,
        "eventCount": 32,
        "role": "Headliner",
        "setTimes": ["Saturday 9:00 PM", "Sunday 7:00 PM"]
      }
    ],
    "prices": [
      {
        "id": "price123",
        "type": "EARLY_BIRD",
        "amount": 120.00,
        "currency": "USD",
        "deadline": "2024-05-15T23:59:59Z",
        "description": "Early bird pricing until May 15",
        "available": true
      },
      {
        "id": "price124",
        "type": "REGULAR",
        "amount": 150.00,
        "currency": "USD",
        "deadline": "2024-06-01T23:59:59Z",
        "description": "Regular pricing",
        "available": true
      }
    ],
    "tags": ["blues", "dance", "weekend", "nyc"],
    "stats": {
      "saves": 45,
      "attendances": {
        "total": 120,
        "interested": 30,
        "going": 85,
        "maybe": 5
      },
      "reviews": {
        "total": 8,
        "averageRating": 4.6
      }
    },
    "reviews": [
      {
        "id": "review123",
        "rating": 5,
        "review": "Amazing festival! Great teachers and music.",
        "createdAt": "2024-01-20T15:30:00Z",
        "user": {
          "name": "Sarah Johnson",
          "avatar": "https://cdn.example.com/sarah-avatar.jpg"
        }
      }
    ],
    "createdBy": {
      "id": "user123",
      "name": "Festival Admin",
      "email": "admin@nycbluesfestival.com"
    },
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-01-20T14:30:00Z"
  },
  "success": true,
  "timestamp": "2024-01-25T12:00:00Z"
}
```

## Error Responses

### 400 Bad Request

```json
{
  "data": null,
  "success": false,
  "error": "Invalid query parameters: page must be a positive number",
  "timestamp": "2024-01-25T12:00:00Z"
}
```

### 404 Not Found

```json
{
  "data": null,
  "success": false,
  "error": "Event not found",
  "timestamp": "2024-01-25T12:00:00Z"
}
```

### 500 Internal Server Error

```json
{
  "data": null,
  "success": false,
  "error": "Internal server error",
  "timestamp": "2024-01-25T12:00:00Z"
}
```

## Price Types

- `EARLY_BIRD` - Early bird pricing
- `REGULAR` - Regular pricing  
- `LATE` - Late registration pricing
- `STUDENT` - Student discount pricing
- `LOCAL` - Local resident pricing
- `VIP` - VIP access pricing
- `DONATION` - Donation-based pricing

## Filtering Examples

### Filter by Date Range

```http
GET /api/events?startDate=2024-06-01&endDate=2024-08-31
```

### Filter by Location

```http
GET /api/events?city=Chicago&country=USA
```

### Filter by Teachers

```http
GET /api/events?teachers=teacher123,teacher456
```

### Search with Pagination

```http
GET /api/events?search=blues%20festival&page=2&limit=50
```

### Featured Events Only

```http
GET /api/events?featured=true&status=PUBLISHED
```

## Rate Limiting

The API implements rate limiting to prevent abuse:

- 100 requests per minute per IP
- 1000 requests per hour per authenticated user

## Authentication

These endpoints are public and do not require authentication. However, some extended features may require authentication in future versions.

## Caching

Responses are cached for optimal performance:

- Events list: 5 minutes
- Event details: 15 minutes
- Search results: 2 minutes