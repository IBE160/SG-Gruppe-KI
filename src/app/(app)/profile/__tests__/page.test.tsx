import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProfilePage from '../page'; // Adjust path as necessary
import * as userService from '@/app/lib/api/user'; // Mock the API service

// Mock the API service functions
jest.mock('@/app/lib/api/user', () => ({
  getUserProfile: jest.fn(),
  updateUserProfile: jest.fn(),
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

describe('ProfilePage', () => {
  beforeEach(() => {
    // Reset mocks before each test
    (userService.getUserProfile as jest.Mock).mockClear();
    (userService.updateUserProfile as jest.Mock).mockClear();
  });

  test('renders loading state initially', () => {
    (userService.getUserProfile as jest.Mock).mockReturnValueOnce(new Promise(() => {})); // Never resolves
    render(<ProfilePage />);
    expect(screen.getByText('Loading profile...')).toBeInTheDocument();
  });

  test('renders user profile after successful API call', async () => {
    (userService.getUserProfile as jest.Mock).mockResolvedValueOnce(mockUserProfile);
    render(<ProfilePage />);

    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument();
      expect(screen.getByText('test@example.com')).toBeInTheDocument();
      const goalsPreElement = screen.getByText('Goals:').nextElementSibling;
      expect(JSON.parse(goalsPreElement?.textContent || '{}')).toEqual(mockUserProfile.goals);

      const preferencesPreElement = screen.getByText('Preferences:').nextElementSibling;
      expect(JSON.parse(preferencesPreElement?.textContent || '{}')).toEqual(mockUserProfile.preferences);
      expect(screen.getByText('dumbbells, barbell')).toBeInTheDocument();
      expect(screen.getByText('none')).toBeInTheDocument();
      expect(screen.getByText('metric')).toBeInTheDocument();
    });

    expect(screen.getByRole('button', { name: /edit profile/i })).toBeInTheDocument();
  });

  test('renders error message if API call fails', async () => {
    const errorMessage = 'Failed to fetch profile';
    (userService.getUserProfile as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));
    render(<ProfilePage />);

    await waitFor(() => {
      expect(screen.getByText(`Error: ${errorMessage}`)).toBeInTheDocument();
    });
  });

  test('switches to editing mode when Edit Profile button is clicked', async () => {
    (userService.getUserProfile as jest.Mock).mockResolvedValueOnce(mockUserProfile);
    render(<ProfilePage />);

    await waitFor(() => {
      fireEvent.click(screen.getByRole('button', { name: /edit profile/i }));
    });

    expect(screen.getByDisplayValue('Test User')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /save changes/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  test('updates user profile on form submission', async () => {
    (userService.getUserProfile as jest.Mock).mockResolvedValueOnce(mockUserProfile);
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
    await waitFor(() => fireEvent.click(screen.getByRole('button', { name: /edit profile/i })));

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: updatedName } });
    fireEvent.change(screen.getByLabelText(/units/i), { target: { value: updatedUnits } });
    fireEvent.change(screen.getByLabelText(/goals \(json\)/i), { target: { value: JSON.stringify(updatedGoals) } });


    fireEvent.click(screen.getByRole('button', { name: /save changes/i }));

    await waitFor(() => {
      expect(userService.updateUserProfile).toHaveBeenCalledWith({
        ...mockUserProfile,
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
    (userService.getUserProfile as jest.Mock).mockResolvedValueOnce(mockUserProfile);
    render(<ProfilePage />);
    await waitFor(() => fireEvent.click(screen.getByRole('button', { name: /edit profile/i })));

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Temporary Name' } });
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));

    await waitFor(() => {
      expect(screen.getByText(mockUserProfile.name)).toBeInTheDocument();
      expect(screen.queryByDisplayValue('Temporary Name')).not.toBeInTheDocument();
    });
  });
});
