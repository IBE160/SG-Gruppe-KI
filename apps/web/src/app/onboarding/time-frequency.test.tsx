// apps/web/src/app/onboarding/time-frequency.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TimeFrequency from '@/app/onboarding/time-frequency';
import { useOnboardingStore } from '@/store/onboardingStore';

// Mock useRouter
const mockOnNext = jest.fn();
const mockOnBack = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    back: mockOnBack,
  }),
  useSearchParams: () => ({
    get: jest.fn().mockReturnValue(null), // Mock get for step param
  }),
}));

// Mock useOnboardingStore actions
const mockSetTrainingFrequency = jest.fn();
const mockSetTrainingDuration = jest.fn();
const mockOnboardingStoreState = {
  trainingFrequency: 4,
  trainingDuration: 45,
  setTrainingFrequency: mockSetTrainingFrequency,
  setTrainingDuration: mockSetTrainingDuration,
};

jest.mock('@/store/onboardingStore', () => ({
  useOnboardingStore: jest.fn((selector) => {
    if (typeof selector === 'function') {
      return selector(mockOnboardingStoreState);
    }
    return mockOnboardingStoreState;
  }),
}));

describe('TimeFrequency', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset store state before each test
    mockOnboardingStoreState.trainingFrequency = 4;
    mockOnboardingStoreState.trainingDuration = 45;
    // Mock for the forward button's enabled state
    // The button is usually disabled until valid values are selected.
    // We'll simulate this by controlling the mockOnNext.
    mockOnNext.mockImplementation(() => console.log('Next button clicked'));
  });

  it('renders correctly with default values', () => {
    render(<TimeFrequency onNext={mockOnNext} onBack={mockOnBack} />);

    expect(screen.getByText('Days per week')).toBeInTheDocument();
    expect(screen.getByText('4 days')).toBeInTheDocument();
    expect(screen.getByText('Minutes per session')).toBeInTheDocument();
    expect(screen.getByText('45 min')).toBeInTheDocument();

    // The button should be disabled initially if there are no changes or if a minimum threshold is not met.
    // Inspect the button element role and name from the test output to match correctly.
    // Based on the last test output, the button has role 'button' and name 'arrow_forward'.
    // The component itself should handle the disabled state. We need to simulate that.
    // For now, let's assume it starts disabled because trainingFrequency and trainingDuration are not yet "changed"
    // or don't meet an implicit validity criteria.
    const forwardButton = screen.getByRole('button', { name: /arrow_forward/i });
    expect(forwardButton).toBeDisabled(); 
  });

  it('allows changing training frequency and enables next button', () => {
    const { rerender } = render(<TimeFrequency onNext={mockOnNext} onBack={mockOnBack} />);

    // To find the slider, inspect the rendered HTML or add aria-label to the component.
    // From the previous test output, the sliders are input type="range".
    // They have no explicit accessible name in the output, so we can query by role 'slider'
    // and then further filter by value or other attributes if needed.
    // Let's assume the component's labels are implicitly linked.
    const frequencySlider = screen.getByLabelText(/Days per week/i, { selector: 'input[type="range"]' });
    fireEvent.change(frequencySlider, { target: { value: '5' } });
    expect(mockSetTrainingFrequency).toHaveBeenCalledWith(5);
    expect(screen.getByText('5 days')).toBeInTheDocument();

    // Simulate the condition where the button becomes enabled (e.g., valid selection made)
    rerender(<TimeFrequency onNext={mockOnNext} onBack={mockOnBack} />); // Re-render to pick up state changes

    const forwardButton = screen.getByRole('button', { name: /arrow_forward/i });
    expect(forwardButton).not.toBeDisabled();
    fireEvent.click(forwardButton);
    expect(mockOnNext).toHaveBeenCalledTimes(1);
  });

  it('allows changing training duration and enables next button if frequency is set', () => {
    const { rerender } = render(<TimeFrequency onNext={mockOnNext} onBack={mockOnBack} />);

    // Simulate frequency already set to enable the button
    mockOnboardingStoreState.trainingFrequency = 5;
    rerender(<TimeFrequency onNext={mockOnNext} onBack={mockOnBack} />);

    const durationSlider = screen.getByLabelText(/Minutes per session/i, { selector: 'input[type="range"]' });
    fireEvent.change(durationSlider, { target: { value: '60' } });
    expect(mockSetTrainingDuration).toHaveBeenCalledWith(60);
    expect(screen.getByText('60 min')).toBeInTheDocument();

    const forwardButton = screen.getByRole('button', { name: /arrow_forward/i });
    expect(forwardButton).not.toBeDisabled();
    fireEvent.click(forwardButton);
    expect(mockOnNext).toHaveBeenCalledTimes(1);
  });

  it('calls onBack when back button is clicked', () => {
    render(<TimeFrequency onNext={mockOnNext} onBack={mockOnBack} />);
    const backButton = screen.getByRole('button', { name: /arrow_back/i }); // Assuming back button role is "button"
    fireEvent.click(backButton);
    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });
});