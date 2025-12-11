// apps/web/src/app/types.ts

// Define a type for the data structure to send to the backend
// This should ideally live in a shared types file or generated from Pydantic models
export interface OnboardingData {
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
