# Database Migration and Seeding Guide

## Overview

This guide covers all aspects of database migration and seeding for the Festival Scout application. It includes setup procedures, best practices, and troubleshooting information.

## Table of Contents

1. [Migration Overview](#migration-overview)
2. [Seeding Overview](#seeding-overview)
3. [Environment Setup](#environment-setup)
4. [Migration Procedures](#migration-procedures)
5. [Seeding Procedures](#seeding-procedures)
6. [Test Data Management](#test-data-management)
7. [Production Deployment](#production-deployment)
8. [Troubleshooting](#troubleshooting)
9. [Best Practices](#best-practices)

## Migration Overview

### What are Migrations?

Migrations are version-controlled database schema changes that allow you to:
- Update database structure safely
- Roll back changes if needed
- Share schema changes across team members
- Deploy consistent database structure to different environments

### Migration Files

All migration files are located in:
```
packages/database/prisma/migrations/
```

Current migrations:
- `20250715062006_initial_schema/`: Initial database schema with all tables and relationships

### Schema Features

The current schema includes:
- **20+ tables** covering all application entities
- **Strategic indexing** for performance optimization
- **Foreign key constraints** for data integrity
- **Enum types** for controlled values
- **Comprehensive relationships** between entities

## Seeding Overview

### What is Seeding?

Seeding populates the database with initial data for development and testing. Our seeding system provides:
- **Basic seed data**: Essential data for application functionality
- **Test scenarios**: Complex data scenarios for testing different features
- **Development data**: Rich dataset for development work

### Seed Files

- `src/seed.ts`: Main seeding functionality with comprehensive sample data
- `src/test-data.ts`: Advanced test scenarios for specific use cases
- `src/utils.ts`: Utility functions for data operations

## Environment Setup

### Prerequisites

Before running migrations or seeding:

1. **PostgreSQL 15+** installed and running
2. **Node.js 18+** installed
3. **Environment variables** configured

### Environment Variables

Create `.env` file in the database package root:

```env
# Database connection
DATABASE_URL="postgresql://username:password@localhost:5432/festivalscout_dev"

# Environment
NODE_ENV="development"

# Optional: Enable query logging
PRISMA_LOG_LEVEL="info"
```

### Development Setup

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Apply migrations
npx prisma migrate deploy
```

## Migration Procedures

### 1. Creating New Migrations

When you modify the Prisma schema:

```bash
# Create and apply migration
npx prisma migrate dev --name descriptive_migration_name

# Example
npx prisma migrate dev --name add_user_preferences_table
```

### 2. Applying Migrations

**Development environment:**
```bash
npx prisma migrate dev
```

**Production environment:**
```bash
npx prisma migrate deploy
```

### 3. Migration Status

Check migration status:
```bash
npx prisma migrate status
```

### 4. Resetting Database (Development Only)

**⚠️ Warning: This will delete all data!**

```bash
npx prisma migrate reset
```

### 5. Rolling Back Migrations

Prisma doesn't support automatic rollbacks. To rollback:

1. Identify the migration to rollback to
2. Manually edit the schema
3. Create a new migration with the changes

## Seeding Procedures

### 1. Basic Seeding

Run basic seed data (recommended for development):

```bash
npm run seed
# or
npx ts-node src/seed.ts
```

This creates:
- 6 venues across different countries
- 6 teachers with specialties and social media
- 6 musicians with genres and instruments
- 8 diverse events with different statuses
- 3 test users with preferences
- Following relationships between users and teachers/musicians

### 2. Advanced Seeding with Test Scenarios

Run seed with comprehensive test scenarios:

```typescript
import { seedDatabase } from './src/seed'

// Include test scenarios
await seedDatabase(true)
```

Or via command line:
```bash
# Modify the seed.ts file to call seedDatabase(true)
npx ts-node src/seed.ts
```

### 3. Test Scenarios Only

Run only test scenarios (requires basic seed data):

```bash
npx ts-node src/test-data.ts
```

### 4. Custom Seeding

```typescript
import { seedVenues, seedTeachers, seedEvents } from './src/seed'

// Seed specific data types
const venues = await seedVenues()
const teachers = await seedTeachers()
// etc.
```

## Test Data Management

### Available Test Scenarios

1. **Power User Scenario**
   - User with many following relationships
   - Tests personalization and recommendation features

2. **Complex Event Scenario**
   - Event with multiple pricing tiers
   - Full capacity and registration deadlines
   - Tests pricing and capacity management

3. **High Engagement Scenario**
   - Event with saves, attendances, and reviews
   - Tests user interaction features

4. **Event Lifecycle Scenario**
   - Events in different statuses (draft, cancelled, completed, archived)
   - Tests status filtering and lifecycle management

5. **International Events Scenario**
   - Events with different currencies and international venues
   - Tests multi-currency and globalization features

6. **Notification Scenario**
   - Various notification types and states
   - Tests notification system functionality

### Running Specific Scenarios

```typescript
import { 
  createPowerUserScenario,
  createComplexEventScenario,
  createHighEngagementEventScenario
} from './src/test-data'

// Run individual scenarios
await createPowerUserScenario()
await createComplexEventScenario()
```

### Cleaning Up Test Data

```typescript
import { cleanupTestData } from './src/test-data'

await cleanupTestData()
```

## Production Deployment

### Pre-deployment Checklist

- [ ] Review all pending migrations
- [ ] Test migrations on staging environment
- [ ] Backup production database
- [ ] Verify rollback procedures
- [ ] Check migration compatibility

### Production Migration Process

1. **Backup Database**
   ```bash
   pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql
   ```

2. **Apply Migrations**
   ```bash
   npx prisma migrate deploy
   ```

3. **Verify Application**
   - Check application startup
   - Test critical user flows
   - Monitor error logs

### Production Seeding

**⚠️ Never run development seed data in production!**

For production, consider:
- Minimal essential data only
- No test users or fake data
- Real venue and artist information
- Proper verification flags

## Troubleshooting

### Common Migration Issues

**Issue: Migration fails with constraint violation**
```
Solution: Check for existing data that violates new constraints
- Review data before migration
- Create data migration if needed
- Use proper constraint handling
```

**Issue: Prisma client out of sync**
```bash
# Regenerate Prisma client
npx prisma generate
```

**Issue: Migration history diverged**
```
Solution: Reset database (development only) or manually resolve conflicts
npx prisma migrate reset  # Development only
```

### Common Seeding Issues

**Issue: Foreign key constraint violations**
```
Solution: Ensure proper order of data creation
- Create parent entities first
- Use proper relationship handling
- Check existing data conflicts
```

**Issue: Unique constraint violations**
```
Solution: Use upsert operations or check for existing data
- Use db.model.upsert() instead of create()
- Check for existing records first
- Handle duplicate prevention properly
```

**Issue: Memory issues with large datasets**
```
Solution: Use batch operations and proper cleanup
- Create data in batches
- Use proper transaction handling
- Monitor memory usage
```

### Debug Commands

```bash
# Check database connection
npx prisma db ping

# View database schema
npx prisma db pull

# Reset and reseed (development only)
npx prisma migrate reset && npm run seed

# Generate new client
npx prisma generate

# Open Prisma Studio
npx prisma studio
```

## Best Practices

### Migration Best Practices

1. **Descriptive Names**: Use clear, descriptive migration names
2. **Small Changes**: Keep migrations focused and small
3. **Test First**: Always test migrations on development/staging first
4. **Backup**: Always backup production data before migrations
5. **Rollback Plan**: Have a rollback strategy for production migrations

### Seeding Best Practices

1. **Idempotent**: Seeds should be runnable multiple times safely
2. **Environment Aware**: Different seed data for different environments
3. **Realistic Data**: Use realistic data that reflects actual usage
4. **Performance**: Optimize seed operations for large datasets
5. **Cleanup**: Provide cleanup mechanisms for test data

### Code Quality

1. **Type Safety**: Use TypeScript types throughout
2. **Error Handling**: Implement proper error handling
3. **Logging**: Provide clear logging for debugging
4. **Documentation**: Document complex seeding logic
5. **Testing**: Test seed functions independently

## Scripts and Commands

### Package.json Scripts

Add these scripts to your package.json:

```json
{
  "scripts": {
    "db:migrate": "prisma migrate dev",
    "db:deploy": "prisma migrate deploy",
    "db:reset": "prisma migrate reset",
    "db:seed": "ts-node src/seed.ts",
    "db:seed-test": "ts-node src/test-data.ts",
    "db:generate": "prisma generate",
    "db:studio": "prisma studio",
    "db:status": "prisma migrate status"
  }
}
```

### Development Workflow

```bash
# Daily development
npm run db:migrate    # Apply any new migrations
npm run db:seed       # Refresh seed data if needed

# Feature development
npm run db:reset      # Reset to clean state
npm run db:seed       # Apply fresh seed data

# Testing
npm run db:seed-test  # Add test scenarios

# Production deployment
npm run db:deploy     # Deploy migrations only
```

## Monitoring and Maintenance

### Regular Maintenance

- Monitor migration performance
- Review and optimize slow queries
- Clean up old test data
- Update seed data to reflect current requirements
- Review foreign key constraints and indexes

### Performance Monitoring

- Track migration execution times
- Monitor database size growth
- Review query performance after schema changes
- Optimize indexes based on usage patterns

## Security Considerations

### Migration Security

- Review all schema changes for security implications
- Ensure proper permissions on sensitive data
- Validate data constraints and access patterns
- Test with realistic data volumes

### Seeding Security

- Never include real user data in development seeds
- Use secure default passwords for test accounts
- Sanitize any external data sources
- Review data visibility and access patterns

---

## Additional Resources

- [Prisma Migration Documentation](https://www.prisma.io/docs/concepts/components/prisma-migrate)
- [Prisma Seeding Guide](https://www.prisma.io/docs/guides/database/seed-database)
- [PostgreSQL Best Practices](https://wiki.postgresql.org/wiki/Don%27t_Do_This)

---

**Last Updated**: Task-008 Implementation  
**Version**: 1.0.0  
**Maintainer**: Development Team