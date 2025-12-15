"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';

interface Track {
  id: string;
  title: string;
  artist: string;
  albumArt: string;
  phase: string;
  phaseIcon: string;
  phaseColor: string;
}

const GenerateSessionMixPreviewPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mixId = searchParams.get('mixId');
  const mixType = searchParams.get('mixType') || 'Full Session';

  const [selectedPlaylistMode, setSelectedPlaylistMode] = useState('AI Smart Mix');
  const [seedInput, setSeedInput] = useState('');
  const [seedTags, setSeedTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]); // Actual tracks from backend
  const [totalDuration, setTotalDuration] = useState('00:00');
  const [trackCount, setTrackCount] = useState(0);

  useEffect(() => {
    if (mixId) {
      const fetchMixDetails = async () => {
        setIsLoading(true);
        setError(null);
        try {
          // Assuming an API endpoint exists to fetch mix details by ID
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/music/session-mix/${mixId}`, {
            headers: {
              // Add auth token if required
            },
          });
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Failed to fetch mix details.');
          }
          const data = await response.json();
          setTracks(data.tracks);
          setSeedTags(data.seedTags || []);
          setSelectedPlaylistMode(data.playlistMode || 'AI Smart Mix');
          setTotalDuration(data.totalDuration || '00:00');
          setTrackCount(data.trackCount || 0);
        } catch (err: any) {
          setError(err.message || "Failed to load mix details.");
          console.error('Fetch mix details error:', err);
        } finally {
          setIsLoading(false);
        }
      };
      fetchMixDetails();
    }
  }, [mixId]);

  const handleAddSeedTag = () => {
    if (seedInput.trim() && !seedTags.includes(seedInput.trim())) {
      setSeedTags([...seedTags, seedInput.trim()]);
      setSeedInput('');
    }
  };

  const handleRemoveSeedTag = (tagToRemove: string) => {
    setSeedTags(seedTags.filter(tag => tag !== tagToRemove));
  };

  const handleStartSession = async () => {
    console.log(`Finalizing mix and starting session with mix type: ${mixType}, mode: ${selectedPlaylistMode}, seeds: ${seedTags}`);
    setIsLoading(true);
    setError(null);
    try {
      // Assuming an API endpoint exists to finalize and start the session
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/music/start-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${userToken}`,
        },
        body: JSON.stringify({ mixId, playlistMode: selectedPlaylistMode, seedTags }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to start session.');
      }

      // On success, redirect to workout player or similar
      router.push('/workout/player'); // Placeholder
    } catch (err: any) {
      setError(err.message || "Failed to start session.");
      console.error('Start session error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    router.back(); // Go back to the previous page
  };

  if (isLoading && !mixId) {
    return (
        <div className="relative flex h-auto min-h-screen w-full flex-col items-center justify-center bg-background-dark">
            <p className="text-white text-lg">Loading mix details...</p>
        </div>
    );
  }

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col dark group/design-root overflow-x-hidden bg-background-light dark:bg-background-dark">
      {/* Top App Bar */}
      <div className="flex items-center bg-background-light dark:bg-background-dark p-4 pb-2 justify-between sticky top-0 z-10">
        <div className="text-black dark:text-white flex size-12 shrink-0 items-center justify-start">
          <button onClick={handleClose} className="material-symbols-outlined text-3xl">close</button>
        </div>
        <h2 className="text-black dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">Generate Session Mix</h2>
        <div className="flex size-12 shrink-0 items-center"></div>
      </div>
      <div className="flex flex-col flex-grow px-4">
        {/* Select a Mode */}
        <h3 className="text-black dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] pt-4 pb-2">Select a Mode</h3>
        <div className="flex py-3">
          <div className="flex h-10 flex-1 items-center justify-center rounded-full bg-black/5 dark:bg-white/5 p-1">
            <label
              className={`flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-full px-2 text-sm font-medium leading-normal transition-colors ${
                selectedPlaylistMode === 'AI Smart Mix' ? 'bg-primary shadow-[0_0_4px_rgba(19,236,91,0.5)] text-black' : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              <span className="truncate">AI Smart Mix</span>
              <input
                className="invisible w-0"
                name="playlist-mode"
                type="radio"
                value="AI Smart Mix"
                checked={selectedPlaylistMode === 'AI Smart Mix'}
                onChange={() => setSelectedPlaylistMode('AI Smart Mix')}
              />
            </label>
            <label
              className={`flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-full px-2 text-sm font-medium leading-normal transition-colors ${
                selectedPlaylistMode === 'Endurance Flow' ? 'bg-primary shadow-[0_0_4px_rgba(19,236,91,0.5)] text-black' : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              <span className="truncate">Endurance</span>
              <input
                className="invisible w-0"
                name="playlist-mode"
                type="radio"
                value="Endurance Flow"
                checked={selectedPlaylistMode === 'Endurance Flow'}
                onChange={() => setSelectedPlaylistMode('Endurance Flow')}
              />
            </label>
            <label
              className={`flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-full px-2 text-sm font-medium leading-normal transition-colors ${
                selectedPlaylistMode === 'Power Bursts' ? 'bg-primary shadow-[0_0_4px_rgba(19,236,91,0.5)] text-black' : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              <span className="truncate">Power Bursts</span>
              <input
                className="invisible w-0"
                name="playlist-mode"
                type="radio"
                value="Power Bursts"
                checked={selectedPlaylistMode === 'Power Bursts'}
                onChange={() => setSelectedPlaylistMode('Power Bursts')}
              />
            </label>
          </div>
        </div>
        {/* Seed Your Mix */}
        <h3 className="text-black dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] pt-4 pb-2">Seed Your Mix</h3>
        <div className="py-3">
          <label className="flex flex-col min-w-40 h-12 w-full">
            <div className="flex w-full flex-1 items-stretch rounded h-full">
              <div className="text-gray-600 dark:text-gray-400 flex border-none bg-black/5 dark:bg-white/5 items-center justify-center pl-4 rounded-l border-r-0">
                <span className="material-symbols-outlined">search</span>
              </div>
              <input
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded text-black dark:text-white focus:outline-0 focus:ring-0 border-none bg-black/5 dark:bg-white/5 focus:border-none h-full placeholder:text-gray-600 dark:placeholder:text-gray-400 px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal"
                placeholder="Add artists or genres..."
                value={seedInput}
                onChange={(e) => setSeedInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAddSeedTag();
                  }
                }}
              />
            </div>
          </label>
        </div>
        <div className="flex flex-wrap gap-2 pt-1 pb-4">
          {seedTags.map((tag) => (
            <div key={tag} className="flex items-center gap-2 rounded-full bg-primary/20 px-3 py-1.5">
              <span className="text-sm font-medium text-primary">{tag}</span>
              <button onClick={() => handleRemoveSeedTag(tag)} className="text-primary/70 hover:text-primary">
                <span className="material-symbols-outlined !text-base">close</span>
              </button>
            </div>
          ))}
        </div>
        {/* Session Preview */}
        <div className="flex justify-between items-baseline pt-6">
          <h3 className="text-black dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] pb-2">Your Session Preview</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">Remove or replace tracks to perfect your mix.</p>
        </div>
        <div className="flex items-center gap-6 rounded-lg bg-black/5 dark:bg-white/5 p-4 my-2">
          <div className="flex flex-col items-center">
            <span className="text-xl font-bold text-black dark:text-white">{totalDuration}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">Total Duration</span>
          </div>
          <div className="w-px h-8 bg-gray-300 dark:bg-gray-600"></div>
          <div className="flex flex-col items-center">
            <span className="text-xl font-bold text-black dark:text-white">{trackCount}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">Track Count</span>
          </div>
        </div>
        <div className="flex flex-col gap-2 py-4">
          {tracks.length > 0 ? (
            tracks.map(track => (
              <div key={track.id} className="flex items-center gap-4 rounded-lg p-2 hover:bg-black/5 dark:hover:bg-white/5">
                <Image src={track.albumArt} alt={track.title} width={56} height={56} className="h-14 w-14 rounded object-cover" />
                <div className="flex-1">
                  <p className="font-semibold text-black dark:text-white">{track.title}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{track.artist}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className={`material-symbols-outlined text-base ${track.phaseColor}`}>{track.phaseIcon}</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{track.phase}</span>
                  </div>
                  <button className="text-gray-500 dark:text-gray-400">
                    <span className="material-symbols-outlined">more_vert</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">No tracks to display. Generate a mix!</p>
          )}
        </div>
      </div>
      {/* CTA Button */}
      <div className="sticky bottom-0 bg-gradient-to-t from-background-light via-background-light dark:from-background-dark dark:via-background-dark to-transparent px-4 pb-6 pt-4">
        {error && <p className="text-red-500 text-center">{error}</p>}
        <button
          className="flex h-14 w-full items-center justify-center rounded-full bg-primary text-black text-lg font-bold leading-tight tracking-[-0.015em] shadow-[0_4px_12px_rgba(19,236,91,0.3)] transition-transform active:scale-95"
          onClick={handleStartSession}
          disabled={isLoading}
        >
          {isLoading ? (
            <svg className="animate-spin h-5 w-5 text-background-dark" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-testid="loading-spinner">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <span>Start Session</span>
          )}
        </button>
      </div>
    </div>
  );
};

export default GenerateSessionMixPreviewPage;
