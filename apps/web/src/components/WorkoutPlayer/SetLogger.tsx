// apps/web/src/components/WorkoutPlayer/SetLogger.tsx
'use client';

import React from 'react'; // Removed useState
import { useWorkoutStore } from '@/store/workoutStore';

interface SetLoggerProps {
  currentExerciseName: string;
  currentSetNumber: number;
  targetReps: string | number;
  targetWeight: number;
  targetRPE: number;
  // Removed onLogSet prop
}

export default function SetLogger({
  currentExerciseName,
  currentSetNumber,
  targetReps,
  targetWeight,
  targetRPE,
  // Removed onLogSet from destructuring
}: SetLoggerProps) {
  const {
    currentReps, setCurrentReps,
    currentWeight, setCurrentWeight,
    currentRPE, setCurrentRPE,
    addLoggedSet
  } = useWorkoutStore();

  // Initialize store values if they are default (0), with target values
  React.useEffect(() => {
    if (currentReps === 0 && Number(targetReps) > 0) setCurrentReps(Number(targetReps));
    if (currentWeight === 0 && targetWeight > 0) setCurrentWeight(targetWeight);
    if (currentRPE === 0 && targetRPE > 0) setCurrentRPE(targetRPE);
  }, [targetReps, targetWeight, targetRPE, currentReps, currentWeight, currentRPE, setCurrentReps, setCurrentWeight, setCurrentRPE]);


  const [loading, setLoading] = React.useState(false); // Local loading state remains

  const handleLogSet = async () => {
    setLoading(true);
    const loggedSet = {
      exercise_name: currentExerciseName,
      set_number: currentSetNumber,
      actual_reps: currentReps, // Use store state
      actual_weight: currentWeight, // Use store state
      rpe: currentRPE, // Use store state
      completed_at: new Date().toISOString(),
    };
    console.log('Logging set:', loggedSet);
    addLoggedSet(loggedSet); // Call store action
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-4 p-4 bg-card-dark rounded-lg">
      <h3 className="text-lg font-bold text-white">Set {currentSetNumber}</h3>

      <div className="grid grid-cols-3 gap-3 text-center">
        {/* Input for Actual Reps */}
        <div className="flex flex-col items-center">
          <label className="text-text-muted-dark text-xs uppercase font-medium" htmlFor="actual-reps">REPS</label>
          <div className="flex items-center justify-between rounded-md bg-background-dark border border-ui-dark p-2 mt-1 w-full">
            <button
              type="button"
              onClick={() => setCurrentReps(Math.max(0, currentReps - 1))}
              className="size-8 rounded-full bg-ui-dark text-white text-lg font-bold flex items-center justify-center"
            >
              -
            </button>
            <input
              id="actual-reps"
              type="number"
              value={currentReps}
              onChange={(e) => setCurrentReps(Number(e.target.value))}
              className="w-full text-center bg-transparent border-none text-white text-xl font-bold focus:ring-0"
            />
            <button
              type="button"
              onClick={() => setCurrentReps(currentReps + 1)}
              className="size-8 rounded-full bg-ui-dark text-white text-lg font-bold flex items-center justify-center"
            >
              +
            </button>
          </div>
        </div>

        {/* Input for Actual Weight */}
        <div className="flex flex-col items-center">
          <label className="text-text-muted-dark text-xs uppercase font-medium" htmlFor="actual-weight">WEIGHT (kg)</label>
          <div className="flex items-center justify-between rounded-md bg-background-dark border border-ui-dark p-2 mt-1 w-full">
            <button
              type="button"
              onClick={() => setCurrentWeight(Math.max(0, currentWeight - 2.5))}
              className="size-8 rounded-full bg-ui-dark text-white text-lg font-bold flex items-center justify-center"
            >
              -
            </button>
            <input
              id="actual-weight"
              type="number"
              value={currentWeight}
              onChange={(e) => setCurrentWeight(Number(e.target.value))}
              className="w-full text-center bg-transparent border-none text-white text-xl font-bold focus:ring-0"
            />
            <button
              type="button"
              onClick={() => setCurrentWeight(currentWeight + 2.5)}
              className="size-8 rounded-full bg-ui-dark text-white text-lg font-bold flex items-center justify-center"
            >
              +
            </button>
          </div>
        </div>

        {/* Input for Actual RPE */}
        <div className="flex flex-col items-center">
          <label className="text-text-muted-dark text-xs uppercase font-medium" htmlFor="actual-rpe">RPE</label>
          <div className="flex items-center justify-between rounded-md bg-background-dark border border-ui-dark p-2 mt-1 w-full">
            <button
              type="button"
              onClick={() => setCurrentRPE(Math.max(0, currentRPE - 0.5))}
              className="size-8 rounded-full bg-ui-dark text-white text-lg font-bold flex items-center justify-center"
            >
              -
            </button>
            <input
              id="actual-rpe"
              type="number"
              value={currentRPE}
              onChange={(e) => setCurrentRPE(Number(e.target.value))}
              className="w-full text-center bg-transparent border-none text-white text-xl font-bold focus:ring-0"
            />
            <button
              type="button"
              onClick={() => setCurrentRPE(Math.min(10, currentRPE + 0.5))}
              className="size-8 rounded-full bg-ui-dark text-white text-lg font-bold flex items-center justify-center"
            >
              +
            </button>
          </div>
        </div>
      </div>

      <button
        onClick={handleLogSet}
        disabled={loading}
        className="mt-4 w-full rounded-full bg-primary py-3 text-background-dark font-bold disabled:opacity-50"
      >
        {loading ? 'Logging...' : 'Log Set'}
      </button>
    </div>
  );
}