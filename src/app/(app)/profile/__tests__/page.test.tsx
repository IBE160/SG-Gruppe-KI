import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProfilePage from '../page'; // Adjust path as necessary
import * as userService from '@/app/lib/api/user'; // Mock the API service
import { supabase } from '@/lib/supabaseClient'; // Import supabase for mocking

// Mock the useRouter hook from Next.js
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
  })),
  usePathname: jest.fn(() => '/profile'),
  useSearchParams: jest.fn(() => new URLSearchParams()),
}));

// Mock the API service functions
jest.mock('@/app/lib/api/user', () => ({
  getUserProfile: jest.fn(),
  updateUserProfile: jest.fn(),
}));

// Mock the Supabase client
jest.mock('@/lib/supabaseClient', () => ({
  supabase: {
    auth: {
      getSession: jest.fn(),
    },
  },
}));

const mockUserProfile = {
  id: 'user123',
  email: 'test@example.com',
  name: 'Test User',
  goals: { fitness: 'strength', weight: 'gain' },
  preferences: { notifications: true },
  equipment: ['dumbbells', 'barbell'],
  injuries: 'none',
  units: 'metric',
};

const mockSession = {
  access_token: 'mock-access-token',
  refresh_token: 'mock-refresh-token',
  expires_in: 3600,
  token_type: 'Bearer',
  user: {
    id: 'user123',
    aud: 'authenticated',
    role: 'authenticated',
    email: 'test@example.com',
    email_confirmed_at: '2023-01-01T00:00:00Z',
    phone_confirmed_at: '2023-01-01T00:00:00Z',
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z',
    identities: [],
    app_metadata: {},
    user_metadata: {},
  },
};

describe('ProfilePage', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();

    // Default mocks for successful profile fetch and authentication
    (supabase.auth.getSession as jest.Mock).mockResolvedValue({ data: { session: mockSession } });
    (userService.getUserProfile as jest.Mock).mockResolvedValue(mockUserProfile);
    (userService.updateUserProfile as jest.Mock).mockResolvedValue(mockUserProfile); // Default successful update
  });

  test('renders loading state initially', async () => {
    // Explicitly make getUserProfile never resolve to simulate loading
    (userService.getUserProfile as jest.Mock).mockReturnValue(new Promise(() => {}));
    render(<ProfilePage />);
    expect(screen.getByText('Loading profile...')).toBeInTheDocument();
  });

  test('renders user profile after successful API call', async () => {
    render(<ProfilePage />);
    // Wait for all initial state updates to settle and the final UI to appear
    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument();
      expect(screen.getByText('test@example.com')).toBeInTheDocument();
      const goalsPreElement = screen.getByText('Goals:').nextElementSibling;
      // Ensure it's a pre tag and parse its content
      expect(goalsPreElement?.tagName).toBe('PRE');
      expect(JSON.parse(goalsPreElement?.textContent || '{}')).toEqual(mockUserProfile.goals);

      const preferencesPreElement = screen.getByText('Preferences:').nextElementSibling;
      expect(JSON.parse(preferencesPreElement?.textContent || '{}')).toEqual(mockUserProfile.preferences);
      expect(screen.getByText('dumbbells, barbell')).toBeInTheDocument();
      expect(screen.getByText('none')).toBeInTheDocument();
      expect(screen.getByText('metric')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /edit profile/i })).toBeInTheDocument();
    });
    expect(supabase.auth.getSession).toHaveBeenCalled();
    expect(userService.getUserProfile).toHaveBeenCalledWith(mockSession.access_token);
  });

  test('renders error message if API call fails', async () => {
    const errorMessage = 'Failed to fetch profile';
    (userService.getUserProfile as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));
    render(<ProfilePage />);
    await screen.findByText(`Error: ${errorMessage}`);
  });

  test('renders error message if not authenticated', async () => {
    (supabase.auth.getSession as jest.Mock).mockResolvedValue({ data: { session: null } }); // Simulate no session
    render(<ProfilePage />);
    await screen.findByText('Error: You are not authenticated. Please log in.');
  });

  test('switches to editing mode when Edit Profile button is clicked', async () => {
    render(<ProfilePage />);
    await screen.findByText('Test User'); // Wait for initial load

    await waitFor(() => {
      fireEvent.click(screen.getByRole('button', { name: /edit profile/i }));
    });

    await screen.findByDisplayValue('Test User'); // Find the input field with current user name
    await screen.findByRole('button', { name: /save changes/i });
    await screen.findByRole('button', { name: /cancel/i });
  });

          test('updates user profile on form submission', async () => {

            // Mock updateUserProfile to return the updated profile structure

            const updatedName = 'Updated User';

            const updatedUnits = 'imperial';

            const updatedGoals = { fitness: 'endurance' };

            (userService.updateUserProfile as jest.Mock).mockResolvedValueOnce({

              ...mockUserProfile,

              name: updatedName,

              units: updatedUnits,

              goals: updatedGoals,

            });

        

            render(<ProfilePage />);

            // 1. Wait for initial non-editing view to load and display the Edit Profile button

            await screen.findByRole('button', { name: /edit profile/i });

            expect(screen.getByText('Test User')).toBeInTheDocument(); // Also check a displayed value

        

            // 2. Click the edit button

            fireEvent.click(screen.getByRole('button', { name: /edit profile/i }));

        

            // 3. Wait for the editing view to appear by asserting on a form element

            await screen.findByLabelText(/name/i);

        

            fireEvent.change(screen.getByLabelText(/name/i), { target: { value: updatedName } });

            fireEvent.change(screen.getByLabelText(/units/i), { target: { value: updatedUnits } });

            fireEvent.change(screen.getByLabelText(/goals/i), { target: { value: JSON.stringify(updatedGoals) } });

            fireEvent.click(screen.getByRole('button', { name: /save changes/i }));

        

            await waitFor(() => {

              expect(userService.updateUserProfile).toHaveBeenCalledWith(mockSession.access_token, {

                ...mockUserProfile, // Ensure all original fields are passed

                name: updatedName,

                units: updatedUnits,

                goals: updatedGoals,

              });

              expect(screen.getByText(updatedName)).toBeInTheDocument();

              expect(screen.getByText(updatedUnits)).toBeInTheDocument();

              const updatedGoalsPreElement = screen.getByText('Goals:').nextElementSibling;

              expect(JSON.parse(updatedGoalsPreElement?.textContent || '{}')).toEqual(updatedGoals);

            });

          });

  test('cancels editing and reverts changes', async () => {
    render(<ProfilePage />);
    // 1. Wait for initial non-editing view to load and display the Edit Profile button
    await screen.findByRole('button', { name: /edit profile/i });
    expect(screen.getByText('Test User')).toBeInTheDocument(); // Also check a displayed value

    // 2. Click the edit button
    fireEvent.click(screen.getByRole('button', { name: /edit profile/i }));

    // 3. Wait for the editing view to appear by asserting on a form element
    await screen.findByLabelText(/name/i);

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Temporary Name' } });
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));

    await waitFor(() => {
      expect(screen.getByText(mockUserProfile.name)).toBeInTheDocument();
      expect(screen.queryByDisplayValue('Temporary Name')).not.toBeInTheDocument();
    });
  });
});

