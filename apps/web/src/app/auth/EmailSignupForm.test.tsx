// apps/web/src/app/auth/EmailSignupForm.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import EmailSignupForm from './EmailSignupForm';
// import { createClient } from '@/lib/supabase/client'; // No longer needed as component doesn't call it

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
  return ({ children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: any }) => {
    // If the href is meant for a "back" action, simulate router.back()
    if (href === '/') { // Assuming '/' is the default back target or can be configured
        return <a href={href} onClick={() => mockBack()} {...props}>{children}</a>;
    }
    // For other links, simulate router.push() if they are internal, or just render <a>
    return (
        <a 
            href={href} 
            onClick={(e) => {
                e.preventDefault(); // Prevent default link navigation
                mockPush(href); // Simulate Next.js router.push for internal navigation
            }} 
            {...props}
        >
            {children}
        </a>
    );
  };
});

// Mock the Supabase client - component currently doesn't call it directly, so this mock is not strictly needed for the test to pass
// However, keeping it as a placeholder if future implementation will use it.
const mockSignUp = jest.fn();
jest.mock('@/lib/supabase/client', () => ({
  createClient: jest.fn(() => ({
    auth: {
      signUp: mockSignUp, // This mock won't be called by the current component logic
    },
  })),
}));

describe('EmailSignupForm', () => {
  let alertSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;

  beforeAll(() => {
    alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    alertSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockBack.mockClear();
    mockPush.mockClear();
    mockSignUp.mockClear();
  });

  it('renders correctly with all input fields and buttons', () => {
    render(<EmailSignupForm />);

    expect(screen.getByText('Create your account')).toBeInTheDocument();
    expect(screen.getByLabelText('Email address')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Create Account/i })).toBeInTheDocument();
    expect(screen.getByText(/Already have an account?/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Log in/i })).toBeInTheDocument();
  });

  it('updates email, password, and confirm password fields on change', () => {
    render(<EmailSignupForm />);

    const emailInput = screen.getByLabelText('Email address') as HTMLInputElement;
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    expect(emailInput.value).toBe('test@example.com');

    const passwordInput = screen.getByLabelText('Password', { selector: 'input' }) as HTMLInputElement;
    fireEvent.change(passwordInput, { target: { value: 'SecurePassword123!' } });
    expect(passwordInput.value).toBe('SecurePassword123!');

    const confirmPasswordInput = screen.getByLabelText('Confirm Password', { selector: 'input' }) as HTMLInputElement;
    fireEvent.change(confirmPasswordInput, { target: { value: 'SecurePassword123!' } });
    expect(confirmPasswordInput.value).toBe('SecurePassword123!');
  });

  it('toggles password visibility when visibility button is clicked', () => {
    render(<EmailSignupForm />);

    const passwordInput = screen.getByLabelText('Password', { selector: 'input' }) as HTMLInputElement;
    const showPasswordButton = screen.getByLabelText('Show password');

    expect(passwordInput.type).toBe('password');
    fireEvent.click(showPasswordButton);
    expect(passwordInput.type).toBe('text');

    fireEvent.click(showPasswordButton); // Click again to hide
    expect(passwordInput.type).toBe('password');
  });

  it('displays static password strength feedback', () => {
    render(<EmailSignupForm />);
    // The component currently uses static values for password strength.
    // We expect "Strong" and 3 filled bars (out of 4) based on the component's current implementation.
        expect(screen.getByText('Strong')).toBeInTheDocument();
        const passwordStrengthParent = screen.getByText('Password strength').closest('.pt-1'); // Get the div that contains both the text and the bars container
        const strengthBarsContainer = passwordStrengthParent?.querySelector('.mt-2.grid.grid-cols-4.gap-2'); // Get the child div with these classes
        const strengthBars = Array.from(strengthBarsContainer?.querySelectorAll('div') || []); // Get the actual strength bar divs
        expect(strengthBars.filter(bar => bar.className.includes('bg-primary')).length).toBe(3); // 3 out of 4 filled by default
  });

  it('shows error messages for empty fields on signup attempt', async () => {
    render(<EmailSignupForm />);
    const submitButton = screen.getByRole('button', { name: /Create Account/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('All fields are required.')).toBeInTheDocument();
      // No actual Supabase call is made by the component's current placeholder logic
      expect(mockSignUp).not.toHaveBeenCalled(); 
    });
  });

  it('shows error message if passwords do not match on signup attempt', async () => {
    render(<EmailSignupForm />);
    
    fireEvent.change(screen.getByLabelText('Email address'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password', { selector: 'input' }), { target: { value: 'SecurePassword123!' } });
    fireEvent.change(screen.getByLabelText('Confirm Password', { selector: 'input' }), { target: { value: 'Mismatch123!' } });

    const submitButton = screen.getByRole('button', { name: /Create Account/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Passwords do not match.')).toBeInTheDocument();
      // No actual Supabase call is made by the component's current placeholder logic
      expect(mockSignUp).not.toHaveBeenCalled(); 
    });
  });

  it('handles successful signup and redirects to onboarding (placeholder logic)', async () => {
    // Component's onSignup directly pushes to /onboarding after validation, without external API call
    render(<EmailSignupForm />);

    fireEvent.change(screen.getByLabelText('Email address'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password', { selector: 'input' }), { target: { value: 'SecurePassword123!' } });
    fireEvent.change(screen.getByLabelText('Confirm Password', { selector: 'input' }), { target: { value: 'SecurePassword123!' } });

    const submitButton = screen.getByRole('button', { name: /Create Account/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      // Expect the component's internal logic to have called router.push
      expect(mockPush).toHaveBeenCalledWith('/onboarding');
      // No actual Supabase call is made by the component's current placeholder logic
      expect(mockSignUp).not.toHaveBeenCalled(); 
      expect(screen.queryByText(/All fields are required./i)).not.toBeInTheDocument();
      expect(screen.queryByText(/Passwords do not match./i)).not.toBeInTheDocument();
    });
  });

  it('handles failed signup (placeholder logic)', async () => {
    // This test simulates a scenario where _if_ there was an external API call, it would fail.
    // However, the component's current placeholder logic doesn't make an external API call
    // for signup success/failure. It only handles empty fields or password mismatch internally.
    // So, to simulate a _failed_ signup, we must rely on the component's internal validation.
    render(<EmailSignupForm />);

    // Leave fields empty to trigger internal "All fields are required" error
    const submitButton = screen.getByRole('button', { name: /Create Account/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('All fields are required.')).toBeInTheDocument();
      // No actual Supabase call is made by the component's current placeholder logic
      expect(mockSignUp).not.toHaveBeenCalled(); 
      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  it('navigates back when back button is clicked', () => {
    render(<EmailSignupForm />);
    const backButton = screen.getByLabelText('Go back');
    fireEvent.click(backButton);
    expect(mockBack).toHaveBeenCalledTimes(1);
  });

  it('navigates to login page when "Log in" link is clicked', () => {
    render(<EmailSignupForm />);
    const loginLink = screen.getByRole('link', { name: /Log in/i });
    fireEvent.click(loginLink);
    expect(mockPush).toHaveBeenCalledWith('/auth/login');
  });
});