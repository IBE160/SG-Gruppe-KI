'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';


export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [goals, setGoals] = useState(''); // Text input for goals, will parse to JSONB
  const [preferences, setPreferences] = useState(''); // Text input for preferences, will parse to JSONB
  const [equipment, setEquipment] = useState<string[]>([]); // Array of strings for equipment
  const [injuries, setInjuries] = useState('');
  const [units, setUnits] = useState('metric'); // 'metric' or 'imperial'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalSteps = 5; // Goals, Preferences, Equipment, Injuries, Units

  const handleNext = () => {
    setError(null);
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    setError(null);
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    // Basic validation for JSONB fields
    let parsedGoals: object = {};
    let parsedPreferences: object = {};
    try {
      if (goals) parsedGoals = JSON.parse(goals);
      if (preferences) parsedPreferences = JSON.parse(preferences);
    } catch (e) {
      setError('Goals or Preferences must be valid JSON.');
      setLoading(false);
      return;
    }

    const onboardingData = {
      goals: parsedGoals,
      preferences: parsedPreferences,
      equipment,
      injuries: injuries || null,
      units,
    };

    try {
      // Get the Supabase session token
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('User not authenticated. Please log in again.');
      }

      const response = await fetch('/api/v1/users/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`, // Send access token for backend auth
        },
        body: JSON.stringify(onboardingData),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Onboarding data saved:', data);
        alert('Onboarding complete! Redirecting to dashboard.');
        router.push('/'); // Redirect to dashboard or home page
      } else {
        setError(data.detail || 'Failed to save onboarding data.');
        console.error('Onboarding API error:', data);
      }
    } catch (err: any) {
      setError(err.message || 'Network error or server unavailable during onboarding.');
      console.error('Onboarding fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div>
            <h2>What are your primary fitness goals?</h2>
            <p>Examples: {"{ \"strength\": true, \"endurance\": false, \"weight_loss\": true }"}</p>
            <textarea
              value={goals}
              onChange={(e) => setGoals(e.target.value)}
              rows={5}
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
              placeholder="Enter your goals as JSON (e.g., { 'focus': 'upper_body' })"
            />
          </div>
        );
      case 1:
        return (
          <div>
            <h2>Any specific workout preferences?</h2>
            <p>Examples: {"{ \"preferred_time\": \"morning\", \"duration\": \"45-60min\" }"}</p>
            <textarea
              value={preferences}
              onChange={(e) => setPreferences(e.target.value)}
              rows={5}
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
              placeholder="Enter your preferences as JSON (e.g., { 'focus': 'upper_body' })"
            />
          </div>
        );
      case 2:
        return (
          <div>
            <h2>What equipment do you have available?</h2>
            <p>Select all that apply:</p>
            <div>
              {['Dumbbells', 'Barbell', 'Resistance Bands', 'Pull-up Bar', 'Kettlebell', 'Yoga Mat', 'None'].map((item) => (
                <label key={item} style={{ display: 'block', marginBottom: '5px' }}>
                  <input
                    type="checkbox"
                    value={item}
                    checked={equipment.includes(item)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setEquipment([...equipment, item]);
                      } else {
                        setEquipment(equipment.filter((eq) => eq !== item));
                      }
                    }}
                  />
                  {item}
                </label>
              ))}
            </div>
          </div>
        );
      case 3:
        return (
          <div>
            <h2>Do you have any injuries or physical limitations?</h2>
            <textarea
              value={injuries}
              onChange={(e) => setInjuries(e.target.value)}
              rows={5}
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
              placeholder="Describe any injuries or limitations (e.g., 'bad knee', 'lower back pain')"
            />
          </div>
        );
      case 4:
        return (
          <div>
            <h2>What units do you prefer?</h2>
            <div>
              <label style={{ display: 'block', marginBottom: '5px' }}>
                <input
                  type="radio"
                  value="metric"
                  checked={units === 'metric'}
                  onChange={(e) => setUnits(e.target.value)}
                />
                Metric (kg, cm)
              </label>
              <label style={{ display: 'block', marginBottom: '5px' }}>
                <input
                  type="radio"
                  value="imperial"
                  checked={units === 'imperial'}
                  onChange={(e) => setUnits(e.target.value)}
                />
                Imperial (lbs, inches)
              </label>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '50px auto', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h1>Onboarding - Step {currentStep + 1} of {totalSteps}</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div style={{ minHeight: '200px', marginBottom: '20px' }}>
        {renderStep()}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button
          onClick={handleBack}
          disabled={currentStep === 0 || loading}
          style={{ padding: '10px 15px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          Back
        </button>
        {currentStep < totalSteps - 1 ? (
          <button
            onClick={handleNext}
            disabled={loading}
            style={{ padding: '10px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{ padding: '10px 15px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
          >
            {loading ? 'Saving...' : 'Finish Onboarding'}
          </button>
        )}
      </div>
    </div>
  );
}
