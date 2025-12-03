'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { getUserProfile, updateUserProfile, UserProfile, UserProfileUpdate } from '@/app/lib/api/user';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form states, initialized from user or default empty values
  const [name, setName] = useState('');
  const [email, setEmail] = useState(''); // Readonly, but useful to have in state
  const [goalsText, setGoalsText] = useState('');
  const [preferencesText, setPreferencesText] = useState('');
  const [equipmentText, setEquipmentText] = useState('');
  const [injuries, setInjuries] = useState('');
  const [units, setUnits] = useState('');

  // JSON parsing errors
  const [goalsError, setGoalsError] = useState<string | null>(null);
  const [preferencesError, setPreferencesError] = useState<string | null>(null);
  const router = useRouter();

  const fetchProfile = useCallback(async (token: string) => {
    try {
      const profile = await getUserProfile(token);
      setUser(profile);
      // Initialize form states with fetched data
      setName(profile.name || '');
      setEmail(profile.email || '');
      setGoalsText(JSON.stringify(profile.goals || {}, null, 2));
      setPreferencesText(JSON.stringify(profile.preferences || {}, null, 2));
      setEquipmentText(Array.isArray(profile.equipment) ? profile.equipment.join(', ') : '');
      setInjuries(profile.injuries || '');
      setUnits(profile.units || '');
      setError(null);
    } catch (err: any) {
      setError(err.message);
      console.error("Failed to fetch user profile:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    async function getSessionAndFetchProfile() {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        fetchProfile(session.access_token);
      } else {
        setError("You are not authenticated. Please log in.");
        setLoading(false);
        // Optionally redirect to login page
        // router.push('/login');
      }
    }
    getSessionAndFetchProfile();
  }, [fetchProfile, router]); // Added router to dependencies

  const handleGoalsTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setGoalsText(value);
    try {
      if (value.trim() === '') {
        setGoalsError(null);
      } else {
        JSON.parse(value);
        setGoalsError(null);
      }
    } catch (err) {
      setGoalsError("Invalid JSON for Goals");
    }
  };

  const handlePreferencesTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setPreferencesText(value);
    try {
      if (value.trim() === '') {
        setPreferencesError(null);
      } else {
        JSON.parse(value);
        setPreferencesError(null);
      }
    } catch (err) {
      setPreferencesError("Invalid JSON for Preferences");
    }
  };

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setGoalsError(null);
    setPreferencesError(null);

    let parsedGoals: Record<string, any> = {};
    let parsedPreferences: Record<string, any> = {};
    let hasError = false;

    // Validate Goals JSON
    try {
      parsedGoals = goalsText.trim() === '' ? {} : JSON.parse(goalsText);
    } catch (err) {
      setGoalsError("Goals must be valid JSON");
      hasError = true;
    }

    // Validate Preferences JSON
    try {
      parsedPreferences = preferencesText.trim() === '' ? {} : JSON.parse(preferencesText);
    } catch (err) {
      setPreferencesError("Preferences must be valid JSON");
      hasError = true;
    }

    if (hasError) {
      setLoading(false);
      return;
    }

    const { data: { session } } = await supabase.auth.getSession();

    if (session) {
      const payload: UserProfileUpdate = {
        name: name.trim() === '' ? undefined : name,
        goals: parsedGoals,
        preferences: parsedPreferences,
        equipment: equipmentText.split(',').map(item => item.trim()).filter(item => item.length > 0),
        injuries: injuries.trim() === '' ? undefined : injuries,
        units: units.trim() === '' ? undefined : units,
      };

      try {
        // Assume API_URL is handled by the wrapper function updateUserProfile
        const updatedProfile = await updateUserProfile(session.access_token, payload);
        setUser(updatedProfile);
        setIsEditing(false); // Exit editing mode on successful save
        alert('Profile updated successfully!'); // User-friendly feedback
        // Re-fetch to ensure UI is fully consistent with backend, or re-initialize from updatedProfile
        fetchProfile(session.access_token);
      } catch (err: any) {
        setError(err.message);
        console.error("Failed to update user profile:", err);
      } finally {
        setLoading(false);
      }
    } else {
      setError("You are not authenticated. Please log in.");
      setLoading(false);
    }
  };

  const handleCancelEdit = useCallback(() => {
    setIsEditing(false);
    // Reset form states to current user's data
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setGoalsText(JSON.stringify(user.goals || {}, null, 2));
      setPreferencesText(JSON.stringify(user.preferences || {}, null, 2));
      setEquipmentText(Array.isArray(user.equipment) ? user.equipment.join(', ') : '');
      setInjuries(user.injuries || '');
      setUnits(user.units || '');
      setGoalsError(null);
      setPreferencesError(null);
    }
  }, [user]);

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">User Profile</h1>
        <p>Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">User Profile</h1>
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">User Profile</h1>
        <p>No user profile found. Please ensure you are logged in.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">User Profile</h1>

      {isEditing ? (
        <form onSubmit={handleSaveChanges} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              value={email}
              readOnly
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="goals" className="block text-sm font-medium text-gray-700">Goals (JSON)</label>
            <textarea
              name="goals"
              id="goals"
              value={goalsText}
              onChange={handleGoalsTextChange}
              rows={8}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm font-mono ${goalsError ? 'border-red-500' : ''}`}
            ></textarea>
            {goalsError && <p className="text-red-500 text-sm mt-1">{goalsError}</p>}
          </div>
          <div>
            <label htmlFor="preferences" className="block text-sm font-medium text-gray-700">Preferences (JSON)</label>
            <textarea
              name="preferences"
              id="preferences"
              value={preferencesText}
              onChange={handlePreferencesTextChange}
              rows={8}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm font-mono ${preferencesError ? 'border-red-500' : ''}`}
            ></textarea>
            {preferencesError && <p className="text-red-500 text-sm mt-1">{preferencesError}</p>}
          </div>
          <div>
            <label htmlFor="equipment" className="block text-sm font-medium text-gray-700">Equipment (comma-separated)</label>
            <input
              type="text"
              name="equipment"
              id="equipment"
              value={equipmentText}
              onChange={(e) => setEquipmentText(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="injuries" className="block text-sm font-medium text-gray-700">Injuries</label>
            <textarea
              name="injuries"
              id="injuries"
              value={injuries}
              onChange={(e) => setInjuries(e.target.value)}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            ></textarea>
          </div>
          <div>
            <label htmlFor="units" className="block text-sm font-medium text-gray-700">Units</label>
            <input
              type="text"
              name="units"
              id="units"
              value={units}
              onChange={(e) => setUnits(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div className="flex space-x-4">
            <button
              type="submit"
              className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={handleCancelEdit}
              className="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-gray-700">Name:</p>
            <p className="mt-1 text-lg font-semibold">{user.name || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Email:</p>
            <p className="mt-1 text-lg font-semibold">{user.email || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Goals:</p>
            <pre className="mt-1 p-2 bg-gray-50 rounded-md text-sm">{JSON.stringify(user.goals || {}, null, 2)}</pre>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Preferences:</p>
            <pre className="mt-1 p-2 bg-gray-50 rounded-md text-sm">{JSON.stringify(user.preferences || {}, null, 2)}</pre>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Equipment:</p>
            <p className="mt-1 text-lg font-semibold">{Array.isArray(user.equipment) ? user.equipment.join(', ') : 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Injuries:</p>
            <p className="mt-1 text-lg font-semibold">{user.injuries || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Units:</p>
            <p className="mt-1 text-lg font-semibold">{user.units || 'N/A'}</p>
          </div>
          <button
            onClick={() => setIsEditing(true)}
            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Edit Profile
          </button>
        </div>
      )}
    </div>
  );
}