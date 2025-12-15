// apps/web/src/app/settings/profile/__tests__/edit-profile.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import EditProfile from '../edit-profile';
import { useProfileStore } from '@/store/profileStore';
import { createClient } from '@/lib/supabase/client';
import { UserProfile } from '@/lib/types';
import { useAuthStore } from '@/store/auth'; // Import useAuthStore
import { api } from '@/lib/api'; // Import api


const mockSaveProfile = jest.fn();
const mockCancelEditing = jest.fn();

let mockProfileState: any; // Make this mutable

// Mock useProfileStore
jest.mock('@/store/profileStore', () => ({
  useProfileStore: jest.fn((selector?: (state: any) => any) => {
    if (selector) {
      return selector(mockProfileState);
    }
    return mockProfileState;
  }),
}));

// Mock useAuthStore
const mockSession = { access_token: 'mock_access_token', user: { id: 'user123', email: 'test@example.com' } };
const mockSetSession = jest.fn();
const mockUseAuthStore = jest.fn(() => ({ session: mockSession, setSession: mockSetSession }));
jest.mock('@/store/auth', () => ({
  useAuthStore: mockUseAuthStore,
}));

// Mock api
const mockApiGet = jest.fn();
jest.mock('@/lib/api', () => ({
  api: {
    get: mockApiGet,
  },
}));

// Mock Supabase client
const mockUpdateUser = jest.fn();
const mockGetUser = jest.fn();
const mockGetSession = jest.fn();
jest.mock('@/lib/supabase/client', () => ({
  createClient: jest.fn(() => ({
    auth: {
      updateUser: mockUpdateUser,
      getUser: mockGetUser,
      getSession: mockGetSession,
    },
  })),
}));

// Mock Formik



let mockFormikContextInstance: any; // Declare mockFormikContextInstance globally




describe('EditProfile', () => {
  const initialProfileData: UserProfile = {
    email: 'test@example.com',
    unit_preference: 'kg',
    primary_goal: 'Build Muscle',
    training_frequency: 4,
    training_duration: 60,
    injuries_limitations: 'None',
    equipment: ['Dumbbells', 'Bench'],
  };

  beforeEach(() => {
    jest.clearAllMocks();

    mockProfileState = {
      tempUserData: { ...initialProfileData },
      saveProfile: mockSaveProfile,
      cancelEditing: mockCancelEditing,
    };
  });

  it('renders form fields with initial data from the store', () => {
    render(<EditProfile />);

    expect(screen.getByLabelText(/email/i)).toHaveValue(initialProfileData.email);
    expect(screen.getByLabelText(/unit preference/i)).toHaveValue(initialProfileData.unit_preference);
    expect(screen.getByLabelText(/primary goal/i)).toHaveValue(initialProfileData.primary_goal);
    expect(screen.getByLabelText(/training frequency/i)).toHaveValue(initialProfileData.training_frequency);
    expect(screen.getByLabelText(/training duration/i)).toHaveValue(initialProfileData.training_duration);
    expect(screen.getByLabelText(/injuries\/limitations/i)).toHaveValue(initialProfileData.injuries_limitations);
    expect(screen.getByLabelText(/equipment/i)).toHaveValue(initialProfileData.equipment.join(', '));
  });

  it('updates form values on user input', async () => {
    render(<EditProfile />);

    const primaryGoalInput = screen.getByLabelText(/primary goal/i);
    fireEvent.change(primaryGoalInput, { target: { value: 'Lose Weight' } });
    
    await waitFor(() => {
        expect(primaryGoalInput).toHaveValue('Lose Weight');
    });

    const frequencyInput = screen.getByLabelText(/training frequency/i);
    fireEvent.change(frequencyInput, { target: { value: '3' } });

    await waitFor(() => {
        expect(frequencyInput).toHaveValue(3);
    });
  });

  it('calls saveProfile with correct data on successful form submission', async () => {
    mockSaveProfile.mockResolvedValue({ success: true });
    render(<EditProfile />);

    // Modify a field to ensure we're sending updated data
    const primaryGoalInput = screen.getByLabelText(/primary goal/i);
    fireEvent.change(primaryGoalInput, { target: { value: 'Improve Endurance' } });
    
    const equipmentInput = screen.getByLabelText(/equipment/i);
    fireEvent.change(equipmentInput, { target: { value: 'Kettlebell, Jump Rope' } });

    const saveButton = screen.getByRole('button', { name: /save changes/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockSaveProfile).toHaveBeenCalledTimes(1);
      expect(mockSaveProfile).toHaveBeenCalledWith({
        email: initialProfileData.email,
        unit_preference: initialProfileData.unit_preference,
        primary_goal: 'Improve Endurance', // updated value
        training_frequency: initialProfileData.training_frequency,
        training_duration: initialProfileData.training_duration,
        injuries_limitations: initialProfileData.injuries_limitations,
        equipment: ['Kettlebell', 'Jump Rope'], // updated and parsed value
      });
    });

    // It should also call cancelEditing on success
    expect(mockCancelEditing).toHaveBeenCalledTimes(1);
  });

  it('displays an error message if saving fails', async () => {
    const errorMessage = 'Failed to save profile.';
    mockSaveProfile.mockRejectedValue(new Error(errorMessage));
    render(<EditProfile />);

    const saveButton = screen.getByRole('button', { name: /save changes/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText(`Error: ${errorMessage}`)).toBeInTheDocument();
    });
    
    expect(mockCancelEditing).not.toHaveBeenCalled();
  });

  it('disables the save button when form is invalid', async () => {
    render(<EditProfile />);
    const saveButton = screen.getByRole('button', { name: /save changes/i });

    // Sanity check: button is initially enabled
    expect(saveButton).not.toBeDisabled();

    // Invalidate the form
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'not-an-email' } });

    await waitFor(() => {
      expect(saveButton).toBeDisabled();
    });
    
    // Make it valid again
    fireEvent.change(emailInput, { target: { value: 'valid@email.com' } });

    await waitFor(() => {
        expect(saveButton).not.toBeDisabled();
    });
  });

  it('shows a loading spinner when form is submitting', async () => {
    // Make the save function hang indefinitely
    mockSaveProfile.mockImplementation(() => new Promise(() => {}));
    render(<EditProfile />);

    const saveButton = screen.getByRole('button', { name: /save changes/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(saveButton).toBeDisabled();
      expect(saveButton.querySelector('svg')).toBeInTheDocument(); // Check for the SVG spinner
    });
  });

  it('calls cancelEditing when cancel button is clicked', () => {
    render(<EditProfile />);
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButton);
    expect(mockCancelEditing).toHaveBeenCalledTimes(1);
  });

  it('displays a message if tempUserData is not available', () => {
    mockProfileState.tempUserData = null; // Set tempUserData to null before rendering
    render(<EditProfile />);
    expect(screen.getByText(/Authentication token missing/i)).toBeInTheDocument();
  });
});
