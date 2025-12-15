// apps/web/src/lib/planApi.ts
import { Mood, EnergyLevel } from '@/store/contextStore';

export interface PlanGenerationContext {
  mood: Mood;
  energy: EnergyLevel;
  soreness: string;
}

export interface PlanGenerationRequest {
  context: PlanGenerationContext;
  // Add other fields like user_id, user_profile, user_goals, workout_history if needed by the API
}

export interface WorkoutDay {
  day_name: string;
  exercises: Exercise[];
}

export interface Exercise {
  name: string;
  sets: number;
  reps: string; // e.g., "8-10", "12"
}

export interface WorkoutPlan {
  user_id: string;
  plan_date: string; // ISO date string
  workout_days: WorkoutDay[];
  ai_explanation?: string;
}

export interface PlanGenerationResponse {
  message: string;
  data: WorkoutPlan;
}

export const generatePlan = async (context: PlanGenerationContext): Promise<PlanGenerationResponse> => {
  const requestBody: PlanGenerationRequest = {
    context: context,
  };

  const response = await fetch('/api/v1/plans/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Add Authorization header here if needed. This will typically come from an auth store.
      // 'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to generate plan');
  }

  return response.json();
};
