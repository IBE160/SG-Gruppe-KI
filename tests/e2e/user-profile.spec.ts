import { test, expect } from '@playwright/test';

// Mock the API responses for the profile page
test.beforeEach(async ({ page }) => {
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
  await page.goto('/'); // Navigate to the base URL (where the profile link is)

  // Click the "Go to Profile" link
  await page.getByRole('link', { name: /go to profile/i }).click();

  // Expect the profile page to load and display initial data
  await expect(page.getByRole('heading', { name: /user profile/i })).toBeVisible();
  await expect(page.getByText('Initial User')).toBeVisible();
  await expect(page.getByText('test@example.com')).toBeVisible();
  await expect(page.locator('pre').filter({ hasText: 'initial_goal' })).toBeVisible();
  await expect(page.getByText('initial_equipment')).toBeVisible();

  // Click the "Edit Profile" button
  await page.getByRole('button', { name: /edit profile/i }).click();

  // Fill in updated details
  const updatedName = 'Updated User Name';
  const updatedGoals = { fitness: 'endurance', type: 'marathon' };
  const updatedEquipment = ['new_equipment1', 'new_equipment2'];
  const updatedInjuries = 'knee ache';
  const updatedUnits = 'imperial';

  await page.getByLabel('Name').fill(updatedName);
  await page.getByLabel('Goals (JSON)').fill(JSON.stringify(updatedGoals, null, 2));
  await page.getByLabel('Equipment (comma-separated)').fill(updatedEquipment.join(', '));
  await page.getByLabel('Injuries').fill(updatedInjuries);
  await page.getByLabel('Units').fill(updatedUnits);

  // Click the "Save Changes" button
  await page.getByRole('button', { name: /save changes/i }).click();

  // Expect the updated details to be displayed on the profile page
  await expect(page.getByRole('heading', { name: /user profile/i })).toBeVisible();
  await expect(page.getByText(updatedName)).toBeVisible();
  await expect(page.locator('pre').filter({ hasText: JSON.stringify(updatedGoals) })).toBeVisible();
  await expect(page.getByText(updatedEquipment.join(', '))).toBeVisible();
  await expect(page.getByText(updatedInjuries)).toBeVisible();
  await expect(page.getByText(updatedUnits)).toBeVisible();

  // Verify that the page is no longer in editing mode
  await expect(page.getByRole('button', { name: /edit profile/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /save changes/i })).not.toBeVisible();
});
