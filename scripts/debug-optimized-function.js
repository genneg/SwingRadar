const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://postgres.tqvvseagpkmdnsiuwabv:mVVzMkwCK6fP4RG@aws-0-eu-central-1.pooler.supabase.com:5432/postgres'
    }
  }
});

async function debugOptimizedFunction() {
  console.log('🔍 Debugging Why API Uses Fallback Instead of Optimized Function\n');
  
  try {
    await prisma.$connect();
    
    // Check if function exists
    console.log('1. Checking if search_events_optimized function exists...');
    const functionExists = await prisma.$queryRaw`
      SELECT EXISTS (
        SELECT 1 FROM pg_proc 
        WHERE proname = 'search_events_optimized'
      ) as exists
    `;
    
    console.log(`Function exists: ${functionExists[0].exists}`);
    
    if (functionExists[0].exists) {
      // Test function directly
      console.log('\n2. Testing function directly with Alexia...');
      
      try {
        const directResult = await prisma.$queryRaw`
          SELECT * FROM search_events_optimized('Alexia', NULL, NULL, 3, 0, 'relevance', 'desc')
        `;
        
        console.log(`Direct function result: ${directResult.length > 0 ? Number(directResult[0].total_count) : 0} events`);
        
        if (directResult.length > 0) {
          directResult.forEach((result, index) => {
            console.log(`   ${index + 1}. "${result.name}" (rank: ${result.search_rank})`);
          });
        }
        
      } catch (functionError) {
        console.log(`❌ Function execution error: ${functionError.message}`);
        console.log('This explains why API uses fallback!');
        
        // The function might have syntax errors - let's check the function definition
        console.log('\n3. Checking function definition...');
        const functionDef = await prisma.$queryRaw`
          SELECT prosrc FROM pg_proc WHERE proname = 'search_events_optimized'
        `;
        
        console.log('Function definition found, but execution fails');
        console.log('Likely issue: Complex dynamic SQL with PostgreSQL security restrictions');
      }
    }
    
    // Check what Vercel/API can access
    console.log('\n4. Testing what API can access...');
    
    // Test basic query that API should be able to execute
    try {
      const basicQuery = await prisma.$queryRaw`
        SELECT e.id, e.name, 
               EXISTS(SELECT 1 FROM event_teachers et JOIN teachers t ON et.teacher_id = t.id 
                     WHERE et.event_id = e.id AND LOWER(t.name) LIKE LOWER('%Alexia%')) as has_teacher
        FROM events e 
        WHERE EXISTS(SELECT 1 FROM event_teachers et JOIN teachers t ON et.teacher_id = t.id 
                    WHERE et.event_id = e.id AND LOWER(t.name) LIKE LOWER('%Alexia%'))
        LIMIT 3
      `;
      
      console.log(`Basic teacher query result: ${basicQuery.length} events`);
      
      if (basicQuery.length > 0) {
        console.log('✅ Teacher relationships exist and are queryable!');
        basicQuery.forEach((result, index) => {
          console.log(`   ${index + 1}. "${result.name}" (has_teacher: ${result.has_teacher})`);
        });
        
        console.log('\n🎯 SOLUTION: Simplify the optimized function or use direct SQL in API');
      } else {
        console.log('⚠️  No teacher relationships found for Alexia');
      }
      
    } catch (basicError) {
      console.log(`❌ Basic query error: ${basicError.message}`);
    }
    
  } catch (error) {
    console.error('❌ Debug error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugOptimizedFunction();