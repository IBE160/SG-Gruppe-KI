// src/app/lib/api/user.ts

const BASE_URL = '/api/v1'; // Assuming Next.js proxy or direct access in dev environment

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  goals: Record<string, any>; // Adjust according to actual data model
  preferences: Record<string, any>; // Adjust according to actual data model
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

export async function getUserProfile(): Promise<UserProfile> {
  const response = await fetch(`${BASE_URL}/users/me`);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch user profile');
  }
  const result = await response.json();
  return result.data; // Assuming API response has a 'data' field
}

export async function updateUserProfile(data: UserProfileUpdate): Promise<UserProfile> {
  const response = await fetch(`${BASE_URL}/users/me`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to update user profile');
  }
  const result = await response.json();
  return result.data; // Assuming API response has a 'data' field
}
