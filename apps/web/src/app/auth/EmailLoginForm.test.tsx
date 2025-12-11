// apps/web/src/app/auth/EmailLoginForm.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import EmailLoginForm from './EmailLoginForm';

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

describe('EmailLoginForm', () => {
  // Clear mocks before each test to ensure isolation
  beforeEach(() => {
    mockBack.mockClear();
    mockPush.mockClear();
  });

  it('renders correctly with all input fields and buttons', () => {
    render(<EmailLoginForm />);

    expect(screen.getByText('Welcome back!')).toBeInTheDocument();
    expect(screen.getByLabelText('Email address')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Log In/i })).toBeInTheDocument();
    expect(screen.getByText(/Forgot Password?/i)).toBeInTheDocument();
    expect(screen.getByText(/Don't have an account?/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Sign up/i })).toBeInTheDocument();
  });

  it('updates email and password fields on change', () => {
    render(<EmailLoginForm />);

    const emailInput = screen.getByLabelText(/Email address/i) as HTMLInputElement;
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    expect(emailInput.value).toBe('test@example.com');

    const passwordInput = screen.getByLabelText(/Password/i) as HTMLInputElement;
    fireEvent.change(passwordInput, { target: { value: 'SecurePassword123!' } });
    expect(passwordInput.value).toBe('SecurePassword123!');
  });

  it('toggles password visibility when visibility button is clicked', () => {
    render(<EmailLoginForm />);

    const passwordInput = screen.getByLabelText(/Password/i) as HTMLInputElement;
    const visibilityOffButton = screen.getByRole('button', { name: 'visibility_off' });

    expect(passwordInput.type).toBe('password');
    fireEvent.click(visibilityOffButton);
    expect(passwordInput.type).toBe('text');
    const visibilityOnButton = screen.getByRole('button', { name: 'visibility' });
    fireEvent.click(visibilityOnButton);
    expect(passwordInput.type).toBe('password');
  });

  it('calls handleSubmit on form submission', async () => {
    const consoleSpy = jest.spyOn(console, 'log');
    render(<EmailLoginForm />);

    const emailInput = screen.getByLabelText(/Email address/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const submitButton = screen.getByRole('button', { name: /Log In/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'SecurePassword123!' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Login attempted with:', {
        email: 'test@example.com',
        password: 'SecurePassword123!',
      });
    });
    consoleSpy.mockRestore();
  });

  it('navigates back when back button is clicked', () => {
    render(<EmailLoginForm />);

    const backButton = screen.getByRole('button', { name: 'arrow_back_ios_new' });
    fireEvent.click(backButton);
    expect(mockBack).toHaveBeenCalledTimes(1);
  });

  it('navigates to signup page when "Sign up" link is clicked', () => {
    render(<EmailLoginForm />);
    const signupLink = screen.getByRole('link', { name: /Sign up/i });
    expect(signupLink).toHaveAttribute('href', '/auth/signup');
  });
});