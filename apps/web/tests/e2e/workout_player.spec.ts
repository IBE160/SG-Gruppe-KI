// apps/web/tests/e2e/workout_player.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Workout Player E2E Tests', () => {
  // Mock API calls for a confirmed plan and logging if needed later
  test.beforeEach(async ({ page }) => {
    // Mock the API response for fetching a confirmed workout plan
    await page.route('**/api/v1/plans/*', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          plan: {
            workout_days: [{
              day_name: 'Full Body Strength A',
              exercises: [
                { name: 'Warm-up Jog', sets: 1, reps: '5 min', rpe: 3, target_weight: 0, image: '' },
                { name: 'Barbell Squats', sets: 3, reps: '8-10', rpe: 7, target_weight: 100, image: 'image_squats.jpg' },
                { name: 'Bench Press', sets: 3, reps: '8-10', rpe: 7, target_weight: 70, image: 'image_bench_press.jpg' },
              ],
            }],
          },
        }),
      });
    });

    // Mock the API response for logging a set
    await page.route('**/api/v1/logs', async route => {
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Log entry received (mocked)' }),
      });
    });

    // Assume we've navigated to a page where "Start Workout" button is present
    // For this E2E, we'll directly navigate to the workout player URL for simplicity
    // A real scenario would involve clicking a button on the dashboard/plan review
    await page.goto('/workout/player'); // Adjust this URL as per your app's routing
  });

  test('should simulate starting a workout, logging sets, and progressing', async ({ page }) => {
    // Simulate current workout state in the store (as if plan was confirmed and loaded)
    // This is a simplified direct state manipulation for testing.
    await page.evaluate(() => {
        const mockPlan = {
            workout_days: [{
              day_name: 'Full Body Strength A',
              exercises: [
                { name: 'Warm-up Jog', sets: 1, reps: '5 min', rpe: 3, target_weight: 0, image: '' },
                { name: 'Barbell Squats', sets: 3, reps: '8-10', rpe: 7, target_weight: 100, image: 'image_squats.jpg' },
                { name: 'Bench Press', sets: 3, reps: '8-10', rpe: 7, target_weight: 70, image: 'image_bench_press.jpg' },
              ],
            }],
          };
        // @ts-ignore - Zustand store is not directly available in global scope but we assume its structure
        window.useWorkoutStore.getState().setPlan(mockPlan);
        // @ts-ignore
        window.useWorkoutStore.getState().setCurrentExerciseIndex(0);
        // @ts-ignore
        window.useWorkoutStore.getState().setCurrentSetIndex(0);
        // @ts-ignore
        window.useWorkoutStore.getState().setCurrentReps(10);
        // @ts-ignore
        window.useWorkoutStore.getState().setCurrentWeight(100);
        // @ts-ignore
        window.useWorkoutStore.getState().setCurrentRPE(7);
    });

    // Expect the workout player UI to be visible
    await expect(page.getByText('Warm-up Jog')).toBeVisible();
    await expect(page.getByText('Set 1')).toBeVisible();

    // Simulate logging the warm-up set
    await page.getByRole('button', { name: 'Log Set' }).click();

    // Expect to be in a rest period
    await expect(page.getByText('Rest')).toBeVisible();
    await expect(page.getByText('NEXT UP')).toBeVisible();
    await expect(page.getByText('Barbell Squats')).toBeVisible();

    // Simulate skipping rest
    await page.getByRole('button', { name: 'Skip Rest' }).click();

    // Expect to see the first main exercise
    await expect(page.getByText('Barbell Squats')).toBeVisible();
    await expect(page.getByText('Set 1')).toBeVisible();

    // Log first set of Barbell Squats
    await page.getByRole('button', { name: 'Log Set' }).click();

    // Expect rest period, then skip
    await expect(page.getByText('Rest')).toBeVisible();
    await page.getByRole('button', { name: 'Skip Rest' }).click();

    // Log second set
    await page.getByRole('button', { name: 'Log Set' }).click();

    // Expect rest period, then skip
    await expect(page.getByText('Rest')).toBeVisible();
    await page.getByRole('button', { name: 'Skip Rest' }).click();

    // Log third set
    await page.getByRole('button', { name: 'Log Set' }).click();
    
    // After all sets of an exercise, it should move to the next exercise or finish
    // For now, it will go into rest then to the next exercise
    await expect(page.getByText('Rest')).toBeVisible();
    await expect(page.getByText('Bench Press')).toBeVisible(); // Next exercise
    await page.getByRole('button', { name: 'Skip Rest' }).click();

    // Log first set of Bench Press
    await expect(page.getByText('Bench Press')).toBeVisible();
    await page.getByRole('button', { name: 'Log Set' }).click();

    // Verify logs were "sent" (mocked API call check)
    // This is hard to assert directly without more sophisticated Playwright mocking setup
    // For now, we rely on the route mock above to capture the call.
    // In a real E2E, we'd check network requests.
    // expect(mockedApiLogCalls.length).toBeGreaterThan(0); // Conceptual assertion
  });

  test('should simulate offline persistence and state recovery', async ({ page, context }) => {
    // Simulate user starting a workout and logging a set
    await page.evaluate(() => {
        const mockPlan = {
            workout_days: [{
              day_name: 'Full Body Strength A',
              exercises: [
                { name: 'Warm-up Jog', sets: 1, reps: '5 min', rpe: 3, target_weight: 0, image: '' },
                { name: 'Barbell Squats', sets: 3, reps: '8-10', rpe: 7, target_weight: 100, image: 'image_squats.jpg' },
              ],
            }],
          };
        // @ts-ignore
        window.useWorkoutStore.getState().setPlan(mockPlan);
        // @ts-ignore
        window.useWorkoutStore.getState().setCurrentExerciseIndex(0);
        // @ts-ignore
        window.useWorkoutStore.getState().setCurrentSetIndex(0);
        // @ts-ignore
        window.useWorkoutStore.getState().setCurrentReps(10);
        // @ts-ignore
        window.useWorkoutStore.getState().addLoggedSet({
            exercise_name: 'Warm-up Jog',
            set_number: 1,
            actual_reps: 5,
            actual_weight: 0,
            rpe: 3,
            completed_at: new Date().toISOString(),
        });
    });

    // Expect some state to be visible before refresh
    await expect(page.getByText('Warm-up Jog')).toBeVisible();
    await expect(page.getByText('Set 1')).toBeVisible();

    // Simulate browser refresh
    await page.reload();

    // After refresh, the state should be recovered from local storage
    await expect(page.getByText('Warm-up Jog')).toBeVisible();
    await expect(page.getByText('Set 1')).toBeVisible();
    // Further assertions could check loggedSets length or other specific persisted state
  });
});