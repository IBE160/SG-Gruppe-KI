import React from 'react';
import { render, screen } from '@testing-library/react';
import ViewProfile from '../view-profile';
import { useProfileStore } from '../../../../store/profileStore';
import { act } from 'react-dom/test-utils'; // Or from 'react' if updated

// Mock Zustand store for testing
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

describe('ViewProfile', () => {
  beforeEach(() => {
    // Reset the store and set a mock profile before each test
    act(() => {
      useProfileStore.getState().resetState();
      useProfileStore.getState().setProfile(mockUserProfile);
    });
  });

  it('renders loading state when userProfile is null', () => {
    act(() => {
      useProfileStore.getState().setProfile(null);
    });
    render(<ViewProfile />);
    expect(screen.getByText('Loading profile data...')).toBeInTheDocument();
  });

  it('renders user profile information correctly', () => {
    render(<ViewProfile />);

    expect(screen.getByText('Your Profile')).toBeInTheDocument();
    expect(screen.getByText('Edit')).toBeInTheDocument();

    // Account Details
    expect(screen.getByText('Account Details')).toBeInTheDocument();
    expect(screen.getByText('Email:')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByText('Unit Preference:')).toBeInTheDocument();
    expect(screen.getByText('kg')).toBeInTheDocument();

    // Fitness Goals
    expect(screen.getByText('Fitness Goals')).toBeInTheDocument();
    expect(screen.getByText('Primary Goal:')).toBeInTheDocument();
    expect(screen.getByText('Build Muscle')).toBeInTheDocument();
    expect(screen.getByText('Training Frequency:')).toBeInTheDocument();
    expect(screen.getByText('4 days/week')).toBeInTheDocument();
    expect(screen.getByText('Session Duration:')).toBeInTheDocument();
    expect(screen.getByText('60 min')).toBeInTheDocument();
    expect(screen.getByText('Injuries/Limitations:')).toBeInTheDocument();
    expect(screen.getByText('Mild knee pain')).toBeInTheDocument();

    // Equipment
    expect(screen.getByText('Available Equipment')).toBeInTheDocument();
    expect(screen.getByText('Dumbbells')).toBeInTheDocument();
    expect(screen.getByText('Barbell')).toBeInTheDocument();
  });

  it('does not render fitness goals section if primary_goal is missing', () => {
    act(() => {
      useProfileStore.getState().setProfile({ ...mockUserProfile, primary_goal: undefined });
    });
    render(<ViewProfile />);
    expect(screen.queryByText('Fitness Goals')).not.toBeInTheDocument();
  });

  it('does not render equipment section if equipment array is empty', () => {
    act(() => {
      useProfileStore.getState().setProfile({ ...mockUserProfile, equipment: [] });
    });
    render(<ViewProfile />);
    expect(screen.queryByText('Available Equipment')).not.toBeInTheDocument();
  });

  it('calls startEditing when Edit button is clicked', () => {
    const startEditingMock = jest.fn();
    act(() => {
      useProfileStore.getState().startEditing = startEditingMock;
    });
    render(<ViewProfile />);
    screen.getByText('Edit').click();
    expect(startEditingMock).toHaveBeenCalledTimes(1);
  });
});