import { test, expect } from '@playwright/test';

test.describe('Basic Application Checks', () => {
  test('Next.js frontend loads correctly', async ({ page }) => {
    await page.goto('/');
    // Assuming your Next.js app has a welcome message with an h1 tag containing "Welcome"
    await expect(page.locator('h1')).toContainText('Welcome');
  });

  test('FastAPI health check endpoint returns status ok', async ({ request }) => {
    const response = await request.get('http://localhost:8000/health');
    expect(response.ok()).toBeTruthy();
    expect(await response.json()).toEqual({ status: 'ok' });
  });
});
