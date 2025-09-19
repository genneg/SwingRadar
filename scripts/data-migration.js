#!/usr/bin/env node

/**
 * Data Migration Script: Local PostgreSQL → Supabase
 * 
 * This script connects to your current local database,
 * exports data, and imports it to Supabase.
 * 
 * Usage:
 *   node scripts/data-migration.js
 * 
 * Environment variables needed:
 *   SOURCE_DATABASE_URL - your current local database
 *   TARGET_DATABASE_URL - your Supabase database URL
 */

const { PrismaClient } = require('../packages/database/src/generated');
const fs = require('fs');
const path = require('path');

// Configuration
const SOURCE_DB_URL = process.env.SOURCE_DATABASE_URL || "postgresql://scraper:scraper_password@localhost:5432/swing_events";
const TARGET_DB_URL = process.env.TARGET_DATABASE_URL || process.env.DATABASE_URL;

if (!TARGET_DB_URL) {
  console.error('❌ TARGET_DATABASE_URL or DATABASE_URL environment variable is required');
  process.exit(1);
}

// Initialize Prisma clients
const sourceDb = new PrismaClient({
  datasources: { db: { url: SOURCE_DB_URL } }
});

const targetDb = new PrismaClient({
  datasources: { db: { url: TARGET_DB_URL } }
});

async function migrateData() {
  console.log('🚀 Starting data migration...\n');

  try {
    // Test connections
    console.log('📡 Testing database connections...');
    await sourceDb.$connect();
    await targetDb.$connect();
    console.log('✅ Database connections established\n');

    // Get source data counts
    const sourceCounts = await getDataCounts(sourceDb);
    console.log('📊 Source database statistics:');
    Object.entries(sourceCounts).forEach(([table, count]) => {
      console.log(`  ${table}: ${count} records`);
    });
    console.log();

    // Step 1: Migrate Events
    console.log('📅 Migrating events...');
    const events = await sourceDb.event.findMany({
      orderBy: { id: 'asc' }
    });
    
    if (events.length > 0) {
      // Clear existing events in target (optional)
      await targetDb.event.deleteMany();
      
      // Insert events
      for (const event of events) {
        await targetDb.event.create({
          data: {
            id: event.id,
            name: event.name,
            from_date: event.from_date,
            to_date: event.to_date,
            country: event.country,
            city: event.city,
            website: event.website,
            style: event.style,
            description: event.description,
            ai_quality_score: event.ai_quality_score,
            ai_completeness_score: event.ai_completeness_score,
            extraction_method: event.extraction_method,
            created_at: event.created_at,
            updated_at: event.updated_at,
            image_url: event.image_url
          }
        });
      }
    }
    console.log(`✅ Migrated ${events.length} events\n`);

    // Step 2: Migrate Teachers
    console.log('👨‍🏫 Migrating teachers...');
    const teachers = await sourceDb.teacher.findMany({
      orderBy: { id: 'asc' }
    });
    
    if (teachers.length > 0) {
      await targetDb.teacher.deleteMany();
      
      for (const teacher of teachers) {
        await targetDb.teacher.create({
          data: {
            id: teacher.id,
            name: teacher.name,
            bio: teacher.bio,
            website: teacher.website,
            ai_bio_summary: teacher.ai_bio_summary,
            ai_relevance_score: teacher.ai_relevance_score,
            image_url: teacher.image_url
          }
        });
      }
    }
    console.log(`✅ Migrated ${teachers.length} teachers\n`);

    // Step 3: Migrate Musicians
    console.log('🎵 Migrating musicians...');
    const musicians = await sourceDb.musician.findMany({
      orderBy: { id: 'asc' }
    });
    
    if (musicians.length > 0) {
      await targetDb.musician.deleteMany();
      
      for (const musician of musicians) {
        await targetDb.musician.create({
          data: {
            id: musician.id,
            name: musician.name,
            slug: musician.slug,
            bio: musician.bio,
            avatar: musician.avatar,
            verified: musician.verified,
            instruments: musician.instruments,
            yearsActive: musician.yearsActive,
            website: musician.website,
            email: musician.email,
            followerCount: musician.followerCount,
            eventCount: musician.eventCount,
            createdAt: musician.createdAt,
            updatedAt: musician.updatedAt,
            image_url: musician.image_url
          }
        });
      }
    }
    console.log(`✅ Migrated ${musicians.length} musicians\n`);

    // Step 4: Migrate Venues
    console.log('🏢 Migrating venues...');
    const venues = await sourceDb.externalEventVenue.findMany({
      orderBy: { id: 'asc' }
    });
    
    if (venues.length > 0) {
      await targetDb.externalEventVenue.deleteMany();
      
      for (const venue of venues) {
        await targetDb.externalEventVenue.create({
          data: {
            id: venue.id,
            event_id: venue.event_id,
            name: venue.name,
            address: venue.address,
            type: venue.type
          }
        });
      }
    }
    console.log(`✅ Migrated ${venues.length} venues\n`);

    // Step 5: Migrate Event-Teacher relationships
    console.log('🔗 Migrating event-teacher relationships...');
    const eventTeachers = await sourceDb.externalEventTeacher.findMany();
    
    if (eventTeachers.length > 0) {
      await targetDb.externalEventTeacher.deleteMany();
      
      for (const eventTeacher of eventTeachers) {
        await targetDb.externalEventTeacher.create({
          data: {
            event_id: eventTeacher.event_id,
            teacher_id: eventTeacher.teacher_id,
            role: eventTeacher.role
          }
        });
      }
    }
    console.log(`✅ Migrated ${eventTeachers.length} event-teacher relationships\n`);

    // Step 6: Migrate Event-Musician relationships
    console.log('🎶 Migrating event-musician relationships...');
    const eventMusicians = await sourceDb.event_musicians.findMany({
      orderBy: { id: 'asc' }
    });
    
    if (eventMusicians.length > 0) {
      await targetDb.event_musicians.deleteMany();
      
      for (const eventMusician of eventMusicians) {
        await targetDb.event_musicians.create({
          data: {
            id: eventMusician.id,
            event_id: eventMusician.event_id,
            musician_id: eventMusician.musician_id,
            role: eventMusician.role,
            set_times: eventMusician.set_times,
            created_at: eventMusician.created_at
          }
        });
      }
    }
    console.log(`✅ Migrated ${eventMusicians.length} event-musician relationships\n`);

    // Step 7: Migrate Event Prices
    console.log('💰 Migrating event prices...');
    const eventPrices = await sourceDb.event_prices.findMany({
      orderBy: { id: 'asc' }
    });
    
    if (eventPrices.length > 0) {
      await targetDb.event_prices.deleteMany();
      
      for (const price of eventPrices) {
        await targetDb.event_prices.create({
          data: {
            id: price.id,
            event_id: price.event_id,
            type: price.type,
            amount: price.amount,
            currency: price.currency,
            deadline: price.deadline,
            description: price.description,
            available: price.available,
            created_at: price.created_at,
            updated_at: price.updated_at
          }
        });
      }
    }
    console.log(`✅ Migrated ${eventPrices.length} event prices\n`);

    // Get target data counts
    const targetCounts = await getDataCounts(targetDb);
    console.log('📊 Target database statistics:');
    Object.entries(targetCounts).forEach(([table, count]) => {
      console.log(`  ${table}: ${count} records`);
    });

    console.log('\n🎉 Data migration completed successfully!');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await sourceDb.$disconnect();
    await targetDb.$disconnect();
  }
}

async function getDataCounts(db) {
  const counts = {};
  
  try {
    counts.events = await db.event.count();
    counts.teachers = await db.teacher.count();
    counts.musicians = await db.musician.count();
    counts.venues = await db.externalEventVenue.count();
    counts.event_teachers = await db.externalEventTeacher.count();
    counts.event_musicians = await db.event_musicians.count();
    counts.event_prices = await db.event_prices.count();
  } catch (error) {
    console.warn('⚠️  Could not get all counts:', error.message);
  }
  
  return counts;
}

// Run migration
if (require.main === module) {
  migrateData()
    .then(() => {
      console.log('✅ Migration script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Migration script failed:', error);
      process.exit(1);
    });
}

module.exports = { migrateData };