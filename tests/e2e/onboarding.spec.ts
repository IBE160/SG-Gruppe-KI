import { test, expect } from '@playwright/test';

test.describe('Onboarding Flow', () => {
  test('should complete multi-step onboarding and redirect to home', async ({ page }) => {
    // Mock Supabase authentication to simulate a logged-in user
    await page.addInitScript(() => {
      window.localStorage.setItem('sb-test-user-session', JSON.stringify({
        access_token: 'mock-access-token',
        refresh_token: 'mock-refresh-token',
        user: {
          id: 'mock-user-uuid',
          email: 'test@example.com',
          user_metadata: {},
        },
      }));
    });

    // Intercept and mock the user profile fetch
    await page.route('/api/v1/users/me', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          message: "success",
          data: {
            id: 'mock-user-uuid',
            email: 'test@example.com',
            name: null,
            goals: null, // Simulate no onboarding data
            preferences: null,
            equipment: null,
            injuries: null,
            units: null,
          }
        }),
      });
    });

    // Intercept and mock the onboarding submission
    await page.route('**/api/v1/users/onboarding', async route => {
      const requestBody = JSON.parse(route.request().postData() as string);
      expect(requestBody).toHaveProperty('goals');
      expect(requestBody).toHaveProperty('preferences');
      expect(requestBody).toHaveProperty('equipment');
      expect(requestBody).toHaveProperty('injuries');
      expect(requestBody).toHaveProperty('units');

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          message: "success",
          data: {
            id: 'mock-user-uuid',
            email: 'test@example.com',
            ...requestBody // Echo back the data
          }
        }),
      });
    });

    // Go to the home page, which should redirect to onboarding due to mock profile
    await page.goto('/');
    await page.waitForURL('**/onboarding');
    expect(page.url()).toContain('/onboarding');

    // Step 1: Goals
    await expect(page.getByText('What are your primary fitness goals?')).toBeVisible();
    await page.getByPlaceholder('Enter your goals as JSON').fill('{ "strength": true }');
    await page.getByRole('button', { name: 'Next' }).click();

    // Step 2: Preferences
    await expect(page.getByText('Any specific workout preferences?')).toBeVisible();
    await page.getByPlaceholder('Enter your preferences as JSON').fill('{ "time": "evening" }');
    await page.getByRole('button', { name: 'Next' }).click();

    // Step 3: Equipment
    await expect(page.getByText('What equipment do you have available?')).toBeVisible();
    await page.getByLabel('Dumbbells').check();
    await page.getByLabel('Yoga Mat').check();
    await page.getByRole('button', { name: 'Next' }).click();

    // Step 4: Injuries
    await expect(page.getByText('Do you have any injuries or physical limitations?')).toBeVisible();
    await page.getByPlaceholder('Describe any injuries or limitations').fill('Previous knee injury');
    await page.getByRole('button', { name: 'Next' }).click();

    // Step 5: Units
    await expect(page.getByText('What units do you prefer?')).toBeVisible();
    await page.getByLabel('Imperial (lbs, inches)').check();
    await page.getByRole('button', { name: 'Finish Onboarding' }).click();

    // Expect successful submission message and redirect to home
    await page.waitForTimeout(500); // Give some time for alert and redirect
    page.on('dialog', async dialog => {
      expect(dialog.message()).toContain('Onboarding complete! Redirecting to dashboard.');
      await dialog.accept();
    });

    // Verify redirection to home page
    await page.waitForURL('/');
    expect(page.url()).toBe(page.baseURL + '/');
  });
});