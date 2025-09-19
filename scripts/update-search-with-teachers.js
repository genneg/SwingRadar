const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://postgres.tqvvseagpkmdnsiuwabv:mVVzMkwCK6fP4RG@aws-0-eu-central-1.pooler.supabase.com:5432/postgres'
    }
  }
});

async function updateSearchWithTeachers() {
  console.log('🎯 Updating Search Function to Include Teachers and Musicians\n');
  
  try {
    await prisma.$connect();
    console.log('✅ Connected to database');
    
    // First, test current search behavior
    console.log('🧪 Testing current search for teachers...');
    
    // Get a teacher name to test
    const sampleTeachers = await prisma.teacher.findMany({
      take: 3,
      select: { name: true }
    });
    
    if (sampleTeachers.length > 0) {
      console.log('📋 Sample teachers in database:');
      sampleTeachers.forEach((teacher, index) => {
        console.log(`   ${index + 1}. "${teacher.name}"`);
      });
      
      const testTeacherName = sampleTeachers[0].name;
      console.log(`\n🔍 Testing search for teacher: "${testTeacherName}"`);
      
      // Test current search
      const currentResults = await prisma.$queryRaw`
        SELECT * FROM search_events_optimized(${testTeacherName}, NULL, NULL, 5, 0, 'relevance', 'desc')
      `;
      
      console.log(`Current search results: ${currentResults.length > 0 ? Number(currentResults[0].total_count) : 0} events`);
    }
    
    // Drop existing function
    console.log('\n🗑️  Dropping existing search function...');
    await prisma.$executeRawUnsafe('DROP FUNCTION IF EXISTS search_events_optimized(text,text,text,integer,integer,text,text)');
    
    // Create enhanced search function
    console.log('⏳ Creating enhanced search function with teachers and musicians...');
    
    const enhancedSearchFunction = `
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
          -- Build search conditions with teachers and musicians
          IF search_query IS NOT NULL AND search_query != '' THEN
              search_conditions := search_conditions || ' AND (
                  -- Event fields
                  LOWER(e.name) = LOWER(' || quote_literal(search_query) || ') OR 
                  LOWER(e.name) LIKE LOWER(' || quote_literal(search_query || '%') || ') OR 
                  LOWER(e.name) LIKE LOWER(' || quote_literal('%' || search_query || '%') || ') OR 
                  LOWER(e.description) LIKE LOWER(' || quote_literal('%' || search_query || '%') || ') OR 
                  LOWER(e.city) LIKE LOWER(' || quote_literal('%' || search_query || '%') || ') OR 
                  LOWER(e.country) LIKE LOWER(' || quote_literal('%' || search_query || '%') || ') OR 
                  LOWER(e.style) LIKE LOWER(' || quote_literal('%' || search_query || '%') || ') OR
                  -- Teacher names
                  EXISTS (
                      SELECT 1 FROM event_teachers et 
                      JOIN teachers t ON et.teacher_id = t.id 
                      WHERE et.event_id = e.id 
                      AND LOWER(t.name) LIKE LOWER(' || quote_literal('%' || search_query || '%') || ')
                  ) OR
                  -- Musician names  
                  EXISTS (
                      SELECT 1 FROM event_musicians em 
                      JOIN musicians m ON em.musician_id = m.id 
                      WHERE em.event_id = e.id 
                      AND LOWER(m.name) LIKE LOWER(' || quote_literal('%' || search_query || '%') || ')
                  )
              )';
              
              -- Add having condition for enhanced relevance with teachers/musicians
              having_conditions := ' HAVING (
                  CASE 
                      WHEN LOWER(e.name) = LOWER(' || quote_literal(search_query) || ') THEN 100.0
                      WHEN LOWER(e.name) LIKE LOWER(' || quote_literal(search_query || '%') || ') THEN 80.0
                      WHEN LOWER(e.name) LIKE LOWER(' || quote_literal('%' || search_query || '%') || ') THEN 60.0
                      -- Teacher exact match gets high priority
                      WHEN EXISTS (
                          SELECT 1 FROM event_teachers et 
                          JOIN teachers t ON et.teacher_id = t.id 
                          WHERE et.event_id = e.id 
                          AND LOWER(t.name) = LOWER(' || quote_literal(search_query) || ')
                      ) THEN 90.0
                      -- Teacher partial match
                      WHEN EXISTS (
                          SELECT 1 FROM event_teachers et 
                          JOIN teachers t ON et.teacher_id = t.id 
                          WHERE et.event_id = e.id 
                          AND LOWER(t.name) LIKE LOWER(' || quote_literal('%' || search_query || '%') || ')
                      ) THEN 70.0
                      -- Musician exact match
                      WHEN EXISTS (
                          SELECT 1 FROM event_musicians em 
                          JOIN musicians m ON em.musician_id = m.id 
                          WHERE em.event_id = e.id 
                          AND LOWER(m.name) = LOWER(' || quote_literal(search_query) || ')
                      ) THEN 85.0
                      -- Musician partial match
                      WHEN EXISTS (
                          SELECT 1 FROM event_musicians em 
                          JOIN musicians m ON em.musician_id = m.id 
                          WHERE em.event_id = e.id 
                          AND LOWER(m.name) LIKE LOWER(' || quote_literal('%' || search_query || '%') || ')
                      ) THEN 65.0
                      WHEN LOWER(e.description) LIKE LOWER(' || quote_literal('%' || search_query || '%') || ') THEN 40.0
                      WHEN LOWER(e.city) LIKE LOWER(' || quote_literal('%' || search_query || '%') || ') THEN 30.0
                      WHEN LOWER(e.country) LIKE LOWER(' || quote_literal('%' || search_query || '%') || ') THEN 20.0
                      WHEN LOWER(e.style) LIKE LOWER(' || quote_literal('%' || search_query || '%') || ') THEN 25.0
                      ELSE 0.0
                  END
              ) > 0';
          END IF;
          
          IF search_city IS NOT NULL AND search_city != '' THEN
              search_conditions := search_conditions || 
                  ' AND LOWER(e.city) LIKE LOWER(' || quote_literal('%' || search_city || '%') || ')';
          END IF;
          
          IF search_country IS NOT NULL AND search_country != '' THEN
              search_conditions := search_conditions || 
                  ' AND LOWER(e.country) LIKE LOWER(' || quote_literal('%' || search_country || '%') || ')';
          END IF;
          
          -- Default to no conditions if none specified
          IF search_conditions = '' THEN
              search_conditions := ' AND TRUE';
              having_conditions := '';
          END IF;
          
          -- Get total count with enhanced search
          full_query := 'SELECT COUNT(*) FROM (
              SELECT e.id FROM events e
              WHERE TRUE' || search_conditions || 
              CASE WHEN having_conditions != '' THEN 
                  ' GROUP BY e.id, e.name, e.description, e.city, e.country, e.style' || having_conditions
              ELSE ''
              END ||
          ') as filtered_events';
          
          EXECUTE full_query INTO total_results;
          
          -- Build order clause with enhanced ranking
          CASE sort_by
              WHEN 'relevance' THEN
                  IF search_query IS NOT NULL AND search_query != '' THEN
                      order_clause := 'ORDER BY (
                          CASE 
                              WHEN LOWER(e.name) = LOWER(' || quote_literal(search_query) || ') THEN 100.0
                              WHEN LOWER(e.name) LIKE LOWER(' || quote_literal(search_query || '%') || ') THEN 80.0
                              WHEN LOWER(e.name) LIKE LOWER(' || quote_literal('%' || search_query || '%') || ') THEN 60.0
                              WHEN EXISTS (
                                  SELECT 1 FROM event_teachers et 
                                  JOIN teachers t ON et.teacher_id = t.id 
                                  WHERE et.event_id = e.id 
                                  AND LOWER(t.name) = LOWER(' || quote_literal(search_query) || ')
                              ) THEN 90.0
                              WHEN EXISTS (
                                  SELECT 1 FROM event_teachers et 
                                  JOIN teachers t ON et.teacher_id = t.id 
                                  WHERE et.event_id = e.id 
                                  AND LOWER(t.name) LIKE LOWER(' || quote_literal('%' || search_query || '%') || ')
                              ) THEN 70.0
                              WHEN EXISTS (
                                  SELECT 1 FROM event_musicians em 
                                  JOIN musicians m ON em.musician_id = m.id 
                                  WHERE em.event_id = e.id 
                                  AND LOWER(m.name) = LOWER(' || quote_literal(search_query) || ')
                              ) THEN 85.0
                              WHEN EXISTS (
                                  SELECT 1 FROM event_musicians em 
                                  JOIN musicians m ON em.musician_id = m.id 
                                  WHERE em.event_id = e.id 
                                  AND LOWER(m.name) LIKE LOWER(' || quote_literal('%' || search_query || '%') || ')
                              ) THEN 65.0
                              WHEN LOWER(e.description) LIKE LOWER(' || quote_literal('%' || search_query || '%') || ') THEN 40.0
                              WHEN LOWER(e.city) LIKE LOWER(' || quote_literal('%' || search_query || '%') || ') THEN 30.0
                              WHEN LOWER(e.country) LIKE LOWER(' || quote_literal('%' || search_query || '%') || ') THEN 20.0
                              WHEN LOWER(e.style) LIKE LOWER(' || quote_literal('%' || search_query || '%') || ') THEN 25.0
                              ELSE 0.0
                          END
                      ) DESC, e.from_date ASC';
                  ELSE
                      order_clause := 'ORDER BY e.from_date ASC';
                  END IF;
              WHEN 'date' THEN 
                  order_clause := 'ORDER BY e.from_date ' || CASE WHEN sort_order = 'desc' THEN 'DESC' ELSE 'ASC' END;
              ELSE 
                  order_clause := 'ORDER BY e.from_date ASC';
          END CASE;
          
          -- Build and execute final query with enhanced search
          full_query := '
              SELECT 
                  ' || total_results || '::BIGINT as total_count,
                  e.id,
                  e.name::VARCHAR,
                  e.description,
                  e.from_date,
                  e.to_date,
                  e.city::VARCHAR,
                  e.country::VARCHAR,
                  e.website::VARCHAR,
                  e.style::VARCHAR,
                  e.image_url::VARCHAR,
                  e.ai_quality_score,
                  e.ai_completeness_score,
                  e.extraction_method::VARCHAR,
                  e.created_at,
                  e.updated_at, ' ||
                  CASE 
                      WHEN search_query IS NOT NULL AND search_query != '' THEN
                          '(CASE 
                              WHEN LOWER(e.name) = LOWER(' || quote_literal(search_query) || ') THEN 100.0
                              WHEN LOWER(e.name) LIKE LOWER(' || quote_literal(search_query || '%') || ') THEN 80.0
                              WHEN LOWER(e.name) LIKE LOWER(' || quote_literal('%' || search_query || '%') || ') THEN 60.0
                              WHEN EXISTS (
                                  SELECT 1 FROM event_teachers et 
                                  JOIN teachers t ON et.teacher_id = t.id 
                                  WHERE et.event_id = e.id 
                                  AND LOWER(t.name) = LOWER(' || quote_literal(search_query) || ')
                              ) THEN 90.0
                              WHEN EXISTS (
                                  SELECT 1 FROM event_teachers et 
                                  JOIN teachers t ON et.teacher_id = t.id 
                                  WHERE et.event_id = e.id 
                                  AND LOWER(t.name) LIKE LOWER(' || quote_literal('%' || search_query || '%') || ')
                              ) THEN 70.0
                              WHEN EXISTS (
                                  SELECT 1 FROM event_musicians em 
                                  JOIN musicians m ON em.musician_id = m.id 
                                  WHERE em.event_id = e.id 
                                  AND LOWER(m.name) = LOWER(' || quote_literal(search_query) || ')
                              ) THEN 85.0
                              WHEN EXISTS (
                                  SELECT 1 FROM event_musicians em 
                                  JOIN musicians m ON em.musician_id = m.id 
                                  WHERE em.event_id = e.id 
                                  AND LOWER(m.name) LIKE LOWER(' || quote_literal('%' || search_query || '%') || ')
                              ) THEN 65.0
                              WHEN LOWER(e.description) LIKE LOWER(' || quote_literal('%' || search_query || '%') || ') THEN 40.0
                              WHEN LOWER(e.city) LIKE LOWER(' || quote_literal('%' || search_query || '%') || ') THEN 30.0
                              WHEN LOWER(e.country) LIKE LOWER(' || quote_literal('%' || search_query || '%') || ') THEN 20.0
                              WHEN LOWER(e.style) LIKE LOWER(' || quote_literal('%' || search_query || '%') || ') THEN 25.0
                              ELSE 0.0 END)::REAL as search_rank'
                      ELSE '0.0::REAL as search_rank'
                  END || '
              FROM events e
              WHERE TRUE' || search_conditions || ' ' ||
              CASE WHEN having_conditions != '' THEN 
                  'GROUP BY e.id, e.name, e.description, e.from_date, e.to_date, e.city, e.country, e.website, e.style, e.image_url, e.ai_quality_score, e.ai_completeness_score, e.extraction_method, e.created_at, e.updated_at' || having_conditions || ' '
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
    
    await prisma.$executeRawUnsafe(enhancedSearchFunction);
    console.log('✅ Enhanced search function created successfully');
    
    // Test the enhanced function
    console.log('\n🧪 Testing enhanced search function...');
    
    if (sampleTeachers.length > 0) {
      const testTeacherName = sampleTeachers[0].name;
      console.log(`🔍 Testing search for teacher: "${testTeacherName}"`);
      
      const enhancedResults = await prisma.$queryRaw`
        SELECT * FROM search_events_optimized(${testTeacherName}, NULL, NULL, 5, 0, 'relevance', 'desc')
      `;
      
      const enhancedCount = enhancedResults.length > 0 ? Number(enhancedResults[0].total_count) : 0;
      console.log(`Enhanced search results: ${enhancedCount} events`);
      
      if (enhancedCount > 0) {
        console.log('📋 Events found for teacher:');
        enhancedResults.slice(0, 3).forEach((result, index) => {
          console.log(`   ${index + 1}. "${result.name}" (rank: ${result.search_rank})`);
        });
        console.log('🎉 SUCCESS! Teacher search now working!');
      } else {
        console.log('⚠️  No events found - might need to check teacher-event relationships');
      }
    }
    
    // Test musician search too
    console.log('\n🎵 Testing musician search...');
    const sampleMusicians = await prisma.musician.findMany({
      take: 2,
      select: { name: true }
    });
    
    if (sampleMusicians.length > 0) {
      const testMusicianName = sampleMusicians[0].name;
      console.log(`🔍 Testing search for musician: "${testMusicianName}"`);
      
      const musicianResults = await prisma.$queryRaw`
        SELECT * FROM search_events_optimized(${testMusicianName}, NULL, NULL, 5, 0, 'relevance', 'desc')
      `;
      
      const musicianCount = musicianResults.length > 0 ? Number(musicianResults[0].total_count) : 0;
      console.log(`Musician search results: ${musicianCount} events`);
      
      if (musicianCount > 0) {
        console.log('🎉 SUCCESS! Musician search also working!');
      }
    }
    
    console.log('\n🎯 TEACHER AND MUSICIAN SEARCH ENHANCEMENT COMPLETE!');
    console.log('\n📋 New Search Capabilities:');
    console.log('✅ Event names (exact match priority: 100, starts-with: 80, contains: 60)');
    console.log('✅ Teacher names (exact match: 90, partial: 70)');
    console.log('✅ Musician names (exact match: 85, partial: 65)');
    console.log('✅ Event descriptions (40 points)');
    console.log('✅ Locations (20-30 points)');
    console.log('✅ Event styles (25 points)');
    
    console.log('\n🚀 Ready to test on website!');
    
  } catch (error) {
    console.error('❌ Error updating search with teachers:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateSearchWithTeachers();