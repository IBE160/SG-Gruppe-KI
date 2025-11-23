import { test, expect } from '../support/fixtures';
import { faker } from '@faker-js/faker';

test.describe('First-Time User Onboarding', () => {
  test('should allow a new user to complete the conversational onboarding flow', async ({ page }) => {
    // GIVEN: A new user is on the welcome page
    await page.goto('/');
    await expect(page.getByTestId('welcome-hero-card')).toBeVisible();

    // WHEN: The user starts the onboarding
    await page.getByTestId('begin-onboarding-button').click();

    // AND: The user answers the conversational prompts
    await expect(page.getByTestId('conversational-check-in')).toBeVisible();

    // Mock the API response for creating the user
    await page.route('**/api/users', (route) => {
      // Check that the request payload is correct
      const body = route.request().postDataJSON();
      expect(body.goal).toBe('build-strength');
      expect(body.trainingDaysPerWeek).toBe(3);
      route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({ id: `usr_${faker.string.uuid()}`, ...body }),
      });
    });
    
    // Mock the API response for the plan generation
    await page.route('**/api/plans/generate', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ planId: `pln_${faker.string.uuid()}`, summary: 'Your First Adaptive Plan' }),
      });
    });

    await page.getByTestId('goal-chip-build-strength').click();
    await page.getByTestId('training-days-slider').fill('3');
    await page.getByTestId('equipment-chip-dumbbells').click();
    await page.getByTestId('music-chip-energetic').click();
    await page.getByTestId('submit-onboarding-button').click();

    // THEN: The user sees the "Plan Ready" confirmation
    await expect(page.getByTestId('plan-reveal-screen')).toBeVisible();
    await expect(page.getByText('Your First Adaptive Plan Is Ready!')).toBeVisible();

    // AND: The user can view their new plan
    await page.getByTestId('view-my-plan-button').click();
    await expect(page.getByTestId('workout-player-preview')).toBeVisible();
    await expect(page.getByText('Here’s how your session works.')).toBeVisible();
  });
});
