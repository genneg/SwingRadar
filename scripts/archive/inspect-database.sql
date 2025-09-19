-- Script to inspect the existing database structure
-- Run this to understand the current database schema

-- Check if events table exists and its structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'events' 
ORDER BY ordinal_position;

-- Check all tables in the database
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Check event table structure specifically
\d events;

-- Show some sample data from events table to understand structure
SELECT * FROM events LIMIT 3;