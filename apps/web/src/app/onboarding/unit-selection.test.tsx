// apps/web/src/app/onboarding/unit-selection.test.tsx
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import UnitSelection from './unit-selection';
import { useOnboardingStore } from '@/store/onboardingStore';

// Mock the zustand store dynamically
let mockUnitPreferenceState: 'kg' | 'lbs' | null = null;

const mockSetUnitPreference = jest.fn((unit: 'kg' | 'lbs') => {
  mockUnitPreferenceState = unit;
});

jest.mock('@/store/onboardingStore', () => ({
  useOnboardingStore: jest.fn(() => ({
    unitPreference: mockUnitPreferenceState,
    setUnitPreference: mockSetUnitPreference,
  })),
}));

describe('UnitSelection', () => {
  const mockOnNext = jest.fn();
  const mockOnBack = jest.fn(); // This prop is passed but not used in the component's JSX directly

  const mockedUseOnboardingStore = useOnboardingStore as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUnitPreferenceState = null; // Reset state for each test

    mockedUseOnboardingStore.mockImplementation(() => ({
      unitPreference: mockUnitPreferenceState,
      setUnitPreference: mockSetUnitPreference,
    }));
  });

  it('renders correctly with initial state', () => {
    render(<UnitSelection onNext={mockOnNext} onBack={mockOnBack} />);

    expect(screen.getByText(/Do you prefer to work with kilograms or pounds/i)).toBeInTheDocument();
    expect(screen.getByLabelText('kg')).toBeInTheDocument();
    expect(screen.getByLabelText('lbs')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /arrow_forward/i })).toBeDisabled(); // Next button should be disabled initially
  });

  it('allows selecting "kg" and enables next button', () => {
    const { rerender } = render(<UnitSelection onNext={mockOnNext} onBack={mockOnBack} />);

    fireEvent.click(screen.getByLabelText('kg'));
    expect(mockSetUnitPreference).toHaveBeenCalledWith('kg');

    act(() => {
      mockUnitPreferenceState = 'kg';
      mockedUseOnboardingStore.mockImplementation(() => ({
        unitPreference: mockUnitPreferenceState,
        setUnitPreference: mockSetUnitPreference,
      }));
    });
    rerender(<UnitSelection onNext={mockOnNext} onBack={mockOnBack} />);

    expect(screen.getByRole('button', { name: /arrow_forward/i })).toBeEnabled();
  });

  it('allows selecting "lbs" and enables next button', () => {
    const { rerender } = render(<UnitSelection onNext={mockOnNext} onBack={mockOnBack} />);

    fireEvent.click(screen.getByLabelText('lbs'));
    expect(mockSetUnitPreference).toHaveBeenCalledWith('lbs');

    act(() => {
      mockUnitPreferenceState = 'lbs';
      mockedUseOnboardingStore.mockImplementation(() => ({
        unitPreference: mockUnitPreferenceState,
        setUnitPreference: mockSetUnitPreference,
      }));
    });
    rerender(<UnitSelection onNext={mockOnNext} onBack={mockOnBack} />);

    expect(screen.getByRole('button', { name: /arrow_forward/i })).toBeEnabled();
  });

  it('calls onNext when the forward button is clicked', () => {
    const { rerender } = render(<UnitSelection onNext={mockOnNext} onBack={mockOnBack} />);

    fireEvent.click(screen.getByLabelText('kg')); // Select to enable next button
    act(() => {
      mockUnitPreferenceState = 'kg'; // Simulate state change
      mockedUseOnboardingStore.mockImplementation(() => ({
        unitPreference: mockUnitPreferenceState,
        setUnitPreference: mockSetUnitPreference,
      }));
    });
    rerender(<UnitSelection onNext={mockOnNext} onBack={mockOnBack} />);

    fireEvent.click(screen.getByRole('button', { name: /arrow_forward/i }));

    expect(mockOnNext).toHaveBeenCalledTimes(1);
  });

  // Removed the test for the back button as it's not part of this component's JSX
});