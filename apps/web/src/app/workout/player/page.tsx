// apps/web/src/app/workout/player/page.tsx
import React from 'react';

// Mock workout plan for demonstration purposes
const mockWorkoutPlan = {
  id: 'plan-123',
  exercises: [
    {
      name: 'Barbell Squat',
      sets: [
        { target_reps: 8, target_weight: 100, rpe: 7 },
        { target_reps: 8, target_weight: 105, rpe: 7 },
        { target_reps: 6, target_weight: 110, rpe: 8 },
      ],
      video_url: 'https://via.placeholder.com/400x200?text=Barbell+Squat+Video',
    },
    {
      name: 'Bench Press',
      sets: [
        { target_reps: 10, target_weight: 70, rpe: 7 },
        { target_reps: 10, target_weight: 75, rpe: 7 },
        { target_reps: 8, target_weight: 80, rpe: 8 },
      ],
      video_url: 'https://via.placeholder.com/400x200?text=Bench+Press+Video',
    },
    // Add more exercises as needed for a full mock plan
  ],
};

const WorkoutPlayerPage: React.FC = () => {
  // For this subtask, we'll hardcode the current exercise and set for demonstration
  const currentExerciseIndex = 0;
  const currentSetIndex = 0;

  const currentExercise = mockWorkoutPlan.exercises[currentExerciseIndex];
  const currentSet = currentExercise.sets[currentSetIndex];

  const totalExercises = mockWorkoutPlan.exercises.length;
  const currentExerciseNumber = currentExerciseIndex + 1;
  const progressPercentage = (currentExerciseNumber / totalExercises) * 100;

  return (
    <div className="h-auto min-h-screen w-full flex-col font-display bg-background-dark">
      <main className="flex-grow flex flex-col px-4 pt-4 pb-28">
        {/* Header */}
        <header className="flex flex-col items-center justify-center pt-8 pb-4">
          <h1 className="text-text-primary-dark tracking-light text-[32px] font-bold">MAIN WORKOUT</h1>
        </header>

        {/* Overall Progress Bar */}
        <div className="flex flex-col gap-2 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-text-secondary-dark text-sm font-medium">Exercises</span>
            <span className="text-text-primary-dark text-sm">{currentExerciseNumber}/{totalExercises}</span>
          </div>
          <div className="rounded-full bg-surface-dark h-2">
            <div className="h-2 rounded-full bg-primary" style={{ width: `${progressPercentage}%` }}></div>
          </div>
        </div>

        {/* Exercise Card */}
        <div className="flex flex-col gap-4 bg-surface-dark p-4 rounded-lg">
          <h2 className="text-text-primary-dark text-2xl font-bold">{currentExercise.name}</h2>
          {/* Action Buttons */}
          <div className="flex gap-3">
            <button className="flex items-center gap-1 text-text-secondary-dark">
              <span className="material-symbols-outlined">swap_horiz</span>
              <span>Swap Exercise</span>
            </button>
            <button className="flex items-center gap-1 text-text-secondary-dark">
              <span className="material-symbols-outlined">info</span>
              <span>Info</span>
            </button>
          </div>
          {/* Media Player */}
          <div className="relative flex items-center justify-center bg-cover bg-center aspect-video rounded-lg" style={{ backgroundImage: `url(${currentExercise.video_url})` }}>
            <button className="size-14 bg-black/50 text-white backdrop-blur-sm rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined fill text-4xl">play_arrow</span>
            </button>
          </div>

          {/* Set Progress Indicators (Dots) */}
          <div className="flex w-full flex-row items-center justify-start gap-3 py-2">
            {currentExercise.sets.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-2 rounded-full ${
                  index < currentSetIndex ? 'bg-primary' : 'bg-primary/30'
                }`}
              ></div>
            ))}
          </div>

          {/* Target Metrics */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-background-dark py-3 rounded">
              <span className="text-text-secondary-dark text-xs font-medium uppercase">SETS</span>
              <p className="text-text-primary-dark text-lg font-bold">{currentExercise.sets.length}</p>
            </div>
            <div className="bg-background-dark py-3 rounded">
              <span className="text-text-secondary-dark text-xs font-medium uppercase">REPS</span>
              <p className="text-text-primary-dark text-lg font-bold">{currentSet.target_reps}</p>
            </div>
            <div className="bg-background-dark py-3 rounded">
              <span className="text-text-secondary-dark text-xs font-medium uppercase">RPE</span>
              <p className="text-text-primary-dark text-lg font-bold">{currentSet.rpe}</p>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <button className="w-full bg-primary text-background-dark h-14 rounded-full flex items-center justify-center text-lg font-bold mt-6">
          START SET {currentSetIndex + 1}
        </button>
      </main>

      {/* Bottom Navigation Bar Placeholder (copied from Flow_7/screen_4/code.html) */}
      <footer className="fixed bottom-0 left-0 right-0 bg-surface-dark/80 backdrop-blur-lg border-t border-white/10">
        <nav className="flex h-16 items-center justify-around">
          <a href="#" className="flex flex-col items-center justify-center text-text-secondary-dark">
            <span className="material-symbols-outlined">dashboard</span>
            <span className="text-xs">Dashboard</span>
          </a>
          <a href="#" className="flex flex-col items-center justify-center text-primary">
            <span className="material-symbols-outlined fill">fitness_center</span>
            <span className="text-xs">Workout</span>
          </a>
          <a href="#" className="flex flex-col items-center justify-center text-text-secondary-dark">
            <span className="material-symbols-outlined">history</span>
            <span className="text-xs">History</span>
          </a>
          <a href="#" className="flex flex-col items-center justify-center text-text-secondary-dark">
            <span className="material-symbols-outlined">settings</span>
            <span className="text-xs">Settings</span>
          </a>
        </nav>
      </footer>
    </div>
  );
};

export default WorkoutPlayerPage;