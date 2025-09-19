-- Seed sample data for testing the integrated database
-- This creates a few sample records to verify the schema works

-- Sample Venues
INSERT INTO venues (id, name, address, city, country, latitude, longitude, "createdAt", "updatedAt") VALUES
('venue1', 'Central Dance Studio', '123 Main St', 'New York', 'USA', 40.7128, -74.0060, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('venue2', 'Blues Palace', '456 Jazz Ave', 'Chicago', 'USA', 41.8781, -87.6298, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('venue3', 'Dance Central', '789 Swing Blvd', 'Los Angeles', 'USA', 34.0522, -118.2437, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Sample Teachers
INSERT INTO teachers (id, name, slug, bio, website, verified, "followerCount", "eventCount", "createdAt", "updatedAt") VALUES
('teacher1', 'Sarah Johnson', 'sarah-johnson', 'Experienced blues dance instructor with 10+ years teaching experience.', 'https://sarahblues.com', true, 150, 25, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('teacher2', 'Michael Blues', 'michael-blues', 'Professional blues dancer and teacher from Chicago.', 'https://michaelblues.com', true, 220, 40, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('teacher3', 'Emma Williams', 'emma-williams', 'International blues dance champion and workshop leader.', NULL, false, 80, 15, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Sample Musicians
INSERT INTO musicians (id, name, slug, bio, instruments, website, verified, "followerCount", "eventCount", "createdAt", "updatedAt") VALUES
('musician1', 'The Blues Brothers Band', 'blues-brothers-band', 'Classic blues band from Chicago playing authentic blues music.', ARRAY['guitar', 'harmonica', 'piano'], 'https://bluesbrothersband.com', true, 500, 60, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('musician2', 'Jazz & Blues Collective', 'jazz-blues-collective', 'Modern blues ensemble with traditional roots.', ARRAY['saxophone', 'bass', 'drums'], NULL, false, 120, 20, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Sample Events
INSERT INTO events (id, name, slug, description, "startDate", "endDate", status, featured, "venueId", website, verified, "createdAt", "updatedAt") VALUES
('event1', 'NYC Blues Weekend 2024', 'nyc-blues-weekend-2024', 'Amazing weekend of blues dancing with top teachers and live music in the heart of New York City.', '2024-09-15 18:00:00', '2024-09-17 23:00:00', 'PUBLISHED', true, 'venue1', 'https://nycbluesweekend.com', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('event2', 'Chicago Blues Festival', 'chicago-blues-festival', 'Annual blues festival featuring workshops, social dancing, and live performances.', '2024-10-10 19:00:00', '2024-10-12 22:00:00', 'PUBLISHED', true, 'venue2', 'https://chicagobluesfest.com', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('event3', 'LA Blues Intensive', 'la-blues-intensive', 'Intensive workshop weekend for intermediate and advanced dancers.', '2024-11-05 10:00:00', '2024-11-07 18:00:00', 'PUBLISHED', false, 'venue3', NULL, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Event-Teacher Relationships
INSERT INTO event_teachers (id, "eventId", "teacherId", role, workshops, level, "createdAt") VALUES
('et1', 'event1', 'teacher1', 'Lead Instructor', ARRAY['Fundamentals', 'Intermediate Technique'], 'Beginner', CURRENT_TIMESTAMP),
('et2', 'event1', 'teacher2', 'Guest Teacher', ARRAY['Advanced Styling', 'Performance'], 'Advanced', CURRENT_TIMESTAMP),
('et3', 'event2', 'teacher2', 'Lead Instructor', ARRAY['Chicago Style Blues', 'Live Music Dancing'], 'Intermediate', CURRENT_TIMESTAMP),
('et4', 'event3', 'teacher3', 'Workshop Leader', ARRAY['Intensive Technique', 'Competition Prep'], 'Advanced', CURRENT_TIMESTAMP);

-- Event-Musician Relationships
INSERT INTO event_musicians (id, "eventId", "musicianId", role, "setTimes", "createdAt") VALUES
('em1', 'event1', 'musician1', 'Headliner', ARRAY['Saturday 21:00-23:00', 'Sunday 20:00-22:00'], CURRENT_TIMESTAMP),
('em2', 'event2', 'musician1', 'Main Act', ARRAY['Friday 22:00-24:00', 'Saturday 21:00-23:00'], CURRENT_TIMESTAMP),
('em3', 'event2', 'musician2', 'Opening Act', ARRAY['Friday 19:00-20:30'], CURRENT_TIMESTAMP);

-- Event Prices
INSERT INTO event_prices (id, "eventId", type, amount, currency, description, "createdAt", "updatedAt") VALUES
('price1', 'event1', 'EARLY_BIRD', 120.00, 'USD', 'Early bird full weekend pass', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('price2', 'event1', 'REGULAR', 150.00, 'USD', 'Regular full weekend pass', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('price3', 'event1', 'STUDENT', 100.00, 'USD', 'Student discount pass', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('price4', 'event2', 'EARLY_BIRD', 100.00, 'USD', 'Early bird registration', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('price5', 'event2', 'REGULAR', 130.00, 'USD', 'Regular registration', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('price6', 'event3', 'REGULAR', 200.00, 'USD', 'Intensive weekend package', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Event Tags
INSERT INTO event_tags (id, "eventId", tag) VALUES
('tag1', 'event1', 'workshop'),
('tag2', 'event1', 'social-dancing'),
('tag3', 'event1', 'live-music'),
('tag4', 'event2', 'festival'),
('tag5', 'event2', 'competition'),
('tag6', 'event3', 'intensive'),
('tag7', 'event3', 'advanced');

-- Teacher Specialties
INSERT INTO teacher_specialties (id, "teacherId", specialty) VALUES
('spec1', 'teacher1', 'Blues Fundamentals'),
('spec2', 'teacher1', 'Social Dancing'),
('spec3', 'teacher2', 'Chicago Style'),
('spec4', 'teacher2', 'Performance'),
('spec5', 'teacher3', 'Competition'),
('spec6', 'teacher3', 'Advanced Technique');

-- Musician Genres
INSERT INTO musician_genres (id, "musicianId", genre) VALUES
('genre1', 'musician1', 'Traditional Blues'),
('genre2', 'musician1', 'Chicago Blues'),
('genre3', 'musician2', 'Modern Blues'),
('genre4', 'musician2', 'Jazz Blues');

-- Final Statistics
SELECT 
    'Sample Data Seeded Successfully!' as status,
    (SELECT COUNT(*) FROM events) as events_created,
    (SELECT COUNT(*) FROM venues) as venues_created,
    (SELECT COUNT(*) FROM teachers) as teachers_created,
    (SELECT COUNT(*) FROM musicians) as musicians_created,
    (SELECT COUNT(*) FROM event_teachers) as teacher_relationships,
    (SELECT COUNT(*) FROM event_prices) as prices_created;