// apps/web/src/app/onboarding/unit-selection.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import UnitSelection from './unit-selection';
import { useOnboardingStore } from '@/store/onboardingStore';

// Mock the zustand store for isolated testing
jest.mock('@/store/onboardingStore', () => ({
  useOnboardingStore: jest.fn(() => ({
    unitPreference: null,
    setUnitPreference: jest.fn(),
  })),
}));

describe('UnitSelection', () => {
  const mockOnNext = jest.fn();
  const mockOnBack = jest.fn();

  const mockStore = useOnboardingStore as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockStore.mockReturnValue({
      unitPreference: null,
      setUnitPreference: jest.fn(),
    });
  });

  it('renders correctly with initial state', () => {
    render(<UnitSelection onNext={mockOnNext} onBack={mockOnBack} />);

    expect(screen.getByText('Last question. Do you prefer to work with kilograms or pounds?')).toBeInTheDocument();
    expect(screen.getByText('kg')).toBeInTheDocument();
    expect(screen.getByText('lbs')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /arrow_forward/i })).toBeDisabled(); // Next button should be disabled initially
  });

  it('allows selecting "kg" and enables next button', () => {
    render(<UnitSelection onNext={mockOnNext} onBack={mockOnBack} />);

    fireEvent.click(screen.getByLabelText('kg'));

    expect(mockStore().setUnitPreference).toHaveBeenCalledWith('kg');
    expect(screen.getByRole('button', { name: /arrow_forward/i })).toBeEnabled();
  });

  it('allows selecting "lbs" and enables next button', () => {
    render(<UnitSelection onNext={mockOnNext} onBack={mockOnBack} />);

    fireEvent.click(screen.getByLabelText('lbs'));

    expect(mockStore().setUnitPreference).toHaveBeenCalledWith('lbs');
    expect(screen.getByRole('button', { name: /arrow_forward/i })).toBeEnabled();
  });

  it('calls onNext when the forward button is clicked', () => {
    render(<UnitSelection onNext={mockOnNext} onBack={mockOnBack} />);

    fireEvent.click(screen.getByLabelText('kg')); // Select to enable next button
    fireEvent.click(screen.getByRole('button', { name: /arrow_forward/i }));

    expect(mockOnNext).toHaveBeenCalledTimes(1);
  });

  it('calls onBack when the back button is clicked via the header back button', () => {
    render(<UnitSelection onNext={mockOnNext} onBack={mockOnBack} />);
    // Simulate a click on the back button, which is usually in the header of the parent component.
    // The onBack prop is directly called in this test to simulate the parent's action.
    fireEvent.click(screen.getByRole('button', { name: /arrow_back/i }));
    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });
});
