// apps/web/src/types/user.ts

export interface Goal {
  id: string;
  user_id: string;
  primary_goal: string;
  training_frequency: number;
  training_duration: number;
  injuries_limitations: string | null;
  created_at: string;
}

export interface Equipment {
  id: string;
  user_id: string;
  name: string;
}

export interface UserProfile {
  id: string;
  email: string;
  unit_preference: string;
  goals: Goal[];
  equipment: Equipment[];
}