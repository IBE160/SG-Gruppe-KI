import { test, expect } from '@playwright/test';

test.describe('Smoke Tests', () => {
  test('should load Next.js frontend', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await expect(page).toHaveTitle(/Create Next App/);
  });

  test('should get successful health check from FastAPI backend', async ({ request }) => {
    const response = await request.get('http://localhost:8000/health');
    expect(response.ok()).toBeTruthy();
    const json = await response.json();
    expect(json).toEqual({ status: 'ok' });
  });
});
