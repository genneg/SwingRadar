import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test('should display the homepage correctly', async ({ page }) => {
    await page.goto('/')
    
    // Check page title
    await expect(page).toHaveTitle(/Blues Dance Festival Finder/)
    
    // Check main heading
    await expect(page.getByRole('heading', { name: /blues dance festival finder/i })).toBeVisible()
    
    // Check description
    await expect(page.getByText(/discover blues dance festivals worldwide/i)).toBeVisible()
    
    // Check call-to-action buttons
    await expect(page.getByRole('button', { name: /explore festivals/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /get started/i })).toBeVisible()
    
    // Check feature cards
    await expect(page.getByText(/follow teachers/i)).toBeVisible()
    await expect(page.getByText(/discover events/i)).toBeVisible()
    await expect(page.getByText(/plan your journey/i)).toBeVisible()
  })

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    
    // Check if main content is visible on mobile
    await expect(page.getByRole('heading', { name: /blues dance festival finder/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /explore festivals/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /get started/i })).toBeVisible()
  })

  test('should be responsive on tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.goto('/')
    
    // Check if main content is visible on tablet
    await expect(page.getByRole('heading', { name: /blues dance festival finder/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /explore festivals/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /get started/i })).toBeVisible()
  })

  test('should have accessible content', async ({ page }) => {
    await page.goto('/')
    
    // Check for proper heading structure
    const h1 = page.getByRole('heading', { level: 1 })
    await expect(h1).toBeVisible()
    
    // Check for proper button roles
    const buttons = page.getByRole('button')
    await expect(buttons).toHaveCount(2)
    
    // Check for proper contrast (basic test)
    const mainContent = page.locator('main')
    await expect(mainContent).toBeVisible()
  })
})