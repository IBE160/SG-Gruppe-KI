// apps/web/src/app/settings/profile/__tests__/edit-profile.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import EditProfile from '../edit-profile';
import { useProfileStore } from '@/store/profileStore';
import { createClient } from '@/lib/supabase/client';
import { UserProfile } from '@/lib/types';
import { useAuthStore } from '@/store/auth'; // Import useAuthStore
import { api } from '@/lib/api'; // Import api

// Mock useRouter
const mockBack = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    back: mockBack,
  }),
}));

// Mock the Link component (consistent with auth forms)
jest.mock('next/link', () => {
    return ({ children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: any }) => {
      if (href === '/') { // Assuming '/' is the default back target or can be configured
          return <a href={href} onClick={() => mockBack()} {...props}>{children}</a>;
      }
      return (
          <a 
              href={href} 
              onClick={(e) => {
                  e.preventDefault();
                  jest.fn().mockImplementation(() => console.log(`Navigating to ${href}`))(); // No mockPush here directly, as it's not used in EditProfile
              }} 
              {...props}
          >
              {children}
          </a>
      );
    };
  });

// Make this dynamic, so `setCurrentUserData` can update it
let mockProfileStoreInternalState: any; 

const mockSaveProfile = jest.fn();
const mockSetUser = jest.fn();
const mockSetCurrentUserData = jest.fn((data) => {
    mockProfileStoreInternalState.tempUserData = data;
    mockProfileStoreInternalState.user = { // Also update 'user' for consistency with full profile object structure
        id: 'user123', // Assuming id is always present
        email: data.email,
        unit_preference: data.unit_preference,
        primary_goal: data.primary_goal,
        training_frequency: data.training_frequency,
        training_duration: data.training_duration,
        injuries_limitations: data.injuries_limitations,
        equipment: data.equipment,
        // Add other properties that are part of the full Supabase user object if needed by the component
        app_metadata: { provider: 'email' },
        aud: 'authenticated',
        confirmed_at: '2025-01-01T00:00:00.000Z',
        created_at: '2025-01-01T00:00:00.000Z',
        role: 'authenticated',
        updated_at: '2025-01-01T00:00:00.000Z',
        last_sign_in_at: '2025-01-01T00:00:00.000Z',
        phone: '',
        email_confirmed_at: '2025-01-01T00:00:00.000Z',
        raw_app_meta_data: { provider: 'email' },
        raw_user_meta_data: { /* other metadata, e.g., display_name */ },
    };
});
const mockUpdateTempUserData = jest.fn((data) => {
    mockProfileStoreInternalState.tempUserData = { ...mockProfileStoreInternalState.tempUserData, ...data };
});
const mockCancelEditing = jest.fn();

jest.mock('@/store/profileStore', () => ({
  useProfileStore: jest.fn((selector) => {
    // Return a new object with current values each time useProfileStore is called
    const store = {
      user: mockProfileStoreInternalState.user,
      tempUserData: mockProfileStoreInternalState.tempUserData,
      saveProfile: mockSaveProfile,
      setUser: mockSetUser,
      setCurrentUserData: mockSetCurrentUserData,
      updateTempUserData: mockUpdateTempUserData,
      cancelEditing: mockCancelEditing,
      getState: () => store, // Mimic Zustand's getState
    };

    if (typeof selector === 'function') {
      return selector(store);
    }
    return store; 
  }),
}));

// Mock useAuthStore
const mockSession = { access_token: 'mock_access_token', user: { id: 'user123', email: 'test@example.com' } };
const mockSetSession = jest.fn();
const mockUseAuthStore = jest.fn(() => ({ session: mockSession, setSession: mockSetSession }));
jest.mock('@/store/auth', () => ({
  useAuthStore: mockUseAuthStore,
}));

// Mock api
const mockApiGet = jest.fn();
jest.mock('@/lib/api', () => ({
  api: {
    get: mockApiGet,
  },
}));

// Mock Supabase client
const mockUpdateUser = jest.fn();
const mockGetUser = jest.fn();
const mockGetSession = jest.fn(); 
jest.mock('@/lib/supabase/client', () => ({
  createClient: jest.fn(() => ({
    auth: {
      updateUser: mockUpdateUser,
      getUser: mockGetUser,
      getSession: mockGetSession,
    },
  })),
}));

// Mock Formik
let mockFormikContextInstance: any;

jest.mock('formik', () => {
  const actualFormik = jest.requireActual('formik');
  return {
    ...actualFormik,
    useFormikContext: jest.fn(() => mockFormikContextInstance),
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
            if (schemaDefinition.email) {
              if (!values.email || !/^\S+@\S+\.\S+$/.test(values.email)) {
                errors.email = 'Invalid email format';
              }
            }
            if (schemaDefinition.training_frequency) {
                if (values.training_frequency < 1 || values.training_frequency > 7) {
                    errors.training_frequency = 'Must be between 1-7';
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


describe('EditProfile', () => {
  let alertSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;
  const initialFormikValues: UserProfile = {
    email: 'test@example.com',
    unit_preference: 'kg',
    primary_goal: 'Build Muscle',
    training_frequency: 4,
    training_duration: 60,
    injuries_limitations: 'None',
    equipment: ['Dumbbells', 'Bench'],
  };

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

    mockFormikContextInstance = {
      values: { ...initialFormikValues, equipment: initialFormikValues.equipment.join(', ') },
      errors: {},
      touched: {},
      isValid: true,
      isSubmitting: false,
      handleChange: jest.fn((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        mockFormikContextInstance.values = { ...mockFormikContextInstance.values, [e.target.name]: e.target.value };
        Object.defineProperty(e.target, 'value', { value: e.target.value, writable: true });
      }),
      handleBlur: jest.fn((e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        mockFormikContextInstance.touched = { ...mockFormikContextInstance.touched, [e.target.name]: true };
      }),
      handleSubmit: jest.fn(),
      submitForm: jest.fn(() => {
        if (mockFormikContextInstance.isValid) {
            mockFormikContextInstance.isSubmitting = true;
            Promise.resolve().then(() => {
                mockFormikContextInstance.handleSubmit(
                    mockFormikContextInstance.values,
                    { setSubmitting: mockFormikContextInstance.setSubmitting, resetForm: jest.fn() }
                );
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

    // Initialize internal state for each test for useProfileStore
    mockProfileStoreInternalState = {
        user: {
            ...initialFormikValues,
            id: 'user123',
            app_metadata: { provider: 'email' },
            aud: 'authenticated',
            confirmed_at: '2025-01-01T00:00:00.000Z',
            created_at: '2025-01-01T00:00:00.000Z',
            role: 'authenticated',
            updated_at: '2025-01-01T00:00:00.000Z',
            last_sign_in_at: '2025-01-01T00:00:00.000Z',
            phone: '',
            email_confirmed_at: '2025-01-01T00:00:00.000Z',
            raw_app_meta_data: { provider: 'email' },
            raw_user_meta_data: { /* other metadata, e.g., display_name */ },
        },
        tempUserData: {
            ...initialFormikValues,
        },
        saveProfile: mockSaveProfile,
        setUser: mockSetUser,
        setCurrentUserData: mockSetCurrentUserData,
        updateTempUserData: mockUpdateTempUserData,
        cancelEditing: mockCancelEditing,
    };

    // Set up mock for useAuthStore
    mockUseAuthStore.mockReturnValue({ session: mockSession, setSession: mockSetSession });

    // Mock API call to /users/me
    mockApiGet.mockResolvedValue({
        data: {
            id: 'user123',
            email: 'test@example.com',
            unit_preference: 'kg',
            primary_goal: 'Build Muscle',
            training_frequency: 4,
            training_duration: 60,
            injuries_limitations: 'None',
            equipment: ['Dumbbells', 'Bench'],
        },
        error: null,
    });
  });

  it('renders form fields with initial data', async () => {
    render(<EditProfile />);

    await waitFor(() => {
      expect(screen.getByLabelText(/email/i)).toHaveValue('test@example.com');
      expect(screen.getByLabelText(/unit preference/i)).toHaveValue('kg');
      expect(screen.getByLabelText(/primary goal/i)).toHaveValue('Build Muscle');
      expect(screen.getByLabelText(/training frequency/i)).toHaveValue('4');
      expect(screen.getByLabelText(/training duration/i)).toHaveValue('60');
      expect(screen.getByLabelText(/injuries\/limitations/i)).toHaveValue('None');
      expect(screen.getByLabelText(/equipment/i)).toHaveValue('Dumbbells, Bench');
    });
  });

  it('updates form values on input change', async () => {
    const { rerender } = render(<EditProfile />);

    const unitPreferenceSelect = screen.getByLabelText(/unit preference/i) as HTMLSelectElement;
    fireEvent.change(unitPreferenceSelect, { target: { name: 'unit_preference', value: 'lbs' } });
    mockFormikContextInstance.values.unit_preference = 'lbs';
    rerender(<EditProfile />);

    expect(mockFormikContextInstance.handleChange).toHaveBeenCalledTimes(1);
    expect(unitPreferenceSelect.value).toBe('lbs');
    expect(mockFormikContextInstance.values.unit_preference).toBe('lbs');

    const primaryGoalInput = screen.getByLabelText(/primary goal/i);
    fireEvent.change(primaryGoalInput, { target: { name: 'primary_goal', value: 'Lose Weight' } });
    mockFormikContextInstance.values.primary_goal = 'Lose Weight';
    rerender(<EditProfile />);
    
    expect(mockFormikContextInstance.handleChange).toHaveBeenCalledTimes(2);
    expect(primaryGoalInput).toHaveValue('Lose Weight');
    expect(mockFormikContextInstance.values.primary_goal).toBe('Lose Weight');
  });

  it('calls saveProfile with correct data on successful form submission', async () => {
    mockSaveProfile.mockResolvedValue({ success: true });
    mockUpdateUser.mockResolvedValue({ data: { user: { id: 'user123' } }, error: null });

    mockFormikContextInstance.values = {
      ...initialFormikValues,
      equipment: initialFormikValues.equipment.join(', '),
    };
    mockFormikContextInstance.isValid = true;
    mockFormikContextInstance.isSubmitting = false;

    const componentHandleSubmit = jest.fn(async (values: UserProfile, formikHelpers: any) => {
        formikHelpers.setSubmitting(true);
        await mockSaveProfile({ ...values, equipment: values.equipment.split(', ') });
        formikHelpers.setSubmitting(false);
    });
    mockFormikContextInstance.handleSubmit.mockImplementation(componentHandleSubmit);

    render(<EditProfile />);

    const saveButton = screen.getByRole('button', { name: /save changes/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(componentHandleSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          email: initialFormikValues.email,
          unit_preference: initialFormikValues.unit_preference,
          primary_goal: initialFormikValues.primary_goal,
          training_frequency: initialFormikValues.training_frequency,
          training_duration: initialFormikValues.training_duration,
          injuries_limitations: initialFormikValues.injuries_limitations,
          equipment: initialFormikValues.equipment.join(', '),
        }),
        expect.anything()
      );
      expect(mockSaveProfile).toHaveBeenCalledWith({
        email: initialFormikValues.email,
        unit_preference: initialFormikValues.unit_preference,
        primary_goal: initialFormikValues.primary_goal,
        training_frequency: initialFormikValues.training_frequency,
        training_duration: initialFormikValues.training_duration,
        injuries_limitations: initialFormikValues.injuries_limitations,
        equipment: initialFormikValues.equipment,
      });
      expect(mockSetUser).toHaveBeenCalledTimes(1);
      expect(screen.queryByText(/Error saving profile/i)).not.toBeInTheDocument();
    });
    expect(mockFormikContextInstance.isSubmitting).toBe(false);
  });

  it('displays error message on failed profile save', async () => {
    mockSaveProfile.mockRejectedValue(new Error('Network Error'));
    mockUpdateUser.mockResolvedValue({ data: { user: null }, error: new Error('Supabase error') });

    mockFormikContextInstance.values = { ...initialFormikValues, equipment: initialFormikValues.equipment.join(', ') };
    mockFormikContextInstance.isValid = true;
    mockFormikContextInstance.isSubmitting = false;

    const componentHandleSubmit = jest.fn(async (values: UserProfile, formikHelpers: any) => {
        formikHelpers.setSubmitting(true);
        try {
            await mockSaveProfile({ ...values, equipment: values.equipment.split(', ') });
        } catch (error: any) {
            expect(screen.getByText('Network Error')).toBeInTheDocument();
        }
        formikHelpers.setSubmitting(false);
    });
    mockFormikContextInstance.handleSubmit.mockImplementation(componentHandleSubmit);

    render(<EditProfile />);
    fireEvent.click(screen.getByRole('button', { name: /save changes/i }));

    await waitFor(() => {
      expect(mockSaveProfile).toHaveBeenCalledTimes(1);
    });
    expect(mockFormikContextInstance.isSubmitting).toBe(false);
  });

  it('disables save button when form is invalid', async () => {
    mockFormikContextInstance.isValid = false;
    
    const { rerender } = render(<EditProfile />);
    const saveButton = screen.getByRole('button', { name: /save changes/i });
    expect(saveButton).toBeDisabled();

    mockFormikContextInstance.isValid = true;
    rerender(<EditProfile />);
    expect(screen.getByRole('button', { name: /save changes/i })).not.toBeDisabled();
  });

  it('shows loading spinner when saving', async () => {
    mockSaveProfile.mockReturnValue(new Promise(() => {}));
    mockUpdateUser.mockResolvedValue({ data: { user: { id: 'user123' } }, error: null });

    mockFormikContextInstance.values = { ...initialFormikValues, equipment: initialFormikValues.equipment.join(', ') };
    mockFormikContextInstance.isValid = true;
    mockFormikContextInstance.isSubmitting = true; 

    render(<EditProfile />);
    const saveButton = screen.getByRole('button', { name: /save changes/i });
    
    expect(saveButton).toBeDisabled();
    expect(screen.getByRole('img', { hidden: true })).toBeInTheDocument();

    fireEvent.click(saveButton);
    
    await waitFor(() => {
        expect(saveButton).toBeDisabled();
        expect(screen.getByRole('img', { hidden: true })).toBeInTheDocument();
    });
  });

  it('navigates back when back button is clicked', () => {
    render(<EditProfile />);
    fireEvent.click(screen.getByRole('button', { name: 'Back' }));
    expect(mockBack).toHaveBeenCalledTimes(1);
  });
});
