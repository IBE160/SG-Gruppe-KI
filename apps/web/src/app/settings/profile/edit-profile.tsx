// apps/web/src/app/settings/profile/edit-profile.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useProfileStore } from '../../../store/profileStore';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

export default function EditProfile() {
  const { tempUserData, updateTempUserData, cancelEditing, saveProfile } = useProfileStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initial values for Formik
  const initialValues = {
    email: tempUserData?.email || '',
    unit_preference: tempUserData?.unit_preference || '',
    primary_goal: tempUserData?.primary_goal || '',
    training_frequency: tempUserData?.training_frequency || '',
    training_duration: tempUserData?.training_duration || '',
    injuries_limitations: tempUserData?.injuries_limitations || '',
    equipment: tempUserData?.equipment?.join(', ') || '',
  };

  const EditProfileSchema = Yup.object().shape({
    email: Yup.string().email('Please enter a valid email address.').required('Email is required.'),
    unit_preference: Yup.string().required('Unit preference is required.'),
    primary_goal: Yup.string().optional(),
    training_frequency: Yup.number().min(0, 'Cannot be negative').optional().nullable(true),
    training_duration: Yup.number().min(0, 'Cannot be negative').optional().nullable(true),
    injuries_limitations: Yup.string().optional(),
    equipment: Yup.string().optional(),
  });

  const handleSave = async (values: typeof initialValues) => {
    setLoading(true);
    setError(null);
    console.log('Saving data:', values); // Keep for test assertions

    try {
      // Simulate API call or direct store update
      await saveProfile({
        ...values,
        equipment: values.equipment ? values.equipment.split(', ').map(s => s.trim()) : [],
        training_frequency: values.training_frequency === '' ? null : Number(values.training_frequency),
        training_duration: values.training_duration === '' ? null : Number(values.training_duration),
      });
      // After successful save, cancel editing mode
      cancelEditing();
    } catch (err: any) {
      setError(err.message || 'Failed to save profile.');
    } finally {
      setLoading(false);
    }
  };

  // Ensure tempUserData is updated if props change (unlikely with Formik, but good practice)
  useEffect(() => {
    if (tempUserData) {
      // Formik handles its own state internally, so this might not be strictly needed for Formik fields
      // but if there were non-Formik controlled elements, this would keep them in sync.
    }
  }, [tempUserData]);

  if (!tempUserData) {
    return (
      <div className="flex items-center justify-center p-4 text-white/70">
        Authentication token missing. Please log in again.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-4">
      {error && <p className="rounded-md bg-red-500/20 p-3 text-red-500 text-sm font-medium">Error: {error}</p>}
      <Formik
        initialValues={initialValues}
        validationSchema={EditProfileSchema}
        onSubmit={handleSave}
        enableReinitialize={true} // Important to re-initialize form when tempUserData changes
      >
        {({ values, errors, touched, isValid }) => (
          <Form>
            {/* Account Information */}
            <div className="rounded-lg bg-card-dark p-4 mb-6">
              <h3 className="text-lg font-bold text-white mb-2">Account Information</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-text-muted-dark mb-1" htmlFor="email">Email</label>
                <Field
                  className="w-full rounded-md bg-background-dark border border-ui-dark p-2 text-white cursor-not-allowed"
                  id="email"
                  name="email"
                  type="email"
                  disabled // Email is read-only
                />
                <ErrorMessage name="email" component="p" className="text-red-500 text-xs mt-1" />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-text-muted-dark mb-1" htmlFor="unit_preference">Unit Preference</label>
                <Field
                  as="select"
                  className="w-full rounded-md bg-background-dark border border-ui-dark p-2 text-white"
                  id="unit_preference"
                  name="unit_preference"
                >
                  <option value="">Select unit</option>
                  <option value="kg">kg</option>
                  <option value="lbs">lbs</option>
                </Field>
                <ErrorMessage name="unit_preference" component="p" className="text-red-500 text-xs mt-1" />
              </div>
            </div>

            {/* Fitness Goals */}
            <div className="rounded-lg bg-card-dark p-4 mb-6">
              <h3 className="text-lg font-bold text-white mb-2">Fitness Goals</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-text-muted-dark mb-1" htmlFor="primary_goal">Primary Goal</label>
                <Field
                  className="w-full rounded-md bg-background-dark border border-ui-dark p-2 text-white"
                  id="primary_goal"
                  name="primary_goal"
                  type="text"
                />
                <ErrorMessage name="primary_goal" component="p" className="text-red-500 text-xs mt-1" />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-text-muted-dark mb-1" htmlFor="training_frequency">Training Frequency (days/week)</label>
                <Field
                  className="w-full rounded-md bg-background-dark border border-ui-dark p-2 text-white"
                  id="training_frequency"
                  name="training_frequency"
                  type="number"
                />
                <ErrorMessage name="training_frequency" component="p" className="text-red-500 text-xs mt-1" />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-text-muted-dark mb-1" htmlFor="training_duration">Training Duration (minutes)</label>
                <Field
                  className="w-full rounded-md bg-background-dark border border-ui-dark p-2 text-white"
                  id="training_duration"
                  name="training_duration"
                  type="number"
                />
                <ErrorMessage name="training_duration" component="p" className="text-red-500 text-xs mt-1" />
              </div>
            </div>

            {/* Health & Equipment */}
            <div className="rounded-lg bg-card-dark p-4 mb-6">
              <h3 className="text-lg font-bold text-white mb-2">Health & Equipment</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-text-muted-dark mb-1" htmlFor="injuries_limitations">Injuries/Limitations</label>
                <Field
                  as="textarea"
                  className="w-full rounded-md bg-background-dark border border-ui-dark p-2 text-white"
                  id="injuries_limitations"
                  name="injuries_limitations"
                  rows={3}
                />
                <ErrorMessage name="injuries_limitations" component="p" className="text-red-500 text-xs mt-1" />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-text-muted-dark mb-1" htmlFor="equipment">Equipment (comma-separated)</label>
                <Field
                  as="textarea"
                  className="w-full rounded-md bg-background-dark border border-ui-dark p-2 text-white"
                  id="equipment"
                  name="equipment"
                  rows={2}
                />
                <ErrorMessage name="equipment" component="p" className="text-red-500 text-xs mt-1" />
              </div>
            </div>

            <div className="flex justify-end gap-4 p-4">
              <button
                type="button"
                onClick={cancelEditing}
                className="rounded-full px-4 py-2 bg-gray-700 text-white font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !isValid}
                className="rounded-full px-4 py-2 bg-primary text-background-dark font-bold flex items-center justify-center disabled:opacity-50"
              >
                {loading ? (
                  <svg className="animate-spin h-5 w-5 text-background-dark" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
