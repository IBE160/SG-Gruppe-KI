import React from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter
import { MaterialSymbol } from '@/components/MaterialSymbol';

// This is a placeholder for the actual WorkoutPlan model
// We'll use this until we integrate with the API in a later task.
const mockPlan = {
  workout_days: [
    {
      day_name: 'Full Body Strength A',
      exercises: [
        { name: 'Barbell Squats', sets: 4, reps: '8-10', is_modified: true },
        { name: 'Push-ups', sets: 3, reps: '15', is_new: false },
        { name: 'Kettlebell Swings', sets: 3, reps: '12', is_new: true },
        { name: 'Plank', sets: 3, reps: '45 sec', is_new: false },
      ],
    },
  ],
  ai_explanation: "We've added a challenge because you're feeling motivated and energetic today. Let's do this!",
};

export const PlanReview: React.FC = () => {
  const router = useRouter(); // Initialize router
  const plan = mockPlan; // Use the mock plan for now

  const onConfirm = () => {
    // In a real scenario, this would involve sending confirmation to the backend
    // and then navigating to the workout player.
    console.log('Plan confirmed! Navigating to workout player.');
    router.push('/dashboard'); // Navigate to the dashboard page
  };

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-dark group/design-root overflow-x-hidden font-display text-white">
      {/* Top App Bar */}
      <div className="flex items-center bg-[#102216] p-4 pb-2 justify-between sticky top-0 z-10">
        <div className="text-white flex size-12 shrink-0 items-center justify-start">
          <MaterialSymbol icon="arrow_back_ios_new" className="text-3xl" />
        </div>
        <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">Review Your Plan</h2>
        <div className="flex size-12 shrink-0 items-center"></div>
      </div>

      <div className="flex flex-col gap-4 px-4 pb-28 pt-4">
        {/* Change Highlight Card */}
        {plan.ai_explanation && (
          <div className="flex items-start gap-3 rounded-xl bg-primary/20 p-4">
            <MaterialSymbol icon="auto_awesome" className="text-primary mt-1" />
            <div className="flex flex-col">
              <p className="font-bold text-primary">Plan Adjusted!</p>
              <p className="text-white/80">{plan.ai_explanation}</p>
            </div>
          </div>
        )}

        {/* Exercise List */}
        {plan.workout_days.map((day, dayIndex) => (
          <div key={dayIndex}>
            <h3 className="text-xl font-bold text-white mb-2">{day.day_name}</h3>
            {day.exercises.map((exercise, exIndex) => (
              <div
                key={exIndex}
                className={`flex items-center gap-4 rounded-xl bg-[#193322] p-4 mb-2 border ${
                  exercise.is_modified ? 'border-yellow-500/50' : exercise.is_new ? 'border-primary/50' : 'border-transparent'
                }`}
              >
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <p className="text-white font-bold">{exercise.name}</p>
                    {exercise.is_modified && (
                      <div className="flex items-center gap-1 rounded-full bg-yellow-500/20 px-2 py-0.5 text-xs font-medium text-yellow-400">
                        <MaterialSymbol icon="edit" className="!text-sm" />
                        <span>MODIFIED</span>
                      </div>
                    )}
                    {exercise.is_new && (
                      <div className="flex items-center gap-1 rounded-full bg-primary/20 px-2 py-0.5 text-xs font-medium text-primary">
                        <MaterialSymbol icon="add" className="!text-sm" />
                        <span>NEW</span>
                      </div>
                    )}
                  </div>
                  <p className="text-white/70">
                    {exercise.sets} sets x {exercise.reps}
                  </p>
                </div>
                <button className="text-white/70 hover:text-white transition-colors">
                  <MaterialSymbol icon="swap_horiz" className="text-3xl" />
                </button>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Confirmation Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-[#102216] to-transparent p-4 pt-8 flex gap-4">
        <button className="flex-1 h-14 w-full items-center justify-center rounded-full bg-white/10 text-white text-lg font-bold transition-transform active:scale-95">
          Edit Plan
        </button>
        <button onClick={onConfirm} className="flex-1 h-14 w-full items-center justify-center rounded-full bg-primary text-background-dark text-lg font-bold transition-transform active:scale-95">
          Confirm Plan
        </button>
      </div>
    </div>
  );
};
