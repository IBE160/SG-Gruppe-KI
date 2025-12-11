// apps/web/src/app/onboarding/goal-selection.tsx
'use client';

import React, { useState } from 'react';
import { useOnboardingStore } from '@/store/onboardingStore';

interface GoalSelectionProps {
  onNext: () => void;
  onBack: () => void;
}

const GoalSelection: React.FC<GoalSelectionProps> = ({ onNext, onBack }) => {
  const { goal, customGoal, setGoal, setCustomGoal } = useOnboardingStore();
  const [showCustomInput, setShowCustomInput] = useState(goal === 'Custom' && !!customGoal);

  const predefinedGoals = ['Lose Weight', 'Build Muscle', 'Improve Endurance', 'Get Fitter'];

  const handleGoalSelect = (selectedGoal: string) => {
    if (selectedGoal === 'Custom') {
      setShowCustomInput(true);
      setGoal('Custom');
    } else {
      setShowCustomInput(false);
      setCustomGoal(null); // Clear custom goal if a predefined one is selected
      setGoal(selectedGoal);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto pt-20 pb-28"> {/* Added padding for header/footer and scroll */}
        <div className="mx-auto w-full max-w-md"> {/* Centering wrapper */}
          {/* AI Chat Message */}
          <div className="flex items-end gap-3 p-4">
            <div
              className="aspect-square w-10 shrink-0 rounded-full bg-cover bg-center bg-no-repeat"
              data-alt="AI Trainer Avatar with a subtle green circuit pattern"
              style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuB-NWBqeqilG3ybfmSbYUYIlGfvQDV4uzARbG_gaW2Fwqyc8PZR4hSvYi8dUnJg_bSo0wLI15ytpWAfHj0kFrvC5ekmInqZvBnfxEco3vdBHAqTamff9SueE2H_DzD_6c4pgQ3R4Pdyffej-oJeAjMq24ke0sVHnhhAGD1URtYLo9w1vL1rTomWbNA74J6EFlKch35QySUbsMvDdk68pJWuaiI-eXjiMEXAeDeBF0tie23RIiKU0r-hh7IyJFDhRcua0vVc4PJgxTR-")' }}
            ></div>
            <div className="flex flex-1 flex-col items-start gap-1">
              <p className="text-sm font-normal leading-normal text-primary/80">AI Trainer</p>
              <p className="flex max-w-[360px] rounded-xl rounded-bl-sm bg-[#1A3122] px-4 py-3 text-base font-normal leading-normal text-white">
                Welcome! I'm your personal AI trainer. What's your main fitness goal?
              </p>
            </div>
          </div>

          {/* Goal Selection Buttons */}
          <div className="mt-6 flex flex-col items-center">
            <div className="flex w-full max-w-[480px] flex-col items-stretch gap-3 px-4 py-3">
              {predefinedGoals.map((g) => (
                <button
                  key={g}
                  onClick={() => handleGoalSelect(g)}
                  className={`flex h-14 min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-full px-5 text-base font-bold leading-normal tracking-[0.015em] ${
                    goal === g
                      ? 'bg-primary text-background-dark'
                      : 'border border-primary/50 bg-transparent text-white'
                  }`}
                >
                  <span className="truncate">{g}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Button */}
          <div className="mt-2 flex px-4 py-3 justify-center">
            <button
              onClick={() => handleGoalSelect('Custom')}
              className={`flex h-14 min-w-[84px] max-w-[480px] flex-1 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-dashed px-5 text-base font-bold leading-normal tracking-[0.015em] ${
                goal === 'Custom'
                  ? 'border-primary bg-primary/20 text-white'
                  : 'border-primary/50 bg-transparent text-white/80'
              }`}
            >
              <span className="truncate">Custom...</span>
            </button>
          </div>

          {/* Custom Goal Input (shown when 'Custom' is selected) */}
          {showCustomInput && (
            <div className="mt-4 px-4 py-3 flex justify-center">
              <input
                type="text"
                value={customGoal || ''}
                onChange={(e) => setCustomGoal(e.target.value)}
                placeholder="Enter your custom goal"
                className="w-full max-w-[480px] rounded-full bg-white/10 px-5 py-3 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          )}
        </div>
      </div>
      {/* Sticky Footer (Next Button) */}
      <footer className="fixed bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-background-dark to-transparent p-6">
        <button
          onClick={onNext}
          disabled={!goal || (goal === 'Custom' && !customGoal)}
          className="flex h-16 w-full min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-full bg-primary text-background-dark disabled:bg-primary/50 disabled:text-background-dark/70"
        >
          <span className="material-symbols-outlined text-4xl">arrow_forward</span>
        </button>
      </footer>
    </div>
  );
};

export default GoalSelection;
