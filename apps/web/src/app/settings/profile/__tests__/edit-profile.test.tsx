import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EditProfile from '../edit-profile';
import { useProfileStore } from '../../../../store/profileStore';
import { act } from 'react-dom/test-utils';

// Mock lucide-react icon to avoid actual icon rendering issues in tests
jest.mock('lucide-react', () => ({
  ChevronLeft: () => <svg data-testid="chevron-left" />,
}));

const mockUserProfile = {
  id: 'user-123',
  email: 'test@example.com',
  unit_preference: 'kg',
  primary_goal: 'Build Muscle',
  training_frequency: 4,
  training_duration: 60,
  injuries_limitations: 'Mild knee pain',
  equipment: ['Dumbbells', 'Barbell'],
};

describe('EditProfile', () => {
  beforeEach(() => {
    // Reset the store and set a mock profile and temp data before each test
    act(() => {
      useProfileStore.getState().resetState();
      useProfileStore.getState().setProfile(mockUserProfile);
      useProfileStore.getState().startEditing(); // Initialize tempProfileData
      // Ensure tempProfileData is explicitly set with a valid initial state for all tests
      useProfileStore.getState().updateTempProfileData(mockUserProfile); 
    });
  });

  it('renders correctly with tempProfileData', () => {
    render(<EditProfile />);

    expect(screen.getByText('Edit Profile')).toBeInTheDocument();
    expect(screen.getByLabelText('Email:')).toHaveValue(mockUserProfile.email);
    expect(screen.getByLabelText('Unit Preference:')).toHaveValue(mockUserProfile.unit_preference);
    expect(screen.getByLabelText('Primary Goal:')).toHaveValue(mockUserProfile.primary_goal);
    expect(screen.getByLabelText('Training Frequency (days/week):')).toHaveValue(mockUserProfile.training_frequency);
    expect(screen.getByLabelText('Session Duration (min):')).toHaveValue(mockUserProfile.training_duration);
    expect(screen.getByLabelText('Injuries/Limitations:')).toHaveValue(mockUserProfile.injuries_limitations);
    expect(screen.getByLabelText('List your equipment (comma separated):')).toHaveValue(mockUserProfile.equipment.join(', '));
    expect(screen.getByRole('button', { name: 'Save Changes' })).toBeInTheDocument();
  });

  it('calls updateTempProfileData on input change', () => {
    const updateTempProfileDataMock = jest.fn();
    act(() => {
      useProfileStore.getState().updateTempProfileData = updateTempProfileDataMock;
    });

    render(<EditProfile />);
    const primaryGoalInput = screen.getByLabelText('Primary Goal:');
    fireEvent.change(primaryGoalInput, { target: { name: 'primary_goal', value: 'Lose Weight' } });
    expect(updateTempProfileDataMock).toHaveBeenCalledWith({ primary_goal: 'Lose Weight' });
  });

  it('displays validation errors for required fields', async () => {
    render(<EditProfile />);

    const primaryGoalInput = screen.getByLabelText('Primary Goal:');
    fireEvent.change(primaryGoalInput, { target: { name: 'primary_goal', value: '' } });

    const saveButton = screen.getByRole('button', { name: 'Save Changes' });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText('Primary goal is required.')).toBeInTheDocument();
    });
  });

  it('displays validation errors for non-positive numbers', async () => {
    render(<EditProfile />);

    const trainingFrequencyInput = screen.getByLabelText('Training Frequency (days/week):');
    fireEvent.change(trainingFrequencyInput, { target: { name: 'training_frequency', value: '0' } });

    const trainingDurationInput = screen.getByLabelText('Session Duration (min):');
    fireEvent.change(trainingDurationInput, { target: { name: 'training_duration', value: '-10' } });

    const saveButton = screen.getByRole('button', { name: 'Save Changes' });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText('Training frequency must be a positive number.')).toBeInTheDocument();
      expect(screen.getByText('Session duration must be a positive number.')).toBeInTheDocument();
    });
  });


  it('calls cancelEditing when the back button is clicked', () => {
    const cancelEditingMock = jest.fn();
    act(() => {
      useProfileStore.getState().cancelEditing = cancelEditingMock;
    });

    render(<EditProfile />);
    fireEvent.click(screen.getByTestId('chevron-left')); // Click the mock ChevronLeft icon
    expect(cancelEditingMock).toHaveBeenCalledTimes(1);
  });

  it('calls saveChanges with updated profile data on successful validation', async () => {
    const saveChangesMock = jest.fn();
    act(() => {
      useProfileStore.getState().saveChanges = saveChangesMock;
      // No need to call updateTempProfileData here, the test already sets valid values
      // If we want to change values, we should do it via fireEvent.change as below
    });

    render(<EditProfile />);

    // Change some values via user interaction
    const unitPreferenceSelect = screen.getByLabelText('Unit Preference:');
    fireEvent.change(unitPreferenceSelect, { target: { name: 'unit_preference', value: 'lbs' } });

    const primaryGoalInput = screen.getByLabelText('Primary Goal:');
    fireEvent.change(primaryGoalInput, { target: { name: 'primary_goal', value: 'Maintain Fitness' } });

    fireEvent.click(screen.getByRole('button', { name: 'Save Changes' }));

    const expectedUpdatedProfile = {
      ...mockUserProfile,
      // The changes from fireEvent.change should be reflected in the store's tempProfileData
      unit_preference: 'lbs',
      primary_goal: 'Maintain Fitness',
    };
    
    // We need to ensure that the userProfile in the store is updated with the tempProfileData
    // The saveChanges mock expects the *result* of the save, which is the merged profile
    // So the mock should be called with the fully merged profile as the argument
    await waitFor(() => {
      expect(saveChangesMock).toHaveBeenCalledTimes(1);
      // The argument passed to saveChanges is the merged userProfile + tempProfileData
      // So we need to compute that manually here for the assertion
      const updatedProfilePassedToSave = { ...mockUserProfile, ...useProfileStore.getState().tempProfileData };
      expect(saveChangesMock).toHaveBeenCalledWith(updatedProfilePassedToSave);
    });
  });
});