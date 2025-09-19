-- Data Migration Script: Local DB → Supabase
-- This script exports data from your current local database
-- and prepares it for import into Supabase

-- STEP 1: Export data from current database (run locally)
-- Connect to your current database and run these queries to export data

-- Export Events
\copy (
  SELECT 
    id,
    name,
    from_date,
    to_date,
    country,
    city,
    website,
    style,
    description,
    ai_quality_score,
    ai_completeness_score,
    extraction_method,
    created_at,
    updated_at,
    image_url
  FROM events
  ORDER BY id
) TO '/tmp/events_export.csv' WITH CSV HEADER;

-- Export Teachers  
\copy (
  SELECT
    id,
    name,
    bio,
    website,
    ai_bio_summary,
    ai_relevance_score,
    image_url
  FROM teachers
  ORDER BY id
) TO '/tmp/teachers_export.csv' WITH CSV HEADER;

-- Export Musicians
\copy (
  SELECT
    id,
    name,
    slug,
    bio,
    avatar,
    verified,
    instruments,
    yearsActive,
    website,
    email,
    followerCount,
    eventCount,
    createdAt,
    updatedAt,
    image_url
  FROM musicians
  ORDER BY id
) TO '/tmp/musicians_export.csv' WITH CSV HEADER;

-- Export Event-Teacher relationships
\copy (
  SELECT
    event_id,
    teacher_id,
    role
  FROM event_teachers
  ORDER BY event_id, teacher_id
) TO '/tmp/event_teachers_export.csv' WITH CSV HEADER;

-- Export Event-Musician relationships
\copy (
  SELECT
    id,
    event_id,
    musician_id,
    role,
    set_times,
    created_at
  FROM event_musicians
  ORDER BY event_id, musician_id
) TO '/tmp/event_musicians_export.csv' WITH CSV HEADER;

-- Export Venues
\copy (
  SELECT
    id,
    event_id,
    name,
    address,
    type
  FROM venues
  ORDER BY id
) TO '/tmp/venues_export.csv' WITH CSV HEADER;

-- Export Event Prices
\copy (
  SELECT
    id,
    event_id,
    type,
    amount,
    currency,
    deadline,
    description,
    available,
    created_at,
    updated_at
  FROM event_prices
  ORDER BY event_id, id
) TO '/tmp/event_prices_export.csv' WITH CSV HEADER;

-- Export Social Media Links
\copy (
  SELECT
    id,
    entity_type,
    entity_id,
    platform,
    url,
    username,
    is_verified,
    follower_count,
    created_at,
    updated_at
  FROM social_media
  ORDER BY entity_type, entity_id
) TO '/tmp/social_media_export.csv' WITH CSV HEADER;

-- STEP 2: Import commands for Supabase (run in Supabase SQL Editor)
-- After uploading CSV files to a accessible location, use these commands:

/*
-- Import Events
COPY events (
  id, name, from_date, to_date, country, city, website, style, description,
  ai_quality_score, ai_completeness_score, extraction_method, created_at, updated_at, image_url
) FROM '/path/to/events_export.csv' WITH CSV HEADER;

-- Import Teachers
COPY teachers (
  id, name, bio, website, ai_bio_summary, ai_relevance_score, image_url
) FROM '/path/to/teachers_export.csv' WITH CSV HEADER;

-- Import Musicians  
COPY musicians (
  id, name, slug, bio, avatar, verified, instruments, yearsActive, website,
  email, followerCount, eventCount, createdAt, updatedAt, image_url
) FROM '/path/to/musicians_export.csv' WITH CSV HEADER;

-- Import Venues
COPY venues (
  id, event_id, name, address, type
) FROM '/path/to/venues_export.csv' WITH CSV HEADER;

-- Import Event-Teacher relationships
COPY event_teachers (
  event_id, teacher_id, role
) FROM '/path/to/event_teachers_export.csv' WITH CSV HEADER;

-- Import Event-Musician relationships
COPY event_musicians (
  id, event_id, musician_id, role, set_times, created_at
) FROM '/path/to/event_musicians_export.csv' WITH CSV HEADER;

-- Import Event Prices
COPY event_prices (
  id, event_id, type, amount, currency, deadline, description, available, created_at, updated_at
) FROM '/path/to/event_prices_export.csv' WITH CSV HEADER;

-- Import Social Media
COPY social_media (
  id, entity_type, entity_id, platform, url, username, is_verified, 
  follower_count, created_at, updated_at
) FROM '/path/to/social_media_export.csv' WITH CSV HEADER;

-- Reset sequence counters to avoid ID conflicts
SELECT setval('events_id_seq', (SELECT MAX(id) FROM events));
SELECT setval('teachers_id_seq', (SELECT MAX(id) FROM teachers));
SELECT setval('musicians_id_seq', (SELECT MAX(id) FROM musicians));
SELECT setval('venues_id_seq', (SELECT MAX(id) FROM venues));
SELECT setval('event_musicians_id_seq', (SELECT MAX(id) FROM event_musicians));
SELECT setval('event_prices_id_seq', (SELECT MAX(id) FROM event_prices));
SELECT setval('social_media_id_seq', (SELECT MAX(id) FROM social_media));
*/

-- Alternative: JSON export for easier handling
SELECT 'Data export completed. Check /tmp/ for CSV files' as status;
SELECT 'Upload CSV files to Supabase and run import commands' as next_step;