// apps/web/src/app/settings/profile/__tests__/page.test.tsx
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import UserProfilePage from '../page';
import { useAuthStore } from '@/store/auth';
import { useProfileStore } from '@/store/profileStore';
import { api } from '@/lib/api';
import '@testing-library/jest-dom';

// Mock the API and Zustand stores
jest.mock('@/lib/api', () => ({
  api: {
    get: jest.fn(),
  },
}));

jest.mock('@/store/auth', () => ({
  useAuthStore: jest.fn(),
}));

jest.mock('@/store/profileStore', () => ({
  useProfileStore: jest.fn(),
}));

// Mock the ViewProfile component as it's tested separately
jest.mock('@/app/settings/profile/view-profile', () => {
  return jest.fn(() => <div>Mock ViewProfile</div>);
});

const mockSession = { access_token: 'fake-token' };
const mockUserProfile = {
  id: 'user123',
  email: 'user@example.com',
  unit_preference: 'kg',
};

describe('UserProfilePage', () => {
  let setCurrentUserData: jest.Mock;

  beforeEach(() => {
    setCurrentUserData = jest.fn();
    (useAuthStore as jest.Mock).mockReturnValue({ session: mockSession });
    (useProfileStore as jest.Mock).mockReturnValue({
      setCurrentUserData,
      currentUserData: mockUserProfile, // Ensure currentUserData is available for ViewProfile mock
    });
    (api.get as jest.Mock).mockClear();
    setCurrentUserData.mockClear();
  });

  it('displays loading state initially', () => {
    (api.get as jest.Mock).mockReturnValueOnce(new Promise(() => {})); // Keep promise pending
    render(<UserProfilePage />);
    expect(screen.getByText(/loading profile/i)).toBeInTheDocument();
  });

  it('fetches user profile data and sets it to store on successful load', async () => {
    (api.get as jest.Mock).mockResolvedValueOnce({ data: mockUserProfile });

    render(<UserProfilePage />);

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith('/users/me', mockSession.access_token);
      expect(setCurrentUserData).toHaveBeenCalledWith(mockUserProfile);
      expect(screen.getByText('Mock ViewProfile')).toBeInTheDocument();
    });
  });

  it('displays error message if not authenticated', async () => {
    (useAuthStore as jest.Mock).mockReturnValue({ session: null });
    render(<UserProfilePage />);

    await waitFor(() => {
      expect(screen.getByText(/error: not authenticated/i)).toBeInTheDocument();
      expect(api.get).not.toHaveBeenCalled();
    });
  });

  it('displays error message on API fetch failure', async () => {
    (api.get as jest.Mock).mockResolvedValueOnce({ error: { message: 'Failed to fetch' } });

    render(<UserProfilePage />);

    await waitFor(() => {
      expect(screen.getByText(/error: failed to fetch/i)).toBeInTheDocument();
    });
  });

  it('displays generic error message on network error', async () => {
    (api.get as jest.Mock).mockRejectedValueOnce(new Error('Network Down'));

    render(<UserProfilePage />);

    await waitFor(() => {
      expect(screen.getByText(/error: failed to fetch profile data/i)).toBeInTheDocument();
    });
  });
});