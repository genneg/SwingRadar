-- Simple migration: Add our schema alongside existing tables
-- This preserves existing data while adding our new structure

-- Create new enums
DO $$ BEGIN
    CREATE TYPE "EventStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'CANCELLED', 'COMPLETED', 'ARCHIVED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "PriceType" AS ENUM ('EARLY_BIRD', 'REGULAR', 'LATE', 'STUDENT', 'LOCAL', 'VIP', 'DONATION');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create CUID generation function
CREATE OR REPLACE FUNCTION generate_cuid() RETURNS text AS $$
BEGIN
    RETURN 'c' || substr(md5(random()::text || clock_timestamp()::text), 1, 24);
END;
$$ LANGUAGE plpgsql;

-- Create new tables with our schema (with different names to avoid conflicts)
CREATE TABLE IF NOT EXISTS app_users (
    id TEXT PRIMARY KEY DEFAULT generate_cuid(),
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    avatar TEXT,
    verified BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS app_venues (
    id TEXT PRIMARY KEY DEFAULT generate_cuid(),
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT,
    country TEXT NOT NULL,
    latitude DECIMAL(10,8) DEFAULT 0,
    longitude DECIMAL(11,8) DEFAULT 0,
    website TEXT,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS app_teachers (
    id TEXT PRIMARY KEY DEFAULT generate_cuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    bio TEXT,
    website TEXT,
    verified BOOLEAN DEFAULT false,
    "followerCount" INTEGER DEFAULT 0,
    "eventCount" INTEGER DEFAULT 0,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS app_events (
    id TEXT PRIMARY KEY DEFAULT generate_cuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    "startDate" TIMESTAMP NOT NULL,
    "endDate" TIMESTAMP NOT NULL,
    status "EventStatus" DEFAULT 'PUBLISHED',
    featured BOOLEAN DEFAULT false,
    "venueId" TEXT,
    website TEXT,
    verified BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("venueId") REFERENCES app_venues(id)
);

CREATE TABLE IF NOT EXISTS app_event_teachers (
    id TEXT PRIMARY KEY DEFAULT generate_cuid(),
    "eventId" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    role TEXT,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("eventId") REFERENCES app_events(id) ON DELETE CASCADE,
    FOREIGN KEY ("teacherId") REFERENCES app_teachers(id) ON DELETE CASCADE,
    UNIQUE("eventId", "teacherId")
);

CREATE TABLE IF NOT EXISTS app_event_prices (
    id TEXT PRIMARY KEY DEFAULT generate_cuid(),
    "eventId" TEXT NOT NULL,
    type "PriceType" NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    description TEXT,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("eventId") REFERENCES app_events(id) ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_app_venues_city_country ON app_venues(city, country);
CREATE INDEX IF NOT EXISTS idx_app_events_dates ON app_events("startDate", "endDate");
CREATE INDEX IF NOT EXISTS idx_app_events_venue ON app_events("venueId");

-- Migrate data from existing tables
INSERT INTO app_venues (id, name, address, city, country, "createdAt", "updatedAt")
SELECT DISTINCT
    generate_cuid(),
    COALESCE(v.name, 'Venue in ' || e.city),
    COALESCE(v.address, e.city),
    e.city,
    e.country,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM events e
LEFT JOIN venues v ON e.id = v.event_id
WHERE e.city IS NOT NULL AND e.country IS NOT NULL
ON CONFLICT DO NOTHING;

INSERT INTO app_teachers (id, name, slug, bio, website, verified, "createdAt", "updatedAt") 
SELECT 
    generate_cuid(),
    t.name,
    lower(regexp_replace(t.name, '[^a-zA-Z0-9]', '-', 'g')),
    t.bio,
    t.website,
    CASE WHEN t.ai_relevance_score > 0.7 THEN true ELSE false END,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM teachers t
WHERE t.name IS NOT NULL
ON CONFLICT (slug) DO NOTHING;

-- Create a mapping view for venues
CREATE OR REPLACE VIEW venue_mapping AS
SELECT 
    e.id as old_event_id,
    e.city,
    e.country,
    av.id as new_venue_id
FROM events e
JOIN app_venues av ON av.city = e.city AND av.country = e.country
WHERE e.city IS NOT NULL AND e.country IS NOT NULL;

INSERT INTO app_events (id, name, slug, description, "startDate", "endDate", status, "venueId", website, verified, "createdAt", "updatedAt")
SELECT 
    generate_cuid(),
    COALESCE(e.style, 'Dance Festival'),
    lower(regexp_replace(COALESCE(e.style, 'festival-' || e.id::text), '[^a-zA-Z0-9]', '-', 'g')),
    e.description,
    e.from_date,
    e.to_date,
    'PUBLISHED'::"EventStatus",
    vm.new_venue_id,
    e.website,
    CASE WHEN e.ai_quality_score > 0.7 THEN true ELSE false END,
    COALESCE(e.created_at, CURRENT_TIMESTAMP),
    COALESCE(e.updated_at, CURRENT_TIMESTAMP)
FROM events e
JOIN venue_mapping vm ON vm.old_event_id = e.id
WHERE e.from_date IS NOT NULL AND e.to_date IS NOT NULL
ON CONFLICT (slug) DO NOTHING;

-- Migrate event-teacher relationships
INSERT INTO app_event_teachers ("eventId", "teacherId", role, "createdAt")
SELECT DISTINCT
    ae.id,
    at.id,
    et.role,
    CURRENT_TIMESTAMP
FROM event_teachers et
JOIN events e ON e.id = et.event_id
JOIN teachers t ON t.id = et.teacher_id
JOIN app_events ae ON ae.slug = lower(regexp_replace(COALESCE(e.style, 'festival-' || e.id::text), '[^a-zA-Z0-9]', '-', 'g'))
JOIN app_teachers at ON at.slug = lower(regexp_replace(t.name, '[^a-zA-Z0-9]', '-', 'g'))
ON CONFLICT ("eventId", "teacherId") DO NOTHING;

-- Migrate pricing
INSERT INTO app_event_prices ("eventId", type, amount, currency, description, "createdAt", "updatedAt")
SELECT 
    ae.id,
    CASE 
        WHEN p.pass_type ILIKE '%early%' OR p.pass_type ILIKE '%bird%' THEN 'EARLY_BIRD'
        WHEN p.pass_type ILIKE '%student%' THEN 'STUDENT'
        WHEN p.pass_type ILIKE '%local%' THEN 'LOCAL'
        WHEN p.pass_type ILIKE '%vip%' THEN 'VIP'
        ELSE 'REGULAR'
    END::"PriceType",
    p.price,
    COALESCE(p.currency, 'USD'),
    p.pass_type,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM pricing p
JOIN events e ON e.id = p.event_id
JOIN app_events ae ON ae.slug = lower(regexp_replace(COALESCE(e.style, 'festival-' || e.id::text), '[^a-zA-Z0-9]', '-', 'g'))
WHERE p.price IS NOT NULL AND p.price > 0;

-- Update event counts for teachers
UPDATE app_teachers SET "eventCount" = (
    SELECT COUNT(*) 
    FROM app_event_teachers aet 
    WHERE aet."teacherId" = app_teachers.id
);

-- Final statistics
SELECT 
    'Migration Complete!' as status,
    (SELECT COUNT(*) FROM app_events) as events_migrated,
    (SELECT COUNT(*) FROM app_venues) as venues_created,
    (SELECT COUNT(*) FROM app_teachers) as teachers_migrated,
    (SELECT COUNT(*) FROM app_event_teachers) as relationships_created,
    (SELECT COUNT(*) FROM app_event_prices) as prices_migrated;