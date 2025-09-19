#!/bin/bash

# Prisma Migration Commands for Supabase Setup
# Run these commands in order after setting up Supabase

echo "🗄️  Prisma Migration Commands for Supabase"
echo "============================================="
echo

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
  echo "❌ DATABASE_URL environment variable not set"
  echo "Set it to your Supabase connection string:"
  echo "export DATABASE_URL='postgresql://postgres:password@db.ref.supabase.co:5432/postgres'"
  exit 1
fi

echo "📡 Database URL: ${DATABASE_URL:0:30}..." 
echo

# Step 1: Generate Prisma Client
echo "1️⃣  Generating Prisma Client..."
cd packages/database
npx prisma generate
if [ $? -eq 0 ]; then
  echo "✅ Prisma client generated successfully"
else
  echo "❌ Failed to generate Prisma client"
  exit 1
fi
echo

# Step 2: Check database connection
echo "2️⃣  Testing database connection..."
npx prisma db pull --print
if [ $? -eq 0 ]; then
  echo "✅ Database connection successful"
else
  echo "❌ Cannot connect to database"
  exit 1
fi
echo

# Step 3: Create initial migration
echo "3️⃣  Creating initial migration..."
npx prisma migrate dev --name init --create-only
if [ $? -eq 0 ]; then
  echo "✅ Initial migration created"
else
  echo "❌ Failed to create migration"
  exit 1
fi
echo

# Step 4: Apply migration to Supabase
echo "4️⃣  Deploying migration to Supabase..."
npx prisma migrate deploy
if [ $? -eq 0 ]; then
  echo "✅ Migration deployed successfully"
else
  echo "❌ Migration deployment failed"
  exit 1
fi
echo

# Step 5: Verify schema
echo "5️⃣  Verifying database schema..."
npx prisma db pull --print | head -20
echo

# Step 6: Generate updated client
echo "6️⃣  Regenerating Prisma client with new schema..."
npx prisma generate
if [ $? -eq 0 ]; then
  echo "✅ Prisma client regenerated"
else
  echo "❌ Failed to regenerate client"
  exit 1
fi
echo

echo "🎉 Prisma setup completed successfully!"
echo
echo "Next steps:"
echo "1. Run data migration: node scripts/data-migration.js"
echo "2. Verify app connection: npm run dev"
echo "3. Check /api/test-db endpoint"
echo

# Optional: Show table counts
echo "📊 Database table verification:"
npx prisma studio --browser none &
STUDIO_PID=$!
sleep 2
kill $STUDIO_PID 2>/dev/null

echo "✅ Setup completed! Your database is ready."