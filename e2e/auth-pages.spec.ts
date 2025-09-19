import { test, expect } from '@playwright/test'

test.describe('Authentication Pages', () => {
  test.describe('Sign In Page', () => {
    test('should display sign in form', async ({ page }) => {
      await page.goto('/auth/signin')
      
      // Check if sign in form is displayed
      await expect(page.getByText('Sign In')).toBeVisible()
      await expect(page.getByLabel(/email/i)).toBeVisible()
      await expect(page.getByLabel(/password/i)).toBeVisible()
      await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible()
    })

    test('should show validation errors for empty form', async ({ page }) => {
      await page.goto('/auth/signin')
      
      // Try to submit empty form
      await page.getByRole('button', { name: /sign in/i }).click()
      
      // Check for validation errors
      await expect(page.getByText(/email is required/i)).toBeVisible()
      await expect(page.getByText(/password is required/i)).toBeVisible()
    })

    test('should show error for invalid email format', async ({ page }) => {
      await page.goto('/auth/signin')
      
      // Fill invalid email
      await page.getByLabel(/email/i).fill('invalid-email')
      await page.getByRole('button', { name: /sign in/i }).click()
      
      // Check for email validation error
      await expect(page.getByText(/please enter a valid email/i)).toBeVisible()
    })

    test('should have link to sign up page', async ({ page }) => {
      await page.goto('/auth/signin')
      
      // Check for link to sign up
      const signupLink = page.getByRole('link', { name: /create account/i })
      await expect(signupLink).toBeVisible()
      
      // Click and verify navigation
      await signupLink.click()
      await expect(page).toHaveURL(/auth\/signup/)
    })
  })

  test.describe('Sign Up Page', () => {
    test('should display sign up form', async ({ page }) => {
      await page.goto('/auth/signup')
      
      // Check if sign up form is displayed
      await expect(page.getByText('Create Account')).toBeVisible()
      await expect(page.getByLabel(/name/i)).toBeVisible()
      await expect(page.getByLabel(/email/i)).toBeVisible()
      await expect(page.getByLabel(/password/i)).toBeVisible()
      await expect(page.getByRole('button', { name: /create account/i })).toBeVisible()
    })

    test('should show validation errors for empty form', async ({ page }) => {
      await page.goto('/auth/signup')
      
      // Try to submit empty form
      await page.getByRole('button', { name: /create account/i }).click()
      
      // Check for validation errors
      await expect(page.getByText(/name is required/i)).toBeVisible()
      await expect(page.getByText(/email is required/i)).toBeVisible()
      await expect(page.getByText(/password is required/i)).toBeVisible()
    })

    test('should have link to sign in page', async ({ page }) => {
      await page.goto('/auth/signup')
      
      // Check for link to sign in
      const signinLink = page.getByRole('link', { name: /sign in/i })
      await expect(signinLink).toBeVisible()
      
      // Click and verify navigation
      await signinLink.click()
      await expect(page).toHaveURL(/auth\/signin/)
    })
  })

  test.describe('Navigation between auth pages', () => {
    test('should navigate between signin and signup pages', async ({ page }) => {
      // Start at sign in
      await page.goto('/auth/signin')
      await expect(page.getByText('Sign In')).toBeVisible()
      
      // Go to sign up
      await page.getByRole('link', { name: /create account/i }).click()
      await expect(page).toHaveURL(/auth\/signup/)
      await expect(page.getByText('Create Account')).toBeVisible()
      
      // Go back to sign in
      await page.getByRole('link', { name: /sign in/i }).click()
      await expect(page).toHaveURL(/auth\/signin/)
      await expect(page.getByText('Sign In')).toBeVisible()
    })
  })

  test.describe('Social Login', () => {
    test('should display social login buttons', async ({ page }) => {
      await page.goto('/auth/signin')
      
      // Check for social login buttons
      await expect(page.getByRole('button', { name: /continue with google/i })).toBeVisible()
      await expect(page.getByRole('button', { name: /continue with facebook/i })).toBeVisible()
    })

    test('should display social login on signup page too', async ({ page }) => {
      await page.goto('/auth/signup')
      
      // Check for social login buttons
      await expect(page.getByRole('button', { name: /continue with google/i })).toBeVisible()
      await expect(page.getByRole('button', { name: /continue with facebook/i })).toBeVisible()
    })
  })
})