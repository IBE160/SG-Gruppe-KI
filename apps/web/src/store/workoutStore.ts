// apps/web/src/store/workoutStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware'; // Import persist

interface Exercise {
  name: string;
  sets: number;
  reps: string;
  rpe: number;
  target_weight: number;
  image: string;
}

interface WorkoutDay {
  day_name: string;
  exercises: Exercise[];
}

interface WorkoutPlan {
  workout_days: WorkoutDay[];
}

interface LoggedSet {
  exercise_name: string;
  set_number: number;
  actual_reps: number;
  actual_weight: number;
  rpe: number;
}

interface WorkoutState {
  plan: WorkoutPlan | null;
  currentExerciseIndex: number;
  currentSetIndex: number;
  currentWeight: number;
  currentReps: number;
  currentRPE: number;
  loggedSets: LoggedSet[];
  isResting: boolean; // New state for rest period
  restDuration: number; // Current duration of the rest timer
  defaultRestTime: number; // Default rest time in seconds (e.g., 60s)
  
  setPlan: (plan: WorkoutPlan) => void;
  setCurrentExerciseIndex: (index: number) => void;
  setCurrentSetIndex: (index: number) => void;
  setCurrentWeight: (weight: number) => void;
  setCurrentReps: (reps: number) => void;
  setCurrentRPE: (rpe: number) => void;
  addLoggedSet: (set: LoggedSet) => void;
  startRest: (duration?: number) => void; // New action
  endRest: () => void; // New action
  addTimeRest: (seconds: number) => void; // New action
  setRestDuration: (duration: number) => void; // New action
  nextExercise: () => void; // New action (placeholder for now)
  nextExerciseDetails: () => { name: string; sets: number; reps: string; } | null; // New computed property
  resetWorkout: () => void;
  clearPersistedState: () => void; // New action to clear persisted state
}

export const useWorkoutStore = create<WorkoutState>()(
  persist( // Wrap with persist middleware
    (set, get) => ({
      plan: null,
      currentExerciseIndex: 0,
      currentSetIndex: 0,
      currentWeight: 0,
      currentReps: 0,
      currentRPE: 0,
      loggedSets: [],
      isResting: false,
      restDuration: 0,
      defaultRestTime: 60, // 60 seconds default rest

      setPlan: (plan) => set({ plan }),
      setCurrentExerciseIndex: (index) => set({ currentExerciseIndex: index }),
      setCurrentSetIndex: (index) => set({ currentSetIndex: index }),
      setCurrentWeight: (weight) => set({ currentWeight: weight }),
      setCurrentReps: (reps) => set({ currentReps: reps }),
      setCurrentRPE: (rpe) => set({ currentRPE: rpe }),
      addLoggedSet: (newSet) => set((state) => ({ loggedSets: [...state.loggedSets, newSet] })),

      startRest: (duration) => set((state) => ({
        isResting: true,
        restDuration: duration !== undefined ? duration : state.defaultRestTime,
      })),
      endRest: () => set({ isResting: false, restDuration: 0 }),
      addTimeRest: (seconds) => set((state) => ({ restDuration: state.restDuration + seconds })),
      setRestDuration: (duration) => set({ restDuration: duration }),
      nextExercise: () => {
        // Placeholder logic for moving to next exercise/set - to be implemented in a later subtask
        console.log('Moving to next exercise/set...');
        set({ isResting: false, restDuration: 0 }); // End rest when progressing
      },
      nextExerciseDetails: () => {
        const state = get();
        const { plan, currentExerciseIndex, currentSetIndex } = state;

        if (!plan || !plan.workout_days || plan.workout_days.length === 0) {
            return null;
        }

        const currentWorkoutDay = plan.workout_days[0]; // Assuming only one workout day for simplicity in Phase 1
        const currentExercise = currentWorkoutDay.exercises[currentExerciseIndex];

        if (!currentExercise) {
            return null;
        }

        // Check for next set in current exercise
        if (currentSetIndex < currentExercise.sets) {
            return {
                name: currentExercise.name,
                sets: currentSetIndex + 1, // Next set number
                reps: currentExercise.reps,
                // Add other relevant details like target_weight, rpe if needed for preview
            };
        }

        // Check for next exercise in current workout day
        if (currentExerciseIndex + 1 < currentWorkoutDay.exercises.length) {
            const nextExerciseItem = currentWorkoutDay.exercises[currentExerciseIndex + 1];
            return {
                name: nextExerciseItem.name,
                sets: 1, // First set of next exercise
                reps: nextExerciseItem.reps,
            };
        }

        return null; // No more exercises or sets
      },

      resetWorkout: () => set({
        plan: null,
        currentExerciseIndex: 0,
        currentSetIndex: 0,
        currentWeight: 0,
        currentReps: 0,
        currentRPE: 0,
        loggedSets: [],
        isResting: false,
        restDuration: 0,
      }),
      clearPersistedState: () => {
        // This action will clear the state that is being persisted
        // Zustand persist middleware provides a way to rehydrate the store after clearing
        set({
          plan: null,
          currentExerciseIndex: 0,
          currentSetIndex: 0,
          currentWeight: 0,
          currentReps: 0,
          currentRPE: 0,
          loggedSets: [],
          isResting: false,
          restDuration: 0,
        });
      },
    }),
    {
      name: 'workout-storage', // unique name
      storage: createJSONStorage(() => localStorage), // Use localStorage
      // Partialize the state to only save what's necessary and avoid saving actions
      partialize: (state) =>
        Object.fromEntries(
          Object.entries(state).filter(([key]) => ![
            'setPlan',
            'setCurrentExerciseIndex',
            'setCurrentSetIndex',
            'setCurrentWeight',
            'setCurrentReps',
            'setCurrentRPE',
            'addLoggedSet',
            'startRest',
            'endRest',
            'addTimeRest',
            'setRestDuration',
            'nextExercise',
            'nextExerciseDetails',
            'resetWorkout',
            'clearPersistedState', // Also exclude new clear action
          ].includes(key))
        ) as WorkoutState, // Type assertion
    }
  )
);
