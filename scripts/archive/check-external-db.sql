-- Check external database content
-- Run with: psql -h localhost -U scraper -d swing_events -f check-external-db.sql

-- Count all tables
SELECT 'events' as table_name, COUNT(*) as count FROM events
UNION ALL
SELECT 'teachers', COUNT(*) FROM teachers
UNION ALL
SELECT 'venues', COUNT(*) FROM venues
UNION ALL
SELECT 'event_teachers', COUNT(*) FROM event_teachers
UNION ALL
SELECT 'pricing', COUNT(*) FROM pricing
UNION ALL
SELECT 'social_media_links', COUNT(*) FROM social_media_links;

-- Sample events
SELECT 'Sample Events:' as info;
SELECT id, from_date, to_date, country, city, style, 
       CASE WHEN length(description) > 50 THEN substring(description for 50) || '...' 
            ELSE description END as description
FROM events 
LIMIT 5;

-- Countries distribution
SELECT 'Countries Distribution:' as info;
SELECT country, COUNT(*) as event_count 
FROM events 
GROUP BY country 
ORDER BY event_count DESC 
LIMIT 10;

-- Sample teachers
SELECT 'Sample Teachers:' as info;
SELECT id, name, 
       CASE WHEN length(bio) > 50 THEN substring(bio for 50) || '...' 
            ELSE bio END as bio,
       ai_relevance_score
FROM teachers 
LIMIT 5;