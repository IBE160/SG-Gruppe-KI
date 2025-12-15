// apps/web/tests/unit/useSpotifyPlayer.test.tsx
import { renderHook, act, waitFor } from '@testing-library/react';
import { useSpotifyPlayer } from '../../src/lib/useSpotifyPlayer';
import { AuthProvider, useAuth } from '../../src/context/AuthContext';
import { v4 as uuidv4 } from 'uuid';

// Mock uuidv4
jest.mock('uuid', () => ({
  v4: () => 'mock-session-id',
}));

// Mock the global Spotify object
const mockSpotifyPlayer = {
  connect: jest.fn(() => Promise.resolve(true)),
  disconnect: jest.fn(),
  addListener: jest.fn(),
  togglePlay: jest.fn(),
  nextTrack: jest.fn(),
  previousTrack: jest.fn(),
  setVolume: jest.fn(),
  getCurrentState: jest.fn(),
};

// Mock window.Spotify
Object.defineProperty(window, 'Spotify', {
  value: {
    Player: jest.fn(() => mockSpotifyPlayer),
  },
  writable: true,
});

// Mock fetch API
global.fetch = jest.fn();

// Mock useAuth hook
jest.mock('../../src/context/AuthContext', () => ({
    ...jest.requireActual('../../src/context/AuthContext'),
    useAuth: jest.fn(),
}));

const mockUseAuth = useAuth as jest.Mock;

let readyCallback: ((data: { device_id: string }) => void) | undefined;
let playerStateChangedCallback: ((state: Spotify.PlayerState) => void) | undefined;
let authenticationErrorCallback: ((error: Spotify.Error) => void) | undefined;

// Define a simple wrapper for renderHook that provides AuthProvider
const defaultWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <AuthProvider>{children}</AuthProvider>
);

describe('useSpotifyPlayer', () => {
  const MOCKED_DATE_NOW = 1678886400000; // March 15, 2023, 12:00:00 PM UTC
  const MOCKED_ISO_STRING = "2023-03-15T12:00:00.000Z";

  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(MOCKED_DATE_NOW));
    jest.spyOn(Date.prototype, 'toISOString').mockReturnValue(MOCKED_ISO_STRING);
  });

  afterAll(() => {
    jest.useRealTimers();
    jest.restoreAllMocks(); // Restore mocks after all tests
  });

  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockClear();
    mockSpotifyPlayer.addListener.mockClear();
    mockSpotifyPlayer.connect.mockClear();
    mockSpotifyPlayer.disconnect.mockClear();
    mockSpotifyPlayer.togglePlay.mockClear();
    mockSpotifyPlayer.nextTrack.mockClear();
    mockSpotifyPlayer.previousTrack.mockClear();
    mockSpotifyPlayer.setVolume.mockClear();
    mockSpotifyPlayer.getCurrentState.mockClear();

    // Default mock for useAuth
    mockUseAuth.mockReturnValue({ accessToken: 'mock-access-token' });

    // Mock successful fetch for feedback
    (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ message: 'Feedback logged' }),
    });

    // Reset and mock window.onSpotifyWebPlaybackSDKReady for each test
    window.onSpotifyWebPlaybackSDKReady = jest.fn();
    mockSpotifyPlayer.addListener.mockImplementation((event, callback) => {
        if (event === 'ready') {
            // Store the ready callback to be triggered manually
            readyCallback = callback;
        } else if (event === 'player_state_changed') {
            // Store the state changed callback
            playerStateChangedCallback = callback;
        } else if (event === 'authentication_error') {
            authenticationErrorCallback = callback;
        }
    });
  });

  it('should initialize Spotify player when access token is available', async () => {
    const { result } = renderHook(() => useSpotifyPlayer(), { wrapper: defaultWrapper });

    await act(async () => {
        window.onSpotifyWebPlaybackSDKReady();
        // Manually trigger the 'ready' listener callback
        const readyCallback = mockSpotifyPlayer.addListener.mock.calls.find(call => call[0] === 'ready')[1];
        if (readyCallback) {
          readyCallback({ device_id: 'mock_device_id' });
        }
    });

    await waitFor(() => expect(result.current.isReady).toBe(true));

    expect(window.Spotify.Player).toHaveBeenCalledTimes(1);
    expect(mockSpotifyPlayer.connect).toHaveBeenCalledTimes(1);
    expect(mockSpotifyPlayer.addListener).toHaveBeenCalledWith('ready', expect.any(Function));
    expect(mockSpotifyPlayer.addListener).toHaveBeenCalledWith('player_state_changed', expect.any(Function));
  });

  it('should not initialize player if access token is not available', async () => {
    mockUseAuth.mockReturnValue({ accessToken: null }); // Mock no access token
    const { result } = renderHook(() => useSpotifyPlayer(), { wrapper: defaultWrapper });

    expect(result.current.error).toBe('Spotify access token not available.');
    expect(window.Spotify.Player).not.toHaveBeenCalled();
  });

  it('should update current playback state on player_state_changed event', async () => {
    const { result } = renderHook(() => useSpotifyPlayer(), { wrapper: defaultWrapper });

    await act(async () => {
        window.onSpotifyWebPlaybackSDKReady();
        if (readyCallback) {
            readyCallback({ device_id: 'mock_device_id' });
        }
    });
    await waitFor(() => expect(result.current.isReady).toBe(true));


    // const playerStateChangedCallback = mockSpotifyPlayer.addListener.mock.calls.find(
    //   (call) => call[0] === 'player_state_changed'
    // )[1];

    const mockPlayerState: Spotify.PlayerState = {
      context: {} as any,
      disallows: {} as any,
      duration: 100000,
      paused: false,
      position: 1000,
      repeat_mode: 0,
      shuffle: false,
      timestamp: Date.now(),
      track_window: {
        current_track: {
          id: 'track1',
          name: 'Song One',
          artists: [{ name: 'Artist One' }] as any,
          album: { images: [{ url: 'album.jpg' }] } as any,
        } as any,
        next_tracks: [],
        previous_tracks: [],
      },
      playback_id: 'pb123',
    };

    act(() => {
      if (playerStateChangedCallback) {
        playerStateChangedCallback(mockPlayerState);
      }
    });

    expect(result.current.currentPlaybackState).toEqual(
      expect.objectContaining({
        is_playing: true,
        track_id: 'track1',
        track_name: 'Song One',
        artist_name: 'Artist One',
      })
    );
  });

  it('should call togglePlay on player when togglePlay is called', async () => {
    const { result } = renderHook(() => useSpotifyPlayer(), { wrapper: defaultWrapper });

    await act(async () => {
        window.onSpotifyWebPlaybackSDKReady();
        if (readyCallback) {
            readyCallback({ device_id: 'mock_device_id' });
        }
    });
    await waitFor(() => expect(result.current.isReady).toBe(true));

    await act(async () => {
      await result.current.togglePlay();
    });

    expect(mockSpotifyPlayer.togglePlay).toHaveBeenCalledTimes(1);
  });

  it('should call skipNext on player and log feedback when skipNext is called', async () => {
    const { result } = renderHook(() => useSpotifyPlayer(), { wrapper: defaultWrapper });
    
    // Simulate player ready and state
    await act(async () => {
        window.onSpotifyWebPlaybackSDKReady();
        if (readyCallback) {
            readyCallback({ device_id: 'mock_device_id' });
        }
    });
    await waitFor(() => expect(result.current.isReady).toBe(true));

    // const playerStateChangedCallback = mockSpotifyPlayer.addListener.mock.calls.find(
    //     (call) => call[0] === 'player_state_changed'
    // )[1];
    act(() => {
      if (playerStateChangedCallback) {
        playerStateChangedCallback({
            track_window: { current_track: { id: 'current_track_id' } as any }
        } as Spotify.PlayerState);
      }
    });

    await act(async () => {
      await result.current.skipNext();
    });

    expect(mockSpotifyPlayer.nextTrack).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/v1/music/feedback',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
            session_id: 'mock-session-id',
            track_id: 'current_track_id',
            feedback_type: 'skip_next',
            timestamp: MOCKED_ISO_STRING,
            context: {},
        }),
      })
    );
  });

  it('should call skipPrevious on player and log feedback when skipPrevious is called', async () => {
    const { result } = renderHook(() => useSpotifyPlayer(), { wrapper: defaultWrapper });
    
    // Simulate player ready and state
    await act(async () => {
        window.onSpotifyWebPlaybackSDKReady();
        if (readyCallback) {
            readyCallback({ device_id: 'mock_device_id' });
        }
    });
    await waitFor(() => expect(result.current.isReady).toBe(true));

    // const playerStateChangedCallback = mockSpotifyPlayer.addListener.mock.calls.find(
    //     (call) => call[0] === 'player_state_changed'
    // )[1];
    act(() => {
      if (playerStateChangedCallback) {
        playerStateChangedCallback({
            track_window: { current_track: { id: 'current_track_id' } as any }
        } as Spotify.PlayerState);
      }
    });

    await act(async () => {
      await result.current.skipPrevious();
    });

    expect(mockSpotifyPlayer.previousTrack).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/v1/music/feedback',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
            session_id: 'mock-session-id',
            track_id: 'current_track_id',
            feedback_type: 'skip_previous',
            timestamp: MOCKED_ISO_STRING,
            context: {},
        }),
      })
    );
  });

  it('should log track completion when track changes', async () => {
    const { result } = renderHook(() => useSpotifyPlayer(), { wrapper: defaultWrapper });

    await act(async () => {
        window.onSpotifyWebPlaybackSDKReady();
        if (readyCallback) {
            readyCallback({ device_id: 'mock_device_id' });
        }
    });
    await waitFor(() => expect(result.current.isReady).toBe(true));


    // const playerStateChangedCallback = mockSpotifyPlayer.addListener.mock.calls.find(
    //   (call) => call[0] === 'player_state_changed'
    // )[1];

    // First track
    act(() => {
      if (playerStateChangedCallback) {
        playerStateChangedCallback({
          track_window: { current_track: { id: 'track_A' } as any },
          position: 0,
          paused: false,
          duration: 100000,
        } as Spotify.PlayerState);
      }
    });
    
    (global.fetch as jest.Mock).mockClear(); // Clear initial fetch call

    // Simulate track change to B (completion of A)
    act(() => {
      playerStateChangedCallback({
        track_window: { current_track: { id: 'track_B' } as any },
        position: 0,
        paused: false,
        duration: 100000,
      } as Spotify.PlayerState);
    });

    expect(global.fetch).toHaveBeenCalledWith(
      '/api/v1/music/feedback',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
            session_id: 'mock-session-id',
            track_id: 'track_A',
            feedback_type: 'completion',
            timestamp: MOCKED_ISO_STRING,
            context: { duration_ms: 100000 },
        }),
      })
    );
  });

  it('should call setVolume on player when setVolume is called', async () => {
    const { result } = renderHook(() => useSpotifyPlayer(), { wrapper: defaultWrapper });

    await act(async () => {
        window.onSpotifyWebPlaybackSDKReady();
        if (readyCallback) {
            readyCallback({ device_id: 'mock_device_id' });
        }
    });
    await waitFor(() => expect(result.current.isReady).toBe(true));

    // Initialize currentPlaybackState
    act(() => {
        if (playerStateChangedCallback) {
            playerStateChangedCallback({
                track_window: { current_track: { id: 'dummy_track' } as any },
                position: 0,
                paused: false,
                duration: 100000,
            } as Spotify.PlayerState);
        }
    });

    await act(async () => {
      await result.current.setVolume(50);
    });

    expect(mockSpotifyPlayer.setVolume).toHaveBeenCalledWith(0.5);
    expect(result.current.currentPlaybackState?.volume).toBe(50);
  });

  it('should update error state when player encounters an error', async () => {
    const { result } = renderHook(() => useSpotifyPlayer(), { wrapper: defaultWrapper });

    await act(async () => {
        window.onSpotifyWebPlaybackSDKReady();
        if (readyCallback) {
            readyCallback({ device_id: 'mock_device_id' });
        }
    });
    await waitFor(() => expect(result.current.isReady).toBe(true));

    // const authenticationErrorCallback = mockSpotifyPlayer.addListener.mock.calls.find(
    //   (call) => call[0] === 'authentication_error'
    // )[1];

    act(() => {
      if (authenticationErrorCallback) {
        authenticationErrorCallback({ message: 'Invalid Token' });
      }
    });

    expect(result.current.error).toBe('Authentication Error: Invalid Token');
  });
});