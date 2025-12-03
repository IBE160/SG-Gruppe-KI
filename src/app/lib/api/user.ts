// src/app/lib/api/user.ts

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  goals: Record<string, any>;
  preferences: Record<string, any>;
  equipment: string[];
  injuries: string;
  units: string;
}

export interface UserProfileUpdate {
  name?: string;
  goals?: Record<string, any>;
  preferences?: Record<string, any>;
  equipment?: string[];
  injuries?: string;
  units?: string;
}

export async function getUserProfile(token: string): Promise<UserProfile> {
  const response = await fetch(`${API_URL}/api/v1/users/me`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to fetch user profile');
  }
  return await response.json();
}

export async function updateUserProfile(token: string, data: UserProfileUpdate): Promise<UserProfile> {
  const response = await fetch(`${API_URL}/api/v1/users/me`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to update user profile');
  }
  return await response.json();
}