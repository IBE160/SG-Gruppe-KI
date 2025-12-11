// apps/web/__mocks__/@supabase/supabase-js.ts
// This file mocks the entire @supabase/supabase-js library

import { jest } from '@jest/globals';

// Define the mock functions for auth methods
export const mockSignUp = jest.fn();
export const mockSignInWithPassword = jest.fn();
export const mockGetSession = jest.fn(() => Promise.resolve({ data: { session: null }, error: null }));
export const mockSignOut = jest.fn(() => Promise.resolve({ error: null }));

// Define a mock for the auth object
const mockAuth = {
  signUp: mockSignUp,
  signInWithPassword: mockSignInWithPassword,
  getSession: mockGetSession,
  signOut: mockSignOut,
  // Add other auth methods as needed for testing
};

// Define a mock for the main createClient function
export const createClient = jest.fn(() => ({
  auth: mockAuth,
  // Add other Supabase client properties/methods you use (e.g., from, storage)
  from: jest.fn(() => ({
    select: jest.fn(() => ({
      eq: jest.fn(() => ({
        maybeSingle: jest.fn(() => Promise.resolve({ data: null, error: null })),
        single: jest.fn(() => Promise.resolve({ data: null, error: null })),
        limit: jest.fn(() => ({
          single: jest.fn(() => Promise.resolve({ data: null, error: null })),
        })),
      })),
    })),
    insert: jest.fn(() => ({
      select: jest.fn(() => Promise.resolve({ data: [], error: null })),
    })),
    update: jest.fn(() => ({
      eq: jest.fn(() => ({
        select: jest.fn(() => Promise.resolve({ data: [], error: null })),
      })),
    })),
    delete: jest.fn(() => Promise.resolve({ data: [], error: null })),
  })),
  storage: {
    from: jest.fn(() => ({
      upload: jest.fn(() => Promise.resolve({ data: {}, error: null })),
      getPublicUrl: jest.fn(() => ({ data: { publicUrl: 'mock-url' } })),
    })),
  },
}));
