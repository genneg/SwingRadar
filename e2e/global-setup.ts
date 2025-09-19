import { chromium, FullConfig } from '@playwright/test'

async function globalSetup(config: FullConfig) {
  // Start the browser and create a context
  const browser = await chromium.launch()
  const context = await browser.newContext()
  const page = await context.newPage()

  // You can perform global setup here, such as:
  // - Setting up test database
  // - Creating test users
  // - Clearing cache
  
  console.log('🎭 Global setup complete')

  await context.close()
  await browser.close()
}

export default globalSetup