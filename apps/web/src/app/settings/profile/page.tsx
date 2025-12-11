import React from 'react';
import { cookies } from 'next/headers';
import ProfileContent from './profile-content'; // Import the new client component
import { useProfileStore } from '../../../store/profileStore';
import { UserProfile } from '../../../store/profileStore'; // Import the interface

// Mock API call for now. This will be replaced by actual backend API call.
async function fetchUserProfile(): Promise<UserProfile | null> {
  // In a real application, you would fetch data from your backend API
  // using the JWT from cookies for authentication.
  // const token = cookies().get('jwt')?.value; // Assuming JWT is stored in cookies
  // const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/users/me`, {
  //   headers: {
  //     'Authorization': `Bearer ${token}`
  //   }
  // });
  // if (!response.ok) {
  //   return null;
  // }
  // const data = await response.json();
  // return data.data;

  // Mock data for development
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: 'user-123',
        email: 'test@example.com',
        unit_preference: 'kg',
        primary_goal: 'Build Muscle',
        training_frequency: 4,
        training_duration: 60,
        injuries_limitations: 'Mild knee pain on heavy squats',
        equipment: ['Dumbbells', 'Barbell', 'Bench'],
      });
    }, 1000);
  });
}

export default async function ProfilePage() {
  const userProfile = await fetchUserProfile();

  // Hydrate the Zustand store on the client side
  // This is a common pattern for Next.js App Router and Zustand
  // where server-fetched data needs to be available in a client store.
  function Hydration() {
    // This component will only run on the client side
    React.useEffect(() => {
      if (userProfile) {
        useProfileStore.getState().setProfile(userProfile);
      }
    }, [userProfile]);
    return null;
  }

  return (
    <>
      <Hydration />
      <ProfileContent />
    </>
  );
}