// apps/web/src/app/settings/profile/__tests__/profile-content.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ProfileContent from '../profile-content';
import { useProfileStore } from '@/store/profileStore';
import '@testing-library/jest-dom';

// Mock the zustand store
jest.mock('@/store/profileStore', () => ({
  useProfileStore: jest.fn(),
}));

// Mock child components
jest.mock('@/app/settings/profile/view-profile', () => {
  return jest.fn(() => <div>Mock ViewProfile Component</div>);
});
jest.mock('@/app/settings/profile/edit-profile', () => {
  return jest.fn(() => <div>Mock EditProfile Component</div>);
});

const mockUserData = {
  id: 'user123',
  email: 'test@example.com',
  unit_preference: 'kg',
};

describe('ProfileContent', () => {
  let startEditing: jest.Mock;

  beforeEach(() => {
    startEditing = jest.fn();
    (useProfileStore as jest.Mock).mockReturnValue({
      isEditing: false,
      currentUserData: mockUserData,
      startEditing,
    });
  });

  it('renders ViewProfile and Edit button when not editing', () => {
    render(<ProfileContent />);
    expect(screen.getByText('Mock ViewProfile Component')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /edit profile/i })).toBeInTheDocument();
    expect(screen.queryByText('Mock EditProfile Component')).not.toBeInTheDocument();
  });

  it('renders EditProfile when isEditing is true', () => {
    (useProfileStore as jest.Mock).mockReturnValue({
      isEditing: true,
      currentUserData: mockUserData,
      startEditing,
    });
    render(<ProfileContent />);
    expect(screen.getByText('Mock EditProfile Component')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /edit profile/i })).not.toBeInTheDocument();
    expect(screen.queryByText('Mock ViewProfile Component')).not.toBeInTheDocument();
  });

  it('calls startEditing with currentUserData when Edit Profile button is clicked', () => {
    render(<ProfileContent />);
    fireEvent.click(screen.getByRole('button', { name: /edit profile/i }));
    expect(startEditing).toHaveBeenCalledWith(mockUserData);
  });

  it('does not render Edit button if no currentUserData', () => {
    (useProfileStore as jest.Mock).mockReturnValue({
      isEditing: false,
      currentUserData: null,
      startEditing,
    });
    render(<ProfileContent />);
    expect(screen.queryByRole('button', { name: /edit profile/i })).not.toBeInTheDocument();
  });
});
