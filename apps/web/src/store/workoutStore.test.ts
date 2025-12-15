// apps/web/src/store/workoutStore.test.ts
import { act } from 'react';

// Define localStorageMock globally as it interacts with window.localStorage
const localStorageStore: { [key: string]: string } = {};
const localStorageMock = {
  getItem: jest.fn((key: string) => localStorageStore[key] || null),
  setItem: jest.fn((key: string, value: string) => { localStorageStore[key] = value.toString(); }),
  removeItem: jest.fn((key: string) => { delete localStorageStore[key]; }),
  clear: jest.fn(() => { for (const key in localStorageStore) { delete localStorageStore[key]; } }),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

jest.mock('./workoutStore', () => {
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

  const initialStoreStateBase = {
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

  const mockStore = {
    ...initialStoreStateBase,
    setPlan: jest.fn((plan) => { mockStore.plan = plan; }),
    setCurrentExerciseIndex: jest.fn((index) => { mockStore.currentExerciseIndex = index; }),
    setCurrentSetIndex: jest.fn((index) => { mockStore.currentSetIndex = index; }),
    setCurrentWeight: jest.fn((weight) => { mockStore.currentWeight = weight; }),
    setCurrentReps: jest.fn((reps) => { mockStore.currentReps = reps; }),
    setCurrentRPE: jest.fn((rpe) => { mockStore.currentRPE = rpe; }),
    addLoggedSet: jest.fn((set) => { mockStore.loggedSets.push(set); }),
    startRest: jest.fn(() => { mockStore.isResting = true; mockStore.restDuration = mockStore.defaultRestTime; }),
    endRest: jest.fn(() => { mockStore.isResting = false; mockStore.restDuration = 0; }),
    addTimeRest: jest.fn((time) => { mockStore.restDuration += time; }),
    setRestDuration: jest.fn((duration) => { mockStore.restDuration = duration; }),
    nextExercise: jest.fn(() => {
        const currentExercise = mockStore.plan?.workout_days[0].exercises[mockStore.currentExerciseIndex];
        if (currentExercise && mockStore.currentSetIndex < currentExercise.sets - 1) {
            mockStore.currentSetIndex++;
        } else if (mockStore.plan && mockStore.currentExerciseIndex < mockStore.plan.workout_days[0].exercises.length - 1) {
            mockStore.currentExerciseIndex++;
            mockStore.currentSetIndex = 0;
        } else {
            // End of workout
            mockStore.plan = null;
        }
        mockStore.isResting = false;
        mockStore.restDuration = 0;
    }),
    nextExerciseDetails: jest.fn(() => {
        const plan = mockStore.plan;
        const currentExerciseIndex = mockStore.currentExerciseIndex;
        const currentSetIndex = mockStore.currentSetIndex;

        if (!plan || !plan.workout_days || !plan.workout_days[0] || !plan.workout_days[0].exercises || currentExerciseIndex >= plan.workout_days[0].exercises.length) {
            return null;
        }
        const currentExercise = plan.workout_days[0].exercises[currentExerciseIndex];
        if (!currentExercise || currentSetIndex >= currentExercise.sets) {
            return null;
        }
        return {
            exerciseName: currentExercise.name,
            targetReps: currentExercise.reps,
            targetRPE: currentExercise.rpe,
            targetWeight: currentExercise.target_weight,
            isLastSet: currentSetIndex === currentExercise.sets - 1,
            isLastExercise: currentExerciseIndex === plan.workout_days[0].exercises.length - 1,
        };
    }),
    resetWorkout: jest.fn(() => {
        Object.assign(mockStore, JSON.parse(JSON.stringify(initialStoreStateBase)));
    }),
    clearPersistedState: jest.fn(() => {
        localStorageMock.removeItem('workout-storage'); // Simulate clearing persisted state
    }),
    getState: jest.fn(() => mockStore),
    setState: jest.fn((updater: any) => {
      Object.assign(mockStore, typeof updater === 'function' ? updater(mockStore) : updater);
    }),
    persist: {
      clearStorage: jest.fn(() => { localStorageMock.clear(); }),
      getOptions: () => ({
        getStorage: () => localStorageMock,
      }),
      setOptions: jest.fn(),
      onRehydrateStorage: jest.fn(),
    },
  };

  return {
    useWorkoutStore: mockStore,
    __esModule: true,
    initialStoreStateBase,
    mockPlan,
  };
});

// Import useWorkoutStore, initialStoreStateBase, and mockPlan from the mocked module
import { useWorkoutStore, initialStoreStateBase, mockPlan } from './workoutStore';

describe('useWorkoutStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    localStorageMock.clear(); // Clear the internal state of the localStorage mock

    // Reset the state of the mock store directly using the imported initialStoreStateBase
    // Ensure useWorkoutStore is mutated to reflect the reset state for each test
    Object.assign(useWorkoutStore, JSON.parse(JSON.stringify(initialStoreStateBase)));

    // Re-mock getState and setState to ensure they refer to the current state of useWorkoutStore
    useWorkoutStore.getState.mockClear().mockImplementation(() => useWorkoutStore);
    useWorkoutStore.setState.mockClear().mockImplementation((updater: any) => {
        Object.assign(useWorkoutStore, typeof updater === 'function' ? updater(useWorkoutStore) : updater);
    });

    // Clear specific action mocks
    useWorkoutStore.setPlan.mockClear();
    useWorkoutStore.setCurrentExerciseIndex.mockClear();
    useWorkoutStore.setCurrentSetIndex.mockClear();
    useWorkoutStore.setCurrentWeight.mockClear();
    useWorkoutStore.setCurrentReps.mockClear();
    useWorkoutStore.setCurrentRPE.mockClear();
    useWorkoutStore.addLoggedSet.mockClear();
    useWorkoutStore.startRest.mockClear();
    useWorkoutStore.endRest.mockClear();
    useWorkoutStore.addTimeRest.mockClear();
    useWorkoutStore.setRestDuration.mockClear();
    useWorkoutStore.nextExercise.mockClear();
    useWorkoutStore.nextExerciseDetails.mockClear();
    useWorkoutStore.resetWorkout.mockClear();
    useWorkoutStore.clearPersistedState.mockClear();
    useWorkoutStore.persist.clearStorage.mockClear();

    // Clear localStorageMock method mocks
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
  });

  test('setPlan correctly updates the plan', () => {
    act(() => {
      useWorkoutStore.setPlan(mockPlan);
    });
    expect(useWorkoutStore.setPlan).toHaveBeenCalledWith(mockPlan);
    expect(useWorkoutStore.plan).toEqual(mockPlan);
  });

  test('setCurrentExerciseIndex updates the index', () => {
    act(() => {
      useWorkoutStore.setCurrentExerciseIndex(1);
    });
    expect(useWorkoutStore.setCurrentExerciseIndex).toHaveBeenCalledWith(1);
    expect(useWorkoutStore.currentExerciseIndex).toBe(1);
  });

  test('nextExerciseDetails returns correct details when plan is set', () => {
    act(() => {
      useWorkoutStore.plan = mockPlan; // Manually set the plan on the mock
      useWorkoutStore.currentExerciseIndex = 0;
      useWorkoutStore.currentSetIndex = 0;
    });

    const details = useWorkoutStore.nextExerciseDetails();
    expect(details).toEqual({
      exerciseName: 'Barbell Squats',
      targetReps: '8-10',
      targetRPE: 7,
      targetWeight: 100,
      isLastSet: false,
      isLastExercise: false,
    });
  });

  test('addLoggedSet correctly adds a logged set', () => {
    act(() => {
      useWorkoutStore.addLoggedSet({
        exerciseName: 'Squats',
        setNumber: 1,
        reps: 8,
        weight: 100,
        rpe: 7,
      });
    });
    expect(useWorkoutStore.addLoggedSet).toHaveBeenCalledWith(expect.any(Object));
    expect(useWorkoutStore.loggedSets).toHaveLength(1);
    expect(useWorkoutStore.loggedSets[0]).toEqual({
      exerciseName: 'Squats',
      setNumber: 1,
      reps: 8,
      weight: 100,
      rpe: 7,
    });
  });
});
