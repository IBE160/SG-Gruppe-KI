import { test, expect } from '@playwright/test';

test.describe('Dashboard Display', () => {
  test('should display dashboard elements correctly', async ({ page }) => {
    // Mock the API calls for dashboard data
    await page.route('**/api/dashboard', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          goal_progress: {
            name: "Bench Press",
            current: 85,
            target: 100,
            unit: "kg",
          },
          workout_streak: {
            days: 5,
          },
          weekly_volume: {
            total: 5450,
            unit: "lbs",
            chart_data_url: "mock_chart_url",
          },
          todays_context: {
            message: "You seem rested. Today's a good day for a high-intensity session. Let's aim for a new PR!",
          },
          recent_workouts: [
            { name: "Push Day - Upper Body", date: "Yesterday" },
            { name: "Leg Day - Hypertrophy", date: "Mar 15" },
            { name: "Pull Day - Back & Biceps", date: "Mar 14" },
          ],
          weekly_review: {
            volume: {
              value: "5,450 lbs",
              trend: "up",
              percentage_change: "15%",
              chart_svg: '<svg data-testid="volume-chart-e2e"></svg>',
            },
            intensity: {
              value: "85% 1RM",
              trend: "down",
              percentage_change: "2%",
              chart_svg: '<svg data-testid="intensity-chart-e2e"></svg>',
            },
            consistency: {
              value: "4/5 Days",
              trend: "up",
              percentage_change: "20%",
              chart_data: [
                  { day: "Mon", height_percentage: "75%", trained: true },
                  { day: "Tue", height_percentage: "100%", trained: false },
                  { day: "Wed", height_percentage: "80%", trained: true },
                  { day: "Thu", height_percentage: "90%", trained: true },
                  { day: "Fri", height_percentage: "100%", trained: false },
                  { day: "Sat", height_percentage: "60%", trained: true },
                  { day: "Sun", height_percentage: "100%", trained: false },
              ],
            },
            coach_corner: {
              message: "Your intensity has been trending down over the last 3 sessions. To prevent overtraining and promote recovery, consider a deload week.",
              suggestion: "Implement Suggestion",
            },
          },
        }),
      });
    });

    await page.goto('/dashboard');

    // Assert top app bar elements
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Generate Plan' })).toBeVisible();

    // Assert "Celebrate Your Wins" section
    await expect(page.getByRole('heading', { name: 'Celebrate Your Wins' })).toBeVisible();
    await expect(page.getByText('New PR: Squat!')).toBeVisible();
    await expect(page.getByText('5 Day Streak!')).toBeVisible();
    await expect(page.getByText('50 Workouts Logged')).toBeVisible();

    // Assert "Your Widgets" section
    await expect(page.getByRole('heading', { name: 'Your Widgets' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'edit' })).toBeVisible();

    // Assert MetricsDisplay elements (using mocked data)
    await expect(page.getByText('Goal: Bench Press')).toBeVisible();
    await expect(page.getByText('85kg / 100kg')).toBeVisible();
    await expect(page.getByText('Workout Streak')).toBeVisible();
    await expect(page.getByText('5 Days')).toBeVisible();
    await expect(page.getByText('Weekly Volume')).toBeVisible();
    await expect(page.getByText("Today's Context")).toBeVisible();
    await expect(page.getByText('You seem rested.')).toBeVisible();
    await expect(page.getByText('Recent Workouts')).toBeVisible();
    await expect(page.getByText('Push Day - Upper Body')).toBeVisible();

    // Assert WeeklyReview elements (using mocked data)
    await expect(page.getByText('Volume').nth(1)).toBeVisible(); // Second occurrence of 'Volume'
    await expect(page.getByText('5,450 lbs').nth(1)).toBeVisible(); // Second occurrence of '5,450 lbs'
    await expect(page.getByText('Intensity')).toBeVisible();
    await expect(page.getByText('85% 1RM')).toBeVisible();
    await expect(page.getByText('Consistency')).toBeVisible();
    await expect(page.getByText('4/5 Days')).toBeVisible();
    await expect(page.getByText("Coach's Corner")).toBeVisible();
    await expect(page.getByText('Your intensity has been trending down over the last 3 sessions.')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Implement Suggestion' })).toBeVisible();

    // Assert bottom navigation bar elements
    await expect(page.getByText('Dashboard', { exact: true })).toBeVisible();
    await expect(page.getByText('Workout', { exact: true })).toBeVisible();
    await expect(page.getByText('History', { exact: true })).toBeVisible();
    await expect(page.getByText('Settings', { exact: true })).toBeVisible();
  });
});
