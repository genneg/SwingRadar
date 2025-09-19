-- Data migration script: Transfer existing data to new schema
-- Run this AFTER migrate-external-db.sql

-- Step 1: Create unique venues from existing data
INSERT INTO venues (id, name, address, city, state, country, latitude, longitude, "createdAt", "updatedAt")
SELECT DISTINCT
    generate_cuid() as id,
    COALESCE(v.name, 'Unknown Venue') as name,
    COALESCE(v.address, e.city) as address,
    e.city,
    '' as state,
    e.country,
    0 as latitude,  -- Will need geocoding later
    0 as longitude, -- Will need geocoding later
    CURRENT_TIMESTAMP as createdAt,
    CURRENT_TIMESTAMP as updatedAt
FROM temp_events_backup e
LEFT JOIN temp_venues_backup v ON e.id = v.event_id
WHERE e.city IS NOT NULL AND e.country IS NOT NULL;

-- Step 2: Create venue mapping table for reference
CREATE TEMP TABLE venue_mapping AS
SELECT 
    e.id as old_event_id,
    e.city,
    e.country,
    v.id as new_venue_id
FROM temp_events_backup e
JOIN venues v ON v.city = e.city AND v.country = e.country
WHERE e.city IS NOT NULL AND e.country IS NOT NULL;

-- Step 3: Migrate teachers
INSERT INTO teachers (id, name, slug, bio, website, verified, "createdAt", "updatedAt")
SELECT 
    generate_cuid() as id,
    name,
    lower(replace(replace(name, ' ', '-'), '''', '')) as slug,
    bio,
    website,
    CASE WHEN ai_relevance_score > 0.7 THEN true ELSE false END as verified,
    CURRENT_TIMESTAMP as createdAt,
    CURRENT_TIMESTAMP as updatedAt
FROM temp_teachers_backup
WHERE name IS NOT NULL;

-- Step 4: Create teacher mapping table
CREATE TEMP TABLE teacher_mapping AS
SELECT 
    tb.id as old_teacher_id,
    t.id as new_teacher_id
FROM temp_teachers_backup tb
JOIN teachers t ON lower(replace(replace(t.name, ' ', '-'), '''', '')) = lower(replace(replace(tb.name, ' ', '-'), '''', ''));

-- Step 5: Migrate events
INSERT INTO events (
    id, name, slug, description, "startDate", "endDate", 
    status, "venueId", website, verified, "createdAt", "updatedAt"
)
SELECT 
    generate_cuid() as id,
    COALESCE(e.style || ' Festival', 'Dance Festival') as name,
    generate_cuid() as slug, -- Will be updated with proper slugs later
    e.description,
    e.from_date::timestamp as startDate,
    e.to_date::timestamp as endDate,
    'PUBLISHED'::EventStatus as status,
    vm.new_venue_id as venueId,
    e.website,
    CASE WHEN e.ai_quality_score > 0.7 THEN true ELSE false END as verified,
    COALESCE(e.created_at, CURRENT_TIMESTAMP) as createdAt,
    COALESCE(e.updated_at, CURRENT_TIMESTAMP) as updatedAt
FROM temp_events_backup e
JOIN venue_mapping vm ON vm.old_event_id = e.id
WHERE e.from_date IS NOT NULL AND e.to_date IS NOT NULL;

-- Step 6: Create event mapping table
CREATE TEMP TABLE event_mapping AS
SELECT 
    eb.id as old_event_id,
    e.id as new_event_id
FROM temp_events_backup eb
JOIN venue_mapping vm ON vm.old_event_id = eb.id
JOIN events e ON e.venueId = vm.new_venue_id 
    AND e.startDate = eb.from_date::timestamp
    AND e.endDate = eb.to_date::timestamp;

-- Step 7: Migrate event-teacher relationships
INSERT INTO event_teachers (id, "eventId", "teacherId", role, "createdAt")
SELECT 
    generate_cuid() as id,
    em.new_event_id as eventId,
    tm.new_teacher_id as teacherId,
    et.role,
    CURRENT_TIMESTAMP as createdAt
FROM temp_event_teachers_backup et
JOIN event_mapping em ON em.old_event_id = et.event_id
JOIN teacher_mapping tm ON tm.old_teacher_id = et.teacher_id;

-- Step 8: Migrate pricing data
INSERT INTO event_prices (id, "eventId", type, amount, currency, description, "createdAt", "updatedAt")
SELECT 
    generate_cuid() as id,
    em.new_event_id as eventId,
    CASE 
        WHEN p.pass_type ILIKE '%early%' OR p.pass_type ILIKE '%bird%' THEN 'EARLY_BIRD'
        WHEN p.pass_type ILIKE '%student%' THEN 'STUDENT'
        WHEN p.pass_type ILIKE '%local%' THEN 'LOCAL'
        WHEN p.pass_type ILIKE '%vip%' THEN 'VIP'
        ELSE 'REGULAR'
    END::PriceType as type,
    COALESCE(p.price, 0) as amount,
    COALESCE(p.currency, 'USD') as currency,
    p.pass_type as description,
    CURRENT_TIMESTAMP as createdAt,
    CURRENT_TIMESTAMP as updatedAt
FROM temp_pricing_backup p
JOIN event_mapping em ON em.old_event_id = p.event_id
WHERE p.price IS NOT NULL AND p.price > 0;

-- Step 9: Update event slugs with proper names
UPDATE events 
SET slug = lower(regexp_replace(regexp_replace(name, '[^a-zA-Z0-9\s]', '', 'g'), '\s+', '-', 'g'))
WHERE slug LIKE 'c%'; -- Only update CUID-based slugs

-- Step 10: Update teacher and event counts
UPDATE teachers SET eventCount = (
    SELECT COUNT(*) 
    FROM event_teachers et 
    WHERE et.teacherId = teachers.id
);

-- Step 11: Clean up temporary tables
DROP TABLE IF EXISTS temp_events_backup;
DROP TABLE IF EXISTS temp_teachers_backup;
DROP TABLE IF EXISTS temp_venues_backup;
DROP TABLE IF EXISTS temp_event_teachers_backup;
DROP TABLE IF EXISTS temp_pricing_backup;
DROP TABLE IF EXISTS temp_social_media_backup;
DROP TABLE IF EXISTS venue_mapping;
DROP TABLE IF EXISTS teacher_mapping;
DROP TABLE IF EXISTS event_mapping;

-- Step 12: Final statistics
SELECT 
    'Data Migration Complete' as status,
    (SELECT COUNT(*) FROM events) as events_migrated,
    (SELECT COUNT(*) FROM venues) as venues_created,
    (SELECT COUNT(*) FROM teachers) as teachers_migrated,
    (SELECT COUNT(*) FROM event_teachers) as relationships_created,
    (SELECT COUNT(*) FROM event_prices) as prices_migrated;