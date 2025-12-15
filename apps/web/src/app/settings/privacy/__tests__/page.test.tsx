
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import PrivacyAndAccountPage from '../page';

// Mock next/navigation
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock signOut function
jest.mock('@/lib/supabaseClient', () => ({
  signOut: jest.fn(),
}));
import { signOut } from '@/lib/supabaseClient';

describe('PrivacyAndAccountPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with all sections and buttons', () => {
    render(<PrivacyAndAccountPage />);

    // Check for main heading
    expect(screen.getByRole('heading', { name: /Privacy & Account/i })).toBeInTheDocument();

    // Check for Privacy section items
    expect(screen.getByText(/Consent Settings/i)).toBeInTheDocument();
    expect(screen.getByText(/Revoke Integrations/i)).toBeInTheDocument();

    // Check for Account Management section items
    expect(screen.getByText(/User Profile Management/i)).toBeInTheDocument();
    expect(screen.getByText(/Export My Data/i)).toBeInTheDocument();
    expect(screen.getByText(/Delete My Account/i)).toBeInTheDocument();

    // Check for Logout button
    expect(screen.getByRole('button', { name: /Logout/i })).toBeInTheDocument();

    // Check for bottom navigation items
    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/Workout/i)).toBeInTheDocument();
    expect(screen.getByText(/History/i)).toBeInTheDocument();
    expect(screen.getByText(/Settings/i)).toBeInTheDocument();
  });

  it('navigates to export-data page when "Export My Data" is clicked', () => {
    render(<PrivacyAndAccountPage />);
    const exportDataLink = screen.getByRole('link', { name: /Export My Data/i });
    expect(exportDataLink).toHaveAttribute('href', '/settings/privacy/export-data');
  });

  it('navigates to delete-account page when "Delete My Account" is clicked', () => {
    render(<PrivacyAndAccountPage />);
    const deleteAccountLink = screen.getByRole('link', { name: /Delete My Account/i });
    expect(deleteAccountLink).toHaveAttribute('href', '/settings/privacy/delete-account');
  });

  it('calls signOut and redirects to /login on successful logout', async () => {
    (signOut as jest.Mock).mockResolvedValue(true);
    render(<PrivacyAndAccountPage />);

    const logoutButton = screen.getByRole('button', { name: /Logout/i });
    fireEvent.click(logoutButton);

    await waitFor(() => {
      expect(signOut).toHaveBeenCalledTimes(1);
      expect(mockPush).toHaveBeenCalledWith('/login');
    });
  });

  it('logs error if signOut fails', async () => {
    (signOut as jest.Mock).mockResolvedValue(false);
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(<PrivacyAndAccountPage />);

    const logoutButton = screen.getByRole('button', { name: /Logout/i });
    fireEvent.click(logoutButton);

    await waitFor(() => {
      expect(signOut).toHaveBeenCalledTimes(1);
      expect(mockPush).not.toHaveBeenCalled(); // Should not redirect on failure
      expect(consoleErrorSpy).toHaveBeenCalledWith('Logout failed');
    });

    consoleErrorSpy.mockRestore();
  });
});
