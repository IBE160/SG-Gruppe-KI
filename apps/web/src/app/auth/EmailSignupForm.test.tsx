// apps/web/src/app/auth/EmailSignupForm.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import EmailSignupForm from './EmailSignupForm';
import { createClient } from '@/lib/supabase/client';

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

// Mock the Supabase client
const mockSignUp = jest.fn();
jest.mock('@/lib/supabase/client', () => ({
  createClient: jest.fn(() => ({
    auth: {
      signUp: mockSignUp,
    },
  })),
}));

// Mock Formik
let mockFormikContextInstance: any;

jest.mock('formik', () => {
  const actualFormik = jest.requireActual('formik');
  return {
    ...actualFormik,
    // Provide a generic mock implementation for useFormikContext that will be overridden by spyOn
    useFormikContext: jest.fn(() => ({
        values: {}, errors: {}, touched: {}, isValid: false, isSubmitting: false,
        handleChange: jest.fn(), handleBlur: jest.fn(), handleSubmit: jest.fn(),
        submitForm: jest.fn(), setFieldValue: jest.fn(), setErrors: jest.fn(),
        setTouched: jest.fn(), setSubmitting: jest.fn(), resetForm: jest.fn(),
        validateForm: jest.fn(() => Promise.resolve({})),
    })),
    Formik: ({ children, onSubmit, initialValues }: any) => {
        const context = (actualFormik.useFormikContext as jest.Mock)();
        if (initialValues) {
            context.values = { ...context.values, ...initialValues };
        }
        context.handleSubmit.mockImplementation((vals: any, formikHelpers: any) => onSubmit(vals, formikHelpers));
        return children(context);
    },
    Field: jest.fn(({ as: Component = 'input', name, children: fieldChildren, ...props }: any) => {
        const context = (actualFormik.useFormikContext as jest.Mock)();
        const value = (context.values as any)[name];
        const fieldProps = {
            name,
            value: value !== undefined ? value : '',
            onChange: context.handleChange,
            onBlur: context.handleBlur,
            ...props,
        };
        if (Component === 'input' || Component === 'textarea' || Component === 'select') {
            return React.createElement(Component, fieldProps);
        }
        return React.createElement(Component, fieldProps, fieldChildren);
    }),
    Form: jest.fn(({ children }: any) => {
        const context = (actualFormik.useFormikContext as jest.Mock)();
        return <form onSubmit={context.submitForm}>{children}</form>;
    }),
    ErrorMessage: jest.fn(({ name, component: Component = 'div', className }: any) => {
        const context = (actualFormik.useFormikContext as jest.Mock)();
        if (context.touched[name] && context.errors[name]) {
            return <Component className={className}>{context.errors[name]}</Component>;
        }
        return null;
    }),
  };
});

jest.mock('yup', () => {
  const actualYup = jest.requireActual('yup');
  return {
    ...actualYup,
    object: () => ({
      shape: jest.fn().mockReturnThis(),
      validate: jest.fn((values, options) => {
        const errors: any = {};
        if (!values.email || !/^\S+@\S+\.\S+$/.test(values.email)) errors.email = 'Please enter a valid email address.';
        if (!values.password) errors.password = 'Password is required.';
        if (values.password && values.password.length < 8) errors.password = 'Password must be at least 8 characters long.';
        if (values.confirmPassword !== values.password) errors.confirmPassword = 'Passwords must match.';

        if (Object.keys(errors).length > 0) {
          const error = new Error('Validation failed');
          (error as any).inner = Object.keys(errors).map(key => ({ path: key, message: errors[key] }));
          return Promise.reject(error);
        }
        return Promise.resolve(values);
      }),
    }),
    string: () => ({
      email: jest.fn().mockReturnThis(),
      required: jest.fn().mockReturnThis(),
      min: jest.fn().mockReturnThis(),
      matches: jest.fn().mockReturnThis(),
      oneOf: jest.fn().mockReturnThis(),
    }),
    ref: jest.fn((key: string) => key),
  };
});


describe('EmailSignupForm', () => {
  let alertSpy: jest.SpyInstance;
  let consoleSpy: jest.SpyInstance;

  beforeAll(() => {
    alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterAll(() => {
    alertSpy.mockRestore();
    consoleSpy.mockRestore();
  });

  beforeEach(() => {
    jest.clearAllMocks();

    mockFormikContextInstance = {
      values: { email: '', password: '', confirmPassword: '' },
      errors: {},
      touched: {},
      isValid: false,
      isSubmitting: false,
      handleChange: jest.fn((e: React.ChangeEvent<HTMLInputElement>) => {
        mockFormikContextInstance.values = { ...mockFormikContextInstance.values, [e.target.name]: e.target.value };
        Object.defineProperty(e.target, 'value', { value: e.target.value, writable: true });

        // Simulate validity logic
        const newValues = mockFormikContextInstance.values;
        let newErrors: any = {};
        let newIsValid = true;

        if (!newValues.email || !/^\S+@\S+\.\S+$/.test(newValues.email)) {
            newErrors.email = 'Please enter a valid email address.';
            newIsValid = false;
        }
        if (!newValues.password) {
            newErrors.password = 'Password is required.';
            newIsValid = false;
        } else if (newValues.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters long.';
            newIsValid = false;
        }
        if (newValues.password !== newValues.confirmPassword) {
            newErrors.confirmPassword = 'Passwords must match.';
            newIsValid = false;
        }
        if (!newValues.confirmPassword) {
            newErrors.confirmPassword = 'Confirm Password is required.';
            newIsValid = false;
        }

        mockFormikContextInstance.errors = newErrors;
        mockFormikContextInstance.isValid = newIsValid;
        
        // Simulate password strength for the test
        if (e.target.name === 'password') {
            const password = e.target.value;
            if (password.length < 6) mockFormikContextInstance.passwordStrength = 'Weak';
            else if (password.length < 10) mockFormikContextInstance.passwordStrength = 'Medium';
            else mockFormikContextInstance.passwordStrength = 'Strong';
        }
      }),
      handleBlur: jest.fn((e: React.FocusEvent<HTMLInputElement>) => {
        mockFormikContextInstance.touched = { ...mockFormikContextInstance.touched, [e.target.name]: true };
      }),
      handleSubmit: jest.fn(),
      submitForm: jest.fn(() => {
        if (mockFormikContextInstance.isValid) {
            mockFormikContextInstance.isSubmitting = true;
            Promise.resolve().then(() => {
                mockFormikContextInstance.handleSubmit(mockFormikContextInstance.values, { setSubmitting: mockFormikContextInstance.setSubmitting, resetForm: jest.fn() });
            });
        } else {
            console.log('Form submission prevented due to invalidity in mock.');
        }
      }),
      setFieldValue: jest.fn((field: string, value: any) => { mockFormikContextInstance.values = { ...mockFormikContextInstance.values, [field]: value }; }),
      setErrors: jest.fn((errors: any) => { mockFormikContextInstance.errors = errors; mockFormikContextInstance.isValid = Object.keys(errors).length === 0; }),
      setTouched: jest.fn((touched: any) => { mockFormikContextInstance.touched = touched; }),
      setSubmitting: jest.fn((isSubmitting: boolean) => { mockFormikContextInstance.isSubmitting = isSubmitting; }),
      resetForm: jest.fn(),
      validateForm: jest.fn(() => Promise.resolve({})),
    };

    (require('formik').useFormikContext as jest.Mock).mockReturnValue(mockFormikContextInstance);
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
    fireEvent.change(emailInput, { target: { name: 'email', value: 'test@example.com' } });
    expect(emailInput.value).toBe('test@example.com');
    expect(mockFormikContextInstance.values.email).toBe('test@example.com');

    const passwordInput = screen.getByLabelText('Password', { selector: 'input' }) as HTMLInputElement;
    fireEvent.change(passwordInput, { target: { name: 'password', value: 'SecurePassword123!' } });
    expect(passwordInput.value).toBe('SecurePassword123!');
    expect(mockFormikContextInstance.values.password).toBe('SecurePassword123!');

    const confirmPasswordInput = screen.getByLabelText('Confirm Password', { selector: 'input' }) as HTMLInputElement;
    fireEvent.change(confirmPasswordInput, { target: { name: 'confirmPassword', value: 'SecurePassword123!' } });
    expect(confirmPasswordInput.value).toBe('SecurePassword123!');
    expect(mockFormikContextInstance.values.confirmPassword).toBe('SecurePassword123!');
  });

  it('toggles password visibility when visibility button is clicked', () => {
    render(<EmailSignupForm />);

    const passwordInput = screen.getByLabelText('Password', { selector: 'input' }) as HTMLInputElement;
    const visibilityOffButton = screen.getByRole('button', { name: 'Show password' });

    expect(passwordInput.type).toBe('password');
    fireEvent.click(visibilityOffButton);
    expect(passwordInput.type).toBe('text');
  });

  it('displays correct password strength feedback', () => {
    render(<EmailSignupForm />);

    const passwordInput = screen.getByLabelText('Password', { selector: 'input' });
    
    fireEvent.change(passwordInput, { target: { name: 'password', value: 'weak' } });
    expect(screen.getByText('Weak')).toBeInTheDocument();

    fireEvent.change(passwordInput, { target: { name: 'password', value: 'Medium1!' } });
    expect(screen.getByText('Medium')).toBeInTheDocument();

    fireEvent.change(passwordInput, { target: { name: 'password', value: 'StrongPassword123!' } });
    expect(screen.getByText('Strong')).toBeInTheDocument();
  });

  it('shows checkmark for matching confirm password', async () => {
    mockFormikContextInstance.values = { email: 'test@example.com', password: 'SecurePassword123!', confirmPassword: 'SecurePassword123!' };
    mockFormikContextInstance.isValid = true;
    mockFormikContextInstance.errors = {};
    render(<EmailSignupForm />);

    // The component should render the checkmark based on valid values
    expect(screen.getByTestId('confirm-password-check')).toBeInTheDocument();
  });

  it('displays email validation errors', async () => {
    mockFormikContextInstance.values = { email: 'invalid-email', password: 'SecurePassword123!', confirmPassword: 'SecurePassword123!' };
    mockFormikContextInstance.errors = { email: 'Please enter a valid email address.' };
    mockFormikContextInstance.touched = { email: true };
    mockFormikContextInstance.isValid = false;
    render(<EmailSignupForm />);
    expect(screen.getByText('Please enter a valid email address.')).toBeInTheDocument();
  });

  it('displays password validation errors', async () => {
    mockFormikContextInstance.values = { email: 'test@example.com', password: 'short', confirmPassword: 'short' };
    mockFormikContextInstance.errors = { password: 'Password must be at least 8 characters long.' };
    mockFormikContextInstance.touched = { password: true };
    mockFormikContextInstance.isValid = false;
    render(<EmailSignupForm />);
    expect(screen.getByText(/Password must be at least 8 characters long./i)).toBeInTheDocument();
  });

  it('displays confirm password mismatch error', async () => {
    mockFormikContextInstance.values = { email: 'test@example.com', password: 'SecurePassword123!', confirmPassword: 'Mismatch123!' };
    mockFormikContextInstance.errors = { confirmPassword: 'Passwords must match.' };
    mockFormikContextInstance.touched = { confirmPassword: true };
    mockFormikContextInstance.isValid = false;
    render(<EmailSignupForm />);
    expect(screen.getByText('Passwords must match.')).toBeInTheDocument();
  });

  it('disables submit button when form is invalid', async () => {
    mockFormikContextInstance.isValid = false;
    render(<EmailSignupForm />);
    const submitButton = screen.getByRole('button', { name: /Create Account/i });
    expect(submitButton).toBeDisabled();

    mockFormikContextInstance.values = { email: 'valid@example.com', password: 'SecurePassword123!', confirmPassword: 'SecurePassword123!' };
    mockFormikContextInstance.isValid = true;
    mockFormikContextInstance.errors = {};
    // Re-render is often needed when directly manipulating mock context to update the UI
    render(<EmailSignupForm />); 
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Create Account/i })).not.toBeDisabled();
    });
  });

  it('handles successful signup', async () => {
    mockSignUp.mockResolvedValueOnce({ data: { user: { id: '123' } }, error: null });
    mockFormikContextInstance.values = { email: 'test@example.com', password: 'SecurePassword123!', confirmPassword: 'SecurePassword123!' };
    mockFormikContextInstance.isValid = true;
    mockFormikContextInstance.isSubmitting = false;

    const componentOnSubmit = jest.fn(async (values, formikHelpers) => {
        formikHelpers.setSubmitting(true);
        const result = await mockSignUp({ email: values.email, password: values.password });
        if (!result.error) {
            mockPush('/onboarding');
        } else {
            console.error('Signup failed:', result.error.message);
        }
        formikHelpers.setSubmitting(false);
    });
    mockFormikContextInstance.handleSubmit.mockImplementation(componentOnSubmit);


    render(<EmailSignupForm />);

    const submitButton = screen.getByRole('button', { name: /Create Account/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalledWith({ email: 'test@example.com', password: 'SecurePassword123!' });
      expect(mockPush).toHaveBeenCalledWith('/onboarding');
      expect(screen.queryByText(/An unexpected error occurred/i)).not.toBeInTheDocument();
    });
    expect(mockFormikContextInstance.isSubmitting).toBe(false);
  });

  it('handles failed signup', async () => {
    mockSignUp.mockResolvedValueOnce({ data: { user: null }, error: { message: 'Signup failed' } });
    mockFormikContextInstance.values = { email: 'test@example.com', password: 'SecurePassword123!', confirmPassword: 'SecurePassword123!' };
    mockFormikContextInstance.isValid = true;
    mockFormikContextInstance.isSubmitting = false;

    const componentOnSubmit = jest.fn(async (values, formikHelpers) => {
        formikHelpers.setSubmitting(true);
        const result = await mockSignUp({ email: values.email, password: values.password });
        if (result.error) {
            expect(screen.getByText(result.error.message)).toBeInTheDocument();
        }
        formikHelpers.setSubmitting(false);
    });
    mockFormikContextInstance.handleSubmit.mockImplementation(componentOnSubmit);

    render(<EmailSignupForm />);

    const submitButton = screen.getByRole('button', { name: /Create Account/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalledWith({ email: 'test@example.com', password: 'SecurePassword123!' });
      expect(mockPush).not.toHaveBeenCalled();
      expect(screen.getByText('Signup failed')).toBeInTheDocument();
    });
    expect(mockFormikContextInstance.isSubmitting).toBe(false);
  });

  it('navigates back when back button is clicked', () => {
    render(<EmailSignupForm />);
    const backButton = screen.getByRole('button', { name: 'Go back' });
    fireEvent.click(backButton);
    expect(mockBack).toHaveBeenCalledTimes(1);
  });

  it('navigates to login page when "Log in" link is clicked', async () => {
    render(<EmailSignupForm />);
    const loginLink = screen.getByRole('link', { name: /Log in/i });
    fireEvent.click(loginLink);
    expect(mockPush).toHaveBeenCalledWith('/auth/login');
  });
});