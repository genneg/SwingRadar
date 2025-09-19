import { FullConfig } from '@playwright/test'

async function globalTeardown(config: FullConfig) {
  // Perform global cleanup here, such as:
  // - Cleaning up test database
  // - Removing test files
  // - Clearing cache
  
  console.log('🎭 Global teardown complete')
}

export default globalTeardown