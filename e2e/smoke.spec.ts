import { test, expect } from '@playwright/test'

test.describe('Smoke Tests', () => {
  test('application should be reachable', async ({ page }) => {
    await page.goto('/')
    
    // Just check that the page loads without throwing errors
    await expect(page.locator('body')).toBeVisible()
    
    // Check for a basic element that should always be present
    await expect(page.locator('main')).toBeVisible()
  })

  test('should have correct page title', async ({ page }) => {
    await page.goto('/')
    
    // Check page title
    await expect(page).toHaveTitle(/Blues Dance Festival Finder/)
  })

  test('should load without JavaScript errors', async ({ page }) => {
    const errors: string[] = []
    
    page.on('pageerror', (error) => {
      errors.push(error.message)
    })
    
    await page.goto('/')
    
    // Allow page to fully load
    await page.waitForLoadState('networkidle')
    
    // Check that no JavaScript errors occurred
    expect(errors).toHaveLength(0)
  })

  test('should have basic accessibility structure', async ({ page }) => {
    await page.goto('/')
    
    // Check for landmark elements
    await expect(page.locator('main')).toBeVisible()
    
    // Check for heading structure
    const h1 = page.locator('h1')
    await expect(h1).toBeVisible()
    
    // Check that heading has actual text
    const headingText = await h1.textContent()
    expect(headingText).toBeTruthy()
    expect(headingText!.length).toBeGreaterThan(0)
  })
})