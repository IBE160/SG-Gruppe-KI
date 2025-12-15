// apps/web/tests/unit/MusicControls.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import MusicControls from '../../src/components/MusicControls';
import { useSpotifyPlayer } from '../../src/lib/useSpotifyPlayer';

// Mock the useSpotifyPlayer hook
jest.mock('../../src/lib/useSpotifyPlayer', () => ({
  useSpotifyPlayer: jest.fn(),
}));

const mockUseSpotifyPlayer = useSpotifyPlayer as jest.Mock;

describe('MusicControls', () => {
  beforeEach(() => {
    mockUseSpotifyPlayer.mockReturnValue({
      player: {},
      isReady: true,
      currentPlaybackState: {
        is_playing: false,
        position: 0,
        duration: 100000,
        track_id: 'mock_track_id',
        track_name: 'Test Song',
        artist_name: 'Test Artist',
        album_art: 'http://mock.album.art/image.jpg',
        volume: 70,
        bpm: 120,
      },
      initiatePlayback: jest.fn(),
      togglePlay: jest.fn(),
      skipNext: jest.fn(),
      skipPrevious: jest.fn(),
      setVolume: jest.fn(),
      logMusicFeedback: jest.fn(),
      error: null,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly when player is ready and playback state exists', () => {
    render(<MusicControls />);

    expect(screen.getByText(/Test Song/i)).toBeInTheDocument();
    expect(screen.getByText(/Test Artist -/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Play' })).toBeInTheDocument(); // Initially paused
    expect(screen.getByText(/BPM: 120 \(Warm-up Phase\)/i)).toBeInTheDocument();
  });

  it('displays pause button when track is playing', () => {
    mockUseSpotifyPlayer.mockReturnValueOnce({
      ...mockUseSpotifyPlayer(),
      currentPlaybackState: {
        ...mockUseSpotifyPlayer().currentPlaybackState,
        is_playing: true,
      },
    });
    render(<MusicControls />);
    expect(screen.getByRole('button', { name: 'Pause' })).toBeInTheDocument();
  });

  it('calls togglePlay when play/pause button is clicked', () => {
    const { togglePlay } = mockUseSpotifyPlayer();
    render(<MusicControls />);
    fireEvent.click(screen.getByRole('button', { name: 'Play' }));
    expect(togglePlay).toHaveBeenCalledTimes(1);
  });

  it('calls skipNext when skip next button is clicked', () => {
    const { skipNext } = mockUseSpotifyPlayer();
    render(<MusicControls />);
    fireEvent.click(screen.getByRole('button', { name: 'Skip Next' }));
    expect(skipNext).toHaveBeenCalledTimes(1);
  });

  it('calls skipPrevious when skip previous button is clicked', () => {
    const { skipPrevious } = mockUseSpotifyPlayer();
    render(<MusicControls />);
    fireEvent.click(screen.getByRole('button', { name: 'Skip Previous' }));
    expect(skipPrevious).toHaveBeenCalledTimes(1);
  });

  it('calls setVolume when volume slider is changed', () => {
    const { setVolume } = mockUseSpotifyPlayer();
    render(<MusicControls />);
    const volumeSlider = screen.getByRole('slider');
    fireEvent.change(volumeSlider, { target: { value: '50' } });
    expect(setVolume).toHaveBeenCalledWith(50);
  });

  it('displays loading message when player is not ready', () => {
    mockUseSpotifyPlayer.mockReturnValueOnce({
      ...mockUseSpotifyPlayer(),
      isReady: false,
      currentPlaybackState: null,
    });
    render(<MusicControls />);
    expect(screen.getByText(/Loading Spotify Player.../i)).toBeInTheDocument();
  });

  it('displays error message when useSpotifyPlayer returns an error', () => {
    mockUseSpotifyPlayer.mockReturnValueOnce({
      ...mockUseSpotifyPlayer(),
      error: 'Failed to connect to Spotify',
    });
    render(<MusicControls />);
    expect(screen.getByText(/Failed to connect to Spotify/i)).toBeInTheDocument();
  });
});
