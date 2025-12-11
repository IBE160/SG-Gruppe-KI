// apps/web/src/app/onboarding/unit-selection.tsx
'use client';

import React from 'react';
import { useOnboardingStore } from '@/store/onboardingStore';

interface UnitSelectionProps {
  onNext: () => void;
  onBack: () => void;
}

const UnitSelection: React.FC<UnitSelectionProps> = ({ onNext, onBack }) => {
  const { unitPreference, setUnitPreference } = useOnboardingStore();

  const handleUnitSelect = (unit: 'kg' | 'lbs') => {
    setUnitPreference(unit);
  };

  const isNextDisabled = !unitPreference;

  return (
    <div className="flex flex-col h-full pt-20 pb-28"> {/* Adjusted padding for header and footer */}
      <div className="mx-auto w-full max-w-md"> {/* Centering wrapper */}
      {/* SingleMessage Component */}
      <div className="flex items-end gap-3 p-4">
        <div
          className="aspect-square w-10 shrink-0 rounded-full bg-cover bg-center bg-no-repeat"
          data-alt="AI Trainer circular avatar with a green and dark green abstract pattern"
          style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuABhMrVWXBiVIq3Ph4WTqXwA8n2C3ibVo-NzJiUPqknTYzDAPqc98L3wYcSA0XHh-MHMFF7h6XaiW_dxs1U8qJLQFt-xEgXPBbuxEUtHpxkCqxUcGvyqOJzLplvqx_nxDLpJ-tErIjOBQYjpYmnLRQLttZZ2imKsf2cddX37n_J-8kPnzGa5PQdHnR6K1o7ZCpLv7Es8mma41Hs_T075wqQRFoYDawBHJMpRlFBifgJ-gHevv2IDmKQq2PdHp4Ea6HmBoEr9DsZx3a1")' }}
        ></div>
        <div className="flex flex-1 flex-col gap-2 items-start">
          <p className="text-text-muted-light dark:text-text-muted-dark text-sm font-medium">AI Trainer</p>
          <p className="text-base font-normal leading-relaxed flex max-w-[360px] rounded-2xl rounded-bl-sm px-4 py-3 bg-component-light dark:bg-component-dark text-text-light dark:text-text-dark">
            Last question. Do you prefer to work with kilograms or pounds?
          </p>
        </div>
      </div>
      {/* SegmentedButtons Component */}
      <div className="flex py-3 px-4">
        <div className="flex h-12 flex-1 items-center justify-center rounded-full bg-component-light dark:bg-component-dark p-1.5">
          <label
            className={`flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-full px-2 text-sm font-semibold leading-normal ${
              unitPreference === 'kg'
                ? 'bg-background-light dark:bg-background-dark shadow-md text-text-light dark:text-text-dark'
                : 'text-text-muted-light dark:text-text-muted-dark'
            }`}
          >
            <span className="truncate">kg</span>
            <input
              checked={unitPreference === 'kg'}
              onChange={() => handleUnitSelect('kg')}
              className="invisible w-0"
              name="units"
              type="radio"
              value="kg"
            />
          </label>
          <label
            className={`flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-full px-2 text-sm font-semibold leading-normal ${
              unitPreference === 'lbs'
                ? 'bg-background-light dark:bg-background-dark shadow-md text-text-light dark:text-text-dark'
                : 'text-text-muted-light dark:text-text-muted-dark'
            }`}
          >
            <span className="truncate">lbs</span>
            <input
              checked={unitPreference === 'lbs'}
              onChange={() => handleUnitSelect('lbs')}
              className="invisible w-0"
              name="units"
              type="radio"
              value="lbs"
            />
          </label>
        </div>
      </div>

      </div> {/* End Centering wrapper */}
      {/* Sticky Footer */}
      <footer className="fixed bottom-0 left-0 right-0 z-10 w-full bg-gradient-to-t from-background-dark to-transparent p-6">
        <div className="flex justify-center">
          <button
            onClick={onNext}
            disabled={isNextDisabled}
            className="flex min-w-[84px] w-full max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-14 px-5 bg-primary text-background-dark disabled:bg-primary/50 disabled:text-background-dark/70 gap-2 text-base font-bold leading-normal tracking-[0.015em] shadow-lg shadow-primary/30"
          >
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>
      </footer>
    </div>
  );
};

export default UnitSelection;
