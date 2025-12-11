import { test, expect } from '@playwright/test';

test.describe('Profile Management Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Mock the API response for fetching user profile
    await page.route('**/api/v1/me', async route => {
      const mockUserProfile = {
        user_id: 'user-123',
        email: 'test@example.com',
        unit_preference: 'kg',
        primary_goal: 'Build Muscle',
        training_frequency: 4,
        training_duration: 60,
        injuries_limitations: 'Mild knee pain on heavy squats',
        equipment: ['Dumbbells', 'Barbell', 'Bench'],
      };
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockUserProfile),
      });
    });

    // Navigate to the profile settings page (assuming /settings is the entry point for settings)
    await page.goto('/settings/profile');

    // Mock authentication: bypass login and set a mock session after navigation
    await page.evaluate(() => {
      localStorage.setItem('auth-store', JSON.stringify({
        state: {
          session: { access_token: 'mock_jwt_token' },
          user: { id: 'user-123', email: 'test@example.com' }
        },
        version: 0
      }));
    });
    // Reload the page after setting localStorage to ensure the store picks up the mock session
    await page.reload();
  });

  test('should allow user to view and edit profile information', async ({ page }) => {
    // Expect to be on the profile view page
    await expect(page.getByText('Your Profile')).toBeVisible();
    await expect(page.getByText('test@example.com')).toBeVisible();
    await expect(page.getByText('kg')).toBeVisible();
    await expect(page.getByText('Build Muscle')).toBeVisible();

    // Click Edit button
    await page.getByRole('button', { name: 'Edit' }).click();

    // Expect to be on the edit profile page
    await expect(page.getByText('Edit Profile')).toBeVisible();

    // Change some fields
    await page.selectOption('select[name="unit_preference"]', 'lbs');
    await page.fill('input[name="primary_goal"]', 'Lose Weight');
    await page.fill('textarea[name="injuries_limitations"]', 'None');
    await page.fill('textarea[name="equipment"]', 'Dumbbells, Treadmill');

    // Mock the API response for updating user profile
    await page.route('**/api/v1/me', async route => {
      const requestBody = route.request().postDataJSON();
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          message: 'User test_user_id_123 profile updated successfully',
          updated_data: {
            user_id: 'user-123',
            email: 'test@example.com',
            unit_preference: requestBody.unit_preference,
            primary_goal: requestBody.primary_goal,
            injuries_limitations: requestBody.injuries_limitations,
            equipment: requestBody.equipment,
          },
        }),
      });
    });

    // Click Save Changes
    await page.getByRole('button', { name: 'Save Changes' }).click();

    // Expect success alert
    await expect(page.getByText('Profile updated successfully!')).toBeVisible();

    // Expect to return to view profile state and see updated data
    await expect(page.getByText('Your Profile')).toBeVisible();
    await expect(page.getByText('lbs')).toBeVisible();
    await expect(page.getByText('Lose Weight')).toBeVisible();
    await expect(page.getByText('None')).toBeVisible();
    await expect(page.getByText('Dumbbells')).toBeVisible();
    await expect(page.getByText('Treadmill')).toBeVisible();
  });

  test('should display validation errors on invalid input during edit', async ({ page }) => {
    // Click Edit button
    await page.getByRole('button', { name: 'Edit' }).click();

    // Clear required primary goal
    await page.fill('input[name="primary_goal"]', '');

    // Set invalid training frequency
    await page.fill('input[name="training_frequency"]', '0');

    // Click Save Changes
    await page.getByRole('button', { name: 'Save Changes' }).click();

    // Expect validation errors to be visible
    await expect(page.getByText('Primary goal is required.')).toBeVisible();
    await expect(page.getByText('Training frequency must be a positive number.')).toBeVisible();
  });

  test('should allow user to cancel editing', async ({ page }) => {
    // Click Edit button
    await page.getByRole('button', { name: 'Edit' }).click();

    // Change a field (should not be saved)
    await page.fill('input[name="primary_goal"]', 'Temporary Goal');

    // Click the back button (cancel editing)
    await page.getByTestId('chevron-left').click();

    // Expect to return to view profile state
    await expect(page.getByText('Your Profile')).toBeVisible();
    // Expect original data to be displayed
    await expect(page.getByText('Build Muscle')).toBeVisible();
    await expect(page.getByText('Temporary Goal')).not.toBeVisible();
  });
});