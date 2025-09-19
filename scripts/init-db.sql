-- Initialize database for Blues Dance Festival Finder

-- Enable PostGIS extension for geographic data
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create initial schema
CREATE SCHEMA IF NOT EXISTS public;

-- Set timezone
SET timezone = 'UTC';

-- Initial database setup complete
SELECT 'Database initialized successfully' as status;