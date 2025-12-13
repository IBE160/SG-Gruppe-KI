// apps/web/src/app/settings/profile/view-profile.tsx
import React from 'react';
import { useProfileStore } from '../../../store/profileStore';

export default function ViewProfile() {
  const { currentUserData } = useProfileStore();

  if (!currentUserData) {
    return (
      <div className="flex items-center justify-center p-4 text-white/70">
        Loading profile data...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-4">
      {/* Basic User Information */}
      <div className="rounded-lg bg-card-dark p-4">
        <h3 className="text-lg font-bold text-white mb-2">Account Information</h3>
        <p className="text-sm text-text-muted-dark">Email: <span className="text-white">{currentUserData.email}</span></p>
        <p className="text-sm text-text-muted-dark">Unit Preference: <span className="text-white">{currentUserData.unit_preference}</span></p>
      </div>

      {/* Fitness Goals */}
      <div className="rounded-lg bg-card-dark p-4">
        <h3 className="text-lg font-bold text-white mb-2">Fitness Goals</h3>
        <p className="text-sm text-text-muted-dark">Primary Goal: <span className="text-white">{currentUserData.primary_goal || 'Not set'}</span></p>
        <p className="text-sm text-text-muted-dark">Training Frequency: <span className="text-white">{currentUserData.training_frequency ? `${currentUserData.training_frequency} days/week` : 'Not set'}</span></p>
        <p className="text-sm text-text-muted-dark">Training Duration: <span className="text-white">{currentUserData.training_duration ? `${currentUserData.training_duration} min/session` : 'Not set'}</span></p>
      </div>

      {/* Health & Equipment */}
      <div className="rounded-lg bg-card-dark p-4">
        <h3 className="text-lg font-bold text-white mb-2">Health & Equipment</h3>
        <p className="text-sm text-text-muted-dark">Injuries/Limitations: <span className="text-white">{currentUserData.injuries_limitations || 'None'}</span></p>
        <p className="text-sm text-text-muted-dark">Equipment: <span className="text-white">{currentUserData.equipment?.join(', ') || 'Not set'}</span></p>
      </div>
    </div>
  );
}