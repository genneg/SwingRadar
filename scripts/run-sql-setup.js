#!/usr/bin/env node

/**
 * Execute initial SQL setup for Supabase
 */

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const DATABASE_URL = process.env.DATABASE_URL || "postgresql://postgres:mVVzMkwCK6fP4RG@db.tqvvseagpkmdnsiuwabv.supabase.co:5432/postgres";

async function runSqlSetup() {
  console.log('🚀 Running initial SQL setup for Supabase...\n');

  const client = new Client({
    connectionString: DATABASE_URL,
  });

  try {
    await client.connect();
    console.log('✅ Connected to Supabase database\n');

    // Read the SQL file
    const sqlPath = path.join(__dirname, 'migrate-production.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    // Execute the SQL
    console.log('📄 Executing migrate-production.sql...');
    const result = await client.query(sql);
    
    console.log('✅ SQL setup completed successfully!');
    console.log('📊 Result:', result.rows);

  } catch (error) {
    console.error('❌ SQL setup failed:', error.message);
    throw error;
  } finally {
    await client.end();
  }
}

// Run setup
if (require.main === module) {
  runSqlSetup()
    .then(() => {
      console.log('\n🎉 Initial SQL setup completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Setup failed:', error);
      process.exit(1);
    });
}

module.exports = { runSqlSetup };