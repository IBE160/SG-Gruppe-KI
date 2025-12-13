import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import WelcomeScreen from './WelcomeScreen';
import '@testing-library/jest-dom';
import { useRouter } from 'next/navigation';

// Mock the useRouter hook
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('WelcomeScreen', () => {
  const mockPush = jest.fn();
  const mockOnCreateAccount = jest.fn();
  const mockOnLogin = jest.fn();
  const mockOnGoogleAuth = jest.fn();
  const mockOnAppleAuth = jest.fn();
  const mockOnTermsOfService = jest.fn();
  const mockOnPrivacyPolicy = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    // Manually assign the mocked functions to the component's internal handlers
    // This is a workaround since directly mocking component methods isn't straightforward with default exports
    // In a real scenario, these handlers would be passed as props or directly testable via their effects.
    // For now, we'll test the button clicks and ensure console logs are called.
    global.console = {
        ...global.console,
        log: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with all main elements', () => {
    render(<WelcomeScreen />);

    expect(screen.getByText('Your Personal AI Trainer')).toBeInTheDocument();
    expect(screen.getByText('Smart, personalized workouts that adapt to you.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Create Account/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Log In/i })).toBeInTheDocument();
    expect(screen.getByText('Or continue with')).toBeInTheDocument();
    expect(screen.getByLabelText(/Google/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Apple/i)).toBeInTheDocument();
    expect(screen.getByText(/By continuing, you agree to our/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Terms of Service/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Privacy Policy/i })).toBeInTheDocument();
  });

  it('calls onCreateAccount when "Create Account" button is clicked', () => {
    render(<WelcomeScreen />);
    fireEvent.click(screen.getByRole('button', { name: /Create Account/i }));
    expect(mockPush).toHaveBeenCalledWith('/auth/signup');
  });

  it('calls onLogin when "Log In" button is clicked', () => {
    render(<WelcomeScreen />);
    fireEvent.click(screen.getByRole('button', { name: /Log In/i }));
    expect(mockPush).toHaveBeenCalledWith('/auth/login');
  });

  it('calls onGoogleAuth when Google button is clicked', () => {
    render(<WelcomeScreen />);
    fireEvent.click(screen.getByLabelText(/Google/i));
    expect(console.log).toHaveBeenCalledWith('Initiate Google OAuth');
  });

  it('calls onAppleAuth when Apple button is clicked', () => {
    render(<WelcomeScreen />);
    fireEvent.click(screen.getByLabelText(/Apple/i));
    expect(console.log).toHaveBeenCalledWith('Initiate Apple OAuth');
  });

  it('calls onTermsOfService when "Terms of Service" link is clicked', () => {
    render(<WelcomeScreen />);
    fireEvent.click(screen.getByRole('link', { name: /Terms of Service/i }));
    expect(console.log).toHaveBeenCalledWith('Navigate to Terms of Service');
  });

  it('calls onPrivacyPolicy when "Privacy Policy" link is clicked', () => {
    render(<WelcomeScreen />);
    fireEvent.click(screen.getByRole('link', { name: /Privacy Policy/i }));
    expect(console.log).toHaveBeenCalledWith('Navigate to Privacy Policy');
  });
});