import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SpotifyCallbackPage from '../callback/page';
import { useRouter, useSearchParams } from 'next/navigation';

// Mock next/navigation hooks
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

// Mock fetch API
const mockFetch = jest.fn();
global.fetch = mockFetch;

const mockPush = jest.fn();
const mockGetSearchParams = jest.fn();

beforeEach(() => {
  (useRouter as jest.Mock).mockReturnValue({
    push: mockPush,
  });
  (useSearchParams as jest.Mock).mockReturnValue({
    get: mockGetSearchParams,
  });
  mockFetch.mockClear();
  mockPush.mockClear();
  mockGetSearchParams.mockClear();
  process.env.NEXT_PUBLIC_API_URL = 'http://localhost:8000';
});

describe('SpotifyCallbackPage', () => {
  it('displays success message and redirects on successful Spotify connection', async () => {
    mockGetSearchParams.mockImplementation((key) => {
      if (key === 'code') return 'mock_code';
      if (key === 'code_verifier') return 'mock_verifier';
      return null;
    });
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ message: 'Spotify connected successfully!' }),
    });

    render(<SpotifyCallbackPage />);

    expect(screen.getByText('Connecting to Spotify...')).toBeInTheDocument();

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8000/music/callback/spotify?code=mock_code&code_verifier=mock_verifier',
        { method: 'GET' }
      );
    });

    await waitFor(() => {
      expect(screen.getByText('Spotify connected successfully!')).toBeInTheDocument();
      expect(screen.getByLabelText('check_circle')).toBeInTheDocument(); // Material Symbol icon
      expect(mockPush).toHaveBeenCalledWith('/settings/music');
    }, { timeout: 3000 }); // Increase timeout for redirect check
  });

  it('displays error message if Spotify connection fails', async () => {
    mockGetSearchParams.mockImplementation((key) => {
      if (key === 'code') return 'mock_code';
      if (key === 'code_verifier') return 'mock_verifier';
      return null;
    });
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ detail: 'Backend error message' }),
    });

    render(<SpotifyCallbackPage />);

    await waitFor(() => {
      expect(screen.getByText('Spotify connection failed.')).toBeInTheDocument();
      expect(screen.getByText('Error: Backend error message')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Try Again/i })).toBeInTheDocument();
      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  it('displays error message if code or verifier are missing', async () => {
    mockGetSearchParams.mockImplementation((key) => {
      if (key === 'code') return null; // Missing code
      if (key === 'code_verifier') return 'mock_verifier';
      return null;
    });

    render(<SpotifyCallbackPage />);

    await waitFor(() => {
      expect(screen.getByText('Spotify connection failed: Missing data.')).toBeInTheDocument();
      expect(screen.getByText('Error: Missing authorization code or code verifier.')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Try Again/i })).toBeInTheDocument();
      expect(mockFetch).not.toHaveBeenCalled();
      expect(mockPush).not.toHaveBeenCalled();
    });
  });
});
