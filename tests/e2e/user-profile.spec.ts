// tests/e2e/user-profile.spec.ts

import { test, expect } from '@playwright/test';

// Mock supabase.auth.getSession globally for the test file by setting local storage
test.beforeEach(async ({ page }) => {
  // Navigate first to establish an origin
  await page.goto('/profile'); // Ensure the page is loaded to an origin

  await page.evaluate(() => {
    // This function runs in the browser context
    window.localStorage.setItem('sb-test-user-id-auth-token', JSON.stringify({
      currentSession: {
        access_token: 'mock-access-token',
        refresh_token: 'mock-refresh-token',
        expires_in: 3600,
        token_type: 'Bearer',
        user: {
          id: 'user123',
          aud: 'authenticated',
          role: 'authenticated',
          email: 'test@example.com',
          user_metadata: {},
          app_metadata: {},
        },
      },
      expiresAt: Date.now() / 1000 + 3600,
    }));
  });

  // Mock getUserProfile
  await page.route('**/api/v1/users/me', async route => {
    const json = {
      message: 'success',
      data: {
        id: 'user123',
        email: 'test@example.com',
        name: 'Initial User',
        goals: { fitness: 'initial_goal' },
        preferences: { notifications: false },
        equipment: ['initial_equipment'],
        injuries: 'none',
        units: 'metric',
      },
    };
    await route.fulfill({ json });
  });

  // Mock updateUserProfile
  await page.route('**/api/v1/users/me', async route => {
    const request = route.request();
    if (request.method() === 'PUT') {
      const postData = JSON.parse(request.postData() || '{}');
      const json = {
        message: 'success',
        data: {
          id: 'user123',
          email: 'test@example.com', // Email should not change
          name: postData.name || 'Initial User',
          goals: postData.goals || { fitness: 'initial_goal' },
          preferences: postData.preferences || { notifications: false },
          equipment: postData.equipment || ['initial_equipment'],
          injuries: postData.injuries || 'none',
          units: postData.units || 'metric',
        },
      };
      await route.fulfill({ json });
    } else {
      route.continue();
    }
  });
});

test('should navigate to profile page, edit details, and save changes successfully', async ({ page }) => {
  await page.goto('/profile'); // Directly navigate to the profile page

  await page.getByLabel('Goals').fill(JSON.stringify(updatedGoals, null, 2));
  await page.getByLabel('Equipment (comma-separated)').fill(updatedEquipment.join(', '));
  await page.getByLabel('Injuries').fill(updatedInjuries);
  await page.getByLabel('Units').fill(updatedUnits);

  // Click the "Save Changes" button
  await page.getByRole('button', { name: /save changes/i }).click();

  // Expect the updated details to be displayed on the profile page
  await expect(page.getByRole('heading', { name: /user profile/i })).toBeVisible();
  await expect(page.getByText(updatedName)).toBeVisible();
  // Expect the goals to be displayed as a formatted JSON string
  await expect(page.locator('pre').filter({ hasText: JSON.stringify({ fitness: 'initial_goal' }, null, 2) })).toBeVisible();
  await expect(page.getByText(updatedEquipment.join(', '))).toBeVisible();
  await expect(page.getByText(updatedInjuries)).toBeVisible();
  await expect(page.getByText(updatedUnits)).toBeVisible();

  // Verify that the page is no longer in editing mode
  await expect(page.getByRole('button', { name: /edit profile/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /save changes/i })).not.toBeVisible();
});

