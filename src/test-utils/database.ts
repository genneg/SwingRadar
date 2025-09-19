import { PrismaClient } from '@/lib/database'

// Test database instance
let testDb: PrismaClient

// Database setup for tests
export const setupTestDatabase = async () => {
  if (!testDb) {
    testDb = new PrismaClient({
      datasources: {
        db: {
          url: process.env.TEST_DATABASE_URL || process.env.DATABASE_URL,
        },
      },
    })
  }
  
  await testDb.$connect()
  return testDb
}

// Database teardown for tests
export const teardownTestDatabase = async () => {
  if (testDb) {
    await testDb.$disconnect()
  }
}

// Clean all tables (for test isolation)
export const cleanDatabase = async () => {
  if (!testDb) {
    await setupTestDatabase()
  }
  
  // Delete in reverse order to handle foreign key constraints
  await testDb.notification.deleteMany()
  await testDb.userFollowsTeacher.deleteMany()
  await testDb.userFollowsMusician.deleteMany()
  await testDb.userFollowsEvent.deleteMany()
  await testDb.eventTeacher.deleteMany()
  await testDb.eventMusician.deleteMany()
  await testDb.event.deleteMany()
  await testDb.venue.deleteMany()
  await testDb.teacher.deleteMany()
  await testDb.musician.deleteMany()
  await testDb.account.deleteMany()
  await testDb.session.deleteMany()
  await testDb.user.deleteMany()
}

// Create test data helpers
export const createTestUser = async (data: any = {}) => {
  if (!testDb) {
    await setupTestDatabase()
  }
  
  return testDb.user.create({
    data: {
      email: data.email || 'test@example.com',
      name: data.name || 'Test User',
      ...data,
    },
  })
}

export const createTestVenue = async (data: any = {}) => {
  if (!testDb) {
    await setupTestDatabase()
  }
  
  return testDb.venue.create({
    data: {
      name: data.name || 'Test Venue',
      address: data.address || '123 Test Street, Test City, TC 12345',
      latitude: data.latitude || 40.7128,
      longitude: data.longitude || -74.0060,
      ...data,
    },
  })
}

export const createTestTeacher = async (data: any = {}) => {
  if (!testDb) {
    await setupTestDatabase()
  }
  
  return testDb.teacher.create({
    data: {
      name: data.name || 'Test Teacher',
      bio: data.bio || 'Professional blues dance instructor',
      specialties: data.specialties || ['slow blues', 'shuffle'],
      ...data,
    },
  })
}

export const createTestMusician = async (data: any = {}) => {
  if (!testDb) {
    await setupTestDatabase()
  }
  
  return testDb.musician.create({
    data: {
      name: data.name || 'Test Musician',
      bio: data.bio || 'Professional blues musician',
      genre: data.genre || 'traditional blues',
      ...data,
    },
  })
}

export const createTestEvent = async (data: any = {}) => {
  if (!testDb) {
    await setupTestDatabase()
  }
  
  let venue = data.venue
  if (!venue) {
    venue = await createTestVenue()
  }
  
  return testDb.event.create({
    data: {
      name: data.name || 'Test Event',
      description: data.description || 'A great test event',
      startDate: data.startDate || new Date('2024-06-15'),
      endDate: data.endDate || new Date('2024-06-17'),
      venueId: venue.id,
      registrationDeadline: data.registrationDeadline || new Date('2024-06-01'),
      price: data.price || 150,
      website: data.website || 'https://testevent.com',
      ...data,
    },
    include: {
      venue: true,
      teachers: true,
      musicians: true,
    },
  })
}

// Jest setup and teardown
export const setupDatabaseForTests = () => {
  if (typeof beforeAll !== 'undefined') {
    beforeAll(async () => {
      await setupTestDatabase()
    })
  }
  
  if (typeof afterAll !== 'undefined') {
    afterAll(async () => {
      await teardownTestDatabase()
    })
  }
  
  if (typeof beforeEach !== 'undefined') {
    beforeEach(async () => {
      await cleanDatabase()
    })
  }
}

// Export the test database instance
export { testDb }