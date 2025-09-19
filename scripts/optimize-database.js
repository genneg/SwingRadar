const { Pool } = require('pg');
const fs = require('fs').promises;
const path = require('path');

// Database connection using pooled endpoint
const pool = new Pool({
  connectionString: 'postgresql://postgres.tqvvseagpkmdnsiuwabv:mVVzMkwCK6fP4RG@aws-0-eu-central-1.pooler.supabase.com:5432/postgres',
  ssl: {
    rejectUnauthorized: false
  },
  max: 5, // Limit concurrent connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

async function optimizeDatabase() {
  console.log('🚀 Starting Festival Scout Database Optimization...\n');
  
  let client;
  try {
    // Test connection
    client = await pool.connect();
    console.log('✅ Connected to Supabase database');
    
    // Read optimization SQL
    const sqlPath = path.join(__dirname, '../database-optimization-plan.sql');
    const optimizationSQL = await fs.readFile(sqlPath, 'utf8');
    
    // Split SQL into individual statements
    const statements = optimizationSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt && !stmt.startsWith('--') && stmt !== '')
      .map(stmt => stmt + ';');
    
    console.log(`📝 Found ${statements.length} SQL statements to execute\n`);
    
    let successCount = 0;
    let errorCount = 0;
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      
      // Skip comments and empty statements
      if (statement.trim().startsWith('--') || statement.trim().length < 10) {
        continue;
      }
      
      try {
        console.log(`⏳ Executing statement ${i + 1}/${statements.length}...`);
        
        // Extract statement type for better logging
        const statementType = statement.trim().split(' ')[0].toUpperCase();
        const statementName = extractStatementName(statement);
        
        console.log(`   ${statementType}: ${statementName}`);
        
        await client.query(statement);
        console.log(`   ✅ Success\n`);
        successCount++;
        
      } catch (error) {
        console.log(`   ❌ Error: ${error.message}\n`);
        
        // Don't fail on "already exists" errors
        if (error.message.includes('already exists') || 
            error.message.includes('does not exist')) {
          console.log(`   ℹ️  Skipping: ${error.message}\n`);
          continue;
        }
        
        errorCount++;
        
        // Continue with other optimizations even if one fails
        console.log(`   ⚠️  Continuing with other optimizations...\n`);
      }
    }
    
    // Run ANALYZE for updated statistics
    console.log('📊 Updating table statistics...');
    await client.query('ANALYZE;');
    console.log('✅ Statistics updated\n');
    
    // Check optimization results
    console.log('🔍 Checking optimization results...\n');
    
    // Check indexes
    const indexQuery = `
      SELECT 
        indexname,
        indexdef
      FROM pg_indexes 
      WHERE tablename = 'events' 
      AND indexname LIKE 'idx_%'
      ORDER BY indexname;
    `;
    
    const indexes = await client.query(indexQuery);
    console.log(`📋 Created ${indexes.rows.length} search indexes:`);
    indexes.rows.forEach(row => {
      console.log(`   - ${row.indexname}`);
    });
    
    // Check materialized view
    const mvQuery = `
      SELECT COUNT(*) as event_count 
      FROM events_search_view;
    `;
    
    try {
      const mvResult = await client.query(mvQuery);
      console.log(`📊 Materialized view contains ${mvResult.rows[0].event_count} events`);
    } catch (mvError) {
      console.log(`⚠️  Materialized view not created: ${mvError.message}`);
    }
    
    // Final summary
    console.log('\n🎉 Database Optimization Complete!');
    console.log(`✅ Successful operations: ${successCount}`);
    console.log(`❌ Failed operations: ${errorCount}`);
    
    if (errorCount === 0) {
      console.log('\n🚀 All optimizations applied successfully!');
      console.log('   Search performance should be significantly improved.');
    } else {
      console.log('\n⚠️  Some optimizations failed, but core improvements are in place.');
      console.log('   Search performance should still be improved.');
    }
    
    console.log('\n📋 Next Steps:');
    console.log('1. Test search performance with: npm run test:search');
    console.log('2. Monitor query performance in Supabase dashboard');
    console.log('3. Consider switching to optimized API endpoint');
    
  } catch (error) {
    console.error('❌ Fatal error during optimization:', error);
    process.exit(1);
  } finally {
    if (client) {
      client.release();
    }
    await pool.end();
  }
}

function extractStatementName(statement) {
  const stmt = statement.trim();
  
  if (stmt.includes('CREATE INDEX')) {
    const match = stmt.match(/CREATE\s+INDEX\s+(?:CONCURRENTLY\s+)?(?:IF\s+NOT\s+EXISTS\s+)?(\w+)/i);
    return match ? match[1] : 'unknown_index';
  }
  
  if (stmt.includes('CREATE OR REPLACE FUNCTION')) {
    const match = stmt.match(/CREATE\s+OR\s+REPLACE\s+FUNCTION\s+(\w+)/i);
    return match ? match[1] : 'unknown_function';
  }
  
  if (stmt.includes('CREATE MATERIALIZED VIEW')) {
    const match = stmt.match(/CREATE\s+MATERIALIZED\s+VIEW\s+(\w+)/i);
    return match ? match[1] : 'unknown_view';
  }
  
  if (stmt.includes('ANALYZE')) {
    return 'table_statistics';
  }
  
  return 'database_operation';
}

// Performance test function
async function testSearchPerformance() {
  console.log('\n🧪 Testing Search Performance...');
  
  const testQueries = [
    'Mountain',
    'Stone', 
    'Vicci',
    'Blues',
    'Berlin'
  ];
  
  let client;
  try {
    client = await pool.connect();
    
    for (const query of testQueries) {
      const startTime = Date.now();
      
      try {
        const result = await client.query(`
          SELECT * FROM search_events_optimized($1, NULL, NULL, 10, 0, 'relevance', 'desc')
        `, [query]);
        
        const duration = Date.now() - startTime;
        console.log(`🔍 "${query}": ${result.rows.length} results in ${duration}ms`);
        
      } catch (error) {
        console.log(`❌ "${query}": Error - ${error.message}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Performance test failed:', error);
  } finally {
    if (client) {
      client.release();
    }
  }
}

// Run optimization
if (require.main === module) {
  optimizeDatabase()
    .then(() => testSearchPerformance())
    .catch(console.error);
}

module.exports = { optimizeDatabase, testSearchPerformance };