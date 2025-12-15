import { test, expect } from '@playwright/test';

test.describe('In-Workout Music Playback & Controls', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authentication and navigate to the workout player page
    // In a real scenario, you would have a robust way to mock user login
    await page.goto('/workout/player'); 

    // Mock the Spotify SDK script loading to prevent actual external calls
    await page.route('https://sdk.scdn.co/spotify-player.js', route => {
      route.fulfill({
        status: 200,
        body: `
          window.Spotify = {
            Player: function(options) {
              this.options = options;
              this.listeners = {};
              this.addListener = (event, callback) => {
                this.listeners[event] = callback;
              };
              this.connect = () => Promise.resolve(true);
              this.disconnect = jest.fn();
              this.togglePlay = jest.fn();
              this.nextTrack = jest.fn();
              this.previousTrack = jest.fn();
              this.setVolume = jest.fn();
              this.getCurrentState = jest.fn(() => Promise.resolve(null));
              setTimeout(() => {
                // Simulate SDK ready after a short delay
                if (this.listeners.ready) {
                  this.listeners.ready({ device_id: 'mock_device_id' });
                }
              }, 100);
            }
          };
          window.onSpotifyWebPlaybackSDKReady();
        `,
      });
    });

    // Mock API call for logging music feedback
    await page.route('**/api/v1/music/feedback', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Music feedback logged successfully' }),
      });
    });

    // Mock API call to get access token if useAuth makes a direct call
    await page.route('**/api/v1/auth/token', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ access_token: 'mock_spotify_access_token' }),
      });
    });

    // Simulate AuthContext providing an access token
    await page.evaluate(() => {
      window.localStorage.setItem('mockAccessToken', 'mock_spotify_access_token');
    });

    // Wait for the Spotify Player to be "ready" in the UI
    await expect(page.getByText('Loading Spotify Player...')).not.toBeVisible();
    await expect(page.getByRole('button', { name: /Play/i })).toBeVisible();
  });

  test('AC3.3.1: music playback controls are available and functional', async ({ page }) => {
    // Check if play/pause button is visible and clickable
    const playButton = page.getByRole('button', { name: /Play/i });
    await expect(playButton).toBeVisible();

    // Simulate clicking play
    await playButton.click();
    // In a real test, you'd check if the mockSpotifyPlayer.togglePlay was called
    // For now, we'll check if the icon changed to pause (conceptual)
    // await expect(page.getByRole('button', { name: /Pause/i })).toBeVisible();

    // Check if skip next button is visible and clickable
    const skipNextButton = page.getByRole('button', { name: 'Skip Next' });
    await expect(skipNextButton).toBeVisible();
    await skipNextButton.click();

    // Check if skip previous button is visible and clickable
    const skipPreviousButton = page.getByRole('button', { name: 'Skip Previous' });
    await expect(skipPreviousButton).toBeVisible();
    await skipPreviousButton.click();

    // Check if volume slider is visible
    const volumeSlider = page.getByRole('slider', { name: 'Volume' }); // Assuming an aria-label for volume
    await expect(volumeSlider).toBeVisible();
  });

  test('AC3.3.2: visual feedback on BPM matching for the current workout phase is displayed', async ({ page }) => {
    // Expect the BPM display to be visible
    const bpmDisplay = page.getByText(/BPM: \d+ \(Warm-up Phase\)/); // Assuming a dynamic BPM
    await expect(bpmDisplay).toBeVisible();
    // Further checks could involve changing mock state and asserting text changes
  });

  test('AC3.3.3: user music interactions are logged via the backend', async ({ page }) => {
    // Test skip next interaction logging
    const skipNextButton = page.getByRole('button', { name: 'Skip Next' });
    const [requestSkipNext] = await Promise.all([
      page.waitForRequest(request => request.url().includes('/api/v1/music/feedback') && request.method() === 'POST' && request.postDataJSON().feedback_type === 'skip_next'),
      skipNextButton.click(),
    ]);
    expect(requestSkipNext.postDataJSON().track_id).toBeDefined();

    // Test skip previous interaction logging
    const skipPreviousButton = page.getByRole('button', { name: 'Skip Previous' });
    const [requestSkipPrevious] = await Promise.all([
      page.waitForRequest(request => request.url().includes('/api/v1/music/feedback') && request.method() === 'POST' && request.postDataJSON().feedback_type === 'skip_previous'),
      skipPreviousButton.click(),
    ]);
    expect(requestSkipPrevious.postDataJSON().track_id).toBeDefined();

    // Test completion interaction logging (requires mocking player_state_changed more deeply)
    // For now, conceptual check: if player_state_changed leads to a new track, completion should be logged
  });
});