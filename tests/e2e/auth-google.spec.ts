// tests/e2e/auth-google.spec.ts
import { test, expect } from '@playwright/test';
import { mockSignInWithOAuth } from '../../apps/web/__mocks__/@supabase/supabase-js'; // Import mock


test.describe('Google OAuth Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Clear local storage to ensure a clean state for each test
    await page.evaluate(() => localStorage.clear());
    // Reset any Playwright route mocks from previous tests if necessary
    await page.unrouteAll();
  });

  test('should redirect to onboarding placeholder after successful Google OAuth', async ({ page, baseURL }) => {
    // Navigate to the Welcome Screen
    // Assuming /auth is the route for WelcomeScreen, and baseURL is http://localhost:3000
    await page.goto(`${baseURL}/auth`);

    // Mock the Supabase signInWithOAuth call to simulate a successful external redirect
    // and then a return to our app with a session.
    // In a real E2E, this would redirect externally, and the callback page would process it.
    // For this E2E, we simulate the effect of the external redirect successfully creating a session.
    mockSignInWithOAuth.mockImplementationOnce(async () => {
      // Simulate that the session is now set in local storage (as Supabase would do)
      // This is necessary because auth/callback/page.tsx will check getSession()
      await page.evaluate(() => {
        localStorage.setItem('supabase.auth.token', JSON.stringify({
          currentSession: {
            access_token: 'mock_google_access_token',
            refresh_token: 'mock_google_refresh_token',
            expires_at: Math.floor(Date.now() / 1000) + 3600,
            token_type: 'Bearer',
            user: {
              id: 'mock-google-new-user-id',
              email: 'mock-google-new@example.com',
              aud: 'authenticated',
              role: 'authenticated',
              app_metadata: { provider: 'google' },
              user_metadata: {},
              created_at: new Date().toISOString(), // Simulating new user
              updated_at: new Date().toISOString(),
            },
          },
          expiresAt: Math.floor(Date.now() / 1000) + 3600,
        }));
      });
      // Return a successful, but non-redirecting response from the mock
      // as Playwright will handle the actual URL change following this mock.
      return { data: { user: null, session: null }, error: null };
    });

    // Click the "Continue with Google" button
    await page.getByRole('button', { name: /Google/i }).click();

    // After clicking, the `signInWithOAuth` mock is called, which we've set to simulate
    // a session being established and a subsequent redirect to the callback page.
    // The `auth/callback/page.tsx` will then pick this up.

    // Expect the page to eventually redirect to the onboarding placeholder route
    // Note: The actual navigation will be to `/auth/callback` first, which then redirects.
    // We expect the final destination.
    await page.waitForURL(`${baseURL}/onboarding-placeholder`);
    await expect(page).toHaveURL(`${baseURL}/onboarding-placeholder`);
  });

  // TODO: Add a test case for returning users redirected to /dashboard once user metadata check is implemented.
  // This would involve mocking the supabase.auth.getSession() to return an existing user,
  // and ensuring the auth/callback/page.tsx redirects correctly.
});
