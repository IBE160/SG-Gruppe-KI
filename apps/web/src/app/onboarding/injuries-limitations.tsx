// apps/web/src/app/onboarding/injuries-limitations.tsx
'use client';

import React from 'react';
import { useOnboardingStore } from '@/store/onboardingStore';

interface InjuriesLimitationsProps {
  onNext: () => void;
  onBack: () => void;
}

const InjuriesLimitations: React.FC<InjuriesLimitationsProps> = ({ onNext, onBack }) => {
  const { injuriesLimitations, customInjuriesLimitations, setInjuriesLimitations, setCustomInjuriesLimitations } = useOnboardingStore();

  const predefinedLimitations = ['Knees', 'Shoulders', 'Back', 'None'];

  const handleLimitationSelect = (item: string) => {
    if (item === 'None') {
      if (injuriesLimitations.includes('None')) {
        setInjuriesLimitations([]); // Deselect 'None'
      } else {
        setInjuriesLimitations(['None']); // Select 'None', clear others
        setCustomInjuriesLimitations(null);
      }
    } else {
      // Toggle selection for other items
      if (injuriesLimitations.includes(item)) {
        setInjuriesLimitations(injuriesLimitations.filter((e) => e !== item));
      } else {
        setInjuriesLimitations([...injuriesLimitations.filter((e) => e !== 'None'), item]); // Select, clear 'None'
      }
    }
  };

  const isSelected = (item: string) => injuriesLimitations.includes(item);

  const isNextDisabled = injuriesLimitations.length === 0 && !customInjuriesLimitations;

  return (
    <div className="flex flex-col h-full pt-20 pb-28"> {/* Adjusted padding for header and footer */}
      <div className="mx-auto w-full max-w-md"> {/* Centering wrapper */}
      {/* AI Chat Message */}
      <div className="flex items-end gap-3 p-4">
        <div
          className="aspect-square w-10 shrink-0 rounded-full bg-cover bg-center bg-no-repeat"
          data-alt="AI Trainer avatar with a friendly green circuit pattern"
          style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAGv1AAorlOHUMKG_E7obyCHOrdEVBWJhN2_p609e4J_mjE7oxZF-5mutob9x5T773zrSb9iNRoeKWA78cqjGNsLYWlIOsg72c_1-dI2Lqn5X-mADzFMZYcUYUEwbFqPMwpycq5YZMmy21XFdcCF3SAiuuS57C7aSO_KaibdfKD3EXBV6ZWnqJv7j1e-0UC6tbWdyqKAP3nFaPR5AQR7gaSEZMtKcQ80HygtUUv0-pLZMhJlTsClL0D_jJHApcANy2O4E-pkENi4yAU")' }}
        ></div>
        <div className="flex flex-1 flex-col gap-1 items-start">
          <p className="text-[#92c9a4] text-[13px] font-normal leading-normal">AI Trainer</p>
          <p className="text-base font-normal leading-normal flex max-w-[360px] rounded-xl px-4 py-3 bg-[#193322] text-white">
            Thanks. To keep you safe, do you have any injuries or limitations I should be aware of?
          </p>
        </div>
      </div>

      {/* Chips */}
      <div className="flex gap-3 p-3 flex-wrap pl-16">
        {predefinedLimitations.map((item) => (
          <button
            key={item}
            onClick={() => handleLimitationSelect(item)}
            className={`flex h-10 shrink-0 cursor-pointer items-center justify-center gap-x-2 rounded-full border px-5 text-sm font-medium leading-normal ${
              isSelected(item)
                ? 'border-primary bg-primary/20 text-primary'
                : 'border-[#326744] bg-transparent text-white'
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      {/* TextField */}
      <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-3 py-3 pl-16">
        <label className="flex flex-col min-w-40 flex-1 relative">
          <textarea
            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-white focus:outline-0 focus:ring-0 border border-[#326744] bg-[#193322] focus:border-primary placeholder:text-[#92c9a4] p-4 text-base font-normal leading-normal pr-10"
            placeholder="Specific details or other limitations..."
            value={customInjuriesLimitations || ''}
            onChange={(e) => setCustomInjuriesLimitations(e.target.value)}
          ></textarea>
          <span className="material-symbols-outlined absolute right-3 top-3.5 text-[#92c9a4] cursor-help">info</span>
        </label>
      </div>

      </div> {/* End Centering wrapper */}
      {/* Sticky Footer */}
      <footer className="fixed bottom-0 left-0 right-0 z-10 w-full bg-background-dark/80 p-4 backdrop-blur-sm">
        <div className="flex gap-4">
          <button
            onClick={onBack}
            className="flex h-12 flex-1 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-white/10 text-white gap-2 pl-5 text-base font-bold leading-normal tracking-[0.015em]"
          >
            <span className="material-symbols-outlined !text-3xl">arrow_back</span>
          </button>
          <button
            onClick={onNext}
            disabled={isNextDisabled}
            className="flex h-12 flex-1 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-primary text-background-dark disabled:bg-primary/50 disabled:text-background-dark/70 gap-2 text-base font-bold leading-normal tracking-[0.015em]"
          >
            <span className="material-symbols-outlined !text-3xl">arrow_forward</span>
          </button>
        </div>
      </footer>
    </div>
  );
};

export default InjuriesLimitations;
