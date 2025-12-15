// apps/web/src/store/contextStore.ts
import { create } from 'zustand';

type Mood = 'Stressed' | 'Neutral' | 'Motivated';
type EnergyLevel = 'Low' | 'Medium' | 'High';

interface ContextState {
  mood: Mood;
  energyLevel: EnergyLevel;
  soreness: string;
  setMood: (mood: Mood) => void;
  setEnergyLevel: (energyLevel: EnergyLevel) => void;
  setSoreness: (soreness: string) => void;
  resetState: () => void;
}

export const useContextStore = create<ContextState>((set) => ({
  mood: 'Neutral',
  energyLevel: 'Medium',
  soreness: '',
  setMood: (mood) => set({ mood }),
  setEnergyLevel: (energyLevel) => set({ energyLevel }),
  setSoreness: (soreness) => set({ soreness }),
  resetState: () => set({ mood: 'Neutral', energyLevel: 'Medium', soreness: '' }),
}));
