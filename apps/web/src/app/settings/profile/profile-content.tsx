// apps/web/src/app/settings/profile/profile-content.tsx
'use client';

import React from 'react';
import { useProfileStore } from '../../../store/profileStore';
import ViewProfile from './view-profile';
import EditProfile from './edit-profile';

export default function ProfileContent() {
  const { isEditing, currentUserData, startEditing } = useProfileStore();

  const handleEditClick = () => {
    if (currentUserData) { // This check is already here
      startEditing(currentUserData);
    }
  };

  return (
    <div>
      <div className="flex justify-end p-4">
        {/* Only render Edit Profile button if not editing AND currentUserData is available */}
        {!isEditing && currentUserData && ( // Added currentUserData check here
          <button
            onClick={handleEditClick}
            className="rounded-full px-4 py-2 bg-primary text-background-dark font-bold"
          >
            Edit Profile
          </button>
        )}
      </div>
      {isEditing ? <EditProfile /> : <ViewProfile />}
    </div>
  );
}