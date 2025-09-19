# Following System API Documentation

## Overview

This document describes the API endpoints for the following system in the Blues Dance Festival Finder application. The following system allows users to follow teachers, musicians, and festivals to receive personalized updates and recommendations.

## Base URL

All API endpoints are prefixed with `/api/users/[id]/`

## Authentication

All endpoints require user authentication via NextAuth.js session. Users can only manage their own following relationships.

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

## Follow/Unfollow API

### POST /api/users/[id]/follow

Follow a teacher, musician, or festival.

**Path Parameters:**
- `id`: User ID (must match authenticated user)

**Request Body:**
```json
{
  "targetId": "string",
  "targetType": "teacher" | "musician" | "festival"
}
```

**Example Request:**
```bash
curl -X POST "http://localhost:3000/api/users/123/follow" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <session-token>" \
  -d '{
    "targetId": "456",
    "targetType": "teacher"
  }'
```

**Example Response:**
```json
{
  "data": {
    "following": {
      "id": "follow_1642252200000",
      "userId": "123",
      "targetId": "456",
      "targetType": "teacher",
      "createdAt": "2024-01-15T10:30:00.000Z"
    },
    "message": "Successfully followed teacher"
  },
  "success": true,
  "message": "You are now following this teacher",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

**Error Cases:**
- `400`: Already following this target
- `400`: Cannot follow yourself
- `401`: Unauthorized
- `403`: Forbidden (wrong user)
- `404`: Target not found

### DELETE /api/users/[id]/follow

Unfollow a teacher, musician, or festival.

**Path Parameters:**
- `id`: User ID (must match authenticated user)

**Query Parameters:**
- `targetId`: ID of the target to unfollow
- `targetType`: Type of target (teacher, musician, festival)

**Example Request:**
```bash
curl -X DELETE "http://localhost:3000/api/users/123/follow?targetId=456&targetType=teacher" \
  -H "Authorization: Bearer <session-token>"
```

**Example Response:**
```json
{
  "data": {
    "message": "Successfully unfollowed teacher"
  },
  "success": true,
  "message": "You are no longer following this teacher",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## Following List API

### GET /api/users/[id]/following

Get user's following list with advanced filtering and pagination.

**Path Parameters:**
- `id`: User ID

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20, max: 100)
- `type` (optional): Filter by target type (teacher, musician, festival)
- `includeDetails` (optional): Boolean to include full target details (default: true)
- `sortBy` (optional): createdAt, name, upcoming_events (default: createdAt)
- `sortOrder` (optional): asc, desc (default: desc)

**Example Request:**
```bash
curl "http://localhost:3000/api/users/123/following?page=1&limit=10&type=teacher&includeDetails=true" \
  -H "Authorization: Bearer <session-token>"
```

**Example Response:**
```json
{
  "data": {
    "following": [
      {
        "id": "follow_1",
        "targetType": "teacher",
        "createdAt": "2024-01-15T10:30:00.000Z",
        "target": {
          "id": "1",
          "name": "Alice Johnson",
          "bio": "Experienced blues dance instructor",
          "specialties": ["Blues", "Connection", "Musicality"],
          "website": "https://alicejohnsonblues.com",
          "socialLinks": {
            "facebook": "https://facebook.com/alicejohnsonblues",
            "instagram": "https://instagram.com/alicejohnsonblues"
          }
        }
      }
    ],
    "grouped": {
      "teachers": [...],
      "musicians": [...],
      "festivals": [...]
    },
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 1,
      "totalPages": 1,
      "hasNext": false,
      "hasPrev": false
    },
    "filters": {
      "type": "teacher",
      "includeDetails": true,
      "sortBy": "createdAt",
      "sortOrder": "desc"
    },
    "stats": {
      "total": 1,
      "teachers": 1,
      "musicians": 0,
      "festivals": 0
    }
  },
  "success": true,
  "message": "Following list retrieved successfully",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### DELETE /api/users/[id]/following

Bulk unfollow multiple targets.

**Path Parameters:**
- `id`: User ID (must match authenticated user)

**Request Body:**
```json
{
  "targets": [
    { "targetId": "456", "targetType": "teacher" },
    { "targetId": "789", "targetType": "musician" }
  ]
}
```

**Example Request:**
```bash
curl -X DELETE "http://localhost:3000/api/users/123/following" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <session-token>" \
  -d '{
    "targets": [
      { "targetId": "456", "targetType": "teacher" },
      { "targetId": "789", "targetType": "musician" }
    ]
  }'
```

**Example Response:**
```json
{
  "data": {
    "unfollowed": [
      { "targetId": "456", "targetType": "teacher" },
      { "targetId": "789", "targetType": "musician" }
    ],
    "failed": [],
    "message": "Successfully unfollowed 2 items"
  },
  "success": true,
  "message": "Bulk unfollow completed",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## Followers API

### GET /api/users/[id]/followers

Get users who follow this user.

**Path Parameters:**
- `id`: User ID

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20, max: 100)
- `includeDetails` (optional): Boolean to include full user details (default: true)
- `sortBy` (optional): createdAt, name (default: createdAt)
- `sortOrder` (optional): asc, desc (default: desc)

**Example Request:**
```bash
curl "http://localhost:3000/api/users/123/followers?page=1&limit=10" \
  -H "Authorization: Bearer <session-token>"
```

**Example Response:**
```json
{
  "data": {
    "targetUser": {
      "id": "123",
      "name": "John Doe",
      "image": "https://example.com/avatar.jpg"
    },
    "followers": [
      {
        "id": "follow_1",
        "followedAt": "2024-01-15T10:30:00.000Z",
        "user": {
          "id": "456",
          "name": "Jane Smith",
          "image": "https://example.com/avatar2.jpg",
          "createdAt": "2024-01-02T00:00:00.000Z",
          "verified": true
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 1,
      "totalPages": 1,
      "hasNext": false,
      "hasPrev": false
    },
    "filters": {
      "includeDetails": true,
      "sortBy": "createdAt",
      "sortOrder": "desc"
    },
    "currentUserFollowing": false
  },
  "success": true,
  "message": "Followers retrieved successfully",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## Following Status API

### GET /api/users/[id]/following-status

Check following status for single or multiple targets.

**Path Parameters:**
- `id`: User ID (must match authenticated user)

**Query Parameters (Single Target):**
- `targetId`: Single target ID
- `targetType`: Single target type (teacher, musician, festival)

**Query Parameters (Multiple Targets):**
- `targets`: Comma-separated list of target IDs
- `type`: Target type for all targets

**Example Request (Single):**
```bash
curl "http://localhost:3000/api/users/123/following-status?targetId=456&targetType=teacher" \
  -H "Authorization: Bearer <session-token>"
```

**Example Response (Single):**
```json
{
  "data": {
    "targetId": "456",
    "targetType": "teacher",
    "isFollowing": true,
    "followedAt": "2024-01-15T10:30:00.000Z"
  },
  "success": true,
  "message": "Following status retrieved successfully",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

**Example Request (Multiple):**
```bash
curl "http://localhost:3000/api/users/123/following-status?targets=456,789,012&type=teacher" \
  -H "Authorization: Bearer <session-token>"
```

**Example Response (Multiple):**
```json
{
  "data": {
    "userId": "123",
    "targetType": "teacher",
    "statuses": [
      {
        "targetId": "456",
        "isFollowing": true,
        "followedAt": "2024-01-15T10:30:00.000Z"
      },
      {
        "targetId": "789",
        "isFollowing": false,
        "followedAt": null
      }
    ],
    "summary": {
      "total": 2,
      "following": 1,
      "notFollowing": 1
    }
  },
  "success": true,
  "message": "Following statuses retrieved successfully",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### POST /api/users/[id]/following-status

Batch check following status for mixed target types.

**Path Parameters:**
- `id`: User ID (must match authenticated user)

**Request Body:**
```json
{
  "targets": [
    { "targetId": "456", "targetType": "teacher" },
    { "targetId": "789", "targetType": "musician" },
    { "targetId": "012", "targetType": "festival" }
  ]
}
```

**Example Request:**
```bash
curl -X POST "http://localhost:3000/api/users/123/following-status" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <session-token>" \
  -d '{
    "targets": [
      { "targetId": "456", "targetType": "teacher" },
      { "targetId": "789", "targetType": "musician" }
    ]
  }'
```

**Example Response:**
```json
{
  "data": {
    "userId": "123",
    "statuses": [
      {
        "targetId": "456",
        "targetType": "teacher",
        "isFollowing": true,
        "followedAt": "2024-01-15T10:30:00.000Z"
      },
      {
        "targetId": "789",
        "targetType": "musician",
        "isFollowing": false,
        "followedAt": null
      }
    ],
    "grouped": {
      "teachers": [...],
      "musicians": [...],
      "festivals": [...]
    },
    "summary": {
      "total": 2,
      "following": 1,
      "notFollowing": 1,
      "byType": {
        "teachers": 1,
        "musicians": 1,
        "festivals": 0
      }
    }
  },
  "success": true,
  "message": "Batch following statuses retrieved successfully",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## Follow Suggestions API

### GET /api/users/[id]/follow-suggestions

Get personalized follow suggestions based on user preferences and activity.

**Path Parameters:**
- `id`: User ID (must match authenticated user)

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20, max: 50)
- `type` (optional): Filter by target type (teacher, musician, festival)
- `location` (optional): Filter by location (city or country)
- `includeReason` (optional): Boolean to include suggestion reason (default: true)

**Example Request:**
```bash
curl "http://localhost:3000/api/users/123/follow-suggestions?page=1&limit=10&type=teacher&includeReason=true" \
  -H "Authorization: Bearer <session-token>"
```

**Example Response:**
```json
{
  "data": {
    "suggestions": [
      {
        "id": "suggestion_456",
        "targetId": "456",
        "targetType": "teacher",
        "target": {
          "id": "456",
          "name": "Carol Williams",
          "bio": "Contemporary blues teacher focusing on improvisation",
          "specialties": ["Blues", "Improvisation", "Creative Movement"],
          "website": "https://carolwilliamsblues.com"
        },
        "algorithm": "popular",
        "score": 0.85,
        "reason": "Popular teacher with similar style preferences"
      }
    ],
    "grouped": {
      "teachers": [...],
      "musicians": [...],
      "festivals": [...]
    },
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 6,
      "totalPages": 1,
      "hasNext": false,
      "hasPrev": false
    },
    "filters": {
      "type": "teacher",
      "location": null,
      "includeReason": true
    },
    "algorithms": {
      "popular": "Based on overall popularity and follower count",
      "location": "Based on your location preferences",
      "similar": "Based on users with similar interests",
      "upcoming": "Based on upcoming events in your area"
    }
  },
  "success": true,
  "message": "Follow suggestions retrieved successfully",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## Error Handling

The API uses standard HTTP status codes:

- `200 OK`: Success
- `400 Bad Request`: Invalid request parameters or already following/not following
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: User can only manage their own following
- `404 Not Found`: Target not found
- `500 Internal Server Error`: Server error

## Rate Limiting

Currently not implemented. Will be added in future versions.

## Database Schema

The following system uses these database tables:

```sql
-- Following relationships
CREATE TABLE following (
  id VARCHAR PRIMARY KEY,
  user_id VARCHAR NOT NULL,
  target_id VARCHAR NOT NULL,
  target_type ENUM('teacher', 'musician', 'festival') NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, target_id, target_type)
);

-- Indexes for performance
CREATE INDEX idx_following_user_id ON following(user_id);
CREATE INDEX idx_following_target ON following(target_id, target_type);
CREATE INDEX idx_following_created_at ON following(created_at);
```

## Future Enhancements

1. **Real Database Integration**: Replace mock data with actual Prisma database queries
2. **Push Notifications**: Send push notifications when someone follows you
3. **Follow Recommendations**: Advanced ML-based recommendation engine
4. **Following Analytics**: Track following patterns and engagement
5. **Mutual Following**: Special handling for mutual following relationships
6. **Follow Limits**: Rate limiting and maximum follow counts
7. **Privacy Controls**: Allow users to make their following/followers private
8. **Activity Feed**: Show activity from followed users
9. **Batch Operations**: More efficient bulk follow/unfollow operations
10. **Caching**: Redis caching for frequently accessed following data

## Testing

Use the following curl commands to test the endpoints:

```bash
# Follow a teacher
curl -X POST "http://localhost:3000/api/users/123/follow" \
  -H "Content-Type: application/json" \
  -d '{"targetId": "456", "targetType": "teacher"}'

# Get following list
curl "http://localhost:3000/api/users/123/following"

# Check following status
curl "http://localhost:3000/api/users/123/following-status?targetId=456&targetType=teacher"

# Get follow suggestions
curl "http://localhost:3000/api/users/123/follow-suggestions"

# Unfollow
curl -X DELETE "http://localhost:3000/api/users/123/follow?targetId=456&targetType=teacher"
```

## Security Considerations

1. **Authentication**: All endpoints require valid session authentication
2. **Authorization**: Users can only manage their own following relationships
3. **Input Validation**: All inputs are validated and sanitized
4. **Rate Limiting**: Will be implemented to prevent abuse
5. **Data Privacy**: Following relationships respect user privacy settings
6. **SQL Injection**: All queries use parameterized statements via Prisma