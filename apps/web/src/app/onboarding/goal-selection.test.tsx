// apps/web/src/app/onboarding/goal-selection.test.tsx
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom'; // Import for additional matchers like toBeEnabled
import GoalSelection from './goal-selection';
import { useOnboardingStore } from '@/store/onboardingStore';

// Mock the zustand store directly to control its state for testing
let mockGoalState: string | null = null;
let mockCustomGoalState: string | null = null;

const mockSetGoal = jest.fn((newGoal: string | null) => {
  mockGoalState = newGoal;
});
const mockSetCustomGoal = jest.fn((newCustomGoal: string | null) => {
  mockCustomGoalState = newCustomGoal;
});

jest.mock('@/store/onboardingStore', () => ({
  useOnboardingStore: jest.fn(() => ({
    goal: mockGoalState,
    customGoal: mockCustomGoalState,
    setGoal: mockSetGoal,
    setCustomGoal: mockSetCustomGoal,
  })),
}));

describe('GoalSelection', () => {
  const mockOnNext = jest.fn();
  const mockOnBack = jest.fn(); // This prop is passed but not used in the component's JSX directly

  const mockedUseOnboardingStore = useOnboardingStore as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockGoalState = null; // Reset state for each test
    mockCustomGoalState = null; // Reset state for each test

    mockedUseOnboardingStore.mockImplementation(() => ({
      goal: mockGoalState,
      customGoal: mockCustomGoalState,
      setGoal: mockSetGoal,
      setCustomGoal: mockSetCustomGoal,
    }));
  });

  it('renders correctly with initial state', () => {
    render(<GoalSelection onNext={mockOnNext} onBack={mockOnBack} />);

    expect(screen.getByText(/What's your main fitness goal?/i)).toBeInTheDocument();
    expect(screen.getByText('Lose Weight')).toBeInTheDocument();
    expect(screen.getByText('Build Muscle')).toBeInTheDocument();
    expect(screen.getByText('Improve Endurance')).toBeInTheDocument();
    expect(screen.getByText('Get Fitter')).toBeInTheDocument();
    expect(screen.getByText('Custom...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /arrow_forward/i })).toBeDisabled(); // Next button should be disabled initially
  });

  it('allows selecting a predefined goal', () => {
    const { rerender } = render(<GoalSelection onNext={mockOnNext} onBack={mockOnBack} />);

    fireEvent.click(screen.getByText('Build Muscle'));
    expect(mockSetGoal).toHaveBeenCalledWith('Build Muscle');

    act(() => {
      mockGoalState = 'Build Muscle';
      mockedUseOnboardingStore.mockImplementation(() => ({
        goal: mockGoalState,
        customGoal: mockCustomGoalState,
        setGoal: mockSetGoal,
        setCustomGoal: mockSetCustomGoal,
      }));
    });
    rerender(<GoalSelection onNext={mockOnNext} onBack={mockOnBack} />);

    expect(screen.getByRole('button', { name: /arrow_forward/i })).toBeEnabled();
  });

  it('allows selecting "Custom" and entering a custom goal', () => {
    const { rerender } = render(<GoalSelection onNext={mockOnNext} onBack={mockOnBack} />);

    fireEvent.click(screen.getByText('Custom...'));
    expect(mockSetGoal).toHaveBeenCalledWith('Custom');

    act(() => {
      mockGoalState = 'Custom';
      mockedUseOnboardingStore.mockImplementation(() => ({
        goal: mockGoalState,
        customGoal: mockCustomGoalState,
        setGoal: mockSetGoal,
        setCustomGoal: mockSetCustomGoal,
      }));
    });
    rerender(<GoalSelection onNext={mockOnNext} onBack={mockOnBack} />);

    const customInput = screen.getByPlaceholderText('Enter your custom goal');
    expect(customInput).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /arrow_forward/i })).toBeDisabled(); // Should be disabled as customGoal is null

    fireEvent.change(customInput, { target: { value: 'Gain Strength' } });
    expect(mockSetCustomGoal).toHaveBeenCalledWith('Gain Strength');

    act(() => {
      mockCustomGoalState = 'Gain Strength';
      mockedUseOnboardingStore.mockImplementation(() => ({
        goal: mockGoalState,
        customGoal: mockCustomGoalState,
        setGoal: mockSetGoal,
        setCustomGoal: mockSetCustomGoal,
      }));
    });
    rerender(<GoalSelection onNext={mockOnNext} onBack={mockOnBack} />);

    expect(screen.getByRole('button', { name: /arrow_forward/i })).toBeEnabled();
  });


  it('calls onNext when the next button is clicked and a goal is selected', () => {
    const { rerender } = render(<GoalSelection onNext={mockOnNext} onBack={mockOnBack} />);

    // Simulate state change for enabled button
    act(() => {
      mockGoalState = 'Lose Weight';
      mockedUseOnboardingStore.mockImplementation(() => ({
        goal: mockGoalState,
        customGoal: mockCustomGoalState,
        setGoal: mockSetGoal,
        setCustomGoal: mockSetCustomGoal,
      }));
    });
    rerender(<GoalSelection onNext={mockOnNext} onBack={mockOnBack} />);

    fireEvent.click(screen.getByRole('button', { name: /arrow_forward/i }));

    expect(mockOnNext).toHaveBeenCalledTimes(1);
  });

  it('disables next button if custom is selected but no text entered', () => {
    const { rerender } = render(<GoalSelection onNext={mockOnNext} onBack={mockOnBack} />);

    fireEvent.click(screen.getByText('Custom...')); // Select custom
    expect(mockSetGoal).toHaveBeenCalledWith('Custom');

    act(() => {
      mockGoalState = 'Custom';
      mockCustomGoalState = null; // Ensure customGoal is null
      mockedUseOnboardingStore.mockImplementation(() => ({
        goal: mockGoalState,
        customGoal: mockCustomGoalState,
        setGoal: mockSetGoal,
        setCustomGoal: mockSetCustomGoal,
      }));
    });
    rerender(<GoalSelection onNext={mockOnNext} onBack={mockOnBack} />);

    expect(screen.getByRole('button', { name: /arrow_forward/i })).toBeDisabled();
  });
});
