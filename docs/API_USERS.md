# Users API Documentation

## Overview

The Users API provides endpoints for managing user profiles, preferences, and account settings. All endpoints require authentication and follow REST conventions.

## Base URL

```
/api/users
```

## Authentication

All endpoints require authentication. Users can only access and modify their own data unless specified otherwise.

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

### 1. Get User Profile

Get detailed information about a user profile.

```http
GET /api/users/{id}
```

#### Path Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | User ID |

#### Response

```json
{
  "data": {
    "id": "user123",
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": "https://example.com/avatar.jpg",
    "verified": true,
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-01-20T14:30:00Z",
    "preferences": {
      "emailNotifications": true,
      "pushNotifications": true,
      "newEventNotifications": true,
      "deadlineReminders": true,
      "weeklyDigest": true,
      "followingUpdates": true,
      "defaultCountry": "Italy",
      "defaultCity": "Rome",
      "searchRadius": 100,
      "theme": "light",
      "language": "en",
      "timezone": "Europe/Rome"
    },
    "stats": {
      "following": 25,
      "savedEvents": 12,
      "reviews": 8,
      "createdEvents": 2
    },
    "recentActivity": {
      "savedEvents": [...],
      "reviews": [...]
    }
  },
  "success": true,
  "timestamp": "2024-01-25T12:00:00Z"
}
```

### 2. Update User Profile

Update user profile information.

```http
PUT /api/users/{id}
```

#### Request Body

```json
{
  "name": "Updated Name",
  "email": "updated@example.com",
  "avatar": "https://example.com/new-avatar.jpg"
}
```

#### Response

```json
{
  "data": {
    "id": "user123",
    "name": "Updated Name",
    "email": "updated@example.com",
    "avatar": "https://example.com/new-avatar.jpg",
    "verified": true,
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-01-25T12:00:00Z"
  },
  "success": true,
  "timestamp": "2024-01-25T12:00:00Z"
}
```

### 3. Change Password

Change user password.

```http
PUT /api/users/{id}
```

#### Request Body

```json
{
  "currentPassword": "currentpass123",
  "newPassword": "newpass123",
  "confirmPassword": "newpass123"
}
```

#### Response

```json
{
  "data": {
    "message": "Password updated successfully"
  },
  "success": true,
  "timestamp": "2024-01-25T12:00:00Z"
}
```

### 4. Delete User Account

Permanently delete user account and all associated data.

```http
DELETE /api/users/{id}
```

#### Request Body

```json
{
  "confirmation": "DELETE"
}
```

#### Response

```json
{
  "data": {
    "message": "Account deleted successfully",
    "deletedAt": "2024-01-25T12:00:00Z"
  },
  "success": true,
  "timestamp": "2024-01-25T12:00:00Z"
}
```

### 5. Get Current User

Get current authenticated user's profile.

```http
GET /api/users/me
```

#### Response

```json
{
  "data": {
    "id": "user123",
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": "https://example.com/avatar.jpg",
    "verified": true,
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-01-20T14:30:00Z",
    "preferences": {...},
    "stats": {
      "following": 25,
      "savedEvents": 12,
      "reviews": 8,
      "createdEvents": 2,
      "unreadNotifications": 3
    },
    "recentActivity": {
      "savedEvents": [...],
      "following": [...],
      "reviews": [...]
    },
    "notifications": [...]
  },
  "success": true,
  "timestamp": "2024-01-25T12:00:00Z"
}
```

## User Preferences

### 6. Get User Preferences

Get user's notification and interface preferences.

```http
GET /api/users/{id}/preferences
```

#### Response

```json
{
  "data": {
    "id": "pref123",
    "emailNotifications": true,
    "pushNotifications": true,
    "newEventNotifications": true,
    "deadlineReminders": true,
    "weeklyDigest": true,
    "followingUpdates": true,
    "defaultCountry": "Italy",
    "defaultCity": "Rome",
    "searchRadius": 100,
    "theme": "light",
    "language": "en",
    "timezone": "Europe/Rome",
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-01-20T14:30:00Z"
  },
  "success": true,
  "timestamp": "2024-01-25T12:00:00Z"
}
```

### 7. Update User Preferences

Update user preferences.

```http
PUT /api/users/{id}/preferences
```

#### Request Body

```json
{
  "emailNotifications": false,
  "pushNotifications": true,
  "newEventNotifications": true,
  "deadlineReminders": false,
  "weeklyDigest": true,
  "followingUpdates": true,
  "defaultCountry": "France",
  "defaultCity": "Paris",
  "searchRadius": 50,
  "theme": "dark",
  "language": "fr",
  "timezone": "Europe/Paris"
}
```

#### Response

```json
{
  "data": {
    "id": "pref123",
    "emailNotifications": false,
    "pushNotifications": true,
    "newEventNotifications": true,
    "deadlineReminders": false,
    "weeklyDigest": true,
    "followingUpdates": true,
    "defaultCountry": "France",
    "defaultCity": "Paris",
    "searchRadius": 50,
    "theme": "dark",
    "language": "fr",
    "timezone": "Europe/Paris",
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-01-25T12:00:00Z"
  },
  "success": true,
  "timestamp": "2024-01-25T12:00:00Z"
}
```

### 8. Reset Preferences

Reset user preferences to default values.

```http
DELETE /api/users/{id}/preferences
```

#### Response

```json
{
  "data": {
    "id": "pref123",
    "emailNotifications": true,
    "pushNotifications": true,
    "newEventNotifications": true,
    "deadlineReminders": true,
    "weeklyDigest": true,
    "followingUpdates": true,
    "defaultCountry": null,
    "defaultCity": null,
    "searchRadius": 100,
    "theme": "light",
    "language": "en",
    "timezone": null,
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-01-25T12:00:00Z"
  },
  "success": true,
  "timestamp": "2024-01-25T12:00:00Z"
}
```

## User Notifications

### 9. Get User Notifications

Get user's notifications with pagination.

```http
GET /api/users/{id}/notifications
```

#### Query Parameters

| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| `page` | number | Page number | 1 |
| `limit` | number | Items per page (max 100) | 20 |
| `unread` | boolean | Show only unread notifications | false |
| `type` | string | Filter by notification type | - |

#### Response

```json
{
  "data": {
    "notifications": [
      {
        "id": "notif123",
        "type": "NEW_EVENT",
        "title": "New Event from Teacher You Follow",
        "message": "Jane Doe has a new workshop in Rome",
        "data": {
          "eventId": "event456",
          "teacherId": "teacher789"
        },
        "read": false,
        "createdAt": "2024-01-25T10:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "totalPages": 3,
      "hasNext": true,
      "hasPrev": false
    },
    "summary": {
      "total": 45,
      "unread": 12
    }
  },
  "success": true,
  "timestamp": "2024-01-25T12:00:00Z"
}
```

### 10. Mark Notifications as Read

Mark specific notifications or all notifications as read.

```http
PUT /api/users/{id}/notifications
```

#### Request Body

Mark specific notifications:
```json
{
  "notificationIds": ["notif123", "notif456"]
}
```

Mark all notifications:
```json
{
  "all": true
}
```

#### Response

```json
{
  "data": {
    "message": "Notifications marked as read",
    "updated": 2
  },
  "success": true,
  "timestamp": "2024-01-25T12:00:00Z"
}
```

### 11. Delete Notifications

Delete specific notifications or all notifications.

```http
DELETE /api/users/{id}/notifications
```

#### Request Body

Delete specific notifications:
```json
{
  "notificationIds": ["notif123", "notif456"]
}
```

Delete all notifications:
```json
{
  "all": true
}
```

#### Response

```json
{
  "data": {
    "message": "Notifications deleted",
    "deleted": 2
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
  "error": "Invalid input: Name is required",
  "timestamp": "2024-01-25T12:00:00Z"
}
```

### 401 Unauthorized

```json
{
  "data": null,
  "success": false,
  "error": "Unauthorized",
  "timestamp": "2024-01-25T12:00:00Z"
}
```

### 403 Forbidden

```json
{
  "data": null,
  "success": false,
  "error": "Forbidden: You can only update your own profile",
  "timestamp": "2024-01-25T12:00:00Z"
}
```

### 404 Not Found

```json
{
  "data": null,
  "success": false,
  "error": "User not found",
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

## Notification Types

- `NEW_EVENT` - New event from followed teacher/musician
- `DEADLINE_REMINDER` - Registration deadline approaching
- `FOLLOWED_UPDATE` - Update from followed teacher/musician
- `EVENT_CANCELLED` - Event has been cancelled
- `EVENT_UPDATED` - Event details have been updated
- `WEEKLY_DIGEST` - Weekly summary of events

## Themes

- `light` - Light theme
- `dark` - Dark theme
- `auto` - System preference

## Languages

- `en` - English
- `it` - Italian
- `fr` - French
- `es` - Spanish

## Security Notes

- All endpoints are rate-limited
- Password changes require current password verification
- Account deletion requires explicit confirmation
- User data is encrypted in transit and at rest
- GDPR compliance for data deletion

## Rate Limiting

- Profile updates: 10 requests per minute
- Preference updates: 20 requests per minute
- Notification actions: 100 requests per minute
- Account deletion: 1 request per hour