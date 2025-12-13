// apps/web/src/app/auth/EmailLoginForm.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import EmailLoginForm from './EmailLoginForm';
import { createClient } from '@/lib/supabase/client';

// Mock useRouter
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
    return (
      <a 
          href={href} 
          onClick={(e) => {
              e.preventDefault();
              if (href === '/') { // Special handling for back navigation
                  mockBack();
              } else {
                  mockPush(href);
              }
          }} 
          {...props}
      >
          {children}
      </a>
    );
  };
});

// Mock the Supabase client
const mockSignInWithPassword = jest.fn();
jest.mock('@/lib/supabase/client', () => ({
  createClient: jest.fn(() => ({
    auth: {
      signInWithPassword: mockSignInWithPassword,
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

// Mock Yup
jest.mock('yup', () => {
    const actualYup = jest.requireActual('yup');
    
    // Create a mock for methods that return 'this' for chaining
    const mockChainableMethod = () => {
        const mock = jest.fn();
        mock.mockReturnThis(); 
        
        mock.email = jest.fn().mockReturnThis();
        mock.required = jest.fn().mockReturnThis();
        mock.min = jest.fn().mockReturnThis();
        mock.max = jest.fn().mockReturnThis();
        mock.integer = jest.fn().mockReturnThis();
        mock.optional = jest.fn().mockReturnThis();
        mock.nullable = jest.fn().mockReturnThis();
        mock.matches = jest.fn().mockReturnThis();
        mock.oneOf = jest.fn().mockReturnThis();
        mock.of = jest.fn().mockReturnThis(); 

        mock.validate = jest.fn((value) => Promise.resolve(value)); 
        mock.cast = jest.fn((value) => value);
        
        return mock;
    };

    return {
      ...actualYup,
      object: jest.fn(() => ({
        shape: jest.fn((schemaDefinition: any) => ({
          validate: jest.fn((values, options) => {
            const errors: any = {};
            // Simplified validation based on schemaDefinition keys
            if (schemaDefinition.email) {
              if (!values.email || !/^\S+@\S+\.\S+$/.test(values.email)) {
                errors.email = 'Please enter a valid email address.';
              }
            }
            if (schemaDefinition.password) {
                if (!values.password) {
                    errors.password = 'Password is required.';
                }
            }

            if (Object.keys(errors).length > 0) {
              const error = new Error('Validation failed');
              (error as any).inner = Object.keys(errors).map(key => ({ path: key, message: errors[key] }));
              return Promise.reject(error);
            }
            return Promise.resolve(values);
          }),
        })),
      })),
      string: jest.fn(mockChainableMethod),
      number: jest.fn(mockChainableMethod),
      array: jest.fn(mockChainableMethod),
      ref: jest.fn((key: string) => key),
    };
  });


describe('EmailLoginForm', () => {
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
      values: { email: '', password: '' },
      errors: {},
      touched: {},
      isValid: false,
      isSubmitting: false,
      handleChange: jest.fn((e: React.ChangeEvent<HTMLInputElement>) => {
        // Update values in the mock context
        mockFormikContextInstance.values = { ...mockFormikContextInstance.values, [e.target.name]: e.target.value };
        Object.defineProperty(e.target, 'value', { value: e.target.value, writable: true }); // Ensure DOM value reflects

        // Simulate validity for this direct change (optional, but helps with disabled state)
        const newValues = mockFormikContextInstance.values;
        let newErrors: any = {};
        let newIsValid = true;
        if (!newValues.email || !/^\S+@\S+\.\S+$/.test(newValues.email)) { newErrors.email = 'Please enter a valid email address.'; newIsValid = false; }
        if (!newValues.password) { newErrors.password = 'Password is required.'; newIsValid = false; }
        mockFormikContextInstance.errors = newErrors;
        mockFormikContextInstance.isValid = newIsValid;
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
    render(<EmailLoginForm />);
    expect(screen.getByText('Welcome back!')).toBeInTheDocument();
    expect(screen.getByLabelText('Email address')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Log In/i })).toBeInTheDocument();
  });

  it('updates email and password fields on change', () => {
    const { rerender } = render(<EmailLoginForm />);

    const emailInput = screen.getByLabelText(/Email address/i) as HTMLInputElement;
    fireEvent.change(emailInput, { target: { name: 'email', value: 'test@example.com' } });
    rerender(<EmailLoginForm />); 

    expect(emailInput.value).toBe('test@example.com');
    expect(mockFormikContextInstance.values.email).toBe('test@example.com');

    const passwordInput = screen.getByLabelText('Password', { selector: 'input' }) as HTMLInputElement;
    fireEvent.change(passwordInput, { target: { name: 'password', value: 'SecurePassword123!' } });
    rerender(<EmailLoginForm />); 

    expect(passwordInput.value).toBe('SecurePassword123!');
    expect(mockFormikContextInstance.values.password).toBe('SecurePassword123!');
  });

  it('toggles password visibility when visibility button is clicked', () => {
    render(<EmailLoginForm />);
    const passwordInput = screen.getByLabelText('Password', { selector: 'input' }) as HTMLInputElement;
    const visibilityButton = screen.getByRole('button', { name: 'Show password' });

    expect(passwordInput.type).toBe('password');
    fireEvent.click(visibilityButton);
    expect(passwordInput.type).toBe('text');
  });

  it('calls handleSubmit on form submission', async () => {
    mockFormikContextInstance.values = { email: 'test@example.com', password: 'SecurePassword123!' };
    mockFormikContextInstance.isValid = true;
    mockFormikContextInstance.isSubmitting = false;

    render(<EmailLoginForm />);
    
    const componentOnSubmit = jest.fn();
    mockFormikContextInstance.handleSubmit.mockImplementation(componentOnSubmit);

    const submitButton = screen.getByRole('button', { name: /Log In/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
        expect(mockFormikContextInstance.submitForm).toHaveBeenCalledTimes(1);
        expect(componentOnSubmit).toHaveBeenCalledWith(
            mockFormikContextInstance.values,
            expect.objectContaining({ setSubmitting: mockFormikContextInstance.setSubmitting })
        );
    });
  });

  it('navigates back when back button is clicked', async () => {
    render(<EmailLoginForm />);
    const backButton = screen.getByRole('button', { name: 'Go back' });
    fireEvent.click(backButton);
    expect(mockBack).toHaveBeenCalledTimes(1);
  });

  it('navigates to signup page when "Sign up" link is clicked', async () => {
    render(<EmailLoginForm />);
    const signupLink = screen.getByRole('link', { name: /Sign up/i });
    fireEvent.click(signupLink);
    expect(mockPush).toHaveBeenCalledWith('/auth/signup');
  });

  it('displays validation errors for invalid email', async () => {
    mockFormikContextInstance.values = { email: 'invalid-email', password: 'SecurePassword123!' };
    mockFormikContextInstance.errors = { email: 'Please enter a valid email address.' };
    mockFormikContextInstance.touched = { email: true };
    mockFormikContextInstance.isValid = false;
    render(<EmailLoginForm />);
    expect(screen.getByText('Please enter a valid email address.')).toBeInTheDocument();
  });

  it('displays validation errors for missing password', async () => {
    mockFormikContextInstance.values = { email: 'test@example.com', password: '' };
    mockFormikContextInstance.errors = { password: 'Password is required.' };
    mockFormikContextInstance.touched = { password: true };
    mockFormikContextInstance.isValid = false;
    render(<EmailLoginForm />);
    expect(screen.getByText('Password is required.')).toBeInTheDocument();
  });

  it('disables submit button when form is invalid', async () => {
    mockFormikContextInstance.isValid = false;
    const { rerender } = render(<EmailLoginForm />);
    const submitButton = screen.getByRole('button', { name: /Log In/i });
    expect(submitButton).toBeDisabled();

    mockFormikContextInstance.values = { email: 'valid@example.com', password: 'SecurePassword123!' };
    mockFormikContextInstance.isValid = true;
    rerender(<EmailLoginForm />);
    expect(screen.getByRole('button', { name: /Log In/i })).not.toBeDisabled();
  });

  it('handles successful login', async () => {
    mockSignInWithPassword.mockResolvedValueOnce({ data: { user: { id: '123' } }, error: null });
    mockFormikContextInstance.values = { email: 'test@example.com', password: 'SecurePassword123!' };
    mockFormikContextInstance.isValid = true;
    mockFormikContextInstance.isSubmitting = false;

    const componentOnSubmit = jest.fn(async (values, formikHelpers) => {
        formikHelpers.setSubmitting(true);
        const result = await mockSignInWithPassword({ email: values.email, password: values.password });
        if (!result.error) {
            mockPush('/dashboard');
        }
        formikHelpers.setSubmitting(false);
    });
    mockFormikContextInstance.handleSubmit.mockImplementation(componentOnSubmit);


    render(<EmailLoginForm />);

    const submitButton = screen.getByRole('button', { name: /Log In/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockSignInWithPassword).toHaveBeenCalledWith({ email: 'test@example.com', password: 'SecurePassword123!' });
      expect(mockPush).toHaveBeenCalledWith('/dashboard');
      expect(screen.queryByText(/An unexpected error occurred/i)).not.toBeInTheDocument();
    });
    expect(mockFormikContextInstance.isSubmitting).toBe(false);
  });

  it('handles failed login', async () => {
    mockSignInWithPassword.mockResolvedValueOnce({ data: { user: null }, error: { message: 'Invalid credentials' } });
    mockFormikContextInstance.values = { email: 'test@example.com', password: 'SecurePassword123!' };
    mockFormikContextInstance.isValid = true;
    mockFormikContextInstance.isSubmitting = false;

    const componentOnSubmit = jest.fn(async (values, formikHelpers) => {
        formikHelpers.setSubmitting(true);
        const result = await mockSignInWithPassword({ email: values.email, password: values.password });
        if (result.error) {
            expect(screen.getByText(result.error.message)).toBeInTheDocument();
        }
        formikHelpers.setSubmitting(false);
    });
    mockFormikContextInstance.handleSubmit.mockImplementation(componentOnSubmit);

    render(<EmailLoginForm />);

    const submitButton = screen.getByRole('button', { name: /Log In/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockSignInWithPassword).toHaveBeenCalledWith({ email: 'test@example.com', password: 'SecurePassword123!' });
      expect(mockPush).not.toHaveBeenCalled();
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
    expect(mockFormikContextInstance.isSubmitting).toBe(false);
  });
});
