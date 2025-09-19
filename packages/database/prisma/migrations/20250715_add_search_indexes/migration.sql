-- Enable PostGIS extension for geographic operations
CREATE EXTENSION IF NOT EXISTS postgis;

-- Add full-text search indexes for events
CREATE INDEX IF NOT EXISTS events_name_gin ON events USING gin(to_tsvector('english', name));
CREATE INDEX IF NOT EXISTS events_description_gin ON events USING gin(to_tsvector('english', description));
CREATE INDEX IF NOT EXISTS events_short_desc_gin ON events USING gin(to_tsvector('english', "shortDesc"));

-- Add full-text search indexes for venues
CREATE INDEX IF NOT EXISTS venues_name_gin ON venues USING gin(to_tsvector('english', name));
CREATE INDEX IF NOT EXISTS venues_city_gin ON venues USING gin(to_tsvector('english', city));
CREATE INDEX IF NOT EXISTS venues_country_gin ON venues USING gin(to_tsvector('english', country));

-- Add full-text search indexes for teachers
CREATE INDEX IF NOT EXISTS teachers_name_gin ON teachers USING gin(to_tsvector('english', name));
CREATE INDEX IF NOT EXISTS teachers_bio_gin ON teachers USING gin(to_tsvector('english', bio));

-- Add full-text search indexes for musicians
CREATE INDEX IF NOT EXISTS musicians_name_gin ON musicians USING gin(to_tsvector('english', name));
CREATE INDEX IF NOT EXISTS musicians_bio_gin ON musicians USING gin(to_tsvector('english', bio));

-- Add geographic indexes for venues using PostGIS
CREATE INDEX IF NOT EXISTS venues_location_gist ON venues USING gist(ST_SetSRID(ST_MakePoint(longitude::float, latitude::float), 4326));

-- Add composite indexes for common search patterns
CREATE INDEX IF NOT EXISTS events_date_status_featured ON events ("startDate", status, featured);
CREATE INDEX IF NOT EXISTS events_status_featured_date ON events (status, featured, "startDate");

-- Add indexes for price range queries
CREATE INDEX IF NOT EXISTS event_prices_amount ON event_prices (amount);
CREATE INDEX IF NOT EXISTS event_prices_event_amount ON event_prices ("eventId", amount);

-- Add indexes for teacher and musician filtering
CREATE INDEX IF NOT EXISTS event_teachers_teacher_event ON event_teachers ("teacherId", "eventId");
CREATE INDEX IF NOT EXISTS event_musicians_musician_event ON event_musicians ("musicianId", "eventId");

-- Add indexes for tag-based filtering
CREATE INDEX IF NOT EXISTS event_tags_tag ON event_tags (tag);
CREATE INDEX IF NOT EXISTS event_tags_event_tag ON event_tags ("eventId", tag);

-- Add indexes for popular searches
CREATE INDEX IF NOT EXISTS venues_city_country ON venues (city, country);
CREATE INDEX IF NOT EXISTS events_venue_date ON events ("venueId", "startDate");

-- Add indexes for statistics and sorting
CREATE INDEX IF NOT EXISTS event_saves_event_id ON event_saves ("eventId");
CREATE INDEX IF NOT EXISTS event_attendances_event_id ON event_attendances ("eventId");
CREATE INDEX IF NOT EXISTS event_reviews_event_rating ON event_reviews ("eventId", rating);

-- Add composite index for geographic search with date filtering
CREATE INDEX IF NOT EXISTS venues_location_events_date ON venues 
USING gist(ST_SetSRID(ST_MakePoint(longitude::float, latitude::float), 4326));

-- Update statistics to help query planner
ANALYZE events;
ANALYZE venues;
ANALYZE teachers;
ANALYZE musicians;
ANALYZE event_prices;
ANALYZE event_tags;
ANALYZE event_teachers;
ANALYZE event_musicians;