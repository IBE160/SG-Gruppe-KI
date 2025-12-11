import React, { useState } from 'react';
import { useProfileStore } from '../../../store/profileStore';
import { ChevronLeft } from 'lucide-react';
import { validateProfileForm } from '../../../lib/profileValidation';
import { supabase } from '../../../lib/supabase'; // Import Supabase client
import { useAuthStore } from '../../../store/authStore'; // Assuming an auth store exists

const EditProfile: React.FC = () => {
  const { tempProfileData, updateTempProfileData, cancelEditing, saveChanges, userProfile } = useProfileStore();
  const { session } = useAuthStore(); // Get session from auth store
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    updateTempProfileData({ [name]: value });
    // Clear validation error for the field being edited
    if (validationErrors[name]) {
      setValidationErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSave = async () => {
    if (!tempProfileData) return;

    const errors = validateProfileForm(tempProfileData);
    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) {
      return; // Stop if validation fails
    }

    setIsSaving(true);
    setSaveError(null);

    try {
      if (!session?.access_token) {
        throw new Error('User not authenticated.');
      }

      // Prepare data for the API call - only send changed fields
      const payload: Partial<typeof userProfile> = {};
      for (const key in tempProfileData) {
        if (tempProfileData[key as keyof typeof tempProfileData] !== userProfile?.[key as keyof typeof userProfile]) {
          // Special handling for equipment as it's an array and might need joining/splitting
          if (key === 'equipment' && Array.isArray(tempProfileData.equipment)) {
             payload.equipment = tempProfileData.equipment;
          } else {
             (payload as any)[key] = tempProfileData[key as keyof typeof tempProfileData];
          }
        }
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/users/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to update profile.');
      }

      const responseData = await response.json();
      // Assuming the API returns the full updated profile data
      saveChanges(responseData.updated_data as any); // Update the main userProfile in store
      alert('Profile updated successfully!'); // Success notification

    } catch (error: any) {
      setSaveError(error.message || 'An unexpected error occurred.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!tempProfileData) {
    // This should ideally not happen if startEditing is called correctly
    return (
      <div className="text-center text-gray-400 p-4">
        No data to edit. Please go back and try again.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Edit Profile Header */}
      <div className="flex justify-between items-center pb-4 border-b border-white/10">
        <button onClick={cancelEditing} className="text-white">
          <ChevronLeft className="h-6 w-6" />
        </button>
        <h2 className="text-2xl font-bold">Edit Profile</h2>
        <div className="w-6" /> {/* Placeholder for alignment */}
      </div>

      {/* Basic Information - Editable */}
      <div className="bg-black/20 rounded-lg p-4 space-y-4">
        <h3 className="text-xl font-semibold">Account Details</h3>
        <div>
          <label htmlFor="email" className="block text-gray-400 text-sm font-medium mb-1">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={tempProfileData.email || ''}
            onChange={handleInputChange}
            className="w-full p-2 rounded-md bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-primary"
            disabled // Email is usually not editable
          />
        </div>
        <div>
          <label htmlFor="unit_preference" className="block text-gray-400 text-sm font-medium mb-1">Unit Preference:</label>
          <select
            id="unit_preference"
            name="unit_preference"
            value={tempProfileData.unit_preference || 'kg'}
            onChange={handleInputChange}
            className="w-full p-2 rounded-md bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="kg">kg</option>
            <option value="lbs">lbs</option>
          </select>
        </div>
      </div>

      {/* Fitness Goals - Editable */}
      <div className="bg-black/20 rounded-lg p-4 space-y-4">
        <h3 className="text-xl font-semibold">Fitness Goals</h3>
        <div>
          <label htmlFor="primary_goal" className="block text-gray-400 text-sm font-medium mb-1">Primary Goal:</label>
          <input
            type="text"
            id="primary_goal"
            name="primary_goal"
            value={tempProfileData.primary_goal || ''}
            onChange={handleInputChange}
            className={`w-full p-2 rounded-md bg-white/10 text-white border ${validationErrors.primary_goal ? 'border-red-500' : 'border-white/20'} focus:outline-none focus:ring-2 focus:ring-primary`}
          />
          {validationErrors.primary_goal && <p className="text-red-500 text-xs mt-1">{validationErrors.primary_goal}</p>}
        </div>
        <div>
          <label htmlFor="training_frequency" className="block text-gray-400 text-sm font-medium mb-1">Training Frequency (days/week):</label>
          <input
            type="number"
            id="training_frequency"
            name="training_frequency"
            value={tempProfileData.training_frequency || ''}
            onChange={handleInputChange}
            className={`w-full p-2 rounded-md bg-white/10 text-white border ${validationErrors.training_frequency ? 'border-red-500' : 'border-white/20'} focus:outline-none focus:ring-2 focus:ring-primary`}
          />
          {validationErrors.training_frequency && <p className="text-red-500 text-xs mt-1">{validationErrors.training_frequency}</p>}
        </div>
        <div>
          <label htmlFor="training_duration" className="block text-gray-400 text-sm font-medium mb-1">Session Duration (min):</label>
          <input
            type="number"
            id="training_duration"
            name="training_duration"
            value={tempProfileData.training_duration || ''}
            onChange={handleInputChange}
            className={`w-full p-2 rounded-md bg-white/10 text-white border ${validationErrors.training_duration ? 'border-red-500' : 'border-white/20'} focus:outline-none focus:ring-2 focus:ring-primary`}
          />
          {validationErrors.training_duration && <p className="text-red-500 text-xs mt-1">{validationErrors.training_duration}</p>}
        </div>
        <div>
          <label htmlFor="injuries_limitations" className="block text-gray-400 text-sm font-medium mb-1">Injuries/Limitations:</label>
          <textarea
            id="injuries_limitations"
            name="injuries_limitations"
            value={tempProfileData.injuries_limitations || ''}
            onChange={handleInputChange}
            rows={3}
            className="w-full p-2 rounded-md bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Equipment - Editable (simplified for now, will need a more complex component) */}
      <div className="bg-black/20 rounded-lg p-4 space-y-4">
        <h3 className="text-xl font-semibold">Available Equipment</h3>
        <label htmlFor="equipment" className="block text-gray-400 text-sm font-medium mb-1">List your equipment (comma separated):</label>
        {/* This will eventually be a more complex component for adding/removing equipment */}
        <textarea
          id="equipment"
          name="equipment"
          value={tempProfileData.equipment?.join(', ') || ''}
          onChange={(e) => updateTempProfileData({ equipment: e.target.value.split(',').map(s => s.trim()) })}
          rows={2}
          placeholder="e.g., Dumbbells, Barbell, Bench"
          className="w-full p-2 rounded-md bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Save Button */}
      <div className="pt-4">
        <button
          onClick={handleSave}
          className="w-full px-4 py-3 bg-primary text-background-dark rounded-full font-bold text-lg"
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
        {saveError && <p className="text-red-500 text-center text-sm mt-2">{saveError}</p>}
      </div>
    </div>
  );
};

export default EditProfile;