// apps/web/src/app/onboarding/page.tsx
'use client';

import React, { useState } from 'react';
import OnboardingLayout from './layout';
import OnboardingHeader from './onboarding-header'; // Import the new header component
import GoalSelection from './goal-selection'; // Import the GoalSelection component
import TimeFrequency from './time-frequency'; // Import the TimeFrequency component
import EquipmentSelection from './equipment-selection'; // Import the EquipmentSelection component
import InjuriesLimitations from './injuries-limitations'; // Import the InjuriesLimitations component
import UnitSelection from './unit-selection'; // Import the UnitSelection component
import ConfirmationStep from './confirmation-step'; // Import the ConfirmationStep component

const OnboardingPage: React.FC = () => {
  const steps = [
    'goal-selection',
    'time-frequency',
    'equipment',
    'injuries-limitations',
    'units',
    'confirmation',
  ];
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const goToNextStep = () => {
    setCurrentStepIndex((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const goToPreviousStep = () => {
    setCurrentStepIndex((prev) => Math.max(prev - 1, 0));
  };

  // Render the current step component based on currentStepIndex
  const CurrentStepComponent = () => {
    switch (steps[currentStepIndex]) {
      case 'goal-selection':
        return <GoalSelection onNext={goToNextStep} onBack={goToPreviousStep} />;
      case 'time-frequency':
        return <TimeFrequency onNext={goToNextStep} onBack={goToPreviousStep} />;
      case 'equipment':
        return <EquipmentSelection onNext={goToNextStep} onBack={goToPreviousStep} />;
      case 'injuries-limitations':
        return <InjuriesLimitations onNext={goToNextStep} onBack={goToPreviousStep} />;
      case 'units':
        return <UnitSelection onNext={goToNextStep} onBack={goToPreviousStep} />;
      case 'confirmation':
        return <ConfirmationStep onNext={goToNextStep} onBack={goToPreviousStep} />;
      default:
        return (
          <div className="flex flex-col items-center justify-center p-4 pt-20"> {/* Add pt-20 for header spacing */}
            <h2 className="text-3xl font-bold mb-4">Step {currentStepIndex + 1}</h2>
            <p>Placeholder content for {steps[currentStepIndex]}</p>
            <div className="flex gap-4 mt-8">
              {currentStepIndex > 0 && (
                <button onClick={goToPreviousStep} className="bg-white/10 text-white font-bold py-3 px-6 rounded-full">
                  Previous
                </button>
              )}
              {currentStepIndex < steps.length - 1 && (
                <button onClick={goToNextStep} className="bg-primary text-background-dark font-bold py-3 px-6 rounded-full">
                  Next
                </button>
              )}
               {currentStepIndex === steps.length - 1 && (
                <button onClick={goToNextStep} className="bg-primary text-background-dark font-bold py-3 px-6 rounded-full">
                  Finish
                </button>
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <OnboardingLayout>
      <OnboardingHeader
        currentStepIndex={currentStepIndex}
        totalSteps={steps.length}
        onBack={goToPreviousStep}
      />
      <div className="flex-1 overflow-y-auto"> {/* This div handles the scrollable content below the header */}
        <CurrentStepComponent />
      </div>
    </OnboardingLayout>
  );
};

export default OnboardingPage;