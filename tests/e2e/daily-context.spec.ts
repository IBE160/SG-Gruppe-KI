// tests/e2e/daily-context.spec.ts
import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

test.describe('Daily Context Window', () => {
  test('should allow an authenticated user to submit daily context', async ({ page }) => {
    // Navigate to the home page (where the ContextWindow is integrated)
    await page.goto('/');

    // Assume user is authenticated and on the dashboard.
    // The ContextWindow trigger button should be visible.
    const openContextButton = page.getByRole('button', { name: /Open Context Window/i });
    await expect(openContextButton).toBeVisible();

    // Click the button to open the context window dialog
    await openContextButton.click();

    // Check if the dialog is open
    await expect(page.getByRole('heading', { name: /Quick Check-In/i })).toBeVisible();

    // Generate fake data for input
    const mood = faker.helpers.arrayElement(['happy', 'neutral', 'motivated']);
    const energy = faker.number.int({ min: 30, max: 90 }).toString();
    const sorenessParts = faker.helpers.arrayElements(['Legs', 'Arms', 'Core'], { min: 1, max: 3 });
    const notes = faker.lorem.sentence();

    // Fill in the form fields
    await page.selectOption('select[id="mood"]', mood);
    await page.fill('input[id="energy"]', energy);
    for (const part of sorenessParts) {
      await page.getByRole('button', { name: new RegExp(part, 'i') }).click();
    }
    await page.fill('textarea[id="notes"]', notes);

    // Click the submit button
    const submitButton = page.getByRole('button', { name: /Submit Context/i });
    await expect(submitButton).toBeVisible();
    await submitButton.click();

    // Verify submission (e.g., dialog closes, or a success message appears)
    // For now, we expect the dialog to close if the submission is handled by the component.
    // In a real app, you might check for a toast notification or that the dialog element is no longer in the DOM.
    // await expect(page.getByRole('heading', { name: /Quick Check-In/i })).not.toBeVisible();
    
    // As the current implementation uses console.log and doesn't explicitly close the dialog,
    // we might need to adjust this expectation or add a mock for the submission handler
    // that simulates dialog closing. For now, we'll check if the submit button is gone
    // or rely on the console.log being captured by test runner if configured.
    // A more robust E2E test would assert on actual UI state changes post-submission.
    await expect(submitButton).toBeHidden(); // Assuming dialog closes and button becomes hidden
  });
});
