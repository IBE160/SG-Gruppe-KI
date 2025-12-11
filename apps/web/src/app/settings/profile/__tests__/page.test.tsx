// apps/web/src/app/settings/profile/__tests__/page.test.tsx

import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import ProfilePage from '../page';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/auth';
import useProfileStore from '@/store/profileStore';
import { FullUserProfile } from '@/types/user';

// Mock the API and stores
jest.mock('@/lib/api', () => ({
  api: {
    get: jest.fn(),
  },
}));

jest.mock('@/store/auth', () => ({
  useAuthStore: jest.fn(),
}));

jest.mock('@/store/profileStore', () => ({
  __esModule: true,
  default: jest.fn(),
}));

// Mock the ViewProfile component since its internal logic is tested separately
jest.mock('../view-profile', () => {
  return jest.fn(({ userProfile }) => (
    <div data-testid="view-profile">
      <span>{userProfile.email}</span>
      <span>{userProfile.unit_preference}</span>
    </div>
  ));
});

describe('ProfilePage', () => {
  const mockAccessToken = 'mock-access-token';
  const mockUserProfile: FullUserProfile = {
    id: 'user-123',
    email: 'test@example.com',
    unit_preference: 'kg',
    goals: [],
    equipment: [],
  };

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();

    (useAuthStore as jest.Mock).mockReturnValue({
      session: { access_token: mockAccessToken },
    });

    (useProfileStore as jest.Mock).mockReturnValue({
      isEditing: false,
      setEditing: jest.fn(),
      setTempUserData: jest.fn(),
    });

    (api.get as jest.Mock).mockResolvedValue({ data: mockUserProfile });
  });

  it('renders loading state initially', () => {
    (api.get as jest.Mock).mockReturnValue(new Promise(() => {})); // Never resolve
    render(<ProfilePage />);
    expect(screen.getByText('Loading profile...')).toBeInTheDocument();
  });

  it('renders error state if no access token', async () => {
    (useAuthStore as jest.Mock).mockReturnValue({ session: null });
    render(<ProfilePage />);
    await waitFor(() => {
      expect(screen.getByText('Error: User not authenticated.')).toBeInTheDocument();
    });
  });

  it('renders error state if API call fails', async () => {
    (api.get as jest.Mock).mockResolvedValue({ error: { message: 'Network error' } });
    render(<ProfilePage />);
    await waitFor(() => {
      expect(screen.getByText('Error: Network error')).toBeInTheDocument();
    });
  });

  it('renders "No profile data available" if API returns no data', async () => {
    (api.get as jest.Mock).mockResolvedValue({ data: null });
    render(<ProfilePage />);
    await waitFor(() => {
      expect(screen.getByText('No profile data available.')).toBeInTheDocument();
    });
  });

  it('fetches and displays user profile data', async () => {
    render(<ProfilePage />);
    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith('/users/me', mockAccessToken);
      expect(screen.getByTestId('view-profile')).toBeInTheDocument();
      expect(screen.getByText(mockUserProfile.email)).toBeInTheDocument();
      expect(screen.getByText(mockUserProfile.unit_preference)).toBeInTheDocument();
    });
  });

  it('shows Edit Profile button when not editing', async () => {
    render(<ProfilePage />);
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Edit Profile' })).toBeInTheDocument();
    });
  });

  it('hides Edit Profile button when in editing mode', async () => {
    (useProfileStore as jest.Mock).mockReturnValue({
      isEditing: true,
      setEditing: jest.fn(),
      setTempUserData: jest.fn(),
    });
    render(<ProfilePage />);
    await waitFor(() => {
      expect(screen.queryByRole('button', { name: 'Edit Profile' })).not.toBeInTheDocument();
    });
  });

  it('calls setEditing and setTempUserData when Edit Profile button is clicked', async () => {
    const mockSetEditing = jest.fn();
    const mockSetTempUserData = jest.fn();
    (useProfileStore as jest.Mock).mockReturnValue({
      isEditing: false,
      setEditing: mockSetEditing,
      setTempUserData: mockSetTempUserData,
    });
    render(<ProfilePage />);
    await waitFor(() => {
      fireEvent.click(screen.getByRole('button', { name: 'Edit Profile' }));
    });
    expect(mockSetTempUserData).toHaveBeenCalledWith(mockUserProfile);
    expect(mockSetEditing).toHaveBeenCalledWith(true);
  });
});
