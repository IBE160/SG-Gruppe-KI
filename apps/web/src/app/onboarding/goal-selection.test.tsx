// apps/web/src/app/onboarding/goal-selection.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react'; // Removed 'act' as it might not be needed with proper hook mocking
import GoalSelection from './goal-selection';
import { useOnboardingStore } from '@/store/onboardingStore'; // Keep import for type inference or if actually needed

// Mock the zustand store for isolated testing
jest.mock('@/store/onboardingStore', () => ({
  useOnboardingStore: jest.fn(() => ({
    goal: null,
    customGoal: null,
    setGoal: jest.fn(),
    setCustomGoal: jest.fn(),
    // Add other state/actions as they are used in the component
  })),
}));

describe('GoalSelection', () => {
  const mockOnNext = jest.fn();
  const mockOnBack = jest.fn();

  // Get the mocked hook's return value for easier assertion setup
  const mockStore = useOnboardingStore as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset store state before each test
    // Provide a fresh mock implementation for each test to avoid state leakage
    mockStore.mockReturnValue({
      goal: null,
      customGoal: null,
      setGoal: jest.fn(),
      setCustomGoal: jest.fn(),
    });
  });

  it('renders correctly with initial state', () => {
    render(<GoalSelection onNext={mockOnNext} onBack={mockOnBack} />);

    expect(screen.getByText("What's your main fitness goal?")).toBeInTheDocument();
    expect(screen.getByText('Lose Weight')).toBeInTheDocument();
    expect(screen.getByText('Build Muscle')).toBeInTheDocument();
    expect(screen.getByText('Improve Endurance')).toBeInTheDocument();
    expect(screen.getByText('Get Fitter')).toBeInTheDocument();
    expect(screen.getByText('Custom...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /arrow_forward/i })).toBeDisabled(); // Next button should be disabled initially
  });

  it('allows selecting a predefined goal', () => {
    render(<GoalSelection onNext={mockOnNext} onBack={mockOnBack} />);

    fireEvent.click(screen.getByText('Build Muscle'));

    expect(useOnboardingStore.getState().goal).toBe('Build Muscle');
    expect(screen.getByRole('button', { name: /arrow_forward/i })).toBeEnabled();
  });

  it('allows selecting "Custom" and entering a custom goal', () => {
    render(<GoalSelection onNext={mockOnNext} onBack={mockOnBack} />);

    fireEvent.click(screen.getByText('Custom...'));
    expect(useOnboardingStore.getState().goal).toBe('Custom');
    
    const customInput = screen.getByPlaceholderText('Enter your custom goal');
    expect(customInput).toBeInTheDocument();

    act(() => {
      fireEvent.change(customInput, { target: { value: 'Gain Strength' } });
    });
    
    expect(useOnboardingStore.getState().customGoal).toBe('Gain Strength');
    expect(screen.getByRole('button', { name: /arrow_forward/i })).toBeEnabled();
  });

  it('calls onNext when the next button is clicked and a goal is selected', () => {
    render(<GoalSelection onNext={mockOnNext} onBack={mockOnBack} />);

    fireEvent.click(screen.getByText('Lose Weight'));
    fireEvent.click(screen.getByRole('button', { name: /arrow_forward/i }));

    expect(mockOnNext).toHaveBeenCalledTimes(1);
  });

  it('disables next button if custom is selected but no text entered', () => {
    render(<GoalSelection onNext={mockOnNext} onBack={mockOnBack} />);
    fireEvent.click(screen.getByText('Custom...'));
    expect(screen.getByRole('button', { name: /arrow_forward/i })).toBeDisabled();
  });
});
