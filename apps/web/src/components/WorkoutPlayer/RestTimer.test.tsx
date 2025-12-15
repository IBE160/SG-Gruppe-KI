// apps/web/src/components/WorkoutPlayer/RestTimer.test.tsx
import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import RestTimer from './RestTimer';
import { useWorkoutStore } from '@/store/workoutStore';

// Mock the workout store
jest.mock('@/store/workoutStore', () => ({
  useWorkoutStore: jest.fn(),
}));

describe('RestTimer', () => {
  const initialRestDuration = 60; // Default for most tests
  let currentRestDuration: number; // Mutable variable for rest duration

  // Define mocks here so they are in scope for the mockImplementation
  let mockSetRestDuration: jest.Mock;
  let mockAddTimeRest: jest.Mock;
  let mockEndRest: jest.Mock;
  let mockNextExercise: jest.Mock;
  let mockNextExerciseDetails: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();

    // Initialize mock functions inside beforeEach
    mockSetRestDuration = jest.fn();
    mockAddTimeRest = jest.fn();
    mockEndRest = jest.fn();
    mockNextExercise = jest.fn();
    mockNextExerciseDetails = jest.fn();

    // Reset currentRestDuration for each test
    currentRestDuration = initialRestDuration;

    (useWorkoutStore as jest.Mock).mockImplementation((selector) => {
      const state = {
        restDuration: currentRestDuration, // Use the mutable variable
        endRest: mockEndRest, // Now mockEndRest is defined
        addTimeRest: mockAddTimeRest,
        setRestDuration: jest.fn((duration) => {
            currentRestDuration = duration; // Update the mutable variable
            mockSetRestDuration(duration); // Call the original mock fn to track calls
        }),
        nextExercise: mockNextExercise,
        nextExerciseDetails: mockNextExerciseDetails,
      };
      return selector ? selector(state) : state;
    });
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('renders correctly with initial duration', () => {
    render(<RestTimer />);
    expect(screen.getByText('Rest')).toBeInTheDocument();
    expect(screen.getByText('01:00')).toBeInTheDocument();
  });

  it('decrements the timer every second', () => {
    render(<RestTimer />);
    expect(screen.getByText('01:00')).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(1000); // Advance 1 second
    });
    expect(mockSetRestDuration).toHaveBeenCalledWith(initialRestDuration - 1);
  });

  it('calls nextExercise when timer reaches 0', async () => {
    // Set the specific initial restDuration for this test BEFORE rendering
    currentRestDuration = 1;

    render(<RestTimer />);

    act(() => {
      jest.advanceTimersByTime(1000); // Advance 1 second
    });

    await waitFor(() => {
      expect(mockSetRestDuration).toHaveBeenCalledWith(0); // The mockSetRestDuration from beforeEach is now called
      expect(mockNextExercise).toHaveBeenCalledTimes(1);
    });
  });

  it('calls addTimeRest when +30s button is clicked', () => {
    render(<RestTimer />);
    fireEvent.click(screen.getByRole('button', { name: '+30s' }));
    expect(mockAddTimeRest).toHaveBeenCalledWith(30);
  });

  it('calls addTimeRest when +60s button is clicked', () => {
    render(<RestTimer />);
    fireEvent.click(screen.getByRole('button', { name: '+60s' }));
    expect(mockAddTimeRest).toHaveBeenCalledWith(60);
  });

  it('calls nextExercise when Skip Rest button is clicked', () => {
    render(<RestTimer />);
    fireEvent.click(screen.getByRole('button', { name: 'Skip Rest' }));
    expect(mockNextExercise).toHaveBeenCalledTimes(1);
  });

  it('displays next exercise details if available', () => {
    const mockNextUp = { name: 'Deadlifts', sets: 3, reps: '5' };
    (useWorkoutStore as jest.Mock).mockImplementation((selector) => {
        const state = {
          restDuration: initialRestDuration,
          endRest: mockEndRest,
          addTimeRest: mockAddTimeRest,
          setRestDuration: mockSetRestDuration,
          nextExercise: mockNextExercise,
          nextExerciseDetails: () => mockNextUp, // Return mock details
        };
        return selector ? selector(state) : state;
      });

    render(<RestTimer />);
    expect(screen.getByText('NEXT UP')).toBeInTheDocument();
    expect(screen.getByText(mockNextUp.name)).toBeInTheDocument();
    expect(screen.getByText(`${mockNextUp.sets} sets of ${mockNextUp.reps} reps`)).toBeInTheDocument();
  });

  it('does not display next exercise details if not available', () => {
    (useWorkoutStore as jest.Mock).mockImplementation((selector) => {
        const state = {
          restDuration: initialRestDuration,
          endRest: mockEndRest,
          addTimeRest: mockAddTimeRest,
          setRestDuration: mockSetRestDuration,
          nextExercise: mockNextExercise,
          nextExerciseDetails: () => null, // Return null
        };
        return selector ? selector(state) : state;
      });

    render(<RestTimer />);
    expect(screen.queryByText('NEXT UP')).not.toBeInTheDocument();
  });
});