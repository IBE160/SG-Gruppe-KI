"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMusicMixStore } from '@/store/musicMixStore'; // Import the Zustand store

const GenerateSessionMixPage: React.FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mixType = useMusicMixStore(state => state.mixType);
  const setMixType = useMusicMixStore(state => state.setMixType);
  const setSelectedPlaylistMode = useMusicMixStore(state => state.setSelectedPlaylistMode);
  const setMixDetails = useMusicMixStore(state => state.setMixDetails);

  // Initialize selectedMixType from store or default
  const [localSelectedMixType, setLocalSelectedMixType] = useState(mixType);

  const handleCreateMix = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Assuming backend returns playlist_id for the generated mix
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/music/generate-session-mix`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${userToken}`,
        },
        body: JSON.stringify({ mix_type: localSelectedMixType }), // Use localSelectedMixType for the API call
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to generate session mix.');
      }

      const data = await response.json();
      // Update Zustand store with generated mix details
      setMixDetails({
        tracks: data.tracks || [],
        seedTags: data.seedTags || [],
        playlistMode: data.playlistMode || 'AI Smart Mix',
        totalDuration: data.totalDuration || '00:00',
        trackCount: data.trackCount || 0,
        mixId: data.playlist_id,
      });

      // Navigate to the preview page. Mix details are already in Zustand.
      router.push('/settings/music/mix/preview');
    } catch (err: any) {
      setError(err.message || "Failed to create mix.");
      console.error('Create mix error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMixTypeChange = (type: string) => {
    setLocalSelectedMixType(type);
    setMixType(type); // Update Zustand store
    setSelectedPlaylistMode('AI Smart Mix'); // Reset playlist mode when mix type changes
  };

  const handleCancel = () => {
    router.back(); // Go back to the previous page (e.g., music settings)
  };

  return (
    <div className="relative flex h-screen w-full flex-col font-display bg-background-dark group/design-root overflow-hidden">
      {/* Background Content (dimmed) */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
      {/* Modal Content */}
      <div className="relative m-auto flex flex-col justify-end w-full max-w-md h-full">
        <div className="flex flex-col items-stretch bg-background-dark rounded-t-xl">
          <div className="flex h-5 w-full items-center justify-center pt-4">
            <div className="h-1 w-9 rounded-full bg-[#326744]"></div>
          </div>
          <h1 className="text-white tracking-light text-[32px] font-bold leading-tight px-4 text-center pb-3 pt-6">Generate Session Mix</h1>
          <p className="text-white/70 text-base font-normal leading-normal pb-3 pt-1 px-4 text-center">What part of your workout is this for?</p>
          <div className="flex px-4 py-3">
            <div className="flex h-10 flex-1 items-center justify-center rounded-full bg-[#23482f] p-1">
              <label
                className={`flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-full px-2 text-sm font-medium leading-normal transition-colors duration-200 ${
                  localSelectedMixType === 'Warm-up only' ? 'bg-primary text-background-dark font-bold' : 'text-white/80'
                }`}
              >
                <span className="truncate">Warm-up only</span>
                <input
                  className="invisible w-0"
                  name="session_mix_type"
                  type="radio"
                  value="Warm-up only"
                  checked={localSelectedMixType === 'Warm-up only'}
                  onChange={() => handleMixTypeChange('Warm-up only')}
                />
              </label>
              <label
                className={`flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-full px-2 text-sm font-medium leading-normal transition-colors duration-200 ${
                  localSelectedMixType === 'Full Session' ? 'bg-primary text-background-dark font-bold' : 'text-white/80'
                }`}
              >
                <span className="truncate">Full Session</span>
                <input
                  className="invisible w-0"
                  name="session_mix_type"
                  type="radio"
                  value="Full Session"
                  checked={localSelectedMixType === 'Full Session'}
                  onChange={() => handleMixTypeChange('Full Session')}
                />
              </label>
              <label
                className={`flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-full px-2 text-sm font-medium leading-normal transition-colors duration-200 ${
                  localSelectedMixType === 'Recovery / Cooldown' ? 'bg-primary text-background-dark font-bold' : 'text-white/80'
                }`}
              >
                <span className="truncate">Cooldown</span>
                <input
                  className="invisible w-0"
                  name="session_mix_type"
                  type="radio"
                  value="Recovery / Cooldown"
                  checked={localSelectedMixType === 'Recovery / Cooldown'}
                  onChange={() => handleMixTypeChange('Recovery / Cooldown')}
                />
              </label>
            </div>
          </div>
          {error && <p className="text-red-500 text-center px-4">{error}</p>}
          <div className="flex justify-center">
            <div className="flex w-full flex-1 gap-3 max-w-[480px] flex-col items-stretch px-4 py-3 pb-8">
              <button
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 px-5 bg-primary text-background-dark text-base font-bold leading-normal tracking-[0.015em] w-full"
                onClick={handleCreateMix}
                disabled={isLoading}
              >
                {isLoading ? (
                    <svg className="animate-spin h-5 w-5 text-background-dark" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-testid="loading-spinner">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                ) : (
                    <span className="truncate">Create Mix</span>
                )}
              </button>
              <button
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 px-5 bg-transparent text-white text-base font-medium leading-normal tracking-[0.015em] w-full hover:bg-white/10 transition-colors duration-200"
                onClick={handleCancel}
                disabled={isLoading}
              >
                <span className="truncate">Cancel</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerateSessionMixPage;

