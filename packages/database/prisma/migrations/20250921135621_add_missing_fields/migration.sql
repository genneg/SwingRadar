-- Add missing fields to Teacher model
ALTER TABLE "teachers" ADD COLUMN IF NOT EXISTS "specializations" TEXT[] DEFAULT ARRAY['blues'];
ALTER TABLE "teachers" ADD COLUMN IF NOT EXISTS "experience_levels" JSONB;
ALTER TABLE "teachers" ADD COLUMN IF NOT EXISTS "teaching_since" INTEGER;
ALTER TABLE "teachers" ADD COLUMN IF NOT EXISTS "credentials" TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "teachers" ADD COLUMN IF NOT EXISTS "preferred_events" TEXT[] DEFAULT ARRAY['workshop', 'festival'];

-- Add missing fields to Musician model
ALTER TABLE "musicians" ADD COLUMN IF NOT EXISTS "music_genres" TEXT[] DEFAULT ARRAY['blues'];
ALTER TABLE "musicians" ADD COLUMN IF NOT EXISTS "primary_genre" VARCHAR(50) DEFAULT 'blues';
ALTER TABLE "musicians" ADD COLUMN IF NOT EXISTS "performance_types" TEXT[] DEFAULT ARRAY['live'];

-- Add missing fields to Event model
ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "dance_styles" TEXT[] DEFAULT ARRAY['blues'];
ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "primary_style" VARCHAR(50) DEFAULT 'blues';
ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "difficulty_level" VARCHAR(20) DEFAULT 'all';
ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "event_types" TEXT[] DEFAULT ARRAY['festival'];

-- Add missing fields to UserPreferences model
ALTER TABLE "user_preferences" ADD COLUMN IF NOT EXISTS "preferred_dance_styles" TEXT[] DEFAULT ARRAY['blues'];
ALTER TABLE "user_preferences" ADD COLUMN IF NOT EXISTS "experience_level" VARCHAR(20) DEFAULT 'intermediate';
ALTER TABLE "user_preferences" ADD COLUMN IF NOT EXISTS "preferred_event_types" TEXT[] DEFAULT ARRAY['festival', 'workshop'];
ALTER TABLE "user_preferences" ADD COLUMN IF NOT EXISTS "skill_levels" JSONB;

-- Create indexes for the new columns
CREATE INDEX IF NOT EXISTS "idx_teachers_specializations" ON "teachers" USING GIN ("specializations");
CREATE INDEX IF NOT EXISTS "idx_musicians_genres" ON "musicians" USING GIN ("music_genres");
CREATE INDEX IF NOT EXISTS "idx_musicians_primary_genre" ON "musicians" ("primary_genre");
CREATE INDEX IF NOT EXISTS "idx_events_dance_styles" ON "events" USING GIN ("dance_styles");
CREATE INDEX IF NOT EXISTS "idx_events_primary_style" ON "events" ("primary_style");
CREATE INDEX IF NOT EXISTS "idx_preferences_dance_styles" ON "user_preferences" USING GIN ("preferred_dance_styles");