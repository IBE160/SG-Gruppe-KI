'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useOnboardingStore } from '@/store/onboardingStore';
import { OnboardingData } from '@/app/types'; // Assuming types.ts will be created for OnboardingData

interface ConfirmationStepProps {
  onNext: () => void; // This will likely trigger the data submission and redirection
  onBack: () => void;
}

const ConfirmationStep: React.FC<ConfirmationStepProps> = ({ onNext, onBack }) => {
  const router = useRouter();
  const onboardingState = useOnboardingStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);

    // Prepare data for submission
    const dataToSend: OnboardingData = {
      goal: onboardingState.goal,
      customGoal: onboardingState.customGoal,
      trainingFrequency: onboardingState.trainingFrequency,
      trainingDuration: onboardingState.trainingDuration,
      equipment: onboardingState.equipment,
      customEquipment: onboardingState.customEquipment,
      injuriesLimitations: onboardingState.injuriesLimitations,
      customInjuriesLimitations: onboardingState.customInjuriesLimitations,
      unitPreference: onboardingState.unitPreference,
    };

    try {
      const response = await fetch('/api/v1/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to submit onboarding data');
      }

      // Clear the onboarding store after successful submission
      onboardingState.setGoal(null);
      onboardingState.setCustomGoal(null);
      onboardingState.setTrainingFrequency(null);
      onboardingState.setTrainingDuration(null);
      onboardingState.setEquipment([]);
      onboardingState.setCustomEquipment(null);
      onboardingState.setInjuriesLimitations([]);
      onboardingState.setCustomInjuriesLimitations(null);
      onboardingState.setUnitPreference(null);


      // Redirect to dashboard on success
      router.push('/dashboard'); 
      onNext(); // Call onNext to potentially advance the step in page.tsx as well
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full pt-20 pb-28 items-center justify-center"> {/* Centered content */}
      <div className="mx-auto w-full max-w-md"> {/* Centering wrapper */}
      {/* AI Chat Message */}
      <div className="flex w-full max-w-sm flex-col items-start gap-3 p-4">
        <div className="flex items-end gap-3">
          <div
            className="aspect-square w-10 shrink-0 rounded-full bg-cover bg-center bg-no-repeat"
            data-alt="Stylized AI coach avatar with a friendly expression"
            style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCbmaT9lIHgZoGa_qtbBxVNgYFMeFS2djijDs_RY-v37qVtkTPcQvRRHC7rqESKxRFLvfJFrnB_F_KcEbFyAqZXTY6TxU67iggN655enj8gHkqscQ4_1O0AvdwDjYf5doFDohd5RLH9aWndE9pn4FeV--Uc9950U2qvpUdr2lZD7579hIYTEVV7ImUxW7qHzvYDGGFfC5qEUe1lChZH2Y5Wjm7exbvLrh2946JJ3LnQ8RXTmobe0iU9DbHJ0mCs7th0F6KJEFSzXGsp")' }}
          ></div>
          <div className="flex flex-1 flex-col gap-1 items-start">
            <p className="text-primary/80 text-sm font-medium leading-normal dark:text-primary/70">AI Coach</p>
            <p className="text-base font-normal leading-relaxed flex max-w-[360px] rounded-2xl rounded-bl-sm px-4 py-3 bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-gray-100">
              Perfect! I have everything I need to create your first workout plan.
            </p>
          </div>
        </div>
      </div>

      {error && <p className="text-red-500 mt-4">{error}</p>}
      </div> {/* End Centering wrapper */}

      {/* Sticky Footer with CTA Button */}
      <footer className="fixed bottom-0 left-0 right-0 z-10 w-full bg-gradient-to-t from-background-dark to-transparent p-6">
        <div className="flex px-4">
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="flex min-w-[84px] w-full max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-14 px-5 bg-primary text-background-dark disabled:bg-primary/50 disabled:text-background-dark/70 gap-2 text-base font-bold leading-normal tracking-[0.015em] shadow-lg shadow-primary/30"
          >
            {isLoading ? 'Submitting...' : 'Let\'s Go!'}
            {!isLoading && <span className="material-symbols-outlined text-3xl text-background-dark">arrow_forward</span>}
          </button>
        </div>
      </footer>
    </div>
  );
};

export default ConfirmationStep;

// Define a type for the data structure to send to the backend
// This should ideally live in a shared types file or generated from Pydantic models
interface OnboardingData {
  goal: string | null;
  customGoal: string | null;
  trainingFrequency: number | null;
  trainingDuration: number | null;
  equipment: string[];
  customEquipment: string | null;
  injuriesLimitations: string[];
  customInjuriesLimitations: string | null;
  unitPreference: 'kg' | 'lbs' | null;
}
