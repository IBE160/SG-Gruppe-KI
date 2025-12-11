// apps/web/src/app/auth/EmailSignupForm.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import EmailSignupForm from './EmailSignupForm';

// Mock the useRouter hook
const mockBack = jest.fn();
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    back: mockBack,
    push: mockPush,
  }),
}));

// Mock the Link component
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

// Mock the Supabase client
const mockSignUp = jest.fn();
const mockSignInWithPassword = jest.fn(); // Also mock for future potential tests if needed

// Use jest.mock with a factory function that returns the mock object
jest.mock('../../lib/supabaseClient', () => ({
  supabase: {
    auth: {
      signUp: mockSignUp,
      signInWithPassword: mockSignInWithPassword,
    },
  },
}));


describe('EmailSignupForm', () => {
  let alertSpy: jest.SpyInstance;

  beforeAll(() => {
    // Mock window.alert before all tests in this describe block
    alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterAll(() => {
    // Restore window.alert after all tests are done
    alertSpy.mockRestore();
  });

  // Clear mocks and reset before each test to ensure isolation
  beforeEach(() => {
    mockBack.mockClear();
    mockPush.mockClear();
    mockSignUp.mockClear();
    mockSignInWithPassword.mockClear();
    alertSpy.mockClear(); // Clear alert spy calls
  });

  it('renders correctly with all input fields and buttons', () => {
    render(<EmailSignupForm />);

    expect(screen.getByText('Create your account')).toBeInTheDocument();
    expect(screen.getByLabelText('Email address')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument(); // Specific query
    expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument(); // Specific query
    expect(screen.getByRole('button', { name: /Create Account/i })).toBeInTheDocument();
    expect(screen.getByText(/Already have an account/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Log in/i })).toBeInTheDocument();
  });

  it('updates email, password, and confirm password fields on change', () => {
    render(<EmailSignupForm />);

    const emailInput = screen.getByLabelText('Email address') as HTMLInputElement;
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    expect(emailInput.value).toBe('test@example.com');

    const passwordInput = screen.getByLabelText('Password') as HTMLInputElement;
    fireEvent.change(passwordInput, { target: { value: 'SecurePassword123!' } });
    expect(passwordInput.value).toBe('SecurePassword123!');

    const confirmPasswordInput = screen.getByLabelText('Confirm Password') as HTMLInputElement;
    fireEvent.change(confirmPasswordInput, { target: { value: 'SecurePassword123!' } });
    expect(confirmPasswordInput.value).toBe('SecurePassword123!');
  });

  it('toggles password visibility when visibility button is clicked', () => {
    render(<EmailSignupForm />);

    const passwordInput = screen.getByLabelText('Password') as HTMLInputElement;
    const visibilityOffButton = screen.getByRole('button', { name: 'visibility_off' });

    expect(passwordInput.type).toBe('password');
    fireEvent.click(visibilityOffButton);
    expect(passwordInput.type).toBe('text');
    const visibilityOnButton = screen.getByRole('button', { name: 'visibility' });
    fireEvent.click(visibilityOnButton);
    expect(passwordInput.type).toBe('password');
  });

  it('displays correct password strength feedback', () => {
    render(<EmailSignupForm />);

    const passwordInput = screen.getByLabelText('Password');
    const strengthText = screen.getByText('Password strength').nextSibling; // Directly target the sibling

    fireEvent.change(passwordInput, { target: { value: 'short' } }); // < 8 chars
    expect(strengthText).toHaveTextContent('Weak');

    fireEvent.change(passwordInput, { target: { value: 'Medium12' } }); // Length >=8, Uppercase, Lowercase, Number
    expect(strengthText).toHaveTextContent('Medium'); // Expected 3 criteria met

    fireEvent.change(passwordInput, { target: { value: 'StrongPassword123!' } }); // All 5 criteria met
    expect(strengthText).toHaveTextContent('Strong');
  });

  it('shows checkmark for matching confirm password', () => {
    render(<EmailSignupForm />);

    const passwordInput = screen.getByLabelText('Password');
    const confirmPasswordInput = screen.getByLabelText('Confirm Password');

    fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'Password123!' } });

    expect(screen.getByText('check_circle')).toBeInTheDocument();
  });

  it('displays email validation errors', () => {
    render(<EmailSignupForm />);
    const emailInput = screen.getByLabelText('Email address');
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.blur(emailInput); // Trigger validation on blur
    expect(screen.getByText('Please enter a valid email address.')).toBeInTheDocument();
  });

  it('displays password validation errors', () => {
    render(<EmailSignupForm />);
    const passwordInput = screen.getByLabelText('Password');

    fireEvent.change(passwordInput, { target: { value: 'short' } });
    fireEvent.blur(passwordInput);
    expect(screen.getByText('Password must be at least 8 characters long.')).toBeInTheDocument();

    fireEvent.change(passwordInput, { target: { value: 'Longenough1!' } }); // Missing lowercase
    fireEvent.blur(passwordInput);
    expect(screen.getByText('Password must contain at least one lowercase letter.')).toBeInTheDocument();

    fireEvent.change(passwordInput, { target: { value: 'longenoughA!' } }); // Missing number
    fireEvent.blur(passwordInput);
    expect(screen.getByText('Password must contain at least one number.')).toBeInTheDocument();
  });

  it('displays confirm password mismatch error', () => {
    render(<EmailSignupForm />);
    const passwordInput = screen.getByLabelText('Password');
    const confirmPasswordInput = screen.getByLabelText('Confirm Password');

    fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'DifferentPassword123!' } });
    fireEvent.blur(confirmPasswordInput);
    expect(screen.getByText('Passwords do not match.')).toBeInTheDocument();
  });

  it('disables submit button when form is invalid', () => {
    render(<EmailSignupForm />);
    expect(screen.getByRole('button', { name: /Create Account/i })).toBeDisabled();

    const emailInput = screen.getByLabelText('Email address');
    const passwordInput = screen.getByLabelText('Password');
    const confirmPasswordInput = screen.getByLabelText('Confirm Password');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'SecurePassword123!' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'SecurePassword123!' } });

    expect(screen.getByRole('button', { name: /Create Account/i })).not.toBeDisabled();

    fireEvent.change(passwordInput, { target: { value: 'short' } }); // Make form invalid
    expect(screen.getByRole('button', { name: /Create Account/i })).toBeDisabled();
  });


  it('handles successful signup', async () => {
    mockSignUp.mockResolvedValueOnce({ data: { user: { id: '123' } }, error: null });
    render(<EmailSignupForm />);

    const emailInput = screen.getByLabelText('Email address');
    const passwordInput = screen.getByLabelText('Password');
    const confirmPasswordInput = screen.getByLabelText('Confirm Password');
    const submitButton = screen.getByRole('button', { name: /Create Account/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'SecurePassword123!' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'SecurePassword123!' } });

    fireEvent.click(submitButton);

    expect(submitButton).toBeDisabled(); // Check loading state

    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalledWith({ email: 'test@example.com', password: 'SecurePassword123!' });
      expect(mockPush).toHaveBeenCalledWith('/onboarding-placeholder');
      expect(alertSpy).toHaveBeenCalledWith('Registration successful! Please check your email to confirm your account.');
      expect(screen.queryByText(/An unexpected error occurred/i)).not.toBeInTheDocument(); // No general error
    });
    expect(submitButton).not.toBeDisabled(); // Loading state ends
  });

  it('handles failed signup', async () => {
    mockSignUp.mockResolvedValueOnce({ data: { user: null }, error: { message: 'Signup failed' } });
    render(<EmailSignupForm />);

    const emailInput = screen.getByLabelText('Email address');
    const passwordInput = screen.getByLabelText('Password');
    const confirmPasswordInput = screen.getByLabelText('Confirm Password');
    const submitButton = screen.getByRole('button', { name: /Create Account/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'SecurePassword123!' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'SecurePassword123!' } });

    fireEvent.click(submitButton);

    expect(submitButton).toBeDisabled(); // Check loading state

    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalledWith({ email: 'test@example.com', password: 'SecurePassword123!' });
      expect(mockPush).not.toHaveBeenCalled();
      expect(screen.getByText('Signup failed')).toBeInTheDocument(); // General error displayed
    });
    expect(submitButton).not.toBeDisabled(); // Loading state ends
  });

  it('navigates back when back button is clicked', () => {
    render(<EmailSignupForm />);

    const backButton = screen.getByRole('button', { name: 'arrow_back_ios_new' });
    fireEvent.click(backButton);
    expect(mockBack).toHaveBeenCalledTimes(1);
  });

  it('navigates to login page when "Log in" link is clicked', () => {
    render(<EmailSignupForm />);
    const loginLink = screen.getByRole('link', { name: /Log in/i });
    expect(loginLink).toHaveAttribute('href', '/auth/login');
  });
});