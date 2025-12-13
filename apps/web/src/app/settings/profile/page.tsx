// apps/web/src/app/settings/profile/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useProfileStore } from '../../../store/profileStore';
import { useAuthStore } from '../../../store/auth';
import { api } from '../../../lib/api';
import ProfileContent from './profile-content';

interface UserProfileData {
  id: string;
  email: string;
  unit_preference: string;
  primary_goal?: string;
  training_frequency?: number;
  training_duration?: number;
  injuries_limitations?: string;
  equipment?: string[];
}

export default function UserProfilePage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { session } = useAuthStore();
  const { setCurrentUserData } = useProfileStore();

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!session?.access_token) {
        setError('Not authenticated.');
        setLoading(false);
        return;
      }

      try {
        const response = await api.get<UserProfileData>('/users/me', session.access_token);
        if (response.data) {
          setCurrentUserData(response.data);
        } else if (response.error) {
          setError(response.error.message);
        }
      } catch (err) {
        setError('Failed to fetch profile data.');
        console.error('Failed to fetch user profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [session, setCurrentUserData]);

  if (loading) {
    return <div className="p-4 text-white">Loading profile...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  return <ProfileContent />;
}


