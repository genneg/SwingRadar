// Script to explore external database content
const { PrismaClient } = require('@prisma/client');

async function exploreDatabase() {
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: 'postgresql://scraper:scraper_password@localhost:5432/swing_events'
      }
    }
  });

  try {
    console.log('🔍 Exploring external database content...\n');
    
    // Count events
    const eventCount = await prisma.$queryRaw`SELECT COUNT(*) FROM events`;
    console.log(`📅 Events: ${eventCount[0].count}`);
    
    // Count teachers
    const teacherCount = await prisma.$queryRaw`SELECT COUNT(*) FROM teachers`;
    console.log(`👨‍🏫 Teachers: ${teacherCount[0].count}`);
    
    // Count venues
    const venueCount = await prisma.$queryRaw`SELECT COUNT(*) FROM venues`;
    console.log(`🏢 Venues: ${venueCount[0].count}`);
    
    // Count pricing
    const pricingCount = await prisma.$queryRaw`SELECT COUNT(*) FROM pricing`;
    console.log(`💰 Pricing entries: ${pricingCount[0].count}`);
    
    // Sample events
    console.log('\n📋 Sample Events:');
    const sampleEvents = await prisma.$queryRaw`
      SELECT id, from_date, to_date, country, city, website, style, description 
      FROM events 
      LIMIT 5
    `;
    
    sampleEvents.forEach((event, i) => {
      console.log(`\n${i + 1}. Event ID: ${event.id}`);
      console.log(`   Dates: ${event.from_date} to ${event.to_date}`);
      console.log(`   Location: ${event.city}, ${event.country}`);
      console.log(`   Style: ${event.style || 'N/A'}`);
      console.log(`   Website: ${event.website || 'N/A'}`);
      if (event.description) {
        console.log(`   Description: ${event.description.substring(0, 100)}...`);
      }
    });
    
    // Sample teachers
    console.log('\n👨‍🏫 Sample Teachers:');
    const sampleTeachers = await prisma.$queryRaw`
      SELECT id, name, bio, website, ai_relevance_score 
      FROM teachers 
      LIMIT 5
    `;
    
    sampleTeachers.forEach((teacher, i) => {
      console.log(`\n${i + 1}. Teacher ID: ${teacher.id}`);
      console.log(`   Name: ${teacher.name}`);
      console.log(`   Website: ${teacher.website || 'N/A'}`);
      console.log(`   AI Score: ${teacher.ai_relevance_score || 'N/A'}`);
      if (teacher.bio) {
        console.log(`   Bio: ${teacher.bio.substring(0, 100)}...`);
      }
    });
    
    // Countries distribution
    console.log('\n🌍 Countries Distribution:');
    const countries = await prisma.$queryRaw`
      SELECT country, COUNT(*) as count 
      FROM events 
      GROUP BY country 
      ORDER BY count DESC 
      LIMIT 10
    `;
    
    countries.forEach(country => {
      console.log(`   ${country.country}: ${country.count} events`);
    });
    
  } catch (error) {
    console.error('❌ Error exploring database:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

exploreDatabase();