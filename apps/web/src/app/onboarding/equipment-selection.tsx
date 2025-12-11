// apps/web/src/app/onboarding/equipment-selection.tsx
'use client';

import React, { useState } from 'react';
import { useOnboardingStore } from '@/store/onboardingStore';

interface EquipmentSelectionProps {
  onNext: () => void;
  onBack: () => void;
}

const EquipmentSelection: React.FC<EquipmentSelectionProps> = ({ onNext, onBack }) => {
  const { equipment, customEquipment, setEquipment, setCustomEquipment } = useOnboardingStore();
  const [showCustomInput, setShowCustomInput] = useState(equipment.includes('Specify...'));

  const predefinedEquipmentOptions = ['No Equipment', 'Basic (Dumbbells, Bands)', 'Full Gym'];

  const handleEquipmentSelect = (item: string) => {
    if (item === 'Specify...') {
      setShowCustomInput(true);
      // Ensure 'Specify...' is in the selected equipment list
      if (!equipment.includes('Specify...')) {
        setEquipment([...equipment, 'Specify...']);
      }
    } else {
      // Toggle selection for other items
      if (equipment.includes(item)) {
        setEquipment(equipment.filter((e) => e !== item && e !== 'Specify...')); // Also remove Specify if no other options are selected
      } else {
        setEquipment([...equipment.filter((e) => e !== 'No Equipment'), item]); // Remove 'No Equipment' if other selected
      }
      setShowCustomInput(false);
      setCustomEquipment(null);
    }

    if (item === 'No Equipment' && equipment.includes('No Equipment')) {
        // If 'No Equipment' is deselected, clear other options as well
        setEquipment([]);
    } else if (item === 'No Equipment' && !equipment.includes('No Equipment')) {
        // If 'No Equipment' is selected, clear all other selections
        setEquipment(['No Equipment']);
        setShowCustomInput(false);
        setCustomEquipment(null);
    }
  };

  const isSelected = (item: string) => equipment.includes(item);

  // Determine if the next button should be disabled
  const isNextDisabled = equipment.length === 0 || (showCustomInput && !customEquipment);

  return (
    <div className="flex flex-col h-full pt-20 pb-28"> {/* Adjusted padding for header and footer */}
      <div className="mx-auto w-full max-w-md"> {/* Centering wrapper */}
      {/* AI Chat Message */}
      <div className="flex items-end gap-3 p-4">
        <div
          className="aspect-square w-10 shrink-0 rounded-full bg-cover bg-center bg-no-repeat"
          data-alt="Abstract green and dark circular AI avatar"
          style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCVyCTU0c4dz6DkaewhPtMTx5b8zbCImj7mP_LVv3Ketm48IPBZ1SNqI59xEsSj09IzpSICIYrP7MtMsziaPMpSFhkyWTgc61lj1w4Ka6xoCr2kG2uO4ZZuAf9B_9jGU61Ni2HOX18nCZK3G-gbFhALP0n6DKXJzsPk-i6MsKIje7o7b7n7lmS6HgfCFUmmaUYI1GSDqVlkrhOi0JFx64j69ieVjkkKVrDZ-OfhHXH8OlBLcMqrQfiNHyBKEcORHEHQUdJaEVT7hXU8")' }}
        ></div>
        <div className="flex flex-1 flex-col gap-1 items-start">
          <p className="text-primary/70 text-[13px] font-normal leading-normal max-w-[360px]">AI Trainer</p>
          <p className="text-base font-normal leading-normal flex max-w-[360px] rounded-xl px-4 py-3 bg-[#23482f] text-white">
            Got it. What equipment do you have access to?
          </p>
        </div>
      </div>

      {/* Equipment Selection Buttons */}
      <div className="flex justify-center mt-6">
        <div className="flex flex-1 gap-3 max-w-[480px] flex-col items-stretch px-4 py-3">
          {predefinedEquipmentOptions.map((item) => (
            <button
              key={item}
              onClick={() => handleEquipmentSelect(item)}
              className={`flex h-12 min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-full px-5 text-base font-bold leading-normal tracking-[0.015em] w-full ${
                isSelected(item)
                  ? 'bg-primary text-background-dark'
                  : 'border border-primary/50 bg-transparent text-white'
              }`}
            >
              <span className="truncate">{item}</span>
            </button>
          ))}
          <button
            onClick={() => handleEquipmentSelect('Specify...')}
            className={`flex h-12 min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-dashed px-5 text-base font-bold leading-normal tracking-[0.015em] w-full ${
              isSelected('Specify...')
                ? 'border-primary bg-primary/20 text-white'
                : 'border-primary/50 bg-transparent text-white/80'
            }`}
          >
            <span className="truncate">Specify...</span>
          </button>
        </div>
      </div>

      {/* Custom Equipment Input (shown when 'Specify...' is selected) */}
      {showCustomInput && (
        <div className="mt-4 px-4 py-3 flex justify-center">
          <input
            type="text"
            value={customEquipment || ''}
            onChange={(e) => setCustomEquipment(e.target.value)}
            placeholder="Enter your custom equipment"
            className="w-full max-w-[480px] rounded-full bg-white/10 px-5 py-3 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      )}

      </div> {/* End Centering wrapper */}
      {/* Footer with Buttons */}
      <footer className="fixed bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-background-dark to-transparent p-6">
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

export default EquipmentSelection;
