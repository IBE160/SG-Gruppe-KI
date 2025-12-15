// apps/web/src/app/onboarding/time-frequency.test.tsx
// Forced re-processing by adding this comment (2025-12-15)
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
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

    expect(screen.getByLabelText('Days per week')).toBeInTheDocument(); // Changed to getByLabelText
    expect(screen.getByText('4 days')).toBeInTheDocument();
    expect(screen.getByLabelText('Minutes per session')).toBeInTheDocument(); // Changed to getByLabelText
    expect(screen.getByText('45 min')).toBeInTheDocument();

    const forwardButton = screen.getByRole('button', { name: /arrow_forward/i });
    expect(forwardButton).not.toBeDisabled(); // Changed expectation: button should NOT be disabled
  });

  it('allows changing training frequency and enables next button', async () => { // Added async
    const { rerender } = render(<TimeFrequency onNext={mockOnNext} onBack={mockOnBack} />);

    const frequencySlider = screen.getByLabelText(/Days per week/i, { selector: 'input[type="range"]' });
    fireEvent.change(frequencySlider, { target: { value: '5' } });
    expect(mockSetTrainingFrequency).toHaveBeenCalledWith(5);
    await waitFor(() => { // Added await waitFor
      expect(screen.getByText('5 days')).toBeInTheDocument();
    });

    rerender(<TimeFrequency onNext={mockOnNext} onBack={mockOnBack} />);

    const forwardButton = screen.getByRole('button', { name: /arrow_forward/i });
    expect(forwardButton).not.toBeDisabled();
    fireEvent.click(forwardButton);
    expect(mockOnNext).toHaveBeenCalledTimes(1);
  });

  it('allows changing training duration and enables next button if frequency is set', async () => { // Added async
    const { rerender } = render(<TimeFrequency onNext={mockOnNext} onBack={mockOnBack} />);

    mockOnboardingStoreState.trainingFrequency = 5;
    rerender(<TimeFrequency onNext={mockOnNext} onBack={mockOnBack} />);

    const durationSlider = screen.getByLabelText(/Minutes per session/i, { selector: 'input[type="range"]' });
    fireEvent.change(durationSlider, { target: { value: '60' } });
    expect(mockSetTrainingDuration).toHaveBeenCalledWith(60);
    await waitFor(() => { // Added await waitFor
      expect(screen.getByText('60 min')).toBeInTheDocument();
    });

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