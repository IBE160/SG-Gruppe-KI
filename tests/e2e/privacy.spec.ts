
import { test, expect } from '@playwright/test';

test.describe('Privacy and Account Management E2E Tests', () => {

  // Before each test, assume user is logged in and navigate to Privacy & Account settings
  test.beforeEach(async ({ page }) => {
    // TODO: Implement actual login flow or mock authentication state
    // For now, we'll directly navigate assuming authentication is handled externally
    // In a real scenario, you'd likely log in here or set local storage for auth token.
    await page.goto('/settings/privacy'); // Assuming this route exists and is protected
  });

  test('should navigate to export data page and show confirmation on request', async ({ page }) => {
    await page.getByRole('link', { name: 'Export My Data' }).click();
    await expect(page).toHaveURL('/settings/privacy/export-data');
    await expect(page.getByRole('heading', { name: 'Export Your Data' })).toBeVisible();

    // Mock API response for exportData
    await page.route('**/api/v1/users/me/export', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: { message: 'Export initiated' } }),
      });
    });

    await page.getByRole('button', { name: 'Request Data Export' }).click();
    await expect(page.getByRole('heading', { name: 'Export Request Received!' })).toBeVisible();
    await expect(page.getByText('Your data export is now being compiled.')).toBeVisible();

    // Test navigation from confirmation screen
    await page.getByRole('button', { name: 'Go to Settings' }).click();
    await expect(page).toHaveURL('/settings/privacy');
    await page.goto('/settings/privacy/export-data'); // Go back to re-test dashboard button
    await page.getByRole('button', { name: 'Request Data Export' }).click();
    await expect(page.getByRole('heading', { name: 'Export Request Received!' })).toBeVisible();
    await page.getByRole('button', { name: 'Go to Dashboard' }).click();
    await expect(page).toHaveURL('/dashboard');
  });

  test('should navigate through account deletion flow and return to login', async ({ page }) => {
    await page.getByRole('link', { name: 'Delete My Account' }).click();
    await expect(page).toHaveURL('/settings/privacy/delete-account');
    await expect(page.getByRole('heading', { name: 'Permanently Delete Your Account?' })).toBeVisible();

    await page.getByRole('button', { name: 'Continue to Delete' }).click();
    await expect(page.getByRole('heading', { name: 'Confirm Account Deletion' })).toBeVisible();

    // Mock API response for deleteAccount
    await page.route('**/api/v1/users/me', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: { message: 'Account deletion initiated' } }),
      });
    });

    // Mock signOut from Supabase
    await page.route('**/auth/v1/logout', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: {} }), // Supabase signOut usually returns null data on success
      });
    });

    await page.getByPlaceholder('DELETE').fill('DELETE');
    await page.getByPlaceholder('Re-enter your password for security').fill('testpassword123');
    await page.getByRole('button', { name: 'Permanently Delete My Account' }).click();

    await expect(page.getByRole('heading', { name: 'Deletion Process Has Begun' })).toBeVisible();
    await page.getByRole('button', { name: 'Okay, Log Me Out' }).click();

    await expect(page.getByRole('heading', { name: 'Deletion Initiated' })).toBeVisible(); // Final confirmation screen
    await page.getByRole('button', { name: 'Return to Login' }).click();
    await expect(page).toHaveURL('/login');
  });

  test('should log out the user and redirect to login page', async ({ page }) => {
    // Mock signOut from Supabase
    await page.route('**/auth/v1/logout', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: {} }), // Supabase signOut usually returns null data on success
      });
    });

    await page.getByRole('button', { name: 'Logout' }).click();
    await expect(page).toHaveURL('/login');
  });

});
