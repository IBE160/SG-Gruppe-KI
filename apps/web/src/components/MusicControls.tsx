// apps/web/src/components/MusicControls.tsx
import React, { useEffect } from 'react';
import { useSpotifyPlayer } from '../lib/useSpotifyPlayer'; // Adjust path as necessary

const MusicControls: React.FC = () => {
  const { player, isReady, currentPlaybackState, togglePlay, skipNext, skipPrevious, setVolume, error, initiatePlayback } = useSpotifyPlayer();

  // Example of how to use initiatePlayback - you would call this when a session mix is generated
  useEffect(() => {
    if (isReady && player && !currentPlaybackState) {
      // For demonstration, let's play a dummy track after the player is ready
      // In a real app, you would get the track URI from your generated session mix
      // initiatePlayback('spotify:track:6rqhFgbbKwnb9MLmUQDhG6'); 
    }
  }, [isReady, player, currentPlaybackState, initiatePlayback]);

  // Handle errors from the Spotify Player
  useEffect(() => {
    if (error) {
      console.error("Spotify Player Error:", error);
      // Potentially display a user-friendly error message in the UI
    }
  }, [error]);

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(event.target.value);
    setVolume(newVolume);
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-surface-dark rounded-lg mt-4">
      {currentPlaybackState ? (
        <>
          <h3 className="text-white text-lg font-bold mb-2">Now Playing: {currentPlaybackState.track_name}</h3>
          <p className="text-text-secondary-dark text-sm">{currentPlaybackState.artist_name} - {currentPlaybackState.album_art}</p>
          
          <div className="flex items-center gap-6 mt-4">
            <button onClick={skipPrevious} disabled={!isReady} className="text-white text-2xl disabled:text-gray-500" aria-label="Skip Previous">
              <span className="material-symbols-outlined">skip_previous</span>
            </button>
            <button onClick={togglePlay} disabled={!isReady} className="text-white text-4xl disabled:text-gray-500" aria-label={currentPlaybackState.is_playing ? 'Pause' : 'Play'}>
              <span className="material-symbols-outlined">
                {currentPlaybackState.is_playing ? 'pause_arrow' : 'play_arrow'}
              </span>
            </button>
            <button onClick={skipNext} disabled={!isReady} className="text-white text-2xl disabled:text-gray-500" aria-label="Skip Next">
              <span className="material-symbols-outlined">skip_next</span>
            </button>
          </div>

          <div className="flex items-center gap-2 mt-4 w-full px-4">
            <span className="material-symbols-outlined text-text-secondary-dark">volume_down</span>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={currentPlaybackState.volume} 
              onChange={handleVolumeChange} 
              className="w-full h-1 bg-primary/30 rounded-lg appearance-none cursor-pointer" 
              disabled={!isReady}
            />
            <span className="material-symbols-outlined text-text-secondary-dark">volume_up</span>
          </div>

          <p className="text-primary text-sm mt-4">BPM: {currentPlaybackState.bpm || 'N/A'} (Warm-up Phase)</p>
        </>
      ) : (
        <p className="text-text-secondary-dark">Loading Spotify Player...</p>
      )}
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
};

export default MusicControls;