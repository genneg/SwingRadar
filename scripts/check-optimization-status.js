const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://postgres.tqvvseagpkmdnsiuwabv:mVVzMkwCK6fP4RG@aws-0-eu-central-1.pooler.supabase.com:5432/postgres'
    }
  }
});

async function checkOptimizationStatus() {
  console.log('🔍 Checking Database Optimization Status...\n');
  
  try {
    await prisma.$connect();
    console.log('✅ Connected to database\n');
    
    // Check existing indexes
    console.log('📋 Current Indexes on events table:');
    const indexes = await prisma.$queryRaw`
      SELECT 
        indexname,
        indexdef,
        CASE 
          WHEN indexdef LIKE '%CONCURRENTLY%' THEN 'Building'
          ELSE 'Ready'
        END as status
      FROM pg_indexes 
      WHERE tablename = 'events' 
      ORDER BY indexname
    `;
    
    indexes.forEach(index => {
      const icon = index.indexname.includes('idx_') ? '🔍' : '📋';
      console.log(`   ${icon} ${index.indexname}: ${index.status || 'Ready'}`);
    });
    
    // Check if our search function exists
    console.log('\n🔧 Search Function Status:');
    try {
      const functionExists = await prisma.$queryRaw`
        SELECT EXISTS (
          SELECT 1 FROM pg_proc 
          WHERE proname = 'search_events_optimized'
        ) as exists
      `;
      
      if (functionExists[0].exists) {
        console.log('   ✅ search_events_optimized function exists');
      } else {
        console.log('   ❌ search_events_optimized function missing');
      }
    } catch (error) {
      console.log('   ❌ Error checking function:', error.message);
    }
    
    // Test basic search performance
    console.log('\n🧪 Testing Current Search Performance:');
    
    const testQueries = ['Mountain', 'Stone'];
    
    for (const query of testQueries) {
      try {
        const startTime = Date.now();
        
        // Use basic Prisma search to test current performance
        const results = await prisma.event.findMany({
          where: {
            OR: [
              { name: { contains: query, mode: 'insensitive' } },
              { description: { contains: query, mode: 'insensitive' } },
              { city: { contains: query, mode: 'insensitive' } },
              { country: { contains: query, mode: 'insensitive' } },
              { style: { contains: query, mode: 'insensitive' } },
            ]
          },
          take: 10
        });
        
        const duration = Date.now() - startTime;
        console.log(`   🔍 "${query}": ${results.length} results in ${duration}ms (Basic Prisma)`);
        
      } catch (error) {
        console.log(`   ❌ "${query}": ${error.message}`);
      }
    }
    
    // Test optimized search if function exists
    try {
      console.log('\n🚀 Testing Optimized Search Function:');
      
      const startTime = Date.now();
      const optimizedResults = await prisma.$queryRaw`
        SELECT * FROM search_events_optimized('Mountain', NULL, NULL, 10, 0, 'relevance', 'desc')
      `;
      const duration = Date.now() - startTime;
      const count = optimizedResults.length > 0 ? Number(optimizedResults[0].total_count) : 0;
      
      console.log(`   🔍 "Mountain" (Optimized): ${count} results in ${duration}ms`);
      
    } catch (error) {
      console.log(`   ❌ Optimized search not available: ${error.message}`);
    }
    
    // Check table statistics
    console.log('\n📊 Table Information:');
    const tableStats = await prisma.$queryRaw`
      SELECT 
        COUNT(*) as total_events,
        MIN(from_date) as earliest_event,
        MAX(from_date) as latest_event
      FROM events
    `;
    
    console.log(`   📅 Total events: ${tableStats[0].total_events}`);
    console.log(`   📅 Date range: ${tableStats[0].earliest_event} to ${tableStats[0].latest_event}`);
    
    console.log('\n📋 Optimization Status Summary:');
    const indexCount = indexes.filter(idx => idx.indexname.includes('idx_')).length;
    if (indexCount >= 3) {
      console.log('   ✅ Search indexes: Good');
    } else {
      console.log('   ⚠️  Search indexes: Partial');
    }
    
  } catch (error) {
    console.error('❌ Error checking status:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkOptimizationStatus().catch(console.error);