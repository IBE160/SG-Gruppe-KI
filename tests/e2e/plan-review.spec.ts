// tests/e2e/plan-review.spec.ts
import { test, expect } from '@playwright/test';

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

test.describe('Plan Review E2E Tests', () => {
  test('should display generated plan and allow confirmation', async ({ page }) => {
    // Mock successful plan generation and display the PlanReview component
    await page.route('**/api/v1/plans/generate', async route => {
      const json = {
        message: 'Workout plan generated successfully',
        data: {
          id: 'mock-plan-id-123',
          user_id: 'mock-user-id',
          plan_date: new Date().toISOString().split('T')[0],
          workout_days: [{ day_name: 'Monday', exercises: [{ name: 'Mock Squat', sets: 3, reps: '8-10' }] }],
          ai_explanation: 'AI generated this mock plan for you.',
        },
      };
      await route.fulfill({ json });
    });

    // Mock plan confirmation API
    await page.route('**/api/v1/plans/mock-plan-id-123/confirm', async route => {
      const json = {
        message: 'Plan confirmed successfully',
        data: { /* confirmed plan details */ }
      };
      await route.fulfill({ json });
    });

    // Simulate clicking the "Generate Today's Plan" button
    await page.getByText('Motivated').click();
    await page.getByText('High').click();
    await page.getByText("Generate Today's Plan").click();

    // Wait for the plan review UI to appear
    await expect(page.getByText('Review Your Plan')).toBeVisible();
    await expect(page.getByText('Mock Squat')).toBeVisible();
    await expect(page.getByText('AI generated this mock plan for you.')).toBeVisible();

    // Click "Confirm Plan"
    await page.getByRole('button', { name: 'Confirm Plan' }).click();

    // Expect the confirmation screen/message to appear
    await expect(page.getByText('Plan Confirmed!')).toBeVisible(); // This element is not yet implemented
  });

  test('should allow editing plan (placeholder) and redirection', async ({ page }) => {
    // Mock plan generation
    await page.route('**/api/v1/plans/generate', async route => {
      const json = {
        message: 'Workout plan generated successfully',
        data: {
          id: 'mock-plan-id-456',
          user_id: 'mock-user-id',
          plan_date: new Date().toISOString().split('T')[0],
          workout_days: [{ day_name: 'Tuesday', exercises: [{ name: 'Deadlift', sets: 3, reps: '5' }] }],
          ai_explanation: 'Another AI plan.',
        },
      };
      await route.fulfill({ json });
    });

    // Simulate clicking the "Generate Today's Plan" button
    await page.getByText('Neutral').click();
    await page.getByText('Medium').click();
    await page.getByText("Generate Today's Plan").click();

    // Wait for the plan review UI to appear
    await expect(page.getByText('Review Your Plan')).toBeVisible();

    // Click "Edit Plan"
    await page.getByRole('button', { name: 'Edit Plan' }).click();

    // Expect some indication of editing mode or redirection to edit screen
    // For this story, actual editing UI is not implemented, so we assert for a navigation change or placeholder.
    // Replace with actual expected behavior.
    await expect(page.getByText('Editing Plan Mode')).toBeVisible(); // Placeholder
  });
});