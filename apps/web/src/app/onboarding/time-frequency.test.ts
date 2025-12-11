// apps/web/src/app/onboarding/time-frequency.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TimeFrequency from './time-frequency';
import { useOnboardingStore } from '@/store/onboardingStore';

// Mock the zustand store for isolated testing
jest.mock('@/store/onboardingStore', () => ({
  useOnboardingStore: jest.fn(() => ({
    trainingFrequency: null,
    trainingDuration: null,
    setTrainingFrequency: jest.fn(),
    setTrainingDuration: jest.fn(),
  })),
}));

describe('TimeFrequency', () => {
  const mockOnNext = jest.fn();
  const mockOnBack = jest.fn();

  const mockStore = useOnboardingStore as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockStore.mockReturnValue({
      trainingFrequency: null,
      trainingDuration: null,
      setTrainingFrequency: jest.fn(),
      setTrainingDuration: jest.fn(),
    });
  });

  it('renders correctly with default values', () => {
    render(<TimeFrequency onNext={mockOnNext} onBack={mockOnBack} />);

    expect(screen.getByText('Days per week')).toBeInTheDocument();
    expect(screen.getByText('4 days')).toBeInTheDocument();
    expect(screen.getByText('Minutes per session')).toBeInTheDocument();
    expect(screen.getByText('45 min')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /arrow_forward/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /arrow_back/i })).toBeInTheDocument();
  });

  it('allows changing training frequency', () => {
    render(<TimeFrequency onNext={mockOnNext} onBack={mockOnBack} />);

    const frequencySlider = screen.getByLabelText('Days per week');
    fireEvent.change(frequencySlider, { target: { value: '5' } });

    expect(useOnboardingStore.getState().trainingFrequency).toBe(5);
    expect(screen.getByText('5 days')).toBeInTheDocument();
  });

  it('allows changing training duration', () => {
    render(<TimeFrequency onNext={mockOnNext} onBack={mockOnBack} />);

    const durationSlider = screen.getByLabelText('Minutes per session');
    fireEvent.change(durationSlider, { target: { value: '60' } });

    expect(useOnboardingStore.getState().trainingDuration).toBe(60);
    expect(screen.getByText('60 min')).toBeInTheDocument();
  });

  it('calls onNext when the forward button is clicked', () => {
    render(<TimeFrequency onNext={mockOnNext} onBack={mockOnBack} />);

    fireEvent.click(screen.getByRole('button', { name: /arrow_forward/i }));
    expect(mockOnNext).toHaveBeenCalledTimes(1);
  });

  it('calls onBack when the back button is clicked', () => {
    render(<TimeFrequency onNext={mockOnNext} onBack={mockOnBack} />);

    fireEvent.click(screen.getByRole('button', { name: /arrow_back/i }));
    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });
});