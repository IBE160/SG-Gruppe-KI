import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext'; // Assuming an AuthContext for access token
import { v4 as uuidv4 } from 'uuid'; // For generating a session ID

interface SpotifyPlayerState {
  is_playing: boolean;
  position: number;
  duration: number;
  track_id: string | null;
  track_name: string;
  artist_name: string;
  album_art: string;
  volume: number;
  bpm: number | null; // Placeholder for BPM, will be fetched or estimated
}

interface UseSpotifyPlayer {
  player: Spotify.Player | null;
  isReady: boolean;
  currentPlaybackState: SpotifyPlayerState | null;
  initiatePlayback: (trackUri: string, positionMs?: number) => Promise<void>;
  togglePlay: () => Promise<void>;
  skipNext: () => Promise<void>;
  skipPrevious: () => Promise<void>;
  setVolume: (volume: number) => Promise<void>;
  logMusicFeedback: (feedbackType: string, trackId: string | null, context?: Record<string, any>) => Promise<void>;
  error: string | null;
}

const SPOTIFY_PLAYER_NAME = 'AI Personal Trainer';
const SESSION_ID = uuidv4(); // Generate a unique session ID for feedback logging

export const useSpotifyPlayer = (): UseSpotifyPlayer => {
  const [player, setPlayer] = useState<Spotify.Player | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [currentPlaybackState, setCurrentPlaybackState] = useState<SpotifyPlayerState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { accessToken } = useAuth(); // Get access token from AuthContext

  const deviceId = useRef<string | null>(null);
  const lastTrackId = useRef<string | null>(null); // To detect track completion

  const logMusicFeedback = useCallback(async (feedbackType: string, trackId: string | null, context?: Record<string, any>) => {
    if (!trackId) {
      console.warn('Cannot log music feedback: trackId is null.');
      return;
    }
    try {
      const response = await fetch('/api/v1/music/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`, // Assuming your API requires this
        },
        body: JSON.stringify({
          session_id: SESSION_ID,
          track_id: trackId,
          feedback_type: feedbackType,
          timestamp: new Date().toISOString(),
          context: context || {},
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error(`Failed to log music feedback (${feedbackType}):`, errorData);
      } else {
        console.log(`Music feedback logged: ${feedbackType} for track ${trackId}`);
      }
    } catch (err) {
      console.error(`Error sending music feedback (${feedbackType}):`, err);
    }
  }, [accessToken]);


  useEffect(() => {
    if (!accessToken) {
      setError('Spotify access token not available.');
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.async = true;
    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const spotifyPlayer = new window.Spotify.Player({
        name: SPOTIFY_PLAYER_NAME,
        getOAuthToken: (cb: (token: string) => void) => {
          cb(accessToken);
        },
        volume: 0.5,
      });

      spotifyPlayer.addListener('ready', ({ device_id }) => {
        console.log('Spotify Web Playback SDK is ready!', device_id);
        deviceId.current = device_id;
        setIsReady(true);
      });

      spotifyPlayer.addListener('not_ready', ({ device_id }) => {
        console.warn('Spotify Web Playback SDK is not ready!', device_id);
      });

      spotifyPlayer.addListener('player_state_changed', (state) => {
        if (!state) {
          setCurrentPlaybackState(null);
          return;
        }

        const {
          position,
          duration,
          paused,
          track_window: { current_track },
        } = state;

        // Log track completion
        if (lastTrackId.current && lastTrackId.current !== current_track?.id && state.position === 0 && !state.paused) {
            logMusicFeedback('completion', lastTrackId.current, { duration_ms: duration });
        }
        lastTrackId.current = current_track?.id || null;

        setCurrentPlaybackState({
          is_playing: !paused,
          position,
          duration,
          track_id: current_track?.id,
          track_name: current_track?.name || 'Unknown Track',
          artist_name: current_track?.artists?.[0]?.name || 'Unknown Artist',
          album_art: current_track?.album?.images?.[0]?.url || '',
          volume: 0.5, // SDK doesn't directly expose current volume in state, will update on setVolume
          bpm: null, // To be updated
        });
      });

      spotifyPlayer.addListener('initialization_error', ({ message }) => {
        console.error('Failed to initialize Spotify Player:', message);
        setError(`Initialization Error: ${message}`);
      });

      spotifyPlayer.addListener('authentication_error', ({ message }) => {
        console.error('Authentication Error for Spotify Player:', message);
        setError(`Authentication Error: ${message}`);
        // Handle token refresh here or redirect to re-authenticate
      });

      spotifyPlayer.addListener('account_error', ({ message }) => {
        console.error('Account Error for Spotify Player:', message);
        setError(`Account Error: ${message}`);
      });

      spotifyPlayer.addListener('playback_error', ({ message }) => {
        console.error('Playback Error for Spotify Player:', message);
        setError(`Playback Error: ${message}`);
      });

      spotifyPlayer.connect().then((success) => {
        if (success) {
          console.log('Spotify Web Playback SDK connected!');
        }
      });

      setPlayer(spotifyPlayer);

      return () => {
        spotifyPlayer.disconnect();
        document.body.removeChild(script);
        window.onSpotifyWebPlaybackSDKReady = null;
      };
    };
  }, [accessToken, logMusicFeedback]); // Added logMusicFeedback to dependencies

  const initiatePlayback = async (trackUri: string, positionMs = 0) => {
    if (!isReady || !deviceId.current || !accessToken) {
      console.warn('Player not ready or access token missing to initiate playback.');
      return;
    }
    setError(null); // Clear previous errors

    try {
      await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId.current}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          uris: [trackUri],
          position_ms: positionMs,
        }),
      });
      console.log(`Initiated playback of ${trackUri}`);
    } catch (err) {
      console.error('Failed to initiate playback:', err);
      setError('Failed to start playback.');
    }
  };

  const togglePlay = async () => {
    if (player) {
      setError(null);
      await player.togglePlay();
    }
  };

  const skipNext = async () => {
    if (player && currentPlaybackState?.track_id) {
      setError(null);
      await player.nextTrack();
      logMusicFeedback('skip_next', currentPlaybackState.track_id);
    }
  };

  const skipPrevious = async () => {
    if (player && currentPlaybackState?.track_id) {
      setError(null);
      await player.previousTrack();
      logMusicFeedback('skip_previous', currentPlaybackState.track_id);
    }
  };

  const setVolume = async (volume: number) => {
    if (player) {
      setError(null);
      await player.setVolume(volume / 100);
      setCurrentPlaybackState((prevState) => (prevState ? { ...prevState, volume: volume } : null));
    }
  };

  return { player, isReady, currentPlaybackState, initiatePlayback, togglePlay, skipNext, skipPrevious, setVolume, logMusicFeedback, error };
};
