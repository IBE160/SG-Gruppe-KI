import { test, expect } from '@playwright/test';

test.describe('Google OAuth Flow', () => {
  test('should redirect to Google when "Continue with Google" button is clicked', async ({ page }) => {
    // Navigate to the login page
    await page.goto('/login');

    // Expect to find the "Continue with Google" button
    const googleButton = page.getByRole('button', { name: 'Continue with Google' });
    await expect(googleButton).toBeVisible();

    // Click the button
    await googleButton.click();

    // Playwright will automatically follow redirects.
    // We expect the page to eventually navigate to Google's OAuth consent screen.
    // We can check the URL to see if it's a Google domain.
    // Note: A full E2E test would involve mocking Google's response or handling a real Google login,
    // which is out of scope for a simple check. This test verifies the initial redirect.

    await page.waitForURL(/^https:\/\/accounts\.google\.com\/.*/, { timeout: 10000 });

    expect(page.url()).toMatch(/^https:\/\/accounts\.google\.com\/.*/);
    console.log(`Redirected to Google OAuth URL: ${page.url()}`);
  });

  // A more comprehensive E2E test would involve:
  // 1. Mocking Google's authentication response to simulate a successful login.
  // 2. Verifying that the application correctly handles the callback and logs the user in.
  // This typically requires advanced Playwright features like route mocking and potentially
  // a test environment that allows bypassing Google's actual login flow.
});
