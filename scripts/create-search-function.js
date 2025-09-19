const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://postgres.tqvvseagpkmdnsiuwabv:mVVzMkwCK6fP4RG@aws-0-eu-central-1.pooler.supabase.com:5432/postgres'
    }
  }
});

async function createOptimizedSearchFunction() {
  console.log('🔧 Creating Optimized Search Function...\n');
  
  try {
    await prisma.$connect();
    console.log('✅ Connected to database');
    
    // Create the optimized search function
    console.log('⏳ Creating search_events_optimized function...');
    
    const searchFunction = `
      CREATE OR REPLACE FUNCTION search_events_optimized(
          search_query TEXT DEFAULT NULL,
          search_city TEXT DEFAULT NULL, 
          search_country TEXT DEFAULT NULL,
          page_limit INTEGER DEFAULT 20,
          page_offset INTEGER DEFAULT 0,
          sort_by TEXT DEFAULT 'date',
          sort_order TEXT DEFAULT 'asc'
      )
      RETURNS TABLE (
          total_count BIGINT,
          id INTEGER,
          name VARCHAR,
          description TEXT,
          short_desc TEXT,
          from_date DATE,
          to_date DATE,
          city VARCHAR,
          country VARCHAR,
          website VARCHAR,
          style VARCHAR,
          image_url VARCHAR,
          ai_quality_score DECIMAL,
          ai_completeness_score DECIMAL,
          extraction_method VARCHAR,
          created_at TIMESTAMP,
          updated_at TIMESTAMP,
          search_rank REAL
      ) AS $$
      DECLARE
          total_results BIGINT;
          search_conditions TEXT := '';
          order_clause TEXT := '';
      BEGIN
          -- Build search conditions
          IF search_query IS NOT NULL AND search_query != '' THEN
              search_conditions := search_conditions || 
                  ' AND (name ILIKE ' || quote_literal('%' || search_query || '%') || 
                  ' OR description ILIKE ' || quote_literal('%' || search_query || '%') ||
                  ' OR city ILIKE ' || quote_literal('%' || search_query || '%') ||
                  ' OR country ILIKE ' || quote_literal('%' || search_query || '%') ||
                  ' OR style ILIKE ' || quote_literal('%' || search_query || '%') || ')';
          END IF;
          
          IF search_city IS NOT NULL AND search_city != '' THEN
              search_conditions := search_conditions || 
                  ' AND city ILIKE ' || quote_literal('%' || search_city || '%');
          END IF;
          
          IF search_country IS NOT NULL AND search_country != '' THEN
              search_conditions := search_conditions || 
                  ' AND country ILIKE ' || quote_literal('%' || search_country || '%');
          END IF;
          
          -- Default to no conditions if none specified
          IF search_conditions = '' THEN
              search_conditions := ' AND TRUE';
          END IF;
          
          -- Get total count
          EXECUTE 'SELECT COUNT(*) FROM events WHERE TRUE' || search_conditions 
          INTO total_results;
          
          -- Build order clause
          CASE sort_by
              WHEN 'date' THEN 
                  order_clause := 'ORDER BY from_date ' || CASE WHEN sort_order = 'desc' THEN 'DESC' ELSE 'ASC' END;
              WHEN 'relevance' THEN
                  IF search_query IS NOT NULL AND search_query != '' THEN
                      order_clause := 'ORDER BY (CASE 
                          WHEN name ILIKE ' || quote_literal('%' || search_query || '%') || ' THEN 1 
                          WHEN description ILIKE ' || quote_literal('%' || search_query || '%') || ' THEN 2
                          ELSE 3 END), from_date ASC';
                  ELSE
                      order_clause := 'ORDER BY from_date ASC';
                  END IF;
              ELSE 
                  order_clause := 'ORDER BY from_date ASC';
          END CASE;
          
          -- Return results
          RETURN QUERY EXECUTE '
              SELECT 
                  ' || total_results || '::BIGINT as total_count,
                  id,
                  name::VARCHAR,
                  description,
                  short_desc,
                  from_date,
                  to_date,
                  city::VARCHAR,
                  country::VARCHAR,
                  website::VARCHAR,
                  style::VARCHAR,
                  image_url::VARCHAR,
                  ai_quality_score,
                  ai_completeness_score,
                  extraction_method::VARCHAR,
                  created_at,
                  updated_at, ' ||
                  CASE 
                      WHEN search_query IS NOT NULL AND search_query != '' THEN
                          '(CASE 
                              WHEN name ILIKE ' || quote_literal('%' || search_query || '%') || ' THEN 1.0 
                              WHEN description ILIKE ' || quote_literal('%' || search_query || '%') || ' THEN 0.8
                              WHEN city ILIKE ' || quote_literal('%' || search_query || '%') || ' THEN 0.6
                              WHEN country ILIKE ' || quote_literal('%' || search_query || '%') || ' THEN 0.4
                              WHEN style ILIKE ' || quote_literal('%' || search_query || '%') || ' THEN 0.5
                              ELSE 0.0 END)::REAL as search_rank'
                      ELSE '0.0::REAL as search_rank'
                  END || '
              FROM events 
              WHERE TRUE' || search_conditions || ' ' ||
              order_clause || ' 
              LIMIT ' || page_limit || ' 
              OFFSET ' || page_offset;
      END;
      $$ LANGUAGE plpgsql;
    `;
    
    await prisma.$executeRawUnsafe(searchFunction);
    console.log('✅ Search function created successfully');
    
    // Test the function
    console.log('\n🧪 Testing optimized search function...');
    
    const testCases = [
      { query: 'Mountain', city: null, country: null },
      { query: 'Stone', city: null, country: null },
      { query: null, city: 'London', country: null },
      { query: 'Blues', city: null, country: null }
    ];
    
    for (const test of testCases) {
      try {
        const startTime = Date.now();
        
        const results = await prisma.$queryRaw`
          SELECT * FROM search_events_optimized(
            ${test.query}, 
            ${test.city}, 
            ${test.country}, 
            10, 0, 'relevance', 'desc'
          )
        `;
        
        const duration = Date.now() - startTime;
        const count = results.length > 0 ? Number(results[0].total_count) : 0;
        const testDesc = test.query || test.city || test.country || 'all';
        
        console.log(`   🔍 "${testDesc}": ${count} results in ${duration}ms`);
        
        // Show first result if available
        if (results.length > 0 && results[0].name) {
          console.log(`      📅 Top result: "${results[0].name}" (rank: ${results[0].search_rank})`);
        }
        
      } catch (error) {
        console.log(`   ❌ Test failed: ${error.message}`);
      }
    }
    
    console.log('\n🎉 Optimized search function is ready!');
    console.log('\n📋 Next Steps:');
    console.log('1. Update API to use the optimized search function');
    console.log('2. Test search performance on the website');
    console.log('3. Monitor query performance improvements');
    
  } catch (error) {
    console.error('❌ Error creating search function:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createOptimizedSearchFunction().catch(console.error);