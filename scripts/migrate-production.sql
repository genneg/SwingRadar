-- Production Migration Script for Supabase
-- Run this in Supabase SQL Editor after creating the project

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For text search

-- Enable Row Level Security (optional but recommended)
-- ALTER DEFAULT PRIVILEGES REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC;

-- Create database if not exists (usually not needed in Supabase)
-- CREATE DATABASE swing_events;

-- Set timezone
SET timezone = 'UTC';

-- Note: The following tables will be created automatically by Prisma migration
-- But we list them here for reference:

/*
Expected tables from Prisma schema:
- events (main festival events)
- event_teachers (many-to-many events <-> teachers)  
- venues (event venues)
- teachers (dance teachers)
- musicians (blues musicians)
- event_musicians (many-to-many events <-> musicians)
- event_prices (pricing tiers for events)
- users (application users)
- accounts (oauth accounts)
- user_preferences (user settings)
- saved_searches (user saved searches)
- user_follow_teachers (user follows teachers)
- user_follow_musicians (user follows musicians)
- user_follow_events (user follows events)
- user_notifications (user notifications)
- social_media (social media links for entities)
*/

-- Create indexes for better performance (Prisma will create these too)
-- These are additional performance indexes

-- Full text search indexes (run after Prisma migration)
-- Uncomment these after running: npx prisma migrate deploy

-- CREATE INDEX IF NOT EXISTS idx_events_fulltext 
-- ON events USING GIN (to_tsvector('english', name || ' ' || COALESCE(description, '')));

-- CREATE INDEX IF NOT EXISTS idx_teachers_fulltext 
-- ON teachers USING GIN (to_tsvector('english', name || ' ' || COALESCE(bio, '')));

-- CREATE INDEX IF NOT EXISTS idx_musicians_fulltext 
-- ON musicians USING GIN (to_tsvector('english', name || ' ' || COALESCE(bio, '')));

-- Additional performance indexes
-- CREATE INDEX IF NOT EXISTS idx_events_date_range 
-- ON events (from_date, to_date) WHERE from_date >= CURRENT_DATE;

-- CREATE INDEX IF NOT EXISTS idx_events_location 
-- ON events (country, city) WHERE from_date >= CURRENT_DATE;

-- Create initial admin user (run after Prisma migration)
-- Uncomment these after running: npx prisma migrate deploy

-- INSERT INTO users (email, name, verified, created_at, updated_at)
-- VALUES ('admin@festivalscout.com', 'Festival Scout Admin', true, NOW(), NOW())
-- ON CONFLICT (email) DO NOTHING;

-- Insert default user preferences for admin
-- INSERT INTO user_preferences (
--   user_id, 
--   email_notifications, 
--   push_notifications, 
--   new_event_notifications,
--   deadlineReminders,
--   weeklyDigest,
--   followingUpdates,
--   theme,
--   language,
--   defaultCountry,
--   timezone,
--   created_at,
--   updated_at
-- )
-- SELECT 
--   u.id,
--   true,
--   true, 
--   true,
--   true,
--   true,
--   true,
--   'light',
--   'en',
--   'US',
--   'UTC',
--   NOW(),
--   NOW()
-- FROM users u 
-- WHERE u.email = 'admin@festivalscout.com'
-- ON CONFLICT (user_id) DO NOTHING;

-- Insert sample event styles/categories
CREATE TABLE IF NOT EXISTS temp_event_styles (style VARCHAR(100));
INSERT INTO temp_event_styles VALUES 
  ('Blues Dance'),
  ('Slow Blues'),
  ('Chicago Blues'),
  ('Traditional Blues'),
  ('Modern Blues'),
  ('Blues Fusion');

-- Success message
SELECT 'Supabase migration completed successfully! Run: npx prisma migrate deploy' as status;