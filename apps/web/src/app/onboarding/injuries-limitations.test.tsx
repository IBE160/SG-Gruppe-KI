// apps/web/src/app/onboarding/injuries-limitations.test.tsx
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom'; // Import for additional matchers like toBeEnabled
import InjuriesLimitations from './injuries-limitations';
import { useOnboardingStore } from '@/store/onboardingStore';

// Mock the zustand store directly to control its state for testing
let mockInjuriesLimitationsState: string[] = [];
let mockCustomInjuriesLimitationsState: string | null = null;

const mockSetInjuriesLimitations = jest.fn((newLimitations: string[]) => {
  mockInjuriesLimitationsState = newLimitations;
});
const mockSetCustomInjuriesLimitations = jest.fn((newCustomLimitations: string | null) => {
  mockCustomInjuriesLimitationsState = newCustomLimitations;
});

jest.mock('@/store/onboardingStore', () => ({
  useOnboardingStore: jest.fn(() => ({
    injuriesLimitations: mockInjuriesLimitationsState,
    customInjuriesLimitations: mockCustomInjuriesLimitationsState,
    setInjuriesLimitations: mockSetInjuriesLimitations,
    setCustomInjuriesLimitations: mockSetCustomInjuriesLimitations,
  })),
}));

describe('InjuriesLimitations', () => {
  const mockOnNext = jest.fn();
  const mockOnBack = jest.fn();

  // Reference to the mocked hook for convenience
  const mockedUseOnboardingStore = useOnboardingStore as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockInjuriesLimitationsState = []; // Reset state for each test
    mockCustomInjuriesLimitationsState = null; // Reset state for each test

    // Reset the mock implementation for each test to ensure fresh state
    mockedUseOnboardingStore.mockImplementation(() => ({
      injuriesLimitations: mockInjuriesLimitationsState,
      customInjuriesLimitations: mockCustomInjuriesLimitationsState,
      setInjuriesLimitations: mockSetInjuriesLimitations,
      setCustomInjuriesLimitations: mockSetCustomInjuriesLimitations,
    }));
  });

  it('renders correctly with initial state', () => {
    render(<InjuriesLimitations onNext={mockOnNext} onBack={mockOnBack} />);

    expect(screen.getByText(/do you have any injuries or limitations I should be aware of?/i)).toBeInTheDocument();
    expect(screen.getByText('Knees')).toBeInTheDocument();
    expect(screen.getByText('Shoulders')).toBeInTheDocument();
    expect(screen.getByText('Back')).toBeInTheDocument();
    expect(screen.getByText('None')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Specific details or other limitations...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /arrow_forward/i })).toBeDisabled(); // Next button should be disabled initially
  });

  it('allows selecting "None" and enables next button', () => {
    const { rerender } = render(<InjuriesLimitations onNext={mockOnNext} onBack={mockOnBack} />);

    fireEvent.click(screen.getByText('None'));
    expect(mockSetInjuriesLimitations).toHaveBeenCalledWith(['None']);

    act(() => {
      mockInjuriesLimitationsState = ['None'];
      mockedUseOnboardingStore.mockImplementation(() => ({
        injuriesLimitations: mockInjuriesLimitationsState,
        customInjuriesLimitations: mockCustomInjuriesLimitationsState,
        setInjuriesLimitations: mockSetInjuriesLimitations,
        setCustomInjuriesLimitations: mockSetCustomInjuriesLimitations,
      }));
    });
    rerender(<InjuriesLimitations onNext={mockOnNext} onBack={mockOnBack} />);

    expect(screen.getByRole('button', { name: /arrow_forward/i })).toBeEnabled();
  });

  it('allows selecting multiple limitations', () => {
    const { rerender } = render(<InjuriesLimitations onNext={mockOnNext} onBack={mockOnBack} />);

    fireEvent.click(screen.getByText('Knees'));
    expect(mockSetInjuriesLimitations).toHaveBeenCalledWith(['Knees']);
    act(() => {
      mockInjuriesLimitationsState = ['Knees'];
      mockedUseOnboardingStore.mockImplementation(() => ({
        injuriesLimitations: mockInjuriesLimitationsState,
        customInjuriesLimitations: mockCustomInjuriesLimitationsState,
        setInjuriesLimitations: mockSetInjuriesLimitations,
        setCustomInjuriesLimitations: mockSetCustomInjuriesLimitations,
      }));
    });
    rerender(<InjuriesLimitations onNext={mockOnNext} onBack={mockOnBack} />);

    fireEvent.click(screen.getByText('Shoulders'));
    expect(mockSetInjuriesLimitations).toHaveBeenCalledWith(['Knees', 'Shoulders']);
    act(() => {
      mockInjuriesLimitationsState = ['Knees', 'Shoulders'];
      mockedUseOnboardingStore.mockImplementation(() => ({
        injuriesLimitations: mockInjuriesLimitationsState,
        customInjuriesLimitations: mockCustomInjuriesLimitationsState,
        setInjuriesLimitations: mockSetInjuriesLimitations,
        setCustomInjuriesLimitations: mockSetCustomInjuriesLimitations,
      }));
    });
    rerender(<InjuriesLimitations onNext={mockOnNext} onBack={mockOnBack} />);

    expect(screen.getByRole('button', { name: /arrow_forward/i })).toBeEnabled();
  });

  it('allows entering custom limitations', () => {
    const { rerender } = render(<InjuriesLimitations onNext={mockOnNext} onBack={mockOnBack} />);

    const customInput = screen.getByPlaceholderText('Specific details or other limitations...');
    fireEvent.change(customInput, { target: { value: 'Tight hamstrings' } });
    expect(mockSetCustomInjuriesLimitations).toHaveBeenCalledWith('Tight hamstrings');

    act(() => {
      mockCustomInjuriesLimitationsState = 'Tight hamstrings';
      mockedUseOnboardingStore.mockImplementation(() => ({
        injuriesLimitations: mockInjuriesLimitationsState,
        customInjuriesLimitations: mockCustomInjuriesLimitationsState,
        setInjuriesLimitations: mockSetInjuriesLimitations,
        setCustomInjuriesLimitations: mockSetCustomInjuriesLimitations,
      }));
    });
    rerender(<InjuriesLimitations onNext={mockOnNext} onBack={mockOnBack} />);

    expect(screen.getByRole('button', { name: /arrow_forward/i })).toBeEnabled();
  });

  it('disables next button if no selection and no custom input', () => {
    render(<InjuriesLimitations onNext={mockOnNext} onBack={mockOnBack} />);
    expect(screen.getByRole('button', { name: /arrow_forward/i })).toBeDisabled();
  });

  it('calls onNext when next button is clicked and a limitation is selected', () => {
    const { rerender } = render(<InjuriesLimitations onNext={mockOnNext} onBack={mockOnBack} />);

    // Select an option to enable the button
    fireEvent.click(screen.getByText('Back')); 
    act(() => {
      mockInjuriesLimitationsState = ['Back'];
      mockedUseOnboardingStore.mockImplementation(() => ({
        injuriesLimitations: mockInjuriesLimitationsState,
        customInjuriesLimitations: mockCustomInjuriesLimitationsState,
        setInjuriesLimitations: mockSetInjuriesLimitations,
        setCustomInjuriesLimitations: mockSetCustomInjuriesLimitations,
      }));
    });
    rerender(<InjuriesLimitations onNext={mockOnNext} onBack={mockOnBack} />);

    fireEvent.click(screen.getByRole('button', { name: /arrow_forward/i }));

    expect(mockOnNext).toHaveBeenCalledTimes(1);
  });

  it('calls onBack when back button is clicked', () => {
    render(<InjuriesLimitations onNext={mockOnNext} onBack={mockOnBack} />);

    // The back button is part of the layout, but onBack is a prop.
    // Simulate clicking the back button in the layout.
    fireEvent.click(screen.getByRole('button', { name: /arrow_back/i }));

    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });
});
