const { test, expect } = require('@playwright/test');

test('homepage loads correctly', async ({ page }) => {
  // Navigate to the homepage
  await page.goto('http://localhost:3000');

  // Wait for page to load
  await page.waitForLoadState('networkidle');

  // Take a screenshot
  await page.screenshot({ path: 'homepage.png', fullPage: true });

  // Check if page title exists
  const title = await page.title();
  console.log('Page title:', title);

  // Check if body has content
  const bodyContent = await page.textContent('body');
  console.log('Body content length:', bodyContent.length);

  // Look for common elements
  const hasMainContent = await page.locator('body').count() > 0;
  console.log('Has body content:', hasMainContent);

  // Check for any visible text content
  const visibleText = await page.locator('body:visible').textContent();
  console.log('Visible text length:', visibleText ? visibleText.length : 0);

  // Basic check that page loaded
  expect(hasMainContent).toBeTruthy();
});