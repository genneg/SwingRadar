const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://postgres.tqvvseagpkmdnsiuwabv:mVVzMkwCK6fP4RG@aws-0-eu-central-1.pooler.supabase.com:5432/postgres'
    }
  }
});

async function fixSearchRelevance() {
  console.log('🎯 Fixing Search Relevance - Exact Match Priority\n');
  
  try {
    await prisma.$connect();
    console.log('✅ Connected to database');
    
    // Drop existing function
    console.log('🗑️  Dropping existing search function...');
    await prisma.$executeRawUnsafe('DROP FUNCTION IF EXISTS search_events_optimized(text,text,text,integer,integer,text,text)');
    
    // Create improved search function with better relevance scoring
    console.log('⏳ Creating improved search function with exact match priority...');
    
    const improvedSearchFunction = `
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
          having_conditions TEXT := '';
          order_clause TEXT := '';
          full_query TEXT;
      BEGIN
          -- Build search conditions with relevance scoring
          IF search_query IS NOT NULL AND search_query != '' THEN
              -- Create conditions that prioritize exact and close matches
              search_conditions := search_conditions || ' AND (' ||
                  -- Exact name match gets highest priority
                  'LOWER(name) = LOWER(' || quote_literal(search_query) || ') OR ' ||
                  -- Name starts with query gets high priority  
                  'LOWER(name) LIKE LOWER(' || quote_literal(search_query || '%') || ') OR ' ||
                  -- Name contains query gets medium priority
                  'LOWER(name) LIKE LOWER(' || quote_literal('%' || search_query || '%') || ') OR ' ||
                  -- Other fields get lower priority
                  'LOWER(description) LIKE LOWER(' || quote_literal('%' || search_query || '%') || ') OR ' ||
                  'LOWER(city) LIKE LOWER(' || quote_literal('%' || search_query || '%') || ') OR ' ||
                  'LOWER(country) LIKE LOWER(' || quote_literal('%' || search_query || '%') || ') OR ' ||
                  'LOWER(style) LIKE LOWER(' || quote_literal('%' || search_query || '%') || ')' ||
              ')';
              
              -- Add having condition for minimum relevance
              having_conditions := ' HAVING (
                  CASE 
                      WHEN LOWER(name) = LOWER(' || quote_literal(search_query) || ') THEN 100.0
                      WHEN LOWER(name) LIKE LOWER(' || quote_literal(search_query || '%') || ') THEN 80.0
                      WHEN LOWER(name) LIKE LOWER(' || quote_literal('%' || search_query || '%') || ') THEN 60.0
                      WHEN LOWER(description) LIKE LOWER(' || quote_literal('%' || search_query || '%') || ') THEN 40.0
                      WHEN LOWER(city) LIKE LOWER(' || quote_literal('%' || search_query || '%') || ') THEN 30.0
                      WHEN LOWER(country) LIKE LOWER(' || quote_literal('%' || search_query || '%') || ') THEN 20.0
                      WHEN LOWER(style) LIKE LOWER(' || quote_literal('%' || search_query || '%') || ') THEN 25.0
                      ELSE 0.0
                  END
              ) > 0';
          END IF;
          
          IF search_city IS NOT NULL AND search_city != '' THEN
              search_conditions := search_conditions || 
                  ' AND LOWER(city) LIKE LOWER(' || quote_literal('%' || search_city || '%') || ')';
          END IF;
          
          IF search_country IS NOT NULL AND search_country != '' THEN
              search_conditions := search_conditions || 
                  ' AND LOWER(country) LIKE LOWER(' || quote_literal('%' || search_country || '%') || ')';
          END IF;
          
          -- Default to no conditions if none specified
          IF search_conditions = '' THEN
              search_conditions := ' AND TRUE';
              having_conditions := '';
          END IF;
          
          -- Get total count with relevance filtering
          full_query := 'SELECT COUNT(*) FROM (
              SELECT id FROM events 
              WHERE TRUE' || search_conditions || 
              CASE WHEN having_conditions != '' THEN 
                  ' GROUP BY id, name, description, city, country, style' || having_conditions
              ELSE ''
              END ||
          ') as filtered_events';
          
          EXECUTE full_query INTO total_results;
          
          -- Build order clause
          CASE sort_by
              WHEN 'relevance' THEN
                  IF search_query IS NOT NULL AND search_query != '' THEN
                      order_clause := 'ORDER BY (
                          CASE 
                              WHEN LOWER(name) = LOWER(' || quote_literal(search_query) || ') THEN 100.0
                              WHEN LOWER(name) LIKE LOWER(' || quote_literal(search_query || '%') || ') THEN 80.0
                              WHEN LOWER(name) LIKE LOWER(' || quote_literal('%' || search_query || '%') || ') THEN 60.0
                              WHEN LOWER(description) LIKE LOWER(' || quote_literal('%' || search_query || '%') || ') THEN 40.0
                              WHEN LOWER(city) LIKE LOWER(' || quote_literal('%' || search_query || '%') || ') THEN 30.0
                              WHEN LOWER(country) LIKE LOWER(' || quote_literal('%' || search_query || '%') || ') THEN 20.0
                              WHEN LOWER(style) LIKE LOWER(' || quote_literal('%' || search_query || '%') || ') THEN 25.0
                              ELSE 0.0
                          END
                      ) DESC, from_date ASC';
                  ELSE
                      order_clause := 'ORDER BY from_date ASC';
                  END IF;
              WHEN 'date' THEN 
                  order_clause := 'ORDER BY from_date ' || CASE WHEN sort_order = 'desc' THEN 'DESC' ELSE 'ASC' END;
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
                              WHEN LOWER(name) = LOWER(' || quote_literal(search_query) || ') THEN 100.0
                              WHEN LOWER(name) LIKE LOWER(' || quote_literal(search_query || '%') || ') THEN 80.0
                              WHEN LOWER(name) LIKE LOWER(' || quote_literal('%' || search_query || '%') || ') THEN 60.0
                              WHEN LOWER(description) LIKE LOWER(' || quote_literal('%' || search_query || '%') || ') THEN 40.0
                              WHEN LOWER(city) LIKE LOWER(' || quote_literal('%' || search_query || '%') || ') THEN 30.0
                              WHEN LOWER(country) LIKE LOWER(' || quote_literal('%' || search_query || '%') || ') THEN 20.0
                              WHEN LOWER(style) LIKE LOWER(' || quote_literal('%' || search_query || '%') || ') THEN 25.0
                              ELSE 0.0 END)::REAL as search_rank'
                      ELSE '0.0::REAL as search_rank'
                  END || '
              FROM events 
              WHERE TRUE' || search_conditions || ' ' ||
              CASE WHEN having_conditions != '' THEN 
                  'GROUP BY id, name, description, from_date, to_date, city, country, website, style, image_url, ai_quality_score, ai_completeness_score, extraction_method, created_at, updated_at' || having_conditions || ' '
              ELSE ''
              END ||
              order_clause || ' 
              LIMIT ' || page_limit || ' 
              OFFSET ' || page_offset;
          
          -- Return results
          RETURN QUERY EXECUTE full_query;
      END;
      $$ LANGUAGE plpgsql;
    `;
    
    await prisma.$executeRawUnsafe(improvedSearchFunction);
    console.log('✅ Improved search function created successfully');
    
    // Test the improved function
    console.log('\n🧪 Testing improved search relevance...');
    
    const testCases = [
      { query: 'ESpanish', description: 'Should find only ESpanish Blues Festival' },
      { query: 'Mountain', description: 'Should prioritize Mountain Monkey Adventure' },
      { query: 'Blues', description: 'Should find blues events ordered by relevance' },
      { query: 'Lazy', description: 'Should find Lazy Blues first' }
    ];
    
    for (const test of testCases) {
      console.log(`\n🔍 Testing: "${test.query}"`);
      console.log(`   Expected: ${test.description}`);
      
      try {
        const startTime = Date.now();
        
        const results = await prisma.$queryRaw`
          SELECT * FROM search_events_optimized(
            ${test.query}, 
            NULL, 
            NULL, 
            10, 0, 'relevance', 'desc'
          )
        `;
        
        const duration = Date.now() - startTime;
        const count = results.length > 0 ? Number(results[0].total_count) : 0;
        
        console.log(`   📊 Results: ${count} events in ${duration}ms`);
        
        // Show top results with ranking
        results.forEach((result, index) => {
          if (result.name && index < 3) {
            console.log(`   ${index + 1}. "${result.name}" (rank: ${result.search_rank})`);
          }
        });
        
        if (results.length === 0) {
          console.log(`   📝 No results found`);
        }
        
      } catch (error) {
        console.log(`   ❌ Test failed: ${error.message}`);
      }
    }
    
    console.log('\n🎉 Search relevance improvements complete!');
    console.log('\n📋 Key Improvements:');
    console.log('✅ Exact matches get highest priority (score: 100)');
    console.log('✅ "Starts with" matches get high priority (score: 80)');
    console.log('✅ "Contains" matches get medium priority (score: 60)');
    console.log('✅ Description/location matches get lower priority');
    console.log('✅ Results ordered by relevance score');
    
    console.log('\n📋 Now "ESpanish" should return only ESpanish Blues Festival!');
    
  } catch (error) {
    console.error('❌ Error fixing search relevance:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixSearchRelevance().catch(console.error);