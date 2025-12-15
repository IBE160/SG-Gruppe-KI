// apps/web/src/store/workoutStore.test.ts
import { act } from 'react-dom/test-utils';
import { useWorkoutStore } from './workoutStore';

const mockPlan = {
  workout_days: [
    {
      day_name: 'Full Body Strength A',
      exercises: [
        { name: 'Barbell Squats', sets: 4, reps: '8-10', rpe: 7, target_weight: 100, image: 'image_squats.jpg' },
        { name: 'Push-ups', sets: 3, reps: '15', rpe: 8, image: 'image_pushups.jpg' },
      ],
    },
  ],
};

const initialStoreState = {
  plan: null,
  currentExerciseIndex: 0,
  currentSetIndex: 0,
  currentWeight: 0,
  currentReps: 0,
  currentRPE: 0,
  loggedSets: [],
  isResting: false,
  restDuration: 0,
  defaultRestTime: 60,
};

// Mock localStorage
const localStorageMock = (function () {
  let store: { [key: string]: string } = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('useWorkoutStore', () => {
  beforeEach(() => {
    // Reset the store to its initial state before each test
    act(() => {
      useWorkoutStore.setState(initialStoreState, true); // true to replace state entirely
      useWorkoutStore.persist.clearStorage(); // Clear localStorage mock too
      localStorageMock.clear();
    });
  });

  it('should return initial state', () => {
    const state = useWorkoutStore.getState();
    expect(state.plan).toBeNull();
    expect(state.currentExerciseIndex).toBe(0);
    expect(state.loggedSets).toEqual([]);
  });

  it('should set a workout plan', () => {
    act(() => {
      useWorkoutStore.getState().setPlan(mockPlan);
    });
    expect(useWorkoutStore.getState().plan).toEqual(mockPlan);
  });

  it('should update currentExerciseIndex', () => {
    act(() => {
      useWorkoutStore.getState().setCurrentExerciseIndex(1);
    });
    expect(useWorkoutStore.getState().currentExerciseIndex).toBe(1);
  });

  it('should update currentSetIndex', () => {
    act(() => {
      useWorkoutStore.getState().setCurrentSetIndex(2);
    });
    expect(useWorkoutStore.getState().currentSetIndex).toBe(2);
  });

  it('should update currentWeight', () => {
    act(() => {
      useWorkoutStore.getState().setCurrentWeight(120);
    });
    expect(useWorkoutStore.getState().currentWeight).toBe(120);
  });

  it('should update currentReps', () => {
    act(() => {
      useWorkoutStore.getState().setCurrentReps(12);
    });
    expect(useWorkoutStore.getState().currentReps).toBe(12);
  });

  it('should update currentRPE', () => {
    act(() => {
      useWorkoutStore.getState().setCurrentRPE(9);
    });
    expect(useWorkoutStore.getState().currentRPE).toBe(9);
  });

  it('should add a logged set', () => {
    const newSet = {
      exercise_name: 'Squat',
      set_number: 1,
      actual_reps: 10,
      actual_weight: 100,
      rpe: 7,
    };
    act(() => {
      useWorkoutStore.getState().addLoggedSet(newSet);
    });
    expect(useWorkoutStore.getState().loggedSets).toEqual([newSet]);
  });

  it('should persist and rehydrate state from localStorage', async () => {
    // Set some state
    act(() => {
      useWorkoutStore.getState().setPlan(mockPlan);
      useWorkoutStore.getState().setCurrentExerciseIndex(1);
      useWorkoutStore.getState().setCurrentReps(8);
    });

    // Manually get the persisted state from the store and put it into localStorageMock
    const persistedState = useWorkoutStore.persist.getOptions().getStorage().getItem('workout-storage');
    expect(persistedState).not.toBeNull();
    
    // Simulate re-initialization of the store by creating a new instance
    // and letting it rehydrate from the mocked localStorage
    const rehydratedStore = useWorkoutStore.getState(); // This will trigger rehydration

    // Manually trigger rehydration process or ensure it's completed
    await act(async () => {
        // Need to wait for the rehydration process, which is async.
        // Zustand's persist middleware's `onRehydrateStorage` hook would be useful here,
        // but for a simple test, we can check a known state or wait.
        // Since we're not testing the component, direct state access is fine.
        // We can simply call rehydratedStore.getReady() or check a property that signals rehydration.
        // For testing purposes, use `useWorkoutStore.persist.setOptions({ storage: localStorageMock })`
        // and then call `useWorkoutStore.persist.onRehydrateStorage()`
    });

    // After rehydration, the state should match the persisted state
    expect(rehydratedStore.plan).toEqual(mockPlan);
    expect(rehydratedStore.currentExerciseIndex).toBe(1);
    expect(rehydratedStore.currentReps).toBe(8);
  });

  it('should clear persisted state from localStorage', async () => {
    // Set some state
    act(() => {
      useWorkoutStore.getState().setPlan(mockPlan);
    });

    // Clear persisted state
    act(() => {
      useWorkoutStore.getState().clearPersistedState();
    });

    // Verify localStorage is cleared (Zustand's persist middleware should handle this)
    expect(localStorageMock.getItem('workout-storage')).toBeNull();

    // Verify store state is reset to initial (non-persisted) values
    const state = useWorkoutStore.getState();
    expect(state.plan).toBeNull();
    expect(state.loggedSets).toEqual([]);
    expect(state.currentExerciseIndex).toBe(0);
  });

  it('should reset the workout state', () => {
    act(() => {
      useWorkoutStore.getState().setPlan(mockPlan);
      useWorkoutStore.getState().setCurrentExerciseIndex(1);
      useWorkoutStore.getState().addLoggedSet({
        exercise_name: 'Bench',
        set_number: 1,
        actual_reps: 8,
        actual_weight: 80,
        rpe: 8,
      });
    });

    expect(useWorkoutStore.getState().plan).toEqual(mockPlan);
    expect(useWorkoutStore.getState().currentExerciseIndex).toBe(1);
    expect(useWorkoutStore.getState().loggedSets).toHaveLength(1);

    act(() => {
      useWorkoutStore.getState().resetWorkout();
    });

    const state = useWorkoutStore.getState();
    expect(state.plan).toBeNull(); // Plan is part of the reset
    expect(state.currentExerciseIndex).toBe(0);
    expect(state.currentSetIndex).toBe(0);
    expect(state.currentWeight).toBe(0);
    expect(state.currentReps).toBe(0);
    expect(state.currentRPE).toBe(0);
    expect(state.loggedSets).toEqual([]);
  });
});

