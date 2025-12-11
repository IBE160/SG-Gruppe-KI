'use client';

import React from 'react';
import ViewProfile from './view-profile';
import EditProfile from './edit-profile';
import { useProfileStore } from '../../../store/profileStore';

const ProfileContent: React.FC = () => {
  const { isEditing } = useProfileStore();

  return isEditing ? <EditProfile /> : <ViewProfile />;
};

export default ProfileContent;