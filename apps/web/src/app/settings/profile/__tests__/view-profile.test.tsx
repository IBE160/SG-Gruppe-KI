// apps/web/src/app/settings/profile/__tests__/view-profile.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import ViewProfile from '../view-profile';
import { useProfileStore } from '@/store/profileStore';
import '@testing-library/jest-dom';

// Mock the zustand store
jest.mock('@/store/profileStore', () => ({
  useProfileStore: jest.fn(),
}));

const mockUserData = {
  id: '123',
  email: 'test@example.com',
  unit_preference: 'kg',
  primary_goal: 'Build Muscle',
  training_frequency: 4,
  training_duration: 60,
  injuries_limitations: 'None',
  equipment: ['Dumbbells', 'Bench'],
};

describe('ViewProfile', () => {
  it('displays loading message when currentUserData is null', () => {
    (useProfileStore as jest.Mock).mockReturnValue({
      currentUserData: null,
    });

    render(<ViewProfile />);
    expect(screen.getByText(/loading profile data/i)).toBeInTheDocument();
  });

  it('displays user profile data correctly when currentUserData is available', () => {
    (useProfileStore as jest.Mock).mockReturnValue({
      currentUserData: mockUserData,
    });

    render(<ViewProfile />);

    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByText('kg')).toBeInTheDocument();
    expect(screen.getByText('Build Muscle')).toBeInTheDocument();
    expect(screen.getByText('4 days/week')).toBeInTheDocument();
    expect(screen.getByText('60 min/session')).toBeInTheDocument();
    expect(screen.getByText('None')).toBeInTheDocument();
    expect(screen.getByText('Dumbbells, Bench')).toBeInTheDocument();
  });

  it('displays "Not set" or "None" for missing optional data', () => {
    const partialUserData = {
      id: '123',
      email: 'partial@example.com',
      unit_preference: 'lbs',
      // Missing primary_goal, training_frequency, training_duration, injuries_limitations, equipment
    };
    (useProfileStore as jest.Mock).mockReturnValue({
      currentUserData: partialUserData,
    });

    render(<ViewProfile />);

    expect(screen.getByText('partial@example.com')).toBeInTheDocument();
    expect(screen.getByText('lbs')).toBeInTheDocument();

    // Query for the text content within the paragraph that contains "Primary Goal:"
    // Then check if its combined text content contains "Not set"
    expect(screen.getByText(/Primary Goal:/i).textContent).toContain('Not set');
    expect(screen.getByText(/Training Frequency:/i).textContent).toContain('Not set');
    expect(screen.getByText(/Training Duration:/i).textContent).toContain('Not set');
    expect(screen.getByText(/Injuries\/Limitations:/i).textContent).toContain('None');
    expect(screen.getByText(/Equipment:/i).textContent).toContain('Not set');
  });
});