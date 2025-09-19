const { chromium } = require('@playwright/test');

(async () => {
  console.log('Launching browser...');
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    console.log('Navigating to homepage...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

    console.log('Taking screenshot...');
    await page.screenshot({ path: 'homepage-test.png', fullPage: true });

    const title = await page.title();
    console.log('Page Title:', title);

    const url = page.url();
    console.log('Current URL:', url);

    const bodyText = await page.textContent('body');
    console.log('Body text length:', bodyText.length);
    console.log('First 200 chars:', bodyText.substring(0, 200));

    console.log('✅ Homepage test completed successfully!');
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
})();