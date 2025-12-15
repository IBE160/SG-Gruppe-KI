// apps/web/src/components/WorkoutPlayer/SetLogger.test.tsx
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import SetLogger from './SetLogger';
import { useWorkoutStore } from '@/store/workoutStore';

// Mock the workout store
jest.mock('@/store/workoutStore', () => ({
  useWorkoutStore: jest.fn(),
}));

const mockAddLoggedSet = jest.fn();
const mockSetCurrentReps = jest.fn();
const mockSetCurrentWeight = jest.fn();
const mockSetCurrentRPE = jest.fn();

const initialStoreState = {
  currentReps: 0,
  currentWeight: 0,
  currentRPE: 0,
  addLoggedSet: mockAddLoggedSet,
  setCurrentReps: mockSetCurrentReps,
  setCurrentWeight: mockSetCurrentWeight,
  setCurrentRPE: mockSetCurrentRPE,
  // Add other necessary state and actions that the component might access
};

describe('SetLogger', () => {
  const defaultProps = {
    currentExerciseName: 'Barbell Squats',
    currentSetNumber: 1,
    targetReps: 10,
    targetWeight: 100,
    targetRPE: 7,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useWorkoutStore as jest.Mock).mockImplementation((selector) => {
      // Provide a consistent state for the store mock
      const state = { ...initialStoreState };
      return selector ? selector(state) : state;
    });
  });

  it('renders correctly with initial target values', () => {
    render(<SetLogger {...defaultProps} />);

    expect(screen.getByText(`Set ${defaultProps.currentSetNumber}`)).toBeInTheDocument();
    expect(screen.getByLabelText(/REPS/i)).toHaveValue(defaultProps.targetReps);
    expect(screen.getByLabelText(/WEIGHT \(kg\)/i)).toHaveValue(defaultProps.targetWeight);
    expect(screen.getByLabelText(/RPE/i)).toHaveValue(defaultProps.targetRPE);
    expect(screen.getByRole('button', { name: /Log Set/i })).toBeInTheDocument();
  });

  it('calls setCurrentReps when reps input changes', () => {
    render(<SetLogger {...defaultProps} />);
    const repsInput = screen.getByLabelText(/REPS/i);
    fireEvent.change(repsInput, { target: { value: '8' } });
    expect(mockSetCurrentReps).toHaveBeenCalledWith(8);
  });

  it('calls setCurrentWeight when weight input changes', () => {
    render(<SetLogger {...defaultProps} />);
    const weightInput = screen.getByLabelText(/WEIGHT \(kg\)/i);
    fireEvent.change(weightInput, { target: { value: '95' } });
    expect(mockSetCurrentWeight).toHaveBeenCalledWith(95);
  });

  it('calls setCurrentRPE when RPE input changes', () => {
    render(<SetLogger {...defaultProps} />);
    const rpeInput = screen.getByLabelText(/RPE/i);
    fireEvent.change(rpeInput, { target: { value: '8' } });
    expect(mockSetCurrentRPE).toHaveBeenCalledWith(8);
  });

  it('increments/decrements reps using buttons', () => {
    (useWorkoutStore as jest.Mock).mockImplementation((selector) => {
        const state = { ...initialStoreState, currentReps: 10 }; // Simulate current reps
        return selector ? selector(state) : state;
      });
    render(<SetLogger {...defaultProps} />);
    
    fireEvent.click(screen.getByRole('button', { name: '+' }));
    expect(mockSetCurrentReps).toHaveBeenCalledWith(11);

    fireEvent.click(screen.getByRole('button', { name: '-' }));
    expect(mockSetCurrentReps).toHaveBeenCalledWith(9);
  });

  it('increments/decrements weight using buttons', () => {
    (useWorkoutStore as jest.Mock).mockImplementation((selector) => {
        const state = { ...initialStoreState, currentWeight: 100 }; // Simulate current weight
        return selector ? selector(state) : state;
      });
    render(<SetLogger {...defaultProps} />);
    
    const weightIncrementButton = screen.getByLabelText(/WEIGHT \(kg\)/i).nextElementSibling; // Get the + button
    fireEvent.click(screen.getAllByRole('button', { name: '+' })[1]); // Assuming second '+' is for weight
    expect(mockSetCurrentWeight).toHaveBeenCalledWith(102.5);

    const weightDecrementButton = screen.getByLabelText(/WEIGHT \(kg\)/i).previousElementSibling; // Get the - button
    fireEvent.click(screen.getAllByRole('button', { name: '-' })[1]); // Assuming second '-' is for weight
    expect(mockSetCurrentWeight).toHaveBeenCalledWith(97.5);
  });

  it('increments/decrements RPE using buttons', () => {
    (useWorkoutStore as jest.Mock).mockImplementation((selector) => {
        const state = { ...initialStoreState, currentRPE: 7 }; // Simulate current RPE
        return selector ? selector(state) : state;
      });
    render(<SetLogger {...defaultProps} />);
    
    fireEvent.click(screen.getAllByRole('button', { name: '+' })[2]); // Assuming third '+' is for RPE
    expect(mockSetCurrentRPE).toHaveBeenCalledWith(7.5);

    fireEvent.click(screen.getAllByRole('button', { name: '-' })[2]); // Assuming third '-' is for RPE
    expect(mockSetCurrentRPE).toHaveBeenCalledWith(6.5);
  });

  it('calls addLoggedSet when Log Set button is clicked', async () => {
    const { currentExerciseName, currentSetNumber } = defaultProps;
    const expectedLoggedSet = {
      exercise_name: currentExerciseName,
      set_number: currentSetNumber,
      actual_reps: initialStoreState.currentReps,
      actual_weight: initialStoreState.currentWeight,
      rpe: initialStoreState.currentRPE,
      completed_at: expect.any(String), // Date will be dynamic
    };

    render(<SetLogger {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: /Log Set/i }));

    expect(mockAddLoggedSet).toHaveBeenCalledWith(expectedLoggedSet);
  });

  it('disables Log Set button when loading', () => {
    // Simulate loading state
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]); // Mock useState for loading
    render(<SetLogger {...defaultProps} />);
    expect(screen.getByRole('button', { name: 'Logging...' })).toBeDisabled();
  });

  it('initializes store values with target values if store values are default', () => {
    const mockSetCurrentRepsInitial = jest.fn();
    const mockSetCurrentWeightInitial = jest.fn();
    const mockSetCurrentRPEInitial = jest.fn();

    (useWorkoutStore as jest.Mock).mockImplementation((selector) => {
      const state = {
        ...initialStoreState,
        setCurrentReps: mockSetCurrentRepsInitial,
        setCurrentWeight: mockSetCurrentWeightInitial,
        setCurrentRPE: mockSetCurrentRPEInitial,
      };
      return selector ? selector(state) : state;
    });

    render(<SetLogger {...defaultProps} />);

    // Expect initializations based on target props
    expect(mockSetCurrentRepsInitial).toHaveBeenCalledWith(defaultProps.targetReps);
    expect(mockSetCurrentWeightInitial).toHaveBeenCalledWith(defaultProps.targetWeight);
    expect(mockSetCurrentRPEInitial).toHaveBeenCalledWith(defaultProps.targetRPE);
  });
});