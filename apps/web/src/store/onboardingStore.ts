// apps/web/src/store/onboardingStore.ts
import { create } from 'zustand';

interface OnboardingState {
  goal: string | null;
  customGoal: string | null;
  trainingFrequency: number | null;
  trainingDuration: number | null;
  equipment: string[];
  customEquipment: string | null;
  injuriesLimitations: string[];
  customInjuriesLimitations: string | null;
  unitPreference: 'kg' | 'lbs' | null;
  // Add other onboarding fields as needed

  setGoal: (goal: string | null) => void;
  setCustomGoal: (customGoal: string | null) => void;
  setTrainingFrequency: (frequency: number | null) => void;
  setTrainingDuration: (duration: number | null) => void;
  setEquipment: (equipment: string[]) => void;
  setCustomEquipment: (customEquipment: string | null) => void;
  setInjuriesLimitations: (injuries: string[]) => void;
  setCustomInjuriesLimitations: (customInjuries: string | null) => void;
  setUnitPreference: (unit: 'kg' | 'lbs' | null) => void;
  resetState: () => void;
  // Add other setters
}

const initialState: OnboardingState = {
  goal: null,
  customGoal: null,
  trainingFrequency: null,
  trainingDuration: null,
  equipment: [],
  customEquipment: null,
  injuriesLimitations: [],
  customInjuriesLimitations: null,
  unitPreference: null,
};

export const useOnboardingStore = create<OnboardingState>((set) => ({
  ...initialState,

  setGoal: (goal) => set({ goal }),
  setCustomGoal: (customGoal) => set({ customGoal }),
  setTrainingFrequency: (trainingFrequency) => set({ trainingFrequency }),
  setTrainingDuration: (trainingDuration) => set({ trainingDuration }),
  setEquipment: (equipment) => set({ equipment }),
  setCustomEquipment: (customEquipment) => set({ customEquipment }),
  setInjuriesLimitations: (injuriesLimitations) => set({ injuriesLimitations }),
  setCustomInjuriesLimitations: (customInjuriesLimitations) => set({ customInjuriesLimitations }),
  setUnitPreference: (unitPreference) => set({ unitPreference }),
  resetState: () => set(initialState),
}));
