import { test, expect } from '@playwright/test';

test.describe('Session Mix Generation Flow', () => {
  test('should successfully generate and start a session mix', async ({ page }) => {
    // Mock environment variables used by the frontend
    process.env.NEXT_PUBLIC_API_URL = 'http://localhost:8000/api/v1';

    // 1. Navigate to the session mix generation page
    await page.goto('/settings/music/mix');

    // Assert that the mix generation screen is visible
    await expect(page.getByText('Generate Session Mix')).toBeVisible();
    await expect(page.getByText('What part of your workout is this for?')).toBeVisible();

    // 2. Select a mix type (e.g., "Full Session" - already default)
    // await page.getByLabel('Full Session').check();

    // 3. Mock the backend call to generate the session mix
    const mockMixId = 'mock_mix_id_123';
    const mockTracks = [
      {
        id: 'track1',
        title: 'Mock Track 1',
        artist: 'Mock Artist A',
        albumArt: 'https://via.placeholder.com/56',
        phase: 'Warm-up',
        phaseIcon: 'local_fire_department',
        phaseColor: 'text-yellow-400',
      },
      {
        id: 'track2',
        title: 'Mock Track 2',
        artist: 'Mock Artist B',
        albumArt: 'https://via.placeholder.com/56',
        phase: 'Peak',
        phaseIcon: 'trending_up',
        phaseColor: 'text-red-500',
      },
    ];

    await page.route('**/music/generate-session-mix', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          message: 'Session mix generated successfully',
          playlist_id: mockMixId,
          mix_type: 'Full Session',
          tracks: mockTracks,
          seedTags: [],
          playlistMode: 'AI Smart Mix',
          totalDuration: '00:01',
          trackCount: mockTracks.length,
        }),
      });
    });

    // 4. Click "Create Mix"
    await page.getByRole('button', { name: 'Create Mix' }).click();

    // 5. Assert that the preview page is displayed with the mocked tracks
    await expect(page).toHaveURL(`/settings/music/mix/preview`);
    await expect(page.getByText('Your Session Preview')).toBeVisible();
    await expect(page.getByText('Mock Track 1')).toBeVisible();
    await expect(page.getByText('Mock Artist A')).toBeVisible();
    await expect(page.getByText('Mock Track 2')).toBeVisible();
    await expect(page.getByText('Mock Artist B')).toBeVisible();
    await expect(page.getByText('Total Duration')).toBeVisible();
    await expect(page.getByText('Track Count')).toBeVisible();

    // Mock the backend call to fetch mix details when the preview page loads
    await page.route(`**/music/session-mix/${mockMixId}`, async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          tracks: mockTracks,
          seedTags: [],
          playlistMode: 'AI Smart Mix',
          totalDuration: '00:01',
          trackCount: mockTracks.length,
        }),
      });
    });

    // 6. Interact with seed inputs and other customization options (example)
    await page.getByPlaceholder('Add artists or genres...').fill('Rock');
    await page.getByPlaceholder('Add artists or genres...').press('Enter');
    await expect(page.getByText('Rock')).toBeVisible();

    // 7. Click "Start Session"
    await page.route('**/music/start-session', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Session started' }),
      });
    });
    await page.getByRole('button', { name: 'Start Session' }).click();

    // 8. Assert that the user is redirected to the workout player
    await expect(page).toHaveURL('/workout/player');
  });

  test('should handle mix generation cancellation', async ({ page }) => {
    // 1. Navigate to the session mix generation page
    await page.goto('/settings/music/mix');

    // 2. Click "Cancel"
    await page.getByRole('button', { name: 'Cancel' }).click();

    // 3. Assert that the user is redirected back (e.g., to /settings/music)
    await expect(page).toHaveURL('/settings/music');
  });

  test('should handle session mix generation failure gracefully', async ({ page }) => {
    // Mock environment variables used by the frontend
    process.env.NEXT_PUBLIC_API_URL = 'http://localhost:8000/api/v1';

    // 1. Navigate to the session mix generation page
    await page.goto('/settings/music/mix');

    // 2. Mock the backend call to generate the session mix to fail
    await page.route('**/music/generate-session-mix', async route => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ detail: 'Backend mix generation error' }),
      });
    });

    // 3. Click "Create Mix"
    await page.getByRole('button', { name: 'Create Mix' }).click();

    // 4. Assert that an error message is displayed
    await expect(page.getByText('Failed to generate session mix.')).toBeVisible();
    await expect(page.getByText('Backend mix generation error')).toBeVisible();
    // Ensure it stays on the current page
    await expect(page).toHaveURL('/settings/music/mix');
  });

  test('should handle starting session failure gracefully', async ({ page }) => {
    // Mock environment variables used by the frontend
    process.env.NEXT_PUBLIC_API_URL = 'http://localhost:8000/api/v1';

    // 1. Navigate to the session mix generation page
    await page.goto('/settings/music/mix');

    // 2. Mock successful mix generation
    const mockMixId = 'mock_mix_id_456';
    const mockTracks = [
        {
            id: 'track3',
            title: 'Mock Track 3',
            artist: 'Mock Artist C',
            albumArt: 'https://via.placeholder.com/56',
            phase: 'Warm-up',
            phaseIcon: 'local_fire_department',
            phaseColor: 'text-yellow-400',
        },
    ];
    await page.route('**/music/generate-session-mix', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          message: 'Session mix generated successfully',
          playlist_id: mockMixId,
          mix_type: 'Full Session',
          tracks: mockTracks,
          seedTags: [],
          playlistMode: 'AI Smart Mix',
          totalDuration: '00:01',
          trackCount: mockTracks.length,
        }),
      });
    });

    // 3. Click "Create Mix" to go to preview page
    await page.getByRole('button', { name: 'Create Mix' }).click();
    await expect(page).toHaveURL(`/settings/music/mix/preview`);

    // Mock fetch mix details for preview page load
    await page.route(`**/music/session-mix/${mockMixId}`, async route => {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
                tracks: mockTracks,
                seedTags: [],
                playlistMode: 'AI Smart Mix',
                totalDuration: '00:01',
                trackCount: mockTracks.length,
            }),
        });
    });


    // 4. Mock the backend call to start session to fail
    await page.route('**/music/start-session', async route => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ detail: 'Backend failed to start session' }),
      });
    });

    // 5. Click "Start Session"
    await page.getByRole('button', { name: 'Start Session' }).click();

    // 6. Assert that an error message is displayed
    await expect(page.getByText('Failed to start session.')).toBeVisible();
    await expect(page.getByText('Backend failed to start session')).toBeVisible();
    // Ensure it stays on the current page
    await expect(page).toHaveURL('/settings/music/mix/preview');
  });
});
