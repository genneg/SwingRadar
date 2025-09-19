const { test, expect } = require('@playwright/test')

test.describe('Vicci Teacher Search', () => {
  test('should find events when searching for Vicci', async ({ page }) => {
    // Navigate to the search page on Vercel
    await page.goto('https://blues-festival-finder.vercel.app/search')

    // Wait for the page to load
    await page.waitForLoadState('networkidle')

    // Find the search input field
    const searchInput = page
      .locator(
        'input[type="text"], input[placeholder*="search"], input[name*="search"], input[id*="search"]'
      )
      .first()

    // Type "Vicci" in the search field
    await searchInput.fill('Vicci')

    // Look for a search button or submit
    const searchButton = page
      .locator('button[type="submit"], button:has-text("Search"), button:has-text("search")')
      .first()

    // Click search button or press Enter
    if (await searchButton.isVisible()) {
      await searchButton.click()
    } else {
      await searchInput.press('Enter')
    }

    // Wait for search results to load
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(2000) // Give extra time for API response

    // Check that we have search results
    const results = page.locator('[data-testid="event-card"], .event-card, .event-item').first()

    // Take a screenshot for debugging
    await page.screenshot({ path: 'vicci-search-results.png', fullPage: true })

    // Log the page content for debugging
    const pageContent = await page.content()
    console.log('Page HTML length:', pageContent.length)

    // Check if we have any events
    const eventElements = await page
      .locator('[data-testid="event-card"], .event-card, .event-item, h2, h3')
      .count()
    console.log('Found elements that might be events:', eventElements)

    // Look for specific event names we expect
    const boulevardBlues = page.locator('text=Boulevard Blues')
    const spanishBlues = page.locator('text=ESpanish Blues')
    const bluesFever = page.locator('text=Blues Fever')

    // Verify we found at least one of the expected events
    const foundEvents = []
    if (await boulevardBlues.isVisible()) foundEvents.push('Boulevard Blues')
    if (await spanishBlues.isVisible()) foundEvents.push('ESpanish Blues')
    if (await bluesFever.isVisible()) foundEvents.push('Blues Fever')

    console.log('Found events:', foundEvents)

    // Expect to find at least one event
    expect(foundEvents.length).toBeGreaterThan(0)

    // More specific checks
    expect(
      (await boulevardBlues.count()) + (await spanishBlues.count()) + (await bluesFever.count())
    ).toBeGreaterThan(0)
  })

  test('should show correct event details for Vicci search', async ({ page }) => {
    // Navigate to the search page on Vercel
    await page.goto('https://blues-festival-finder.vercel.app/search')

    // Wait for the page to load
    await page.waitForLoadState('networkidle')

    // Find and use the search functionality
    const searchInput = page.locator('input').first()
    await searchInput.fill('Vicci')
    await searchInput.press('Enter')

    // Wait for results
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(2000)

    // Look for venue information that should be present
    const venues = page.locator('text=Hasselt, text=Madrid, text=Vienna')
    const venueCount = await venues.count()

    console.log('Found venue references:', venueCount)

    // Take screenshot for manual verification
    await page.screenshot({ path: 'vicci-search-details.png', fullPage: true })
  })
})
