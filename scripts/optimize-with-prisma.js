const { PrismaClient } = require('@prisma/client');
const fs = require('fs').promises;
const path = require('path');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://postgres.tqvvseagpkmdnsiuwabv:mVVzMkwCK6fP4RG@aws-0-eu-central-1.pooler.supabase.com:5432/postgres'
    }
  }
});

async function optimizeDatabase() {
  console.log('🚀 Starting Festival Scout Database Optimization with Prisma...\n');
  
  try {
    // Test connection
    await prisma.$connect();
    console.log('✅ Connected to Supabase database via Prisma');
    
    // Create essential indexes first
    console.log('\n📋 Creating essential search indexes...');
    
    const criticalIndexes = [
      {
        name: 'idx_events_name_gin',
        query: `CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_events_name_gin 
                ON events USING GIN (to_tsvector('english', name))`
      },
      {
        name: 'idx_events_fulltext_search',
        query: `CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_events_fulltext_search 
                ON events USING GIN (
                    to_tsvector('english', 
                        COALESCE(name, '') || ' ' || 
                        COALESCE(description, '') || ' ' || 
                        COALESCE(city, '') || ' ' || 
                        COALESCE(country, '') || ' ' || 
                        COALESCE(style, '')
                    )
                )`
      },
      {
        name: 'idx_events_city_lower',
        query: `CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_events_city_lower 
                ON events (LOWER(city))`
      },
      {
        name: 'idx_events_country_lower',
        query: `CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_events_country_lower 
                ON events (LOWER(country))`
      },
      {
        name: 'idx_events_from_date',
        query: `CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_events_from_date 
                ON events (from_date)`
      }
    ];
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const index of criticalIndexes) {
      try {
        console.log(`⏳ Creating index: ${index.name}...`);
        await prisma.$executeRawUnsafe(index.query);
        console.log(`   ✅ Success: ${index.name}`);
        successCount++;
      } catch (error) {
        if (error.message.includes('already exists')) {
          console.log(`   ℹ️  Already exists: ${index.name}`);
          successCount++;
        } else {
          console.log(`   ❌ Error: ${index.name} - ${error.message}`);
          errorCount++;
        }
      }
    }
    
    // Create optimized search function
    console.log('\n🔧 Creating optimized search function...');
    
    try {
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
            where_clause TEXT := 'TRUE';
        BEGIN
            -- Build WHERE conditions
            IF search_query IS NOT NULL AND search_query != '' THEN
                where_clause := where_clause || ' AND to_tsvector(''english'', 
                    COALESCE(name, '''') || '' '' || 
                    COALESCE(description, '''') || '' '' || 
                    COALESCE(city, '''') || '' '' || 
                    COALESCE(country, '''') || '' '' || 
                    COALESCE(style, '''')
                ) @@ plainto_tsquery(''english'', ''' || search_query || ''')';
            END IF;
            
            IF search_city IS NOT NULL AND search_city != '' THEN
                where_clause := where_clause || ' AND LOWER(city) LIKE LOWER(''%' || search_city || '%'')';
            END IF;
            
            IF search_country IS NOT NULL AND search_country != '' THEN
                where_clause := where_clause || ' AND LOWER(country) LIKE LOWER(''%' || search_country || '%'')';
            END IF;
            
            -- Get total count
            EXECUTE 'SELECT COUNT(*) FROM events WHERE ' || where_clause INTO total_results;
            
            -- Return results with ranking
            RETURN QUERY EXECUTE '
                SELECT ' || total_results || ' as total_count, 
                    e.id, e.name, e.description, e.short_desc, e.from_date, e.to_date,
                    e.city, e.country, e.website, e.style, e.image_url,
                    e.ai_quality_score, e.ai_completeness_score, e.extraction_method,
                    e.created_at, e.updated_at, ' ||
                    CASE 
                        WHEN search_query IS NOT NULL AND search_query != '' THEN
                            'ts_rank(to_tsvector(''english'', 
                                COALESCE(e.name, '''') || '' '' || 
                                COALESCE(e.description, '''') || '' '' || 
                                COALESCE(e.city, '''') || '' '' || 
                                COALESCE(e.country, '''') || '' '' || 
                                COALESCE(e.style, '''')
                            ), plainto_tsquery(''english'', ''' || search_query || ''')) as search_rank'
                        ELSE '0.0 as search_rank'
                    END ||
                ' FROM events e
                WHERE ' || where_clause || 
                CASE 
                    WHEN sort_by = 'relevance' AND search_query IS NOT NULL THEN
                        ' ORDER BY search_rank DESC, e.from_date ASC'
                    WHEN sort_by = 'date' THEN
                        ' ORDER BY e.from_date ' || CASE WHEN sort_order = 'desc' THEN 'DESC' ELSE 'ASC' END
                    ELSE ' ORDER BY e.from_date ASC'
                END ||
                ' LIMIT ' || page_limit || ' OFFSET ' || page_offset;
        END;
        $$ LANGUAGE plpgsql;
      `;
      
      await prisma.$executeRawUnsafe(searchFunction);
      console.log('   ✅ Search function created successfully');
      successCount++;
      
    } catch (error) {
      console.log(`   ❌ Search function error: ${error.message}`);
      errorCount++;
    }
    
    // Update table statistics
    console.log('\n📊 Updating table statistics...');
    try {
      await prisma.$executeRaw`ANALYZE events`;
      console.log('   ✅ Statistics updated');
      successCount++;
    } catch (error) {
      console.log(`   ❌ Statistics error: ${error.message}`);
      errorCount++;
    }
    
    // Test the optimization
    console.log('\n🧪 Testing optimized search...');
    
    const testQueries = ['Mountain', 'Stone', 'Blues'];
    
    for (const query of testQueries) {
      try {
        const startTime = Date.now();
        
        const results = await prisma.$queryRaw`
          SELECT * FROM search_events_optimized(${query}, NULL, NULL, 5, 0, 'relevance', 'desc')
        `;
        
        const duration = Date.now() - startTime;
        const count = results.length > 0 ? Number(results[0].total_count) : 0;
        
        console.log(`   🔍 "${query}": ${count} results in ${duration}ms`);
        
      } catch (error) {
        console.log(`   ❌ "${query}": ${error.message}`);
      }
    }
    
    // Final summary
    console.log('\n🎉 Database Optimization Complete!');
    console.log(`✅ Successful operations: ${successCount}`);
    console.log(`❌ Failed operations: ${errorCount}`);
    
    if (errorCount === 0) {
      console.log('\n🚀 All optimizations applied successfully!');
    } else {
      console.log('\n⚠️  Some optimizations failed, but core improvements are in place.');
    }
    
    // Check existing indexes
    console.log('\n📋 Current search indexes:');
    const indexes = await prisma.$queryRaw`
      SELECT indexname, indexdef 
      FROM pg_indexes 
      WHERE tablename = 'events' 
      AND indexname LIKE 'idx_%'
      ORDER BY indexname
    `;
    
    indexes.forEach(index => {
      console.log(`   - ${index.indexname}`);
    });
    
    console.log('\n📋 Next Steps:');
    console.log('1. Test search performance on the website');
    console.log('2. Monitor database performance');
    console.log('3. Consider deploying optimized API endpoint');
    
  } catch (error) {
    console.error('❌ Fatal error during optimization:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run optimization
optimizeDatabase().catch(console.error);