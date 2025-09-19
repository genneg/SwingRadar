# Teachers & Musicians API Documentation

## Overview

This document describes the API endpoints for managing teachers and musicians in the Blues Dance Festival Finder application.

## Base URL

All API endpoints are prefixed with `/api/`

## Authentication

Currently, all endpoints support public access for read operations. Write operations (POST, PUT, DELETE) require admin authentication (to be implemented).

## Response Format

All API responses follow this standard format:

```json
{
  "data": {...},
  "success": true,
  "message": "Success message",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

Error responses:

```json
{
  "data": null,
  "success": false,
  "error": "Error message",
  "details": {...},
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## Teachers API

### GET /api/teachers

Get list of teachers with optional filtering.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)
- `search` (optional): Search term for name and bio
- `specialties` (optional): Comma-separated list of specialties
- `hasUpcomingEvents` (optional): Boolean to filter teachers with upcoming events

**Example Request:**
```
GET /api/teachers?page=1&limit=20&search=blues&specialties=Connection,Musicality
```

**Example Response:**
```json
{
  "data": {
    "teachers": [
      {
        "id": "1",
        "name": "Alice Johnson",
        "bio": "Experienced blues dance instructor specializing in authentic connection and musicality",
        "specialties": ["Blues", "Connection", "Musicality"],
        "website": "https://alicejohnsonblues.com",
        "socialLinks": {
          "facebook": "https://facebook.com/alicejohnsonblues",
          "instagram": "https://instagram.com/alicejohnsonblues"
        },
        "followers": [],
        "festivals": []
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 1,
      "totalPages": 1,
      "hasNext": false,
      "hasPrev": false
    }
  },
  "success": true,
  "message": "Teachers retrieved successfully",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### GET /api/teachers/[id]

Get specific teacher with event history.

**Path Parameters:**
- `id`: Teacher ID

**Query Parameters:**
- `includeEvents` (optional): Boolean to include associated events (default: true)
- `eventsPage` (optional): Page number for events (default: 1)
- `eventsLimit` (optional): Items per page for events (default: 10, max: 50)
- `upcomingOnly` (optional): Boolean to show only upcoming events (default: false)

**Example Request:**
```
GET /api/teachers/1?includeEvents=true&eventsPage=1&eventsLimit=5&upcomingOnly=true
```

**Example Response:**
```json
{
  "data": {
    "teacher": {
      "id": "1",
      "name": "Alice Johnson",
      "bio": "Experienced blues dance instructor specializing in authentic connection and musicality. Alice has been teaching blues dance for over 12 years and has performed at major festivals across Europe and North America.",
      "specialties": ["Blues", "Connection", "Musicality", "Solo Jazz"],
      "website": "https://alicejohnsonblues.com",
      "socialLinks": {
        "facebook": "https://facebook.com/alicejohnsonblues",
        "instagram": "https://instagram.com/alicejohnsonblues",
        "youtube": "https://youtube.com/alicejohnsonblues"
      },
      "followers": [],
      "festivals": []
    },
    "events": [
      {
        "id": "1",
        "name": "Blues & Brews Festival 2024",
        "description": "A weekend of blues music and dance in the heart of the city",
        "startDate": "2024-08-15T00:00:00.000Z",
        "endDate": "2024-08-17T00:00:00.000Z",
        "venue": {
          "id": "1",
          "name": "City Convention Center",
          "address": "123 Main Street",
          "city": "New York",
          "country": "USA"
        }
      }
    ],
    "eventsPagination": {
      "page": 1,
      "limit": 5,
      "total": 1,
      "totalPages": 1,
      "hasNext": false,
      "hasPrev": false
    },
    "stats": {
      "totalEvents": 2,
      "upcomingEvents": 1,
      "totalFollowers": 0
    }
  },
  "success": true,
  "message": "Teacher retrieved successfully",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### POST /api/teachers

Create a new teacher (admin only, not implemented yet).

**Request Body:**
```json
{
  "name": "New Teacher",
  "bio": "Teacher bio",
  "specialties": ["Blues", "Connection"],
  "website": "https://example.com",
  "socialLinks": {
    "facebook": "https://facebook.com/newteacher"
  }
}
```

**Response:**
```json
{
  "data": null,
  "success": false,
  "error": "Teacher creation not implemented yet",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## Musicians API

### GET /api/musicians

Get list of musicians with optional filtering.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)
- `search` (optional): Search term for name and bio
- `genre` (optional): Comma-separated list of genres
- `hasUpcomingEvents` (optional): Boolean to filter musicians with upcoming events

**Example Request:**
```
GET /api/musicians?page=1&limit=20&search=jazz&genre=Blues,Jazz
```

**Example Response:**
```json
{
  "data": {
    "musicians": [
      {
        "id": "2",
        "name": "Diana Jazz Quartet",
        "bio": "Contemporary jazz ensemble specializing in blues-influenced improvisation",
        "genre": ["Jazz", "Blues", "Contemporary"],
        "website": "https://dianajazzquartet.com",
        "socialLinks": {
          "facebook": "https://facebook.com/dianajazzquartet",
          "youtube": "https://youtube.com/dianajazzquartet",
          "spotify": "https://spotify.com/artist/dianajazzquartet"
        },
        "followers": [],
        "festivals": []
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 1,
      "totalPages": 1,
      "hasNext": false,
      "hasPrev": false
    }
  },
  "success": true,
  "message": "Musicians retrieved successfully",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### GET /api/musicians/[id]

Get specific musician with event history.

**Path Parameters:**
- `id`: Musician ID

**Query Parameters:**
- `includeEvents` (optional): Boolean to include associated events (default: true)
- `eventsPage` (optional): Page number for events (default: 1)
- `eventsLimit` (optional): Items per page for events (default: 10, max: 50)
- `upcomingOnly` (optional): Boolean to show only upcoming events (default: false)

**Example Request:**
```
GET /api/musicians/1?includeEvents=true&upcomingOnly=true
```

**Example Response:**
```json
{
  "data": {
    "musician": {
      "id": "1",
      "name": "Charlie Blues Band",
      "bio": "Traditional blues band with over 20 years of experience performing at dance events worldwide. Known for their authentic sound and ability to keep dancers moving all night long.",
      "genre": ["Blues", "Traditional Jazz", "Swing", "Boogie Woogie"],
      "website": "https://charliebluesband.com",
      "socialLinks": {
        "facebook": "https://facebook.com/charliebluesband",
        "instagram": "https://instagram.com/charliebluesband",
        "spotify": "https://spotify.com/artist/charliebluesband",
        "youtube": "https://youtube.com/charliebluesband"
      },
      "followers": [],
      "festivals": []
    },
    "events": [
      {
        "id": "1",
        "name": "Blues & Brews Festival 2024",
        "description": "A weekend of blues music and dance in the heart of the city",
        "startDate": "2024-08-15T00:00:00.000Z",
        "endDate": "2024-08-17T00:00:00.000Z",
        "venue": {
          "id": "1",
          "name": "City Convention Center",
          "address": "123 Main Street",
          "city": "New York",
          "country": "USA"
        }
      }
    ],
    "eventsPagination": {
      "page": 1,
      "limit": 10,
      "total": 1,
      "totalPages": 1,
      "hasNext": false,
      "hasPrev": false
    },
    "stats": {
      "totalEvents": 3,
      "upcomingEvents": 1,
      "totalFollowers": 0
    }
  },
  "success": true,
  "message": "Musician retrieved successfully",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## Search API

### GET /api/search/teachers

Advanced search for teachers.

**Query Parameters:**
- `q` (required): Search query (minimum 2 characters)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 50)
- `specialties` (optional): Comma-separated list of specialties
- `location` (optional): City or country filter
- `hasUpcomingEvents` (optional): Boolean to filter teachers with upcoming events
- `sortBy` (optional): name, relevance, upcoming_events (default: relevance)
- `sortOrder` (optional): asc, desc (default: desc)

**Example Request:**
```
GET /api/search/teachers?q=blues&specialties=Connection&location=New York&sortBy=name&sortOrder=asc
```

**Example Response:**
```json
{
  "data": {
    "teachers": [
      {
        "id": "1",
        "name": "Alice Johnson",
        "bio": "Experienced blues dance instructor specializing in authentic connection and musicality",
        "specialties": ["Blues", "Connection", "Musicality"],
        "website": "https://alicejohnsonblues.com",
        "socialLinks": {
          "facebook": "https://facebook.com/alicejohnsonblues",
          "instagram": "https://instagram.com/alicejohnsonblues"
        },
        "followers": [],
        "festivals": []
      }
    ],
    "searchQuery": "blues",
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 1,
      "totalPages": 1,
      "hasNext": false,
      "hasPrev": false
    },
    "filters": {
      "specialties": ["Connection"],
      "location": "New York",
      "hasUpcomingEvents": false,
      "sortBy": "name",
      "sortOrder": "asc"
    }
  },
  "success": true,
  "message": "Found 1 teachers matching \"blues\"",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### GET /api/search/musicians

Advanced search for musicians.

**Query Parameters:**
- `q` (required): Search query (minimum 2 characters)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 50)
- `genre` (optional): Comma-separated list of genres
- `location` (optional): City or country filter
- `hasUpcomingEvents` (optional): Boolean to filter musicians with upcoming events
- `sortBy` (optional): name, relevance, upcoming_events (default: relevance)
- `sortOrder` (optional): asc, desc (default: desc)

**Example Request:**
```
GET /api/search/musicians?q=jazz&genre=Blues,Jazz&hasUpcomingEvents=true&sortBy=relevance
```

**Example Response:**
```json
{
  "data": {
    "musicians": [
      {
        "id": "2",
        "name": "Diana Jazz Quartet",
        "bio": "Contemporary jazz ensemble specializing in blues-influenced improvisation",
        "genre": ["Jazz", "Blues", "Contemporary"],
        "website": "https://dianajazzquartet.com",
        "socialLinks": {
          "facebook": "https://facebook.com/dianajazzquartet",
          "youtube": "https://youtube.com/dianajazzquartet",
          "spotify": "https://spotify.com/artist/dianajazzquartet"
        },
        "followers": [],
        "festivals": []
      }
    ],
    "searchQuery": "jazz",
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 1,
      "totalPages": 1,
      "hasNext": false,
      "hasPrev": false
    },
    "filters": {
      "genre": ["Blues", "Jazz"],
      "location": null,
      "hasUpcomingEvents": true,
      "sortBy": "relevance",
      "sortOrder": "desc"
    }
  },
  "success": true,
  "message": "Found 1 musicians matching \"jazz\"",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## Error Handling

The API uses standard HTTP status codes:

- `200 OK`: Success
- `400 Bad Request`: Invalid request parameters
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error
- `501 Not Implemented`: Feature not implemented yet

## Rate Limiting

Currently not implemented. Will be added in future versions.

## Future Enhancements

1. **Authentication**: Admin endpoints for creating/updating/deleting teachers and musicians
2. **Real Database**: Replace mock data with actual Prisma database queries
3. **Advanced Search**: Full-text search with PostgreSQL
4. **Caching**: Redis caching for improved performance
5. **Rate Limiting**: API rate limiting for abuse prevention
6. **Pagination Improvements**: Cursor-based pagination for large datasets
7. **Aggregation**: Statistics and analytics endpoints
8. **File Upload**: Support for profile images and media files

## Testing

Use the following curl commands to test the endpoints:

```bash
# Get all teachers
curl "http://localhost:3000/api/teachers"

# Get specific teacher
curl "http://localhost:3000/api/teachers/1"

# Search teachers
curl "http://localhost:3000/api/search/teachers?q=blues"

# Get all musicians
curl "http://localhost:3000/api/musicians"

# Get specific musician
curl "http://localhost:3000/api/musicians/1"

# Search musicians
curl "http://localhost:3000/api/search/musicians?q=jazz"
```