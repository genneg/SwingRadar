import { test, expect } from '@playwright/test'

test.describe('Basic Application Tests', () => {
  test('should load the homepage', async ({ page }) => {
    await page.goto('/')
    
    // Check if the page loads
    await expect(page).toHaveTitle(/Blues Dance Festival Finder/)
    
    // Check if main content is present
    await expect(page.getByRole('heading', { name: /blues dance festival finder/i })).toBeVisible()
    await expect(page.getByText(/discover blues dance festivals worldwide/i)).toBeVisible()
  })

  test('should have working navigation', async ({ page }) => {
    await page.goto('/')
    
    // Check if we can navigate to different pages
    await page.goto('/auth/signin')
    await expect(page.getByText('Sign In')).toBeVisible()
    
    await page.goto('/auth/signup')
    await expect(page.getByText('Create Account')).toBeVisible()
    
    await page.goto('/dashboard')
    // Dashboard might require authentication, so we just check if it doesn't crash
    await expect(page.locator('body')).toBeVisible()
  })

  test('should be responsive', async ({ page }) => {
    await page.goto('/')
    
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await expect(page.getByRole('heading', { name: /blues dance festival finder/i })).toBeVisible()
    
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 })
    await expect(page.getByRole('heading', { name: /blues dance festival finder/i })).toBeVisible()
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 })
    await expect(page.getByRole('heading', { name: /blues dance festival finder/i })).toBeVisible()
  })

  test('should have accessible content structure', async ({ page }) => {
    await page.goto('/')
    
    // Check for proper heading structure
    const h1 = page.getByRole('heading', { level: 1 })
    await expect(h1).toBeVisible()
    
    // Check for proper button roles
    const buttons = page.getByRole('button')
    await expect(buttons.first()).toBeVisible()
    
    // Check for proper main content
    await expect(page.locator('main')).toBeVisible()
  })
})