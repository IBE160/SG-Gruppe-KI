// tests/e2e/profile-management.spec.ts
import { test, expect } from '@playwright/test';
import { UUID } from 'crypto';

// Helper to set a mock Supabase session in localStorage
async function setMockSupabaseSession(page, userId: UUID, email: string) {
    const sessionData = {
        currentSession: {
            access_token: 'mock-access-token',
            refresh_token: 'mock-refresh-token',
            expires_at: Math.floor(Date.now() / 1000) + 3600,
            token_type: 'Bearer',
            user: {
                id: userId,
                email: email,
                aud: 'authenticated',
                role: 'authenticated',
                app_metadata: { provider: 'email' },
                user_metadata: {},
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            },
        },
        expiresAt: Math.floor(Date.now() / 1000) + 3600,
    };
    await page.evaluate(data => {
        localStorage.setItem('supabase.auth.token', JSON.stringify(data));
    }, sessionData);
}

test.describe('User Profile Management Flow', () => {
    const MOCK_USER_ID = '00000000-0000-0000-0000-000000000001'; // Example UUID
    const MOCK_USER_EMAIL = 'testuser@example.com';

    test.beforeEach(async ({ page, baseURL }) => {
        await page.unrouteAll(); // Clear any previous route mocks
        await page.evaluate(() => localStorage.clear()); // Clear local storage for clean state

        // Set mock Supabase session
        await setMockSupabaseSession(page, MOCK_USER_ID as UUID, MOCK_USER_EMAIL);

        // Mock the API response for GET /users/me
        await page.route('**/api/v1/users/me', async route => {
            const method = route.request().method();
            if (method === 'GET') {
                await route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify({
                        data: {
                            id: MOCK_USER_ID,
                            email: MOCK_USER_EMAIL,
                            unit_preference: 'kg',
                            primary_goal: 'Build Muscle',
                            training_frequency: 3,
                            training_duration: 45,
                            injuries_limitations: 'Lower back pain',
                            equipment: ['Dumbbells', 'Pull-up Bar'],
                        },
                    }),
                });
            } else if (method === 'PUT') {
                // Mock PUT request to return the updated data
                const requestBody = JSON.parse(route.request().postData());
                await route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify({
                        data: {
                            id: MOCK_USER_ID,
                            email: MOCK_USER_EMAIL, // Email is not updatable via PUT, so it remains original
                            unit_preference: requestBody.unit_preference || 'kg',
                            primary_goal: requestBody.primary_goal,
                            training_frequency: requestBody.training_frequency,
                            training_duration: requestBody.training_duration,
                            injuries_limitations: requestBody.injuries_limitations,
                            equipment: requestBody.equipment,
                        },
                    }),
                });
            }
        });

        // Navigate to the settings page, then to the profile page
        await page.goto(`${baseURL}/settings`);
        await page.getByRole('link', { name: /User Profile/i }).click();
        await page.waitForURL(`${baseURL}/settings/profile`);
        await expect(page).toHaveURL(`${baseURL}/settings/profile`);
    });

    test('should display user profile data correctly', async ({ page }) => {
        await expect(page.getByText('testuser@example.com')).toBeVisible();
        await expect(page.getByText('kg')).toBeVisible();
        await expect(page.getByText('Build Muscle')).toBeVisible();
        await expect(page.getByText('3 days/week')).toBeVisible();
        await expect(page.getByText('45 min/session')).toBeVisible();
        await expect(page.getByText('Lower back pain')).toBeVisible();
        await expect(page.getByText('Dumbbells, Pull-up Bar')).toBeVisible();
    });

    test('should allow editing and saving profile information', async ({ page }) => {
        // Click Edit Profile button
        await page.getByRole('button', { name: /Edit Profile/i }).click();

        // Change unit preference
        await page.getByLabelText(/Unit Preference/i).selectOption('lbs');
        // Change primary goal
        await page.getByLabelText(/Primary Goal/i).fill('Lose Weight');
        // Change training frequency
        await page.getByLabelText(/Training Frequency/i).fill('5');
        // Change equipment
        await page.getByLabelText(/Equipment/i).fill('Resistance Bands, Yoga Mat');

        // Click Save Changes
        await page.getByRole('button', { name: /Save Changes/i }).click();

        // Expect to be back in view mode and see updated data
        await expect(page.getByText('Profile updated successfully!')).toBeVisible();
        await expect(page.getByText('lbs')).toBeVisible();
        await expect(page.getByText('Lose Weight')).toBeVisible();
        await expect(page.getByText('5 days/week')).toBeVisible();
        await expect(page.getByText('Resistance Bands, Yoga Mat')).toBeVisible();

        // Verify old data is not visible
        await expect(page.queryByText('kg')).not.toBeVisible();
        await expect(page.queryByText('Build Muscle')).not.toBeVisible();
    });

    test('should allow cancelling edits without saving', async ({ page }) => {
        // Click Edit Profile button
        await page.getByRole('button', { name: /Edit Profile/i }).click();

        // Change some fields
        await page.getByLabelText(/Unit Preference/i).selectOption('lbs');
        await page.getByLabelText(/Primary Goal/i).fill('Gain Weight');

        // Click Cancel
        await page.getByRole('button', { name: /Cancel/i }).click();

        // Expect to be back in view mode and see original data
        await expect(page.getByText('kg')).toBeVisible();
        await expect(page.getByText('Build Muscle')).toBeVisible();

        // Verify changed data is not visible
        await expect(page.queryByText('lbs')).not.toBeVisible();
        await expect(page.queryByText('Gain Weight')).not.toBeVisible();
    });

    test('should show validation errors on invalid input', async ({ page }) => {
      // Click Edit Profile button
      await page.getByRole('button', { name: /Edit Profile/i }).click();

      // Enter invalid training frequency
      await page.getByLabelText(/Training Frequency/i).fill('0'); // < 1
      await page.getByLabelText(/Training Duration/i).fill('5'); // < 10

      // Click Save Changes
      await page.getByRole('button', { name: /Save Changes/i }).click();

      // Expect validation error messages to be visible
      await expect(page.getByText(/frequency must be between 1 and 7/i)).toBeVisible();
      await expect(page.getByText(/duration must be between 10 and 240 minutes/i)).toBeVisible();

      // Check for generic save error
      await expect(page.getByText(/please correct the errors in the form/i)).toBeVisible();
    });
});
