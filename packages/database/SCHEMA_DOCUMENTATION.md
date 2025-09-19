# Database Schema Design Documentation

## TASK-005 Implementation Summary

This document validates our database schema implementation against the requirements specified in the PRD, planning documents, and technical specifications.

## ✅ Requirements Validation

### Core Entities (As Required in TASK-005)

| Entity | Status | Implementation Details |
|--------|---------|----------------------|
| **User** | ✅ Complete | Full user management with authentication, preferences, and social features |
| **Event** | ✅ Complete | Comprehensive event metadata including dates, location, pricing, and status |
| **Teacher** | ✅ Complete | Professional profiles with specialties, social media, and following system |
| **Musician** | ✅ Complete | Artist profiles with genres, instruments, and social features |
| **Venue** | ✅ Complete | Geographic locations with PostGIS support for distance searches |

### Following Relationships (Core Differentiator)

| Relationship | Status | Implementation |
|-------------|---------|----------------|
| User → Teacher | ✅ Complete | Polymorphic following table with follower counts |
| User → Musician | ✅ Complete | Automatic counter updates and notification triggers |
| User → Event | ✅ Complete | Save/attend/review capabilities |
| Junction Tables | ✅ Complete | Proper many-to-many relationships with metadata |

### Event Metadata (As Specified in PRD)

| Requirement | Status | Implementation |
|------------|---------|----------------|
| Dates & Deadlines | ✅ Complete | `startDate`, `endDate`, `registrationDeadline` |
| Location Data | ✅ Complete | Full venue with PostGIS coordinates |
| Pricing Tiers | ✅ Complete | Multiple price types with deadlines |
| Teacher/Musician Lists | ✅ Complete | Many-to-many with role metadata |
| Registration URLs | ✅ Complete | Direct links to external registration |
| Tags & Categories | ✅ Complete | Flexible tagging system |

### Performance Indexing Strategy

| Index Type | Purpose | Implementation |
|-----------|---------|----------------|
| **Date Queries** | Event discovery | `events(startDate, endDate)` |
| **Location Search** | Geographic filtering | `venues(latitude, longitude)` with PostGIS |
| **Following Queries** | User dashboard | `following(userId)`, `following(targetType, targetId)` |
| **Text Search** | Event/teacher search | `events(slug)`, `teachers(slug)`, Full-text on names |
| **Status Filtering** | Published events | `events(status)`, `events(featured)` |

## 🎯 Technical Design Decisions

### 1. Authentication System (NextAuth.js Compatible)

```typescript
// Implements NextAuth.js adapter pattern
Account {
  provider, providerAccountId  // OAuth providers
  refresh_token, access_token  // Token management
  expires_at                   // Session expiration
}

Session {
  sessionToken                 // Secure session tracking
  expires                      // Session timeout
}
```

**Decision Rationale**: Full compatibility with NextAuth.js for Google/Facebook OAuth as specified in planning.md.

### 2. Geographic Data (PostGIS Integration)

```sql
-- Venue coordinates using PostGIS
latitude: Decimal @db.Decimal(10, 8)  -- High precision for accuracy
longitude: Decimal @db.Decimal(11, 8) -- Support for geographic queries

-- Raw SQL for distance calculations (in utils.ts)
ST_Distance(ST_Point(longitude, latitude)::geography, ST_Point($lng, $lat)::geography)
```

**Decision Rationale**: PostGIS enables advanced geographic queries essential for location-based event discovery.

### 3. Following System (Polymorphic Design)

```typescript
model Following {
  targetType: FollowType      // 'TEACHER' | 'MUSICIAN'
  targetId: String            // ID of followed entity
  
  // Polymorphic relationships
  teacher: Teacher?           // Conditional relation
  musician: Musician?         // Conditional relation
}
```

**Decision Rationale**: Polymorphic design allows following different entity types while maintaining data integrity.

### 4. Event Pricing (Multiple Tiers)

```typescript
model EventPrice {
  type: PriceType            // EARLY_BIRD, REGULAR, STUDENT, etc.
  amount: Decimal            // Precise decimal for currency
  deadline: DateTime?        // Early bird deadlines
  description: String?       // Additional context
}
```

**Decision Rationale**: Flexible pricing supports complex festival pricing strategies mentioned in PRD.

### 5. Social Media Integration

```typescript
// Separate tables for extensibility
TeacherSocialMedia {
  facebook, instagram, youtube, tiktok, linkedin
}

MusicianSocialMedia {
  facebook, instagram, youtube, spotify, soundcloud, bandcamp
}
```

**Decision Rationale**: Separate tables allow different social platforms per entity type while maintaining clean schema.

## 📊 Performance Optimization Features

### 1. Strategic Indexing

- **Composite Indexes**: `(city, country)`, `(latitude, longitude)` for location queries
- **Unique Constraints**: `(userId, targetType, targetId)` for following relationships
- **Time-based Indexes**: `events(startDate, endDate)` for date filtering
- **Status Indexes**: `events(status)`, `events(featured)` for published content

### 2. Query Optimization Patterns

```typescript
// Optimized event listing with minimal data
getUpcomingEvents({
  include: {
    venue: true,
    prices: { orderBy: { amount: 'asc' }, take: 1 },  // Only cheapest price
    _count: { select: { saves: true, attendances: true } }  // Popularity metrics
  }
})
```

### 3. Database Connection Management

```typescript
// Singleton pattern with proper cleanup
export const db = globalThis.__prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query'] : ['error']
})
```

## 🔒 Security & Data Integrity

### 1. Data Constraints

- **Email Uniqueness**: Prevents duplicate user accounts
- **Slug Uniqueness**: SEO-friendly URLs with collision prevention
- **Date Validation**: `endDate >= startDate`, deadline constraints
- **Geographic Bounds**: Latitude/longitude within valid ranges
- **Rating Bounds**: Review ratings between 1-5 stars

### 2. Cascade Deletion Strategy

- **User Deletion**: Removes all related data (GDPR compliance)
- **Event Deletion**: Removes prices, tags, relationships
- **Teacher/Musician Deletion**: Removes specialties, social media

### 3. Privacy Features

- **Optional Fields**: Many user fields are optional for privacy
- **Notification Control**: Granular notification preferences
- **Data Export**: Structure supports GDPR data export requirements

## 🌐 Internationalization Support

### 1. Multi-Currency Pricing

```typescript
EventPrice {
  amount: Decimal
  currency: String @default("USD")  // Supports multiple currencies
}
```

### 2. Geographic Flexibility

```typescript
Venue {
  country: String     // Supports worldwide events
  state: String?      // Optional for non-US venues
  postalCode: String? // Flexible postal code formats
}
```

### 3. Timezone Awareness

```typescript
UserPreferences {
  timezone: String?   // User's timezone preference
}

Event {
  startDate: DateTime // UTC storage, display in user timezone
  endDate: DateTime
}
```

## 🚀 Scalability Considerations

### 1. Data Growth Patterns

- **Events**: ~1000 new events per year (manageable)
- **Users**: Target 1000+ users first year
- **Following**: Potentially 10K+ relationships
- **Notifications**: High volume, needs cleanup strategy

### 2. Query Performance

- **Pagination**: All list queries support limit/offset
- **Selective Loading**: Includes only necessary related data
- **Aggregation**: Pre-calculated counts (followerCount, eventCount)

### 3. Background Processing

```typescript
// Utility functions support background operations
updateFollowerCounts()    // Async counter updates
generateNotifications()   // Batch notification creation
refreshEventData()        // Scraping updates
```

## 📈 Analytics & Monitoring Support

### 1. User Engagement Tracking

- **Event Saves**: Popularity metrics
- **Attendance Status**: Interest vs actual attendance
- **Review System**: Event quality feedback
- **Following Activity**: Teacher/musician popularity

### 2. Content Performance

- **Event Views**: Implicit via save/attendance counts
- **Search Analytics**: Can be tracked via API layer
- **Geographic Distribution**: Venue location analysis

## 🎵 Domain-Specific Features

### 1. Blues Dance Specialization

```typescript
TeacherSpecialty {
  specialty: String  // "Authentic Blues", "Slow Blues", "Chicago Style"
}

MusicianGenre {
  genre: String      // "Delta Blues", "Electric Blues", "Contemporary"
}
```

### 2. Event Categorization

```typescript
EventTag {
  tag: String        // "Workshop", "Festival", "Social Dance", "Live Music"
}

EventStatus {
  DRAFT, PUBLISHED, CANCELLED, COMPLETED, ARCHIVED
}
```

### 3. Professional Networking

- **Teacher Profiles**: Professional bio, specialties, years active
- **Musician Profiles**: Instruments, genres, performance history
- **Event Networking**: Reviews and attendance tracking

## ✅ TASK-005 Completion Checklist

- [x] **ERD Created**: Comprehensive relationship diagram in ERD.md
- [x] **Core Entities Defined**: User, Event, Teacher, Musician, Venue
- [x] **Following Relationships**: Many-to-many with junction tables
- [x] **Indexing Strategy**: Performance-optimized indexes planned
- [x] **Schema Documentation**: Decisions and constraints documented
- [x] **Prisma Configuration**: Complete schema.prisma file
- [x] **Database Utilities**: Helper functions and seed data
- [x] **Migration Ready**: Schema ready for initial migration

## 🔄 Next Steps (Post TASK-005)

1. **TASK-006**: Set up Prisma ORM configuration
2. **Database Migration**: Run initial migration with PostGIS setup
3. **Seed Development Data**: Populate database with sample data
4. **API Integration**: Connect schema to Next.js API routes
5. **Testing Setup**: Unit tests for database utilities

---

**Implementation Status**: ✅ **TASK-005 COMPLETE**

The database schema fully implements all requirements specified in the PRD and planning documents, with optimizations for the blues dance community's specific needs while maintaining scalability for future growth.