import { test, expect } from '@playwright/test';

test.describe('Spotify OAuth Flow', () => {
  test('should successfully connect to Spotify', async ({ page }) => {
    // Mock environment variables used by the frontend
    process.env.NEXT_PUBLIC_API_URL = 'http://localhost:8000/api/v1';

    // 1. Navigate to the Spotify connect page
    await page.goto('/settings/music/connect');

    // Assert that the explainer screen is visible
    await expect(page.getByText('Power Your Workouts with Music')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Connect with Spotify' })).toBeVisible();

    // 2. Mock the backend call to initiate OAuth
    const mockAuthUrl = 'https://accounts.spotify.com/authorize?client_id=mock_client_id&response_type=code&redirect_uri=http://localhost:8000/api/v1/music/callback/spotify&code_challenge_method=S256&code_challenge=mock_code_challenge';
    const mockCodeVerifier = 'mock_code_verifier_123';

    await page.route('**/music/connect/spotify', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          auth_url: mockAuthUrl,
          code_verifier: mockCodeVerifier,
        }),
      });
    });

    // 3. Click the "Connect with Spotify" button
    await page.getByRole('button', { name: 'Connect with Spotify' }).click();

    // 4. Playwright should intercept the redirect and allow us to mock it
    // We need to mock the actual Spotify redirect, which is external.
    // Instead of redirecting to actual Spotify, we will intercept the URL and proceed to our callback
    // by mocking the browser's navigation.

    // Intercept the navigation to the external Spotify URL
    await page.route(mockAuthUrl, async route => {
      // Simulate Spotify redirecting back to our callback with code and verifier
      await route.fulfill({
        status: 302, // Redirect status
        headers: {
          'Location': `${process.env.NEXT_PUBLIC_API_URL}/music/callback/spotify?code=mock_auth_code&code_verifier=${mockCodeVerifier}`,
        },
      });
    });

    // 5. Mock the backend callback to complete token exchange and storage
    await page.route('**/music/callback/spotify**', async route => {
      // In a real scenario, this would involve calling the backend directly
      // Here, we just mock its successful response
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          message: 'Spotify connection successful',
          access_token: 'mock_access_token',
        }),
      });
    });

    // Wait for the redirect to the callback page and assertion of its content
    await expect(page.getByText('Spotify connected successfully!')).toBeVisible();
    await expect(page.getByLabel('check_circle')).toBeVisible(); // Material Symbol icon

    // Assert that the page eventually redirects to /settings/music
    await page.waitForURL('**/settings/music', { timeout: 5000 });
  });

  test('should handle Spotify OAuth cancellation gracefully', async ({ page }) => {
    // Mock environment variables used by the frontend
    process.env.NEXT_PUBLIC_API_URL = 'http://localhost:8000/api/v1';

    // 1. Navigate to the Spotify connect page
    await page.goto('/settings/music/connect');

    // Mock the backend call to initiate OAuth
    const mockAuthUrl = 'https://accounts.spotify.com/authorize?test=true';
    const mockCodeVerifier = 'mock_code_verifier_123';

    await page.route('**/music/connect/spotify', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          auth_url: mockAuthUrl,
          code_verifier: mockCodeVerifier,
        }),
      });
    });

    // 2. Click the "Connect with Spotify" button
    await page.getByRole('button', { name: 'Connect with Spotify' }).click();

    // 3. Simulate user cancelling the Spotify OAuth flow
    // This typically means Spotify redirects back to our callback URL with an error parameter,
    // or the user closes the popup/tab. For Playwright, we'll mock the callback
    // directly with an error.
    await page.route('**/music/callback/spotify**', async route => {
      await route.fulfill({
        status: 400, // Simulate a bad request or error from backend
        contentType: 'application/json',
        body: JSON.stringify({
          detail: 'Spotify connection failed due to user cancellation or missing data.',
        }),
      });
    });
    
    // Simulate navigation back to our callback page with an error (no code/verifier)
    // This is a direct navigation to test the callback page's error handling for missing params
    await page.goto('/settings/music/callback?error=access_denied&error_description=User%20denied%20access');

    // Wait for the error message to be visible
    await expect(page.getByText('Spotify connection failed.')).toBeVisible();
    await expect(page.getByText('Error: Spotify connection failed due to user cancellation or missing data.')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Try Again' })).toBeVisible();
    await expect(page.getByLabel('cancel')).toBeVisible(); // Material Symbol icon

    // Ensure no redirect to /settings/music on failure
    await expect(page).not.toHaveURL('**/settings/music', { timeout: 2000 });

    // Test clicking "Try Again"
    await page.getByRole('button', { name: 'Try Again' }).click();
    await expect(page).toHaveURL('**/settings/music/connect');
  });
});
