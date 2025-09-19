# Database Migration Strategy - External Integration

## Current Situation

### External Database Schema (`swing_events`)
- **Simplified schema** from scraping system
- **Pre-populated data** with real festival information
- **7 models**: Event, Venue, Teacher, EventTeacher, pricing, social_media_links, ai_extraction_logs

### Our Application Schema
- **Comprehensive schema** with 22+ models
- **Full feature support** (users, following, notifications, etc.)
- **Production-ready** with proper relationships and constraints

## Integration Strategy

### Option 1: Schema Migration (Recommended)
Migrate the external database to our comprehensive schema while preserving existing data.

#### Steps:
1. **Backup external data**
2. **Create data mapping script** (external schema → our schema)
3. **Apply our migrations** to external database
4. **Migrate existing data** to new structure
5. **Verify data integrity**

#### Benefits:
- ✅ Full application functionality
- ✅ Preserve existing scraped data
- ✅ Production-ready schema
- ✅ All features available immediately

#### Challenges:
- 🔶 Complex data transformation required
- 🔶 Potential data loss if mapping is incorrect

### Option 2: Dual Schema Approach
Keep external database as read-only data source, create separate application database.

#### Steps:
1. **Create application database** with our schema
2. **Create sync service** to copy data from external to application DB
3. **Regular synchronization** for new scraped data

#### Benefits:
- ✅ No risk to existing data
- ✅ Gradual migration possible
- ✅ Fallback option available

#### Challenges:
- 🔶 Increased complexity
- 🔶 Data synchronization overhead
- 🔶 Potential data inconsistency

### Option 3: Schema Adaptation (Not Recommended)
Adapt our application to work with the simplified external schema.

#### Benefits:
- ✅ Immediate access to data
- ✅ No migration required

#### Challenges:
- ❌ Limited application functionality
- ❌ Missing core features (users, following, etc.)
- ❌ Not suitable for production

## Recommended Approach: Schema Migration

### Phase 1: Data Analysis and Mapping

#### External Schema Analysis
```sql
-- Events mapping
external.events → our.events
- id (int) → need to convert to cuid
- from_date → startDate
- to_date → endDate
- country, city → need to find/create venue
- website → website
- style → could map to tags
- description → description

-- Teachers mapping
external.teachers → our.teachers
- id (int) → need to convert to cuid
- name → name
- bio → bio
- website → website
- ai_relevance_score → could use for verification

-- Venues mapping
external.venues → our.venues
- Need to extract unique venues from external data
- Combine with event location data
- Generate coordinates (geocoding required)

-- Pricing mapping
external.pricing → our.event_prices
- Map pass_type to our PriceType enum
- Convert price formats
```

### Phase 2: Data Transformation Script

#### Key Transformations Needed

1. **ID Generation**
   ```javascript
   // Convert integer IDs to CUIDs
   const newId = cuid();
   const idMapping = new Map(); // old_id -> new_id
   ```

2. **Venue Extraction**
   ```javascript
   // Extract unique venues from events
   const venues = extractUniqueVenues(events);
   // Geocode addresses to get coordinates
   const geocodedVenues = await geocodeVenues(venues);
   ```

3. **Enum Mapping**
   ```javascript
   // Map external values to our enums
   const priceTypeMapping = {
     'full_pass': 'REGULAR',
     'student': 'STUDENT',
     'early_bird': 'EARLY_BIRD'
   };
   ```

4. **Default Values**
   ```javascript
   // Add required fields with defaults
   const defaultValues = {
     status: 'PUBLISHED',
     featured: false,
     verified: false,
     publicationDate: new Date(),
     // ... other defaults
   };
   ```

### Phase 3: Migration Execution

#### Pre-Migration Checklist
- [ ] **Backup external database**
- [ ] **Test migration script on copy**
- [ ] **Verify data mapping accuracy**
- [ ] **Prepare rollback procedure**

#### Migration Steps
```sql
-- 1. Create backup
pg_dump swing_events > swing_events_backup.sql

-- 2. Apply our schema migrations
-- (This will add new tables and modify existing ones)

-- 3. Run data transformation script
-- (Populate new structure with existing data)

-- 4. Verify data integrity
-- (Run validation queries)

-- 5. Update sequences and constraints
-- (Ensure everything is consistent)
```

### Phase 4: Validation and Testing

#### Data Integrity Checks
```sql
-- Verify all events migrated
SELECT COUNT(*) FROM old_events vs new_events;

-- Check foreign key relationships
SELECT COUNT(*) FROM events e 
LEFT JOIN venues v ON e.venueId = v.id 
WHERE v.id IS NULL;

-- Validate enum values
SELECT DISTINCT status FROM events;
```

#### Application Testing
- [ ] **Event listing works**
- [ ] **Event details display correctly**
- [ ] **Teacher/venue relationships intact**
- [ ] **Pricing information accurate**

## Implementation Plan

### Immediate Actions (Today)
1. **Create backup** of external database
2. **Write data exploration script** to understand data quality
3. **Create ID mapping tables** for tracking conversions

### Next Steps (This Week)
1. **Develop migration script** for core entities
2. **Test migration** on database copy
3. **Implement data validation** checks

### Future Enhancements
1. **Set up ongoing sync** for new scraped data
2. **Implement data quality monitoring**
3. **Add manual data correction tools**

## Migration Script Structure

```javascript
// migration-script.js
const migrationSteps = [
  'backupExternalData',
  'createIdMappings', 
  'migrateVenues',
  'migrateTeachers',
  'migrateEvents',
  'migratePricing',
  'migrateEventTeachers',
  'validateMigration',
  'updateSequences'
];
```

## Risk Mitigation

### Data Loss Prevention
- **Complete backup** before any changes
- **Incremental migration** with checkpoints
- **Rollback procedures** documented and tested

### Quality Assurance
- **Data validation** at each step
- **Sample data testing** before full migration
- **Manual verification** of critical records

### Performance Considerations
- **Batch processing** for large datasets
- **Index management** during migration
- **Connection pooling** for efficiency

This strategy ensures we can leverage the valuable scraped data while maintaining our comprehensive application schema and full feature set.