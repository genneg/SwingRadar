#!/usr/bin/env node

/**
 * Check local database data counts before migration
 */

const { PrismaClient } = require('@prisma/client');

const DATABASE_URL = process.env.DATABASE_URL || "postgresql://scraper:scraper_password@localhost:5432/swing_events";

const prisma = new PrismaClient({
  datasources: { db: { url: DATABASE_URL } }
});

async function checkLocalData() {
  console.log('📊 Checking local database data...\n');

  try {
    await prisma.$connect();
    console.log('✅ Connected to local database');

    const events = await prisma.event.count();
    const teachers = await prisma.teacher.count();
    const musicians = await prisma.musician.count();
    const venues = await prisma.externalEventVenue.count();
    const eventTeachers = await prisma.externalEventTeacher.count();
    const eventMusicians = await prisma.event_musicians.count();
    const eventPrices = await prisma.event_prices.count();
    const socialMedia = await prisma.social_media.count();

    console.log('\n📈 Database Statistics:');
    console.log(`  Events: ${events}`);
    console.log(`  Teachers: ${teachers}`);
    console.log(`  Musicians: ${musicians}`);
    console.log(`  Venues: ${venues}`);
    console.log(`  Event-Teacher relationships: ${eventTeachers}`);
    console.log(`  Event-Musician relationships: ${eventMusicians}`);
    console.log(`  Event prices: ${eventPrices}`);
    console.log(`  Social media links: ${socialMedia}`);

    const totalRecords = events + teachers + musicians + venues + eventTeachers + eventMusicians + eventPrices + socialMedia;
    console.log(`\n🔢 Total records to migrate: ${totalRecords}`);

    // Sample some data
    if (events > 0) {
      console.log('\n🎭 Sample Events:');
      const sampleEvents = await prisma.event.findMany({
        take: 3,
        select: { name: true, city: true, country: true, from_date: true }
      });
      sampleEvents.forEach(event => {
        console.log(`  - ${event.name} (${event.city}, ${event.country}) - ${event.from_date.toDateString()}`);
      });
    }

    if (teachers > 0) {
      console.log('\n👨‍🏫 Sample Teachers:');
      const sampleTeachers = await prisma.teacher.findMany({
        take: 3,
        select: { name: true }
      });
      sampleTeachers.forEach(teacher => {
        console.log(`  - ${teacher.name}`);
      });
    }

  } catch (error) {
    console.error('❌ Error checking local data:', error.message);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run check
if (require.main === module) {
  checkLocalData()
    .then(() => {
      console.log('\n✅ Local data check completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Check failed:', error);
      process.exit(1);
    });
}

module.exports = { checkLocalData };