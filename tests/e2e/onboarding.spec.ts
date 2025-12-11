// tests/e2e/onboarding.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Onboarding Flow E2E', () => {
  test('should complete the onboarding flow and redirect to dashboard', async ({ page }) => {
    // 1. Navigate to the onboarding flow
    await page.goto('/onboarding');

    // Mock the backend API call for onboarding submission
    await page.route('**/api/v1/onboarding', async route => {
      const json = { message: 'Onboarding data received successfully' };
      await route.fulfill({ json, status: 201 });
    });

    // --- Step 1: Goal Selection ---
    await expect(page.getByText("What's your main fitness goal?")).toBeVisible();
    await page.getByText('Build Muscle').click();
    await page.getByRole('button', { name: /arrow_forward/i }).click();

    // --- Step 2: Time & Frequency ---
    await expect(page.getByText('How many days a week do you want to train?')).toBeVisible(); // This text may vary
    await page.getByLabel('Days per week').fill('4');
    await page.getByLabel('Minutes per session').fill('60');
    await page.getByRole('button', { name: /arrow_forward/i }).click();

    // --- Step 3: Equipment Selection ---
    await expect(page.getByText('What equipment do you have access to?')).toBeVisible();
    await page.getByText('Basic (Dumbbells, Bands)').click();
    await page.getByText('Specify...').click();
    await page.getByPlaceholder('Enter your custom equipment').fill('Kettlebells');
    await page.getByRole('button', { name: /arrow_forward/i }).click();

    // --- Step 4: Injuries & Limitations ---
    await expect(page.getByText('do you have any injuries or limitations I should be aware of?')).toBeVisible();
    await page.getByText('Knees').click();
    await page.getByPlaceholder('Specific details or other limitations...').fill('Previous ACL injury on right knee');
    await page.getByRole('button', { name: /arrow_forward/i }).click();

    // --- Step 5: Unit Selection ---
    await expect(page.getByText('Do you prefer to work with kilograms or pounds?')).toBeVisible();
    await page.getByLabel('kg').click();
    await page.getByRole('button', { name: /arrow_forward/i }).click();

    // --- Step 6: Confirmation and Submission ---
    await expect(page.getByText('Perfect! I have everything I need to create your first workout plan.')).toBeVisible();
    await page.getByRole('button', { name: "Let's Go!" }).click();

    // Verify redirection to dashboard
    await expect(page).toHaveURL('/dashboard'); // Assuming dashboard is the redirect target
  });
});
