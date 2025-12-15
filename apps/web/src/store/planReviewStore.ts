// apps/web/src/store/planReviewStore.ts
import { create } from 'zustand';
import { WorkoutPlan } from '@/lib/planApi';

interface PlanReviewState {
  plan: WorkoutPlan | null;
  setPlan: (plan: WorkoutPlan) => void;
  resetState: () => void;
}

export const usePlanReviewStore = create<PlanReviewState>((set) => ({
  plan: null,
  setPlan: (plan) => set({ plan }),
  resetState: () => set({ plan: null }),
}));
