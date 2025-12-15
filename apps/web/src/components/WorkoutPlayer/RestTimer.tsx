// apps/web/src/components/WorkoutPlayer/RestTimer.tsx
'use client';

import React, { useEffect, useRef } from 'react';
import { useWorkoutStore } from '@/store/workoutStore';

// Props are no longer needed as state/actions are from store
interface RestTimerProps {
  // empty
}

export default function RestTimer({}: RestTimerProps) {
  const {
    restDuration, endRest, addTimeRest, setRestDuration, nextExercise, nextExerciseDetails
  } = useWorkoutStore();

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (restDuration <= 0) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      if (restDuration <= 0) { // If it ended naturally
        nextExercise(); // Progress to next exercise/set
      }
      return;
    }

    timerRef.current = setInterval(() => {
      setRestDuration(restDuration - 1);
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [restDuration, setRestDuration, nextExercise]); // Adjusted dependencies


  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const nextUp = nextExerciseDetails(); // Get next exercise details

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-background-dark rounded-lg">
      <h3 className="text-white text-2xl font-bold mb-4">Rest</h3>
      <div className="text-primary text-6xl font-bold mb-6">{formatTime(restDuration)}</div>

      {nextUp && (
        <div className="flex flex-col items-center mb-6 p-4 rounded-lg bg-ui-dark w-full">
          <p className="text-text-muted-dark text-sm mb-2">NEXT UP</p>
          <p className="text-white text-xl font-bold">{nextUp.name}</p>
          <p className="text-primary text-md">{nextUp.sets} sets of {nextUp.reps} reps</p>
        </div>
      )}

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => addTimeRest(30)}
          className="rounded-full px-4 py-2 bg-ui-dark text-white font-bold"
        >
          +30s
        </button>
        <button
          onClick={() => addTimeRest(60)}
          className="rounded-full px-4 py-2 bg-ui-dark text-white font-bold"
        >
          +60s
        </button>
      </div>

      <button
        onClick={nextExercise} // Calls nextExercise to skip rest and progress
        className="w-full rounded-full bg-primary py-3 text-background-dark font-bold"
      >
        Skip Rest
      </button>
    </div>
  );
}
