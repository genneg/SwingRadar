# @festival-scout/database

Shared database package for Festival Scout containing Prisma schemas, migrations, and database utilities.

## Setup

This package will contain:

- **Prisma Schema**: Database models and relationships
- **Migrations**: Database schema changes
- **Seed Data**: Development and test data
- **Database Utilities**: Connection helpers and utilities

## Future Structure

```
packages/database/
├── src/
│   ├── index.ts          # Main exports
│   ├── seed.ts           # Seed data scripts
│   └── utils.ts          # Database utilities
├── prisma/
│   ├── schema.prisma     # Prisma schema
│   ├── migrations/       # Database migrations
│   └── seed/             # Seed data files
└── package.json
```

## Usage

Once implemented, this package will be used by the main app:

```typescript
import { db } from '@festival-scout/database'

// Database operations
const events = await db.event.findMany()
```

## Development

- `npm run generate` - Generate Prisma client
- `npm run migrate` - Run database migrations
- `npm run seed` - Seed database with test data
- `npm run studio` - Open Prisma Studio