-- Migration script to integrate external database with our schema
-- This script preserves existing data while applying our comprehensive schema

-- Step 1: Backup existing data to temporary tables
CREATE TABLE temp_events_backup AS SELECT * FROM events;
CREATE TABLE temp_teachers_backup AS SELECT * FROM teachers;
CREATE TABLE temp_venues_backup AS SELECT * FROM venues;
CREATE TABLE temp_event_teachers_backup AS SELECT * FROM event_teachers;
CREATE TABLE temp_pricing_backup AS SELECT * FROM pricing;
CREATE TABLE temp_social_media_backup AS SELECT * FROM social_media_links;

-- Step 2: Drop existing tables to avoid conflicts
DROP TABLE IF EXISTS ai_extraction_logs CASCADE;
DROP TABLE IF EXISTS social_media_links CASCADE;
DROP TABLE IF EXISTS pricing CASCADE;
DROP TABLE IF EXISTS event_teachers CASCADE;
DROP TABLE IF EXISTS venues CASCADE;
DROP TABLE IF EXISTS teachers CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TYPE IF EXISTS venue_type CASCADE;

-- Step 3: Create our comprehensive schema
-- (Apply our migration script here)

-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'CANCELLED', 'COMPLETED', 'ARCHIVED');
CREATE TYPE "PriceType" AS ENUM ('EARLY_BIRD', 'REGULAR', 'LATE', 'STUDENT', 'LOCAL', 'VIP', 'DONATION');
CREATE TYPE "FollowType" AS ENUM ('TEACHER', 'MUSICIAN');
CREATE TYPE "AttendanceStatus" AS ENUM ('INTERESTED', 'GOING', 'MAYBE', 'NOT_GOING');
CREATE TYPE "NotificationType" AS ENUM ('NEW_EVENT', 'DEADLINE_REMINDER', 'FOLLOWED_UPDATE', 'EVENT_CANCELLED', 'EVENT_UPDATED', 'WEEKLY_DIGEST');

-- CreateTable: Users
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "avatar" TEXT,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable: Venues (updated structure)
CREATE TABLE "venues" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT,
    "country" TEXT NOT NULL,
    "postalCode" TEXT,
    "latitude" DECIMAL(10,8) NOT NULL DEFAULT 0,
    "longitude" DECIMAL(11,8) NOT NULL DEFAULT 0,
    "website" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "capacity" INTEGER,
    "description" TEXT,
    "hasParking" BOOLEAN NOT NULL DEFAULT false,
    "hasAirCon" BOOLEAN NOT NULL DEFAULT false,
    "hasWifi" BOOLEAN NOT NULL DEFAULT false,
    "wheelchairAccess" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "venues_pkey" PRIMARY KEY ("id")
);

-- CreateTable: Events (updated structure)
CREATE TABLE "events" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "shortDesc" VARCHAR(255),
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "registrationDeadline" TIMESTAMP(3),
    "publicationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "EventStatus" NOT NULL DEFAULT 'PUBLISHED',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "capacity" INTEGER,
    "venueId" TEXT NOT NULL,
    "website" TEXT,
    "registrationUrl" TEXT,
    "imageUrl" TEXT,
    "createdById" TEXT,
    "sourceUrl" TEXT,
    "scrapedAt" TIMESTAMP(3),
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable: Teachers (updated structure)
CREATE TABLE "teachers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "bio" TEXT,
    "avatar" TEXT,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "yearsActive" INTEGER,
    "website" TEXT,
    "email" TEXT,
    "followerCount" INTEGER NOT NULL DEFAULT 0,
    "eventCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "teachers_pkey" PRIMARY KEY ("id")
);

-- CreateTable: Musicians (new)
CREATE TABLE "musicians" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "bio" TEXT,
    "avatar" TEXT,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "instruments" TEXT[],
    "yearsActive" INTEGER,
    "website" TEXT,
    "email" TEXT,
    "followerCount" INTEGER NOT NULL DEFAULT 0,
    "eventCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "musicians_pkey" PRIMARY KEY ("id")
);

-- CreateTable: Event-Teacher relationships (updated)
CREATE TABLE "event_teachers" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "role" TEXT,
    "workshops" TEXT[],
    "level" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "event_teachers_pkey" PRIMARY KEY ("id")
);

-- CreateTable: Event prices (updated structure)
CREATE TABLE "event_prices" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "type" "PriceType" NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "deadline" TIMESTAMP(3),
    "description" TEXT,
    "available" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "event_prices_pkey" PRIMARY KEY ("id")
);

-- Step 4: Create indexes for performance
CREATE UNIQUE INDEX "venues_name_city_country_key" ON "venues"("name", "city", "country");
CREATE INDEX "venues_city_country_idx" ON "venues"("city", "country");
CREATE INDEX "venues_latitude_longitude_idx" ON "venues"("latitude", "longitude");

CREATE UNIQUE INDEX "events_slug_key" ON "events"("slug");
CREATE INDEX "events_startDate_endDate_idx" ON "events"("startDate", "endDate");
CREATE INDEX "events_venueId_idx" ON "events"("venueId");
CREATE INDEX "events_status_idx" ON "events"("status");

CREATE UNIQUE INDEX "teachers_slug_key" ON "teachers"("slug");
CREATE INDEX "teachers_verified_idx" ON "teachers"("verified");

CREATE UNIQUE INDEX "event_teachers_eventId_teacherId_key" ON "event_teachers"("eventId", "teacherId");
CREATE INDEX "event_prices_eventId_idx" ON "event_prices"("eventId");

-- Step 5: Add foreign key constraints
ALTER TABLE "events" ADD CONSTRAINT "events_venueId_fkey" 
    FOREIGN KEY ("venueId") REFERENCES "venues"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "event_teachers" ADD CONSTRAINT "event_teachers_eventId_fkey" 
    FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "event_teachers" ADD CONSTRAINT "event_teachers_teacherId_fkey" 
    FOREIGN KEY ("teacherId") REFERENCES "teachers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "event_prices" ADD CONSTRAINT "event_prices_eventId_fkey" 
    FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Step 6: Create function to generate simple IDs
CREATE OR REPLACE FUNCTION generate_cuid() RETURNS text AS $$
BEGIN
    RETURN 'c' || substr(md5(random()::text || clock_timestamp()::text), 1, 24);
END;
$$ LANGUAGE plpgsql;

-- Step 7: Migration complete message
SELECT 'Schema migration completed. Ready for data migration.' as status;