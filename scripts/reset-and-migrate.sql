-- Complete reset and migration script
-- This will completely reset the database and apply our schema with data

-- Step 1: Drop everything
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;

-- Step 2: Recreate the original external tables for backup reference
CREATE TABLE original_events (
    id INTEGER,
    from_date DATE,
    to_date DATE,
    country VARCHAR(100),
    city VARCHAR(100),
    website VARCHAR(500),
    style VARCHAR(100),
    description TEXT,
    ai_quality_score DECIMAL(3,2),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE original_teachers (
    id INTEGER,
    name VARCHAR(200),
    bio TEXT,
    website VARCHAR(500),
    ai_relevance_score DECIMAL(3,2)
);

CREATE TABLE original_venues (
    id INTEGER,
    event_id INTEGER,
    name VARCHAR(200),
    address TEXT
);

CREATE TABLE original_event_teachers (
    event_id INTEGER,
    teacher_id INTEGER,
    role VARCHAR(100)
);

CREATE TABLE original_pricing (
    id INTEGER,
    event_id INTEGER,
    pass_type VARCHAR(100),
    price DECIMAL(10,2),
    currency VARCHAR(3)
);

-- Note: You'll need to re-populate these tables from your backup data
-- Then run the full migration script

SELECT 'Database reset complete. Please re-populate original tables and run migration.' as status;