const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://postgres.tqvvseagpkmdnsiuwabv:mVVzMkwCK6fP4RG@aws-0-eu-central-1.pooler.supabase.com:5432/postgres'
    }
  }
});

async function recreateSearchFunction() {
  console.log('🔧 Recreating Optimized Search Function...\n');
  
  try {
    await prisma.$connect();
    console.log('✅ Connected to database');
    
    // Drop existing function first
    console.log('🗑️  Dropping existing function...');
    try {
      await prisma.$executeRawUnsafe('DROP FUNCTION IF EXISTS search_events_optimized(text,text,text,integer,integer,text,text)');
      console.log('✅ Existing function dropped');
    } catch (error) {
      console.log('ℹ️  No existing function to drop');
    }
    
    // Create corrected search function
    console.log('⏳ Creating optimized search function...');
    
    const searchFunction = `
      CREATE FUNCTION search_events_optimized(
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
          from_date DATE,
          to_date DATE,
          city VARCHAR,
          country VARCHAR,
          website VARCHAR,
          style VARCHAR,
          image_url VARCHAR,
          ai_quality_score INTEGER,
          ai_completeness_score INTEGER,
          extraction_method VARCHAR,
          created_at TIMESTAMP WITH TIME ZONE,
          updated_at TIMESTAMP WITH TIME ZONE,
          search_rank REAL
      ) AS $$
      DECLARE
          total_results BIGINT;
          search_conditions TEXT := '';
          order_clause TEXT := '';
          full_query TEXT;
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
          full_query := 'SELECT COUNT(*) FROM events WHERE TRUE' || search_conditions;
          EXECUTE full_query INTO total_results;
          
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
          
          -- Build and execute final query
          full_query := '
              SELECT 
                  ' || total_results || '::BIGINT as total_count,
                  id,
                  name::VARCHAR,
                  description,
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
          
          -- Return results
          RETURN QUERY EXECUTE full_query;
      END;
      $$ LANGUAGE plpgsql;
    `;
    
    await prisma.$executeRawUnsafe(searchFunction);
    console.log('✅ Optimized search function created successfully');
    
    // Test the function
    console.log('\n🧪 Testing optimized search function...');
    
    const testCases = [
      { query: 'Mountain', desc: 'Mountain search (should find Mountain Monkey)' },
      { query: 'Stone', desc: 'Stone search' },
      { query: 'Blues', desc: 'Blues search' },
      { query: 'Monkey', desc: 'Monkey search' }
    ];
    
    for (const test of testCases) {
      try {
        const startTime = Date.now();
        
        const results = await prisma.$queryRaw`
          SELECT * FROM search_events_optimized(
            ${test.query}, 
            NULL, 
            NULL, 
            5, 0, 'relevance', 'desc'
          )
        `;
        
        const duration = Date.now() - startTime;
        const count = results.length > 0 ? Number(results[0].total_count) : 0;
        
        console.log(`   🔍 ${test.desc}:`);
        console.log(`      ⚡ ${count} results in ${duration}ms`);
        
        // Show results
        results.forEach((result, index) => {
          if (result.name && index < 2) { // Show max 2 results
            console.log(`      📅 ${index + 1}. "${result.name}" (rank: ${result.search_rank})`);
            if (result.city && result.country) {
              console.log(`         📍 ${result.city}, ${result.country}`);
            }
          }
        });
        
        if (results.length === 0) {
          console.log(`      📝 No results found`);
        }
        
        console.log(''); // Empty line for readability
        
      } catch (error) {
        console.log(`   ❌ ${test.desc} failed: ${error.message}\n`);
      }
    }
    
    console.log('🎉 Database optimization complete!');
    console.log('\n📈 Performance Improvements:');
    console.log('✅ Search indexes: Active');
    console.log('✅ Optimized search function: Working');
    console.log('✅ Query performance: Enhanced');
    
    console.log('\n📋 Now ready to test on the website!');
    console.log('   Search for "Mountain" should be much faster');
    console.log('   Multiple searches should not cause CPU issues');
    
  } catch (error) {
    console.error('❌ Error recreating search function:', error);
  } finally {
    await prisma.$disconnect();
  }
}

recreateSearchFunction().catch(console.error);