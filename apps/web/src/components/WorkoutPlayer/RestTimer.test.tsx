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

const mockSetRestDuration = jest.fn();
const mockAddTimeRest = jest.fn();
const mockEndRest = jest.fn();
const mockNextExercise = jest.fn();
const mockNextExerciseDetails = jest.fn();

describe('RestTimer', () => {
  const initialRestDuration = 60; // 60 seconds for tests

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers(); // Mock timers for consistent testing

    (useWorkoutStore as jest.Mock).mockImplementation((selector) => {
      const state = {
        restDuration: initialRestDuration,
        endRest: mockEndRest,
        addTimeRest: mockAddTimeRest,
        setRestDuration: mockSetRestDuration,
        nextExercise: mockNextExercise,
        nextExerciseDetails: mockNextExerciseDetails,
      };
      return selector ? selector(state) : state;
    });
  });

  afterEach(() => {
    jest.runOnlyPendingTimers(); // Clear any pending timers
    jest.useRealTimers(); // Restore real timers
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

  it('calls nextExercise when timer reaches 0', () => {
    render(<RestTimer />);

    act(() => {
      // Simulate timer running down to 0
      (useWorkoutStore as jest.Mock).mockImplementation((selector) => {
        const state = {
          restDuration: 1, // Start at 1 second
          endRest: mockEndRest,
          addTimeRest: mockAddTimeRest,
          setRestDuration: mockSetRestDuration,
          nextExercise: mockNextExercise,
          nextExerciseDetails: mockNextExerciseDetails,
        };
        return selector ? selector(state) : state;
      });
      jest.advanceTimersByTime(1000); // Advance 1 second
    });

    expect(mockSetRestDuration).toHaveBeenCalledWith(0);
    expect(mockNextExercise).toHaveBeenCalledTimes(1);
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