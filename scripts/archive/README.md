# Archived Database Scripts

This directory contains database exploration and testing scripts that are no longer needed for regular development.

## Archived Scripts

### Database Exploration (Historical)
- **`explore-external-db.js`** - JavaScript script to explore external database content
- **`check-external-db.sql`** - SQL script to count and verify external database tables
- **`explore-structure.sql`** - SQL script to analyze database structure and relationships
- **`inspect-database.sql`** - SQL script for detailed database inspection

### Testing Scripts (Historical)  
- **`test-auth-config.js`** - Node.js script to test NextAuth.js configuration

## Reason for Archiving

These scripts were used during the initial database integration phase to:
1. Explore the external swing_events database structure
2. Verify data content and relationships
3. Test authentication configuration
4. Debug database connectivity issues

## Current Status

The database integration is now complete and these scripts are no longer needed because:
- ✅ Database schema is fully mapped with Prisma
- ✅ External database integration is working
- ✅ Authentication is properly configured
- ✅ Data validation is complete

## Active Scripts

Current production/development scripts remain in `/scripts/`:
- `backup-external-db.sh` - Database backup procedures
- `migrate-external-db.sql` - Production migration scripts
- `seed-sample-data.sql` - Sample data generation
- `init-db.sql` - Database initialization
- Other migration and setup scripts

## Access

These archived scripts remain available for:
- Historical reference
- Debugging similar issues in the future
- Understanding the database exploration process
- Training/onboarding new developers