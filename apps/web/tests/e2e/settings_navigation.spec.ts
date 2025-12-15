// apps/web/tests/e2e/settings_navigation.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Settings Menu Navigation', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the settings page
    await page.goto('/settings');
  });

  test('AC4.1.4: should navigate to the general settings page when General is clicked', async ({ page }) => {
    await page.getByText('General').click();
    await expect(page).toHaveURL('/settings/general');
  });

  test('AC4.1.3: should filter settings and navigate to the filtered result', async ({ page }) => {
    // Search for "Appearance"
    await page.getByPlaceholderText('Search Settings...').fill('appearance');

    // Verify that "General" is not visible
    await expect(page.getByText('General')).not.toBeVisible();

    // Click on "Appearance"
    await page.getByText('Appearance').click();

    // Verify navigation
    await expect(page).toHaveURL('/settings/appearance');
  });
});
