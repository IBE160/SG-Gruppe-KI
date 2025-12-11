import { UserProfile } from "../store/profileStore";

export const validateProfileForm = (profileData: Partial<UserProfile>) => {
  const errors: { [key: string]: string } = {};

  if (!profileData.primary_goal) {
    errors.primary_goal = 'Primary goal is required.';
  }
  
  // Convert to number for validation if it exists as string
  const trainingFrequency = Number(profileData.training_frequency);
  if (isNaN(trainingFrequency) || trainingFrequency <= 0) {
    errors.training_frequency = 'Training frequency must be a positive number.';
  }

  const trainingDuration = Number(profileData.training_duration);
  if (isNaN(trainingDuration) || trainingDuration <= 0) {
    errors.training_duration = 'Session duration must be a positive number.';
  }

  return errors;
};