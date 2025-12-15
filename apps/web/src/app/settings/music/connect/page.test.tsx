import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SpotifyConnectExplainer from '../connect/page';
import { useRouter } from 'next/navigation';

// Mock the next/navigation useRouter
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock fetch API
const mockFetch = jest.fn();
global.fetch = mockFetch;

const mockPush = jest.fn();

beforeEach(() => {
  (useRouter as jest.Mock).mockReturnValue({
    push: mockPush,
  });
  mockFetch.mockClear();
  mockPush.mockClear();
  process.env.NEXT_PUBLIC_API_URL = 'http://localhost:8000';
});

describe('SpotifyConnectExplainer', () => {
  it('renders correctly', () => {
    render(<SpotifyConnectExplainer />);

    expect(screen.getByText('Connect Spotify')).toBeInTheDocument();
    expect(screen.getByText('Power Your Workouts with Music')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Connect with Spotify/i })).toBeInTheDocument();
  });

  it('initiates Spotify OAuth flow on button click', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ auth_url: 'https://spotify.com/auth?test=123' }),
    });

    render(<SpotifyConnectExplainer />);

    fireEvent.click(screen.getByRole('button', { name: /Connect with Spotify/i }));

    expect(mockFetch).toHaveBeenCalledWith('http://localhost:8000/music/connect/spotify');
    await waitFor(() => expect(mockPush).toHaveBeenCalledWith('https://spotify.com/auth?test=123'));
  });

  it('displays an error message if API call fails', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ detail: 'Backend error' }),
    });

    render(<SpotifyConnectExplainer />);

    fireEvent.click(screen.getByRole('button', { name: /Connect with Spotify/i }));

    await waitFor(() => expect(screen.getByText('Backend error')).toBeInTheDocument());
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('disables button and shows loading state when connecting', async () => {
    mockFetch.mockReturnValueOnce(new Promise(() => {})); // Never resolve to keep it loading

    render(<SpotifyConnectExplainer />);

    const connectButton = screen.getByRole('button', { name: /Connect with Spotify/i });
    fireEvent.click(connectButton);

    expect(connectButton).toBeDisabled();
    expect(screen.getByTestId('loading-spinner')).toHaveClass('animate-spin');
  });
});
