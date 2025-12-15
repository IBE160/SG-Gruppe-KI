// tests/e2e/context-window.spec.ts
import { test, expect } from '@playwright/test';

// Use a beforeAll or beforeEach hook to set up the authenticated state
test.beforeEach(async ({ page }) => {
  // Navigate to the root of the application
  await page.goto('/');

  // Click the "Log In" button
  await page.getByRole('button', { name: 'Log In' }).click();

  // Fill in email and password
  await page.getByLabel('Email address').fill('test@example.com');
  await page.getByRole('textbox', { name: 'Password' }).fill('password123'); // Use a valid test password

  // Click the "Log In" button to submit the form
  await page.getByRole('button', { name: 'Log In' }).click();

  // Wait for navigation to the dashboard and for the ContextWindow to be visible
  await expect(page).toHaveURL('/dashboard'); // Assuming dashboard is at root
  await expect(page.getByText('How are you feeling today?')).toBeVisible(); // Check for ContextWindow content
});

test.describe('Context Window E2E Tests', () => {
  test('should allow user to input context and generate a plan', async ({ page }) => {
    // Mock the API call to /api/v1/plans/generate
    await page.route('**/api/v1/plans/generate', async route => {
      const json = {
        message: 'Workout plan generated successfully',
        data: {
          user_id: 'mock-user-id',
          plan_date: new Date().toISOString().split('T')[0],
          workout_days: [{ day_name: 'Monday', exercises: [{ name: 'Mock Squat', sets: 3, reps: '8-10' }] }],
          ai_explanation: 'AI generated a mock plan.',
        },
      };
      // Add a delay to simulate network latency
      await new Promise(resolve => setTimeout(resolve, 500));
      await route.fulfill({ json });
    });

    // Navigate to a page where ContextWindow is rendered. Assuming it's on the dashboard or a dedicated route.
    // For now, we'll assume the component is directly accessible via a test route or integrated into the app.
    // Replace '/your-dashboard-route' with the actual route where ContextWindow will be displayed.
        // Interact with mood selection
    await page.getByText('Motivated').click();
    expect(page.getByLabel('Motivated')).toBeChecked();

    // Interact with energy level selection
    await page.getByText('High').click();
    expect(page.getByLabel('High')).toBeChecked();

    // Fill in soreness input
    await page.getByPlaceholder('Any specific muscle soreness or limitations today?').fill('My shoulders are a bit sore.');

    // Click the generate plan button
    const generateButton = page.getByRole('button', { name: "Generate Today's Plan" });
    await generateButton.click();

    // Expect the button to show loading state
    await expect(page.getByRole('button', { name: "Generating Plan..." })).toBeVisible();
    await expect(page.getByRole('button', { name: "Generating Plan..." })).toBeDisabled();

    // Wait for the API call to complete and verify the success message is logged to the console
    const [msg] = await Promise.all([
      page.waitForEvent('console'),
      generateButton.click(),
    ]);
    expect(msg.text()).toContain('Plan generated successfully:');
  });

  test('should display error message on plan generation failure', async ({ page }) => {
    // Mock the API call to /api/v1/plans/generate to fail
    await page.route('**/api/v1/plans/generate', async route => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ detail: 'Failed to generate plan from AI' }),
      });
    });



    // Select some context
    await page.getByText('Neutral').click();
    expect(page.getByLabel('Neutral')).toBeChecked();
    await page.getByText('Medium').click();
    expect(page.getByLabel('Medium')).toBeChecked();

    // Click the generate plan button
    const generateButton = page.getByText("Generate Today's Plan");
    await generateButton.click();

    // Expect an error message to be displayed
    await expect(page.getByText('Failed to generate plan from AI')).toBeVisible();
    await expect(generateButton).not.toBeDisabled();
    await expect(generateButton).toHaveText("Generate Today's Plan");
  });
});
