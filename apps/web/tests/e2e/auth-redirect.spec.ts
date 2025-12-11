// apps/web/tests/e2e/auth-redirect.spec.ts
import { test, expect } from '@playwright/test';
import { supabase } from '../../src/lib/supabaseClient'; // Import the actual supabase client
import { mockGetSession } from '../../__mocks__/@supabase/supabase-js'; // Import mock for getSession

// Mock the supabase.from().select().eq().single() call for profiles table
const mockProfilesSelect = jest.fn();

// We need to provide a custom mock for supabaseClient that allows us to control the profiles query
jest.mock('../../src/lib/supabaseClient', () => {
  // Use the actual supabaseClient module to get the structure, then override parts
  const actual = jest.requireActual('../../src/lib/supabaseClient');
  return {
    ...actual,
    supabase: {
      ...actual.supabase,
      auth: {
        ...actual.supabase.auth,
        getSession: mockGetSession, // Use our mock for getSession
      },
      from: jest.fn((tableName) => {
        if (tableName === 'profiles') {
          return {
            select: jest.fn(() => ({
              eq: jest.fn(() => ({
                single: mockProfilesSelect, // Mock the single call for profiles
              })),
            })),
          };
        }
        return actual.supabase.from(tableName); // Use actual for other tables
      }),
    },
  };
});

test.describe('AuthCallback Redirection Logic', () => {
  test.beforeEach(async ({ page }) => {
    // Clear local storage for a clean test environment
    await page.evaluate(() => localStorage.clear());
    // Clear mock calls and reset default behavior before each test
    mockGetSession.mockClear();
    mockProfilesSelect.mockClear();

    // Default mock for getSession - no active session
    mockGetSession.mockResolvedValue({ data: { session: null }, error: null });
  });

  test('should redirect to login if no session is found', async ({ page, baseURL }) => {
    await page.goto(`${baseURL}/auth/callback`);

    await expect(page).toHaveURL(`${baseURL}/auth/login`);
  });

  test('should redirect to onboarding placeholder for a new user (no profile entry)', async ({ page, baseURL }) => {
    const mockSession = {
      user: { id: 'new-user-id', email: 'new@example.com' },
      access_token: 'mock_token',
      expires_at: Math.floor(Date.now() / 1000) + 3600,
    };
    mockGetSession.mockResolvedValue({ data: { session: mockSession }, error: null });
    // Simulate no profile found for the new user
    mockProfilesSelect.mockResolvedValue({ data: null, error: { code: 'PGRST116', message: 'No rows found' } });


    await page.goto(`${baseURL}/auth/callback`);

    await expect(page).toHaveURL(`${baseURL}/onboarding-placeholder`);
  });

  test('should redirect to onboarding placeholder for an existing but non-onboarded user', async ({ page, baseURL }) => {
    const mockSession = {
      user: { id: 'existing-user-id', email: 'existing@example.com' },
      access_token: 'mock_token',
      expires_at: Math.floor(Date.now() / 1000) + 3600,
    };
    mockGetSession.mockResolvedValue({ data: { session: mockSession }, error: null });
    // Simulate a profile where is_onboarded is false
    mockProfilesSelect.mockResolvedValue({ data: { id: 'existing-user-id', is_onboarded: false }, error: null });

    await page.goto(`${baseURL}/auth/callback`);

    await expect(page).toHaveURL(`${baseURL}/onboarding-placeholder`);
  });

  test('should redirect to dashboard for an existing and onboarded user', async ({ page, baseURL }) => {
    const mockSession = {
      user: { id: 'onboarded-user-id', email: 'onboarded@example.com' },
      access_token: 'mock_token',
      expires_at: Math.floor(Date.now() / 1000) + 3600,
    };
    mockGetSession.mockResolvedValue({ data: { session: mockSession }, error: null });
    // Simulate a profile where is_onboarded is true
    mockProfilesSelect.mockResolvedValue({ data: { id: 'onboarded-user-id', is_onboarded: true }, error: null });


    await page.goto(`${baseURL}/auth/callback`);

    await expect(page).toHaveURL(`${baseURL}/dashboard`);
  });
});