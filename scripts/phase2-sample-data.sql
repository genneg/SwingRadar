-- Phase 2 Sample Data: Adding Swing Dance Events and Teachers
-- This script demonstrates the multi-style capabilities of SwingRadar

-- Add Swing Dance Teachers
INSERT INTO teachers (name, bio, specializations, experience_levels, teaching_since, credentials, preferred_events, created_at, updated_at) VALUES
(
  'Frankie Manning Jr.',
  'Legendary Lindy Hop dancer and choreographer, known as the "Ambassador of Lindy Hop". Second-generation Lindy Hopper who helped revive the dance in the 1980s.',
  ARRAY['swing', 'lindy hop', 'charleston'],
  '{"swing": "expert", "lindy hop": "expert", "charleston": "advanced"}',
  1982,
  ARRAY['Lindy Hop Hall of Fame', 'National Heritage Fellowship', 'Tony Award for Choreography'],
  ARRAY['festival', 'workshop', 'masterclass'],
  NOW(),
  NOW()
),
(
  'Eva Burrows',
  'International swing dance champion and teacher specializing in authentic swing era styles. Expert in musicality and connection techniques.',
  ARRAY['swing', 'lindy hop', 'east coast swing'],
  '{"swing": "expert", "lindy hop": "expert", "east coast swing": "advanced"}',
  2005,
  ARRAY['World Swing Dance Champion', 'US Open Swing Dance Champion'],
  ARRAY['festival', 'workshop', 'competition'],
  NOW(),
  NOW()
),
(
  'Steven Mitchell',
  'Master of East Coast Swing and Lindy Hop with over 25 years of teaching experience. Known for breaking down complex moves into simple steps.',
  ARRAY['swing', 'lindy hop', 'east coast swing'],
  '{"swing": "expert", "lindy hop": "advanced", "east coast swing": "expert"}',
  1998,
  ARRAY['Certified Swing Dance Instructor', 'Grand National Dance Champion'],
  ARRAY['workshop', 'intensive', 'social'],
  NOW(),
  NOW()
),
(
  'Carla Heiney',
  'Charleston and swing dance specialist with a focus on historical authenticity and vintage styling. Expert in 1920s-1940s dance forms.',
  ARRAY['swing', 'charleston', 'lindy hop'],
  '{"swing": "advanced", "charleston": "expert", "lindy hop": "intermediate"}',
  2008,
  ARRAY['Historical Dance Society Member', 'Vintage Dance Preservation Award'],
  ARRAY['workshop', 'masterclass', 'festival'],
  NOW(),
  NOW()
),
(
  'Marcus Koch & Bärbl Kauker',
  'International swing dance duo known for their smooth style and excellent teaching methodology. Specialize in Lindy Hop and Balboa.',
  ARRAY['swing', 'lindy hop', 'balboa'],
  '{"swing": "expert", "lindy hop": "expert", "balboa": "advanced"}',
  1995,
  ARRAY['European Swing Dance Champions', 'German Dance Sport Federation'],
  ARRAY['festival', 'workshop', 'competition'],
  NOW(),
  NOW()
);

-- Add Swing Dance Events
INSERT INTO events (name, from_date, to_date, city, country, style, dance_styles, primary_style, difficulty_level, event_types, description, ai_quality_score, ai_completeness_score, extraction_method, image_url, created_at, updated_at) VALUES
(
  'Herräng Dance Camp 2025',
  '2025-07-15',
  '2025-07-27',
  'Stockholm',
  'Sweden',
  'swing',
  ARRAY['swing', 'lindy hop', 'charleston', 'balboa', 'shag'],
  'swing',
  'all',
  ARRAY['festival', 'workshop', 'social', 'competition'],
  'The world''s largest swing dance festival featuring world-class instructors, live music, and non-stop dancing. This historic camp offers immersive learning in all swing dance styles.',
  95,
  92,
  'automated',
  '/uploads/herrang-2025.jpg',
  NOW(),
  NOW()
),
(
  'Snowball 2025 - Swing Dance Classic',
  '2025-12-27',
  '2025-12-31',
  'Washington DC',
  'United States',
  'swing',
  ARRAY['swing', 'lindy hop', 'east coast swing'],
  'swing',
  'all',
  ARRAY['festival', 'competition', 'social'],
  'America''s premier New Year''s Eve swing dance celebration featuring competitions, live bands, and the legendary Snowball ballroom.',
  98,
  95,
  'automated',
  '/uploads/snowball-2025.jpg',
  NOW(),
  NOW()
),
(
  'Lindy Shock 2025',
  '2025-10-10',
  '2025-10-13',
  'Budapest',
  'Hungary',
  'swing',
  ARRAY['swing', 'lindy hop'],
  'swing',
  'intermediate',
  ARRAY['festival', 'workshop', 'social'],
  'Central Europe''s most exciting Lindy Hop festival with international instructors, live music, and vibrant social dancing.',
  90,
  88,
  'automated',
  '/uploads/lindy-shock-2025.jpg',
  NOW(),
  NOW()
),
(
  'Camp Hollywood 2025',
  '2025-08-01',
  '2025-08-04',
  'Los Angeles',
  'United States',
  'swing',
  ARRAY['swing', 'lindy hop', 'balboa', 'shag'],
  'swing',
  'all',
  ARRAY['festival', 'workshop', 'competition', 'social'],
  'Classic Hollywood swing dance festival celebrating the golden age of swing with authentic venues and vintage atmosphere.',
  92,
  90,
  'automated',
  '/uploads/camp-hollywood-2025.jpg',
  NOW(),
  NOW()
),
(
  'London Swing Festival 2025',
  '2025-05-15',
  '2025-05-18',
  'London',
  'United Kingdom',
  'swing',
  ARRAY['swing', 'lindy hop', 'east coast swing'],
  'swing',
  'beginner',
  ARRAY['festival', 'workshop', 'social'],
  'Perfect introduction to swing dancing for beginners. Friendly atmosphere with expert teachers and live swing music.',
  85,
  82,
  'automated',
  '/uploads/london-swing-2025.jpg',
  NOW(),
  NOW()
),
(
  'Swing Out New Hampshire 2025',
  '2025-06-20',
  '2025-06-23',
  'New Hampshire',
  'United States',
  'swing',
  ARRAY['swing', 'lindy hop', 'charleston'],
  'swing',
  'all',
  ARRAY['festival', 'workshop', 'social'],
  'Beautiful lakeside swing dance festival featuring world-class instructors, outdoor dancing, and stunning mountain views.',
  88,
  85,
  'automated',
  '/uploads/swing-out-nh-2025.jpg',
  NOW(),
  NOW()
),
(
  'Chicago Swing Dance Festival 2025',
  '2025-09-12',
  '2025-09-15',
  'Chicago',
  'United States',
  'swing',
  ARRAY['swing', 'lindy hop', 'east coast swing'],
  'swing',
  'intermediate',
  ARRAY['festival', 'workshop', 'social', 'competition'],
  'Celebrating Chicago''s rich swing dance heritage with authentic venues, live music, and world-class competitions.',
  90,
  87,
  'automated',
  '/uploads/chicago-swing-2025.jpg',
  NOW(),
  NOW()
),
(
  'Berlin Swing Exchange 2025',
  '2025-04-03',
  '2025-04-06',
  'Berlin',
  'Germany',
  'swing',
  ARRAY['swing', 'lindy hop', 'balboa'],
  'swing',
  'all',
  ARRAY['festival', 'workshop', 'social'],
  'European swing dance exchange with international flavor, featuring teachers from around the world and vibrant social dancing.',
  87,
  84,
  'automated',
  '/uploads/berlin-swing-2025.jpg',
  NOW(),
  NOW()
);

-- Link Teachers to Events
INSERT INTO event_teachers (event_id, teacher_id, role) VALUES
-- Herräng Dance Camp
((SELECT id FROM events WHERE name = 'Herräng Dance Camp 2025'), (SELECT id FROM teachers WHERE name = 'Frankie Manning Jr.'), 'Head Instructor'),
((SELECT id FROM events WHERE name = 'Herräng Dance Camp 2025'), (SELECT id FROM teachers WHERE name = 'Eva Burrows'), 'Competition Judge'),
((SELECT id FROM events WHERE name = 'Herräng Dance Camp 2025'), (SELECT id FROM teachers WHERE name = 'Marcus Koch & Bärbl Kauker'), 'Workshop Instructor'),

-- Snowball
((SELECT id FROM events WHERE name = 'Snowball 2025 - Swing Dance Classic'), (SELECT id FROM teachers WHERE name = 'Steven Mitchell'), 'Competition Director'),
((SELECT id FROM events WHERE name = 'Snowball 2025 - Swing Dance Classic'), (SELECT id FROM teachers WHERE name = 'Eva Burrows'), 'Head Judge'),

-- Lindy Shock
((SELECT id FROM events WHERE name = 'Lindy Shock 2025'), (SELECT id FROM teachers WHERE name = 'Marcus Koch & Bärbl Kauker'), 'Featured Instructor'),
((SELECT id FROM events WHERE name = 'Lindy Shock 2025'), (SELECT id FROM teachers WHERE name = 'Carla Heiney'), 'Charleston Specialist'),

-- Camp Hollywood
((SELECT id FROM events WHERE name = 'Camp Hollywood 2025'), (SELECT id FROM teachers WHERE name = 'Steven Mitchell'), 'Lindy Hop Instructor'),
((SELECT id FROM events WHERE name = 'Camp Hollywood 2025'), (SELECT id FROM teachers WHERE name = 'Carla Heiney'), 'Vintage Style Expert'),

-- London Swing Festival
((SELECT id FROM events WHERE name = 'London Swing Festival 2025'), (SELECT id FROM teachers WHERE name = 'Eva Burrows'), 'Beginner Program Director'),
((SELECT id FROM events WHERE name = 'London Swing Festival 2025'), (SELECT id FROM teachers WHERE name = 'Steven Mitchell'), 'East Coast Swing Specialist'),

-- Swing Out New Hampshire
((SELECT id FROM events WHERE name = 'Swing Out New Hampshire 2025'), (SELECT id FROM teachers WHERE name = 'Frankie Manning Jr.'), 'Guest of Honor'),
((SELECT id FROM events WHERE name = 'Swing Out New Hampshire 2025'), (SELECT id FROM teachers WHERE name = 'Carla Heiney'), 'Charleston Workshop Leader'),

-- Chicago Swing Dance Festival
((SELECT id FROM events WHERE name = 'Chicago Swing Dance Festival 2025'), (SELECT id FROM teachers WHERE name = 'Marcus Koch & Bärbl Kauker'), 'International Guest'),
((SELECT id FROM events WHERE name = 'Chicago Swing Dance Festival 2025'), (SELECT id FROM teachers WHERE name = 'Eva Burrows'), 'Competition Head Judge'),

-- Berlin Swing Exchange
((SELECT id FROM events WHERE name = 'Berlin Swing Exchange 2025'), (SELECT id FROM teachers WHERE name = 'Steven Mitchell'), 'Workshop Leader'),
((SELECT id FROM events WHERE name = 'Berlin Swing Exchange 2025'), (SELECT id FROM teachers WHERE name = 'Carla Heiney'), 'Historical Dance Expert');

-- Add Sample Musicians
INSERT INTO musicians (name, slug, bio, instruments, music_genres, primary_genre, performance_types, yearsActive, website, followerCount, eventCount, created_at, updated_at) VALUES
(
  'Count Basie Orchestra',
  'count-basie-orchestra',
  'Legendary big band orchestra led by William "Count" Basie, defining the Kansas City jazz sound and swing era.',
  ARRAY['piano', 'trumpet', 'saxophone', 'trombone', 'drums', 'bass'],
  ARRAY['swing', 'jazz', 'big-band'],
  'swing',
  ARRAY['live', 'band'],
  85,
  'https://countbasie.com',
  150000,
  250,
  NOW(),
  NOW()
),
(
  'Benny Goodman Quartet',
  'benny-goodman-quartet',
  'The "King of Swing" and his legendary quartet, pioneers of the swing era and clarinet virtuosos.',
  ARRAY['clarinet', 'piano', 'vibraphone', 'drums', 'bass'],
  ARRAY['swing', 'jazz', 'big-band'],
  'swing',
  ARRAY['live', 'band'],
  90,
  'https://bennygoodman.com',
  200000,
  300,
  NOW(),
  NOW()
),
(
  'Duke Ellington Orchestra',
  'duke-ellington-orchestra',
  'Sophisticated jazz orchestra led by Duke Ellington, masters of swing, jazz, and big band arrangements.',
  ARRAY['piano', 'trumpet', 'saxophone', 'trombone', 'drums', 'bass'],
  ARRAY['swing', 'jazz', 'big-band'],
  'jazz',
  ARRAY['live', 'band'],
  95,
  'https://dukeellington.com',
  250000,
  400,
  NOW(),
  NOW()
),
(
  'Ella Fitzgerald',
  'ella-fitzgerald',
  'The "First Lady of Song" with unparalleled vocal range and improvisational skills in jazz and swing.',
  ARRAY['vocals'],
  ARRAY['swing', 'jazz', 'big-band'],
  'jazz',
  ARRAY['live', 'solo'],
  60,
  'https://ellafitzgerald.com',
  500000,
  150,
  NOW(),
  NOW()
);

-- Link Musicians to Events
INSERT INTO event_musicians (event_id, musician_id, role, set_times) VALUES
-- Herräng Dance Camp
((SELECT id FROM events WHERE name = 'Herräng Dance Camp 2025'), (SELECT id FROM musicians WHERE name = 'Count Basie Orchestra'), 'Headliner', ARRAY['2025-07-20 20:00', '2025-07-21 21:00']),
((SELECT id FROM events WHERE name = 'Herräng Dance Camp 2025'), (SELECT id FROM musicians WHERE name = 'Ella Fitzgerald'), 'Special Guest', ARRAY['2025-07-22 19:30']),

-- Snowball
((SELECT id FROM events WHERE name = 'Snowball 2025 - Swing Dance Classic'), (SELECT id FROM musicians WHERE name = 'Benny Goodman Quartet'), 'New Year''s Eve Special', ARRAY['2025-12-31 22:00']),
((SELECT id FROM events WHERE name = 'Snowball 2025 - Swing Dance Classic'), (SELECT id FROM musicians WHERE name = 'Duke Ellington Orchestra'), 'Big Band Night', ARRAY['2025-12-30 21:00']),

-- Lindy Shock
((SELECT id FROM events WHERE name = 'Lindy Shock 2025'), (SELECT id FROM musicians WHERE name = 'Count Basie Orchestra'), 'International Headliner', ARRAY['2025-10-12 20:00']),

-- Camp Hollywood
((SELECT id FROM events WHERE name = 'Camp Hollywood 2025'), (SELECT id FROM musicians WHERE name = 'Benny Goodman Quartet'), 'Vintage Night', ARRAY['2025-08-02 21:00']),
((SELECT id FROM events WHERE name = 'Camp Hollywood 2025'), (SELECT id FROM musicians WHERE name = 'Ella Fitzgerald'), 'Lady Song Night', ARRAY['2025-08-03 20:00']),

-- Chicago Swing Dance Festival
((SELECT id FROM events WHERE name = 'Chicago Swing Dance Festival 2025'), (SELECT id FROM musicians WHERE name = 'Duke Ellington Orchestra'), 'Chicago Jazz Legend', ARRAY['2025-09-13 21:00']),

-- Berlin Swing Exchange
((SELECT id FROM events WHERE name = 'Berlin Swing Exchange 2025'), (SELECT id FROM musicians WHERE name = 'Count Basie Orchestra'), 'European Tour', ARRAY['2025-04-05 20:00']);

-- Add Pricing for Events
INSERT INTO event_prices (event_id, type, amount, currency, description, available, created_at, updated_at) VALUES
-- Herräng Dance Camp
((SELECT id FROM events WHERE name = 'Herräng Dance Camp 2025'), 'Full Pass', 899.00, 'EUR', 'Complete festival access including all workshops, socials, and competitions', true, NOW(), NOW()),
((SELECT id FROM events WHERE name = 'Herräng Dance Camp 2025'), 'Workshop Only', 699.00, 'EUR', 'Access to all workshops and competitions', true, NOW(), NOW()),
((SELECT id FROM events WHERE name = 'Herräng Dance Camp 2025'), 'Social Pass', 299.00, 'EUR', 'Access to all social dances and evening events', true, NOW(), NOW()),

-- Snowball
((SELECT id FROM events WHERE name = 'Snowball 2025 - Swing Dance Classic'), 'Full Weekend Pass', 450.00, 'USD', 'Complete New Year''s Eve celebration package', true, NOW(), NOW()),
((SELECT id FROM events WHERE name = 'Snowball 2025 - Swing Dance Classic'), 'New Year''s Eve Only', 250.00, 'USD', 'December 31st celebration with champagne toast', true, NOW(), NOW()),

-- Lindy Shock
((SELECT id FROM events WHERE name = 'Lindy Shock 2025'), 'Full Pass', 320.00, 'EUR', 'Complete festival access', true, NOW(), NOW()),
((SELECT id FROM events WHERE name = 'Lindy Shock 2025'), 'Social Pass', 120.00, 'EUR', 'Evening social dances only', true, NOW(), NOW()),

-- Camp Hollywood
((SELECT id FROM events WHERE name = 'Camp Hollywood 2025'), 'Full Pass', 380.00, 'USD', 'Complete Hollywood swing experience', true, NOW(), NOW()),
((SELECT id FROM events WHERE name = 'Camp Hollywood 2025'), 'Day Pass', 95.00, 'USD', 'Single day access', true, NOW(), NOW()),

-- London Swing Festival
((SELECT id FROM events WHERE name = 'London Swing Festival 2025'), 'Beginner Weekend', 180.00, 'GBP', 'Perfect introduction package', true, NOW(), NOW()),
((SELECT id FROM events WHERE name = 'London Swing Festival 2025'), 'Full Pass', 280.00, 'GBP', 'Complete festival access', true, NOW(), NOW()),

-- Swing Out New Hampshire
((SELECT id FROM events WHERE name = 'Swing Out New Hampshire 2025'), 'Full Weekend', 350.00, 'USD', 'Lakeside swing experience', true, NOW(), NOW()),
((SELECT id FROM events WHERE name = 'Swing Out New Hampshire 2025'), 'Social Only', 150.00, 'USD', 'Evening social dances', true, NOW(), NOW()),

-- Chicago Swing Dance Festival
((SELECT id FROM events WHERE name = 'Chicago Swing Dance Festival 2025'), 'Full Pass', 400.00, 'USD', 'Chicago swing heritage celebration', true, NOW(), NOW()),
((SELECT id FROM events WHERE name = 'Chicago Swing Dance Festival 2025'), 'Competition Entry', 50.00, 'USD', 'Add competition entry to any pass', true, NOW(), NOW()),

-- Berlin Swing Exchange
((SELECT id FROM events WHERE name = 'Berlin Swing Exchange 2025'), 'Full Pass', 220.00, 'EUR', 'International swing exchange', true, NOW(), NOW()),
((SELECT id FROM events WHERE name = 'Berlin Swing Exchange 2025'), 'Student Discount', 180.00, 'EUR', 'Full pass for students with valid ID', true, NOW(), NOW());