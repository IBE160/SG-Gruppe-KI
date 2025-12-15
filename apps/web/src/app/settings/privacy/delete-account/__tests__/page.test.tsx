
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import DeleteAccountPage, { DeleteScreen } from '../page'; // Import DeleteScreen enum

// Mock next/navigation
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock API client
const mockDeleteAccount = jest.fn();
jest.mock('@/lib/api', () => ({
  api: {
    deleteAccount: (token: string) => mockDeleteAccount(token),
  },
}));

// Mock signOut function
const mockSignOut = jest.fn();
jest.mock('@/lib/supabaseClient', () => ({
  signOut: () => mockSignOut(),
}));

describe('DeleteAccountPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test initial render (Screen 1: WARNING)
  it('renders Screen 1 (warning) initially', () => {
    render(<DeleteAccountPage />);
    expect(screen.getByRole('heading', { name: /Permanently Delete Your Account?/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Continue to Delete/i })).toBeInTheDocument();
  });

  // Test navigation from Screen 1 to Screen 2
  it('transitions to Screen 2 (confirmation) when "Continue to Delete" is clicked', () => {
    render(<DeleteAccountPage />);
    fireEvent.click(screen.getByRole('button', { name: /Continue to Delete/i }));
    expect(screen.getByRole('heading', { name: /Confirm Account Deletion/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/DELETE/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Re-enter your password for security/i)).toBeInTheDocument();
  });

  // Test confirmation button enablement
  it('disables "Permanently Delete My Account" button initially on Screen 2', async () => {
    render(<DeleteAccountPage />);
    fireEvent.click(screen.getByRole('button', { name: /Continue to Delete/i })); // Go to Screen 2
    const deleteButton = screen.getByRole('button', { name: /Permanently Delete My Account/i });
    expect(deleteButton).toBeDisabled();
  });

  it('enables "Permanently Delete My Account" button when "DELETE" and password are typed', async () => {
    render(<DeleteAccountPage />);
    fireEvent.click(screen.getByRole('button', { name: /Continue to Delete/i })); // Go to Screen 2

    const confirmInput = screen.getByPlaceholderText(/DELETE/i);
    const passwordInput = screen.getByPlaceholderText(/Re-enter your password for security/i);
    const deleteButton = screen.getByRole('button', { name: /Permanently Delete My Account/i });

    fireEvent.change(confirmInput, { target: { value: 'DELETE' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    await waitFor(() => {
      expect(deleteButton).toBeEnabled();
    });
  });

  it('keeps "Permanently Delete My Account" button disabled if confirmation text is wrong', async () => {
    render(<DeleteAccountPage />);
    fireEvent.click(screen.getByRole('button', { name: /Continue to Delete/i })); // Go to Screen 2

    const confirmInput = screen.getByPlaceholderText(/DELETE/i);
    const passwordInput = screen.getByPlaceholderText(/Re-enter your password for security/i);
    const deleteButton = screen.getByRole('button', { name: /Permanently Delete My Account/i });

    fireEvent.change(confirmInput, { target: { value: 'DELET' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    await waitFor(() => {
      expect(deleteButton).toBeDisabled();
    });
  });

  // Test successful account deletion
  it('calls deleteAccount and transitions to Screen 3 on success', async () => {
    mockDeleteAccount.mockResolvedValue({ data: { message: 'Deletion initiated' } });
    mockSignOut.mockResolvedValue(true); // Sign out after initiation

    render(<DeleteAccountPage />);
    fireEvent.click(screen.getByRole('button', { name: /Continue to Delete/i }));

    fireEvent.change(screen.getByPlaceholderText(/DELETE/i), { target: { value: 'DELETE' } });
    fireEvent.change(screen.getByPlaceholderText(/Re-enter your password for security/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /Permanently Delete My Account/i }));

    await waitFor(() => {
      expect(mockDeleteAccount).toHaveBeenCalledTimes(1);
      expect(mockDeleteAccount).toHaveBeenCalledWith('YOUR_AUTH_TOKEN_HERE');
      expect(screen.getByRole('heading', { name: /Deletion Process Has Begun/i })).toBeInTheDocument();
    });

    // Simulate clicking "Okay, Log Me Out"
    fireEvent.click(screen.getByRole('button', { name: /Okay, Log Me Out/i }));
    await waitFor(() => {
        expect(mockSignOut).toHaveBeenCalledTimes(1);
        expect(screen.getByRole('heading', { name: /Deletion Initiated/i })).toBeInTheDocument(); // Screen 4
        expect(screen.getByRole('button', { name: /Return to Login/i })).toBeInTheDocument(); // Screen 4 button
    });
  });

  // Test failed account deletion
  it('displays an error message if account deletion fails', async () => {
    mockDeleteAccount.mockResolvedValue({ error: { message: 'Failed to delete account' } });
    console.error = jest.fn(); // Mock console.error to prevent test output pollution

    render(<DeleteAccountPage />);
    fireEvent.click(screen.getByRole('button', { name: /Continue to Delete/i }));

    fireEvent.change(screen.getByPlaceholderText(/DELETE/i), { target: { value: 'DELETE' } });
    fireEvent.change(screen.getByPlaceholderText(/Re-enter your password for security/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /Permanently Delete My Account/i }));

    await waitFor(() => {
      expect(mockDeleteAccount).toHaveBeenCalledTimes(1);
      expect(screen.getByText(/Failed to delete account/i)).toBeInTheDocument();
      expect(screen.queryByRole('heading', { name: /Deletion Process Has Begun/i })).not.toBeInTheDocument(); // Should not transition
    });
  });


  // Test navigation to login from final screen
  it('redirects to /login when "Return to Login" is clicked on Screen 4', async () => {
    mockDeleteAccount.mockResolvedValue({ data: { message: 'Deletion initiated' } });
    mockSignOut.mockResolvedValue(true);

    render(<DeleteAccountPage />);
    fireEvent.click(screen.getByRole('button', { name: /Continue to Delete/i })); // Screen 1 to 2
    fireEvent.change(screen.getByPlaceholderText(/DELETE/i), { target: { value: 'DELETE' } });
    fireEvent.change(screen.getByPlaceholderText(/Re-enter your password for security/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /Permanently Delete My Account/i })); // Screen 2 to 3
    await waitFor(() => expect(screen.getByRole('heading', { name: /Deletion Process Has Begun/i })).toBeInTheDocument());

    fireEvent.click(screen.getByRole('button', { name: /Okay, Log Me Out/i })); // Screen 3 to 4
    await waitFor(() => expect(screen.getByRole('heading', { name: /Deletion Initiated/i })).toBeInTheDocument());

    fireEvent.click(screen.getByRole('button', { name: /Return to Login/i }));
    expect(mockPush).toHaveBeenCalledWith('/login');
  });

  it('toggles password visibility', async () => {
    render(<DeleteAccountPage />);
    fireEvent.click(screen.getByRole('button', { name: /Continue to Delete/i })); // Go to Screen 2

    const passwordInput = screen.getByPlaceholderText(/Re-enter your password for security/i) as HTMLInputElement;
    const toggleButton = screen.getByLabelText(/toggle password visibility/i);

    expect(passwordInput.type).toBe('password');

    fireEvent.click(toggleButton);
    expect(passwordInput.type).toBe('text');

    fireEvent.click(toggleButton);
    expect(passwordInput.type).toBe('password');
  });
});
