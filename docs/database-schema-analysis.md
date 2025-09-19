# Database Schema Analysis - Blues Dance Festival Finder

## Overview

This document provides a comprehensive analysis of the existing database schema for the Blues Dance Festival Finder application. The schema has been designed with scalability, performance, and data integrity in mind.

## Schema Statistics

- **Total Models**: 22 main entities
- **Junction Tables**: 6 relationship tables
- **Enums**: 5 enumeration types
- **Indexes**: 30+ optimized indexes
- **Database Provider**: PostgreSQL with PostGIS support

## Core Entities Analysis

### 1. User Management System

#### Users (`users`)
- **Primary Key**: `id` (CUID)
- **Unique Constraints**: `email`
- **Key Features**: 
  - Email-based identification
  - Avatar support
  - Verification status
  - Timestamp tracking

#### Accounts (`accounts`)
- **Purpose**: OAuth and credential authentication
- **Providers**: Google, Facebook, Email/Password
- **Security**: Supports NextAuth.js integration

#### Sessions (`sessions`)
- **Purpose**: User session management
- **Security**: Session tokens with expiration

#### User Preferences (`user_preferences`)
- **Purpose**: Personalization settings
- **Features**: 
  - Notification preferences (6 types)
  - Location preferences
  - UI/Theme preferences
  - Search radius configuration

### 2. Core Content Entities

#### Events (`events`)
- **Primary Key**: `id` (CUID)
- **Unique Constraints**: `slug`
- **Key Features**:
  - Full date/time management (start, end, registration deadline)
  - Status workflow (DRAFT → PUBLISHED → COMPLETED/CANCELLED)
  - Featured events support
  - SEO-friendly slugs
  - Image and website integration
  - Scraping metadata tracking

#### Venues (`venues`)
- **Primary Key**: `id` (CUID)
- **Unique Constraints**: `name + city + country`
- **Geographic Features**:
  - Decimal coordinates (latitude/longitude)
  - PostGIS optimization ready
  - Address normalization
  - Venue amenities tracking

#### Teachers (`teachers`)
- **Primary Key**: `id` (CUID)
- **Unique Constraints**: `slug`
- **Professional Features**:
  - Bio and specialties
  - Years of experience
  - Verification system
  - Follower/event counters

#### Musicians (`musicians`)
- **Primary Key**: `id` (CUID)
- **Unique Constraints**: `slug`
- **Musical Features**:
  - Genre classification
  - Instrument arrays
  - Social media integration
  - Performance tracking

### 3. Relationship Tables

#### Event-Teacher Relationships (`event_teachers`)
- **Purpose**: Many-to-many with metadata
- **Additional Data**: Role, workshops, skill level
- **Constraints**: Unique per event-teacher pair

#### Event-Musician Relationships (`event_musicians`)
- **Purpose**: Many-to-many with metadata
- **Additional Data**: Performance role, set times
- **Constraints**: Unique per event-musician pair

#### Following System (`following`)
- **Purpose**: Polymorphic following relationships
- **Targets**: Teachers and Musicians
- **Features**: Type-safe with enums

### 4. Event Enhancement Features

#### Event Prices (`event_prices`)
- **Purpose**: Multiple pricing tiers
- **Types**: Early Bird, Regular, Student, VIP, etc.
- **Features**: Deadline-based pricing, currency support

#### Event Tags (`event_tags`)
- **Purpose**: Flexible categorization
- **Implementation**: Simple tag system
- **Performance**: Indexed for fast searches

#### User Interactions
- **Event Saves**: Bookmark functionality
- **Event Attendance**: Interest level tracking
- **Event Reviews**: Rating and feedback system

### 5. Social Features

#### Specialties & Genres
- **Teacher Specialties**: Flexible skill categorization
- **Musician Genres**: Musical style classification

#### Social Media Integration
- **Teacher Social Media**: Professional profiles
- **Musician Social Media**: Performance platforms

#### Notification System (`notifications`)
- **Purpose**: In-app notification management
- **Types**: 6 notification categories
- **Features**: Read status, JSON payload support

## Indexing Strategy

### Performance Optimizations

#### Primary Search Indexes
```sql
-- Event searches by date range
CREATE INDEX events_startDate_endDate_idx ON events(startDate, endDate);

-- Geographic venue searches
CREATE INDEX venues_latitude_longitude_idx ON venues(latitude, longitude);

-- Location-based searches
CREATE INDEX venues_city_country_idx ON venues(city, country);
```

#### Following System Indexes
```sql
-- User following lookups
CREATE INDEX following_userId_idx ON following(userId);

-- Polymorphic target lookups
CREATE INDEX following_targetType_targetId_idx ON following(targetType, targetId);
```

#### Content Discovery Indexes
```sql
-- Featured events
CREATE INDEX events_featured_idx ON events(featured);

-- Event status filtering
CREATE INDEX events_status_idx ON events(status);

-- Tag-based searches
CREATE INDEX event_tags_tag_idx ON event_tags(tag);
```

## Data Integrity Constraints

### Referential Integrity
- **Cascade Deletes**: User-related data cleanup
- **Restrict Deletes**: Venue protection when events exist
- **Unique Constraints**: Prevent duplicate relationships

### Business Logic Constraints
- **Email Uniqueness**: User identification
- **Slug Uniqueness**: SEO and routing
- **Venue Uniqueness**: Name + Location combination

## Scalability Considerations

### Database Design Patterns

#### 1. CUID Usage
- **Benefits**: Collision-resistant, URL-safe
- **Performance**: Better than UUIDs for databases
- **Clustering**: Better insertion performance

#### 2. Polymorphic Relationships
- **Following System**: Type-safe polymorphism
- **Extensibility**: Easy to add new followable types

#### 3. Junction Tables with Metadata
- **Rich Relationships**: Additional context data
- **Query Flexibility**: Filter by relationship properties

### Performance Optimizations

#### 1. Counter Denormalization
```sql
-- Teacher/Musician counters for quick stats
followerCount INTEGER NOT NULL DEFAULT 0
eventCount INTEGER NOT NULL DEFAULT 0
```

#### 2. Geographic Optimization
```sql
-- PostGIS-ready coordinate storage
latitude DECIMAL(10,8) NOT NULL
longitude DECIMAL(11,8) NOT NULL
```

#### 3. Full-Text Search Ready
- Text fields sized appropriately
- Description fields marked as TEXT
- Search-optimized string fields

## Schema Evolution Considerations

### Future Enhancements

#### 1. Event Categories
```sql
-- Potential addition
CREATE TABLE event_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE,
  description TEXT
);
```

#### 2. Advanced Pricing
```sql
-- Potential enhancement
ALTER TABLE event_prices 
ADD COLUMN discountCode TEXT,
ADD COLUMN maxUses INTEGER;
```

#### 3. Media Galleries
```sql
-- Potential addition
CREATE TABLE event_media (
  id TEXT PRIMARY KEY,
  eventId TEXT NOT NULL,
  type MediaType NOT NULL, -- PHOTO, VIDEO, AUDIO
  url TEXT NOT NULL,
  caption TEXT
);
```

### Migration Strategy
- **Version Control**: All migrations tracked
- **Rollback Plans**: Reversible migration design
- **Data Validation**: Pre/post migration checks

## Security Considerations

### Data Protection
- **Sensitive Data**: Password hashing in accounts table
- **PII Handling**: User data isolation
- **Access Control**: Role-based permissions ready

### API Security
- **Rate Limiting**: Index support for rate limiting
- **Audit Trail**: Created/updated timestamps
- **Data Validation**: Type-safe enums

## Monitoring & Maintenance

### Query Performance
- **Slow Query Monitoring**: Index coverage analysis
- **Connection Pooling**: Prisma optimization
- **Cache Strategy**: Redis integration ready

### Data Quality
- **Duplicate Detection**: Unique constraints
- **Data Freshness**: Timestamp tracking
- **Verification System**: Manual review workflow

## Connection to External Data

### Integration Points
- **External Database**: `swing_events` database connection
- **Scraping Sources**: Source URL tracking
- **Data Synchronization**: Timestamp-based updates

### Data Pipeline
```
External DB (swing_events) → Scraping Scripts → Application DB
                          ↓
                    Data Validation & Normalization
                          ↓
                    User-Facing Application
```

## Recommendations

### Immediate Actions
1. ✅ **Schema Design**: Completed and comprehensive
2. ✅ **Migrations**: Initial migration created
3. ✅ **Indexing**: Performance indexes in place
4. ⏳ **Documentation**: This analysis document

### Future Optimizations
1. **PostGIS Extension**: For advanced geographic queries
2. **Full-Text Search**: PostgreSQL native search
3. **Materialized Views**: For complex aggregations
4. **Partitioning**: For large event datasets

## Conclusion

The database schema is exceptionally well-designed for a festival finder application. It provides:

- **Comprehensive Feature Support**: All core requirements covered
- **Performance Optimization**: Strategic indexing and denormalization
- **Scalability**: Designed for growth and high traffic
- **Data Integrity**: Robust constraints and relationships
- **Extensibility**: Easy to add new features

The schema successfully balances normalization for data integrity with denormalization for performance, creating an optimal foundation for the Blues Dance Festival Finder application.