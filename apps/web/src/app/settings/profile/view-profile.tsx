import React from 'react';
import { useProfileStore } from '../../../store/profileStore';

const ViewProfile: React.FC = () => {
  const { userProfile, startEditing } = useProfileStore();

  if (!userProfile) {
    return (
      <div className="text-center text-gray-400 p-4">
        Loading profile data...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="flex justify-between items-center pb-4 border-b border-white/10">
        <h2 className="text-2xl font-bold">Your Profile</h2>
        <button
          onClick={startEditing}
          className="px-4 py-2 bg-primary text-background-dark rounded-full font-medium"
        >
          Edit
        </button>
      </div>

      {/* Basic Information */}
      <div className="bg-black/20 rounded-lg p-4 space-y-3">
        <h3 className="text-xl font-semibold">Account Details</h3>
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Email:</span>
          <span className="text-white">{userProfile.email}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Unit Preference:</span>
          <span className="text-white uppercase">{userProfile.unit_preference}</span>
        </div>
      </div>

      {/* Fitness Goals */}
      {userProfile.primary_goal && (
        <div className="bg-black/20 rounded-lg p-4 space-y-3">
          <h3 className="text-xl font-semibold">Fitness Goals</h3>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Primary Goal:</span>
            <span className="text-white">{userProfile.primary_goal}</span>
          </div>
          {userProfile.training_frequency && (
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Training Frequency:</span>
              <span className="text-white">{userProfile.training_frequency} days/week</span>
            </div>
          )}
          {userProfile.training_duration && (
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Session Duration:</span>
              <span className="text-white">{userProfile.training_duration} min</span>
            </div>
          )}
          {userProfile.injuries_limitations && (
            <div>
              <span className="text-gray-400 block pb-1">Injuries/Limitations:</span>
              <span className="text-white">{userProfile.injuries_limitations}</span>
            </div>
          )}
        </div>
      )}

      {/* Equipment */}
      {userProfile.equipment && userProfile.equipment.length > 0 && (
        <div className="bg-black/20 rounded-lg p-4 space-y-3">
          <h3 className="text-xl font-semibold">Available Equipment</h3>
          <ul className="list-disc list-inside text-white ml-4">
            {userProfile.equipment.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ViewProfile;