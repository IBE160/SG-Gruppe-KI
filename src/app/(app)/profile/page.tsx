'use client';

import React, { useEffect, useState } from 'react';
import { getUserProfile, updateUserProfile, UserProfile, UserProfileUpdate } from '@/app/lib/api/user';
import { supabase } from '@/lib/supabaseClient';

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState<UserProfileUpdate>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        try {
          // Pass the access token to the API function
          const profile = await getUserProfile(session.access_token);
          setUser(profile);
          setFormData(profile);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      } else {
        setError("You are not authenticated.");
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGoalsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    try {
      const goals = JSON.parse(e.target.value);
      setFormData(prev => ({ ...prev, goals }));
    } catch (err) {
      // Handle invalid JSON input
      console.error("Invalid JSON for goals:", err);
      // Optionally set an error state for the goals field
    }
  };

  const handleEquipmentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const equipmentArray = e.target.value.split(',').map(item => item.trim());
    setFormData(prev => ({ ...prev, equipment: equipmentArray }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data: { session } } = await supabase.auth.getSession();

    if (session) {
      try {
        const updatedProfile = await updateUserProfile(session.access_token, formData);
        setUser(updatedProfile);
        setIsEditing(false); // Exit editing mode on successful save
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    } else {
      setError("You are not authenticated.");
      setLoading(false);
    }
  };

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
        <p>No user profile found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">User Profile</h1>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name || ''}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email || ''}
              readOnly // Email typically not editable
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="goals" className="block text-sm font-medium text-gray-700">Goals (JSON)</label>
            <textarea
              name="goals"
              id="goals"
              value={JSON.stringify(formData.goals, null, 2)}
              onChange={handleGoalsChange}
              rows={5}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            ></textarea>
          </div>
          <div>
            <label htmlFor="preferences" className="block text-sm font-medium text-gray-700">Preferences (JSON)</label>
            <textarea
              name="preferences"
              id="preferences"
              value={JSON.stringify(formData.preferences, null, 2)}
              onChange={handleGoalsChange} // Re-using handleGoalsChange for preferences (assuming similar JSON structure)
              rows={5}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            ></textarea>
          </div>
          <div>
            <label htmlFor="equipment" className="block text-sm font-medium text-gray-700">Equipment (comma-separated)</label>
            <input
              type="text"
              name="equipment"
              id="equipment"
              value={Array.isArray(formData.equipment) ? formData.equipment.join(', ') : ''}
              onChange={handleEquipmentChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="injuries" className="block text-sm font-medium text-gray-700">Injuries</label>
            <textarea
              name="injuries"
              id="injuries"
              value={formData.injuries || ''}
              onChange={handleChange}
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
              value={formData.units || ''}
              onChange={handleChange}
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
              onClick={() => {
                setIsEditing(false);
                setFormData(user); // Reset form data if cancelling edit
              }}
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
            <p className="mt-1 text-lg font-semibold">{user.name}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Email:</p>
            <p className="mt-1 text-lg font-semibold">{user.email}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Goals:</p>
            <pre className="mt-1 p-2 bg-gray-50 rounded-md text-sm">{JSON.stringify(user.goals, null, 2)}</pre>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Preferences:</p>
            <pre className="mt-1 p-2 bg-gray-50 rounded-md text-sm">{JSON.stringify(user.preferences, null, 2)}</pre>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Equipment:</p>
            <p className="mt-1 text-lg font-semibold">{Array.isArray(user.equipment) ? user.equipment.join(', ') : ''}</p>
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