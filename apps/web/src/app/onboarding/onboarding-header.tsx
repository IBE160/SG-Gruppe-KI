// apps/web/src/app/onboarding/onboarding-header.tsx
'use client';

import React from 'react';

interface OnboardingHeaderProps {
  currentStepIndex: number;
  totalSteps: number;
  onBack: () => void;
}

const OnboardingHeader: React.FC<OnboardingHeaderProps> = ({ currentStepIndex, totalSteps, onBack }) => {
  return (
    <header className="fixed top-0 z-10 w-full bg-background-dark/80 backdrop-blur-sm">
      <div className="mx-auto w-full max-w-md"> {/* Centering wrapper */}
        <div className="flex flex-row items-center justify-between px-4 py-5">
          <button
            onClick={onBack}
            className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white/10"
            aria-label="Back"
          >
            <span className="material-symbols-outlined text-white/80">arrow_back_ios_new</span>
          </button>
          <div className="flex w-full flex-row items-center justify-center gap-3">
            {Array.from({ length: totalSteps }).map((_, index) => (
              <div
                key={index}
                className={`h-2 w-2 rounded-full ${
                  index <= currentStepIndex ? 'bg-primary' : 'bg-white/20'
                }`}
                aria-label="progress-dot"
              ></div>
            ))}
          </div>
          <div className="flex size-10 shrink-0 items-center"></div> {/* Spacer for alignment */}
        </div>
      </div>
    </header>
  );
};

export default OnboardingHeader;
