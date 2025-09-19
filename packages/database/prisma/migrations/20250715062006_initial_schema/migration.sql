-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'CANCELLED', 'COMPLETED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "PriceType" AS ENUM ('EARLY_BIRD', 'REGULAR', 'LATE', 'STUDENT', 'LOCAL', 'VIP', 'DONATION');

-- CreateEnum
CREATE TYPE "FollowType" AS ENUM ('TEACHER', 'MUSICIAN');

-- CreateEnum
CREATE TYPE "AttendanceStatus" AS ENUM ('INTERESTED', 'GOING', 'MAYBE', 'NOT_GOING');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('NEW_EVENT', 'DEADLINE_REMINDER', 'FOLLOWED_UPDATE', 'EVENT_CANCELLED', 'EVENT_UPDATED', 'WEEKLY_DIGEST');

-- CreateTable
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

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verificationtokens" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "user_preferences" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "emailNotifications" BOOLEAN NOT NULL DEFAULT true,
    "pushNotifications" BOOLEAN NOT NULL DEFAULT true,
    "newEventNotifications" BOOLEAN NOT NULL DEFAULT true,
    "deadlineReminders" BOOLEAN NOT NULL DEFAULT true,
    "weeklyDigest" BOOLEAN NOT NULL DEFAULT true,
    "followingUpdates" BOOLEAN NOT NULL DEFAULT true,
    "defaultCountry" TEXT,
    "defaultCity" TEXT,
    "searchRadius" INTEGER DEFAULT 100,
    "theme" TEXT NOT NULL DEFAULT 'light',
    "language" TEXT NOT NULL DEFAULT 'en',
    "timezone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
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
    "status" "EventStatus" NOT NULL DEFAULT 'DRAFT',
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

-- CreateTable
CREATE TABLE "venues" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT,
    "country" TEXT NOT NULL,
    "postalCode" TEXT,
    "latitude" DECIMAL(10,8) NOT NULL,
    "longitude" DECIMAL(11,8) NOT NULL,
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

-- CreateTable
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

-- CreateTable
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

-- CreateTable
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

-- CreateTable
CREATE TABLE "event_musicians" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "musicianId" TEXT NOT NULL,
    "role" TEXT,
    "setTimes" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "event_musicians_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "following" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "targetType" "FollowType" NOT NULL,
    "targetId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "following_pkey" PRIMARY KEY ("id")
);

-- CreateTable
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

-- CreateTable
CREATE TABLE "event_tags" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "tag" TEXT NOT NULL,

    CONSTRAINT "event_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_saves" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "event_saves_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_attendances" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "status" "AttendanceStatus" NOT NULL DEFAULT 'INTERESTED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "event_attendances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_reviews" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "rating" SMALLINT NOT NULL,
    "review" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "event_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teacher_specialties" (
    "id" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "specialty" TEXT NOT NULL,

    CONSTRAINT "teacher_specialties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "musician_genres" (
    "id" TEXT NOT NULL,
    "musicianId" TEXT NOT NULL,
    "genre" TEXT NOT NULL,

    CONSTRAINT "musician_genres_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teacher_social_media" (
    "id" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "facebook" TEXT,
    "instagram" TEXT,
    "youtube" TEXT,
    "tiktok" TEXT,
    "linkedin" TEXT,

    CONSTRAINT "teacher_social_media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "musician_social_media" (
    "id" TEXT NOT NULL,
    "musicianId" TEXT NOT NULL,
    "facebook" TEXT,
    "instagram" TEXT,
    "youtube" TEXT,
    "spotify" TEXT,
    "soundcloud" TEXT,
    "bandcamp" TEXT,

    CONSTRAINT "musician_social_media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "data" JSONB,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_createdAt_idx" ON "users"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_providerAccountId_key" ON "accounts"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_sessionToken_key" ON "sessions"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "verificationtokens_token_key" ON "verificationtokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "verificationtokens_identifier_token_key" ON "verificationtokens"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "user_preferences_userId_key" ON "user_preferences"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "events_slug_key" ON "events"("slug");

-- CreateIndex
CREATE INDEX "events_startDate_endDate_idx" ON "events"("startDate", "endDate");

-- CreateIndex
CREATE INDEX "events_venueId_idx" ON "events"("venueId");

-- CreateIndex
CREATE INDEX "events_status_idx" ON "events"("status");

-- CreateIndex
CREATE INDEX "events_featured_idx" ON "events"("featured");

-- CreateIndex
CREATE INDEX "events_slug_idx" ON "events"("slug");

-- CreateIndex
CREATE INDEX "events_createdAt_idx" ON "events"("createdAt");

-- CreateIndex
CREATE INDEX "venues_city_country_idx" ON "venues"("city", "country");

-- CreateIndex
CREATE INDEX "venues_latitude_longitude_idx" ON "venues"("latitude", "longitude");

-- CreateIndex
CREATE UNIQUE INDEX "venues_name_city_country_key" ON "venues"("name", "city", "country");

-- CreateIndex
CREATE UNIQUE INDEX "teachers_slug_key" ON "teachers"("slug");

-- CreateIndex
CREATE INDEX "teachers_slug_idx" ON "teachers"("slug");

-- CreateIndex
CREATE INDEX "teachers_verified_idx" ON "teachers"("verified");

-- CreateIndex
CREATE INDEX "teachers_followerCount_idx" ON "teachers"("followerCount");

-- CreateIndex
CREATE UNIQUE INDEX "musicians_slug_key" ON "musicians"("slug");

-- CreateIndex
CREATE INDEX "musicians_slug_idx" ON "musicians"("slug");

-- CreateIndex
CREATE INDEX "musicians_verified_idx" ON "musicians"("verified");

-- CreateIndex
CREATE INDEX "musicians_followerCount_idx" ON "musicians"("followerCount");

-- CreateIndex
CREATE UNIQUE INDEX "event_teachers_eventId_teacherId_key" ON "event_teachers"("eventId", "teacherId");

-- CreateIndex
CREATE UNIQUE INDEX "event_musicians_eventId_musicianId_key" ON "event_musicians"("eventId", "musicianId");

-- CreateIndex
CREATE INDEX "following_userId_idx" ON "following"("userId");

-- CreateIndex
CREATE INDEX "following_targetType_targetId_idx" ON "following"("targetType", "targetId");

-- CreateIndex
CREATE UNIQUE INDEX "following_userId_targetType_targetId_key" ON "following"("userId", "targetType", "targetId");

-- CreateIndex
CREATE INDEX "event_prices_eventId_idx" ON "event_prices"("eventId");

-- CreateIndex
CREATE INDEX "event_prices_type_idx" ON "event_prices"("type");

-- CreateIndex
CREATE INDEX "event_tags_tag_idx" ON "event_tags"("tag");

-- CreateIndex
CREATE UNIQUE INDEX "event_tags_eventId_tag_key" ON "event_tags"("eventId", "tag");

-- CreateIndex
CREATE UNIQUE INDEX "event_saves_userId_eventId_key" ON "event_saves"("userId", "eventId");

-- CreateIndex
CREATE UNIQUE INDEX "event_attendances_userId_eventId_key" ON "event_attendances"("userId", "eventId");

-- CreateIndex
CREATE INDEX "event_reviews_rating_idx" ON "event_reviews"("rating");

-- CreateIndex
CREATE UNIQUE INDEX "event_reviews_userId_eventId_key" ON "event_reviews"("userId", "eventId");

-- CreateIndex
CREATE INDEX "teacher_specialties_specialty_idx" ON "teacher_specialties"("specialty");

-- CreateIndex
CREATE UNIQUE INDEX "teacher_specialties_teacherId_specialty_key" ON "teacher_specialties"("teacherId", "specialty");

-- CreateIndex
CREATE INDEX "musician_genres_genre_idx" ON "musician_genres"("genre");

-- CreateIndex
CREATE UNIQUE INDEX "musician_genres_musicianId_genre_key" ON "musician_genres"("musicianId", "genre");

-- CreateIndex
CREATE UNIQUE INDEX "teacher_social_media_teacherId_key" ON "teacher_social_media"("teacherId");

-- CreateIndex
CREATE UNIQUE INDEX "musician_social_media_musicianId_key" ON "musician_social_media"("musicianId");

-- CreateIndex
CREATE INDEX "notifications_userId_read_idx" ON "notifications"("userId", "read");

-- CreateIndex
CREATE INDEX "notifications_createdAt_idx" ON "notifications"("createdAt");

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_preferences" ADD CONSTRAINT "user_preferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "venues"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_teachers" ADD CONSTRAINT "event_teachers_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_teachers" ADD CONSTRAINT "event_teachers_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "teachers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_musicians" ADD CONSTRAINT "event_musicians_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_musicians" ADD CONSTRAINT "event_musicians_musicianId_fkey" FOREIGN KEY ("musicianId") REFERENCES "musicians"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "following" ADD CONSTRAINT "following_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_prices" ADD CONSTRAINT "event_prices_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_tags" ADD CONSTRAINT "event_tags_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_saves" ADD CONSTRAINT "event_saves_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_saves" ADD CONSTRAINT "event_saves_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_attendances" ADD CONSTRAINT "event_attendances_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_attendances" ADD CONSTRAINT "event_attendances_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_reviews" ADD CONSTRAINT "event_reviews_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_reviews" ADD CONSTRAINT "event_reviews_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teacher_specialties" ADD CONSTRAINT "teacher_specialties_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "teachers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "musician_genres" ADD CONSTRAINT "musician_genres_musicianId_fkey" FOREIGN KEY ("musicianId") REFERENCES "musicians"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teacher_social_media" ADD CONSTRAINT "teacher_social_media_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "teachers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "musician_social_media" ADD CONSTRAINT "musician_social_media_musicianId_fkey" FOREIGN KEY ("musicianId") REFERENCES "musicians"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
