// apps/web/src/components/ContextWindow/ContextWindow.tsx
import React, { useEffect, useState } from 'react';
import { MaterialSymbol } from '@/components/MaterialSymbol';
import { useContextStore, Mood, EnergyLevel } from '@/store/contextStore';
import { generatePlan } from '@/lib/planApi'; // Import the API utility

export const ContextWindow: React.FC = () => {
  const { mood, energyLevel, soreness, setMood, setEnergyLevel, setSoreness } = useContextStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // Sunday - 0, Monday - 1, etc.

    if (dayOfWeek === 1) { // Monday
      setMood('Motivated');
      setEnergyLevel('High');
    } else {
      setMood('Neutral');
      setEnergyLevel('Medium');
    }
  }, [setMood, setEnergyLevel]);

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await generatePlan({ mood, energy: energyLevel, soreness });
      console.log('Plan generated successfully:', response);
      // Here you would typically redirect the user to the plan review screen
      // or update a global state with the generated plan.
    } catch (err: any) {
      console.error('Failed to generate plan:', err);
      setError(err.message || 'Failed to generate plan. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-dark group/design-root overflow-x-hidden font-display">
      {/* Top App Bar */}
      <div className="flex items-center bg-[#102216] p-4 pb-2 justify-between sticky top-0 z-10">
        <div className="text-white flex size-12 shrink-0 items-center justify-start">
          <MaterialSymbol icon="arrow_back_ios_new" className="text-3xl" />
        </div>
        <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">Your Daily Plan</h2>
        <div className="flex size-12 shrink-0 items-center"></div>
      </div>

      {/* Smart Context Window */}
      <div className="p-4 @container">
        <div className="flex flex-col items-stretch justify-start rounded-xl bg-[#193322] p-4">
          <p className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">How are you feeling today?</p>
          <p className="text-[#92c9a4] text-base font-normal leading-normal mt-1">Select your mood and energy level to generate a plan.</p>

          {/* Mood Selection */}
          <h3 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] pt-6 pb-2">Mood</h3>
          <div className="flex">
            <div className="flex h-12 flex-1 items-center justify-center rounded-full bg-[#23482f] p-1">
              {['Stressed', 'Neutral', 'Motivated'].map((m) => (
                <label key={m} className="flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-full px-2 has-[:checked]:bg-[#102216] has-[:checked]:shadow-[0_0_4px_rgba(0,0,0,0.1)] has-[:checked]:text-white text-[#92c9a4] text-sm font-medium leading-normal transition-colors">
                  <span className="truncate text-lg">{m === 'Stressed' ? '😫' : m === 'Neutral' ? '😐' : '🤩'}</span>
                  <span className="ml-2 hidden sm:inline">{m}</span>
                  <input
                    className="invisible w-0"
                    name="mood_selector"
                    type="radio"
                    value={m}
                    checked={mood === m}
                    onChange={() => setMood(m as Mood)}
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Energy Level Selection */}
          <h3 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] pt-6 pb-2">Energy Level</h3>
          <div className="flex">
            <div className="flex h-12 flex-1 items-center justify-center rounded-full bg-[#23482f] p-1">
              {['Low', 'Medium', 'High'].map((e) => (
                <label key={e} className="flex cursor-pointer h-full grow items-center justify-center gap-2 overflow-hidden rounded-full px-2 has-[:checked]:bg-[#102216] has-[:checked]:shadow-[0_0_4px_rgba(0,0,0,0.1)] has-[:checked]:text-white text-[#92c9a4] text-sm font-medium leading-normal transition-colors">
                  <MaterialSymbol
                    icon={e === 'Low' ? 'battery_low' : e === 'Medium' ? 'battery_horiz_050' : 'battery_full'}
                    className={`!text-xl ${e === 'Low' ? 'text-yellow-400' : e === 'Medium' ? 'text-yellow-400' : 'text-primary'}`}
                  />
                  <span className="hidden sm:inline">{e}</span>
                  <input
                    className="invisible w-0"
                    name="energy_selector"
                    type="radio"
                    value={e}
                    checked={energyLevel === e}
                    onChange={() => setEnergyLevel(e as EnergyLevel)}
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Soreness Input */}
          <h3 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] pt-6 pb-2">Soreness / Limitations</h3>
          <textarea
            className="w-full rounded-lg bg-[#23482f] p-3 text-white placeholder-[#92c9a4] focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Any specific muscle soreness or limitations today? (e.g., 'Lower back is a bit tight', 'Shoulder feels off')"
            value={soreness}
            onChange={(e) => setSoreness(e.target.value)}
            rows={3}
          />

          {error && <p className="text-red-500 text-sm mt-4">{error}</p>}

          {/* Generate Plan Button */}
          <button
            onClick={handleSubmit}
            className="mt-8 flex h-14 w-full items-center justify-center rounded-full bg-primary text-background-dark text-lg font-bold transition-transform active:scale-95"
            disabled={isLoading}
          >
            {isLoading ? 'Generating Plan...' : "Generate Today's Plan"}
          </button>
        </div>
      </div>
    </div>
  );
};

// Assuming MaterialSymbol component is something like this:
// You'll need to define this component or ensure it's available in your project.
// For now, I'll assume it's imported from '@/components/MaterialSymbol'
// import React from 'react';

// type MaterialSymbolProps = {
//   icon: string;
//   className?: string;
// };

// export const MaterialSymbol: React.FC<MaterialSymbolProps> = ({ icon, className }) => {
//   return <span className={`material-symbols-outlined ${className}`}>{icon}</span>;
// };
