import { test, expect } from '@playwright/test';

test('Next.js frontend loads successfully', async ({ page }) => {
  // Assuming Next.js app is running on http://localhost:3000
  await page.goto('http://localhost:3000');
  // You might need to adjust the text to something specific on your default Next.js page
  await expect(page.locator('html')).toContainText('Welcome'); 
});

test('FastAPI backend health check returns ok', async ({ request }) => {
  // Assuming FastAPI backend is running on http://localhost:8000
  const response = await request.get('http://localhost:8000/health');
  expect(response.ok()).toBeTruthy();
  expect(await response.json()).toEqual({ status: 'ok' });
});
