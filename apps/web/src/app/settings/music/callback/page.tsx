"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

const SpotifyCallbackPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [statusMessage, setStatusMessage] = useState('Connecting to Spotify...');
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const verifier = searchParams.get('code_verifier'); // Insecure for production, for testing only

    if (code && verifier) {
      const completeSpotifyAuth = async () => {
        try {
          // Send the code and verifier to your backend
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/music/callback/spotify?code=${code}&code_verifier=${verifier}`,
            {
              method: 'GET',
            }
          );

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Failed to complete Spotify authentication.');
          }

          const data = await response.json();
          setStatusMessage(data.message || 'Spotify connected successfully!');
          setIsSuccess(true);
          // Redirect to a success/status page or settings after a short delay
          setTimeout(() => {
            router.push('/settings/music');
          }, 2000);
        } catch (err: any) {
          setError(err.message);
          setStatusMessage('Spotify connection failed.');
          setIsSuccess(false);
          console.error('Spotify callback error:', err);
        }
      };
      completeSpotifyAuth();
    } else {
      setError('Missing authorization code or code verifier.');
      setStatusMessage('Spotify connection failed: Missing data.');
      setIsSuccess(false);
      console.error('Spotify callback error: Missing code or verifier in URL');
    }
  }, [searchParams, router]);

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col items-center justify-center bg-background-light dark:bg-background-dark p-4 group/design-root font-display">
      <div className="flex flex-col items-center justify-center text-center max-w-sm w-full">
        {isSuccess ? (
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/20 mb-6">
            <span className="material-symbols-outlined text-primary" style={{ fontSize: '50px' }} aria-label="Check circle icon">check_circle</span>
          </div>
        ) : (
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-red-500/20 mb-6">
            <span className="material-symbols-outlined text-red-500" style={{ fontSize: '50px' }} aria-label="Cancel icon">cancel</span>
          </div>
        )}
        <h1 className="text-gray-900 dark:text-white tracking-tight text-3xl font-bold leading-tight pb-3">
          {statusMessage}
        </h1>
        {error && (
          <p className="text-red-500 dark:text-red-400 text-base font-normal leading-normal mb-6">
            Error: {error}
          </p>
        )}
        {!isSuccess && (
          <Link href="/settings/music/connect" className="mt-4">
            <button className="flex h-12 items-center justify-center rounded-full bg-primary px-6 text-center font-bold text-background-dark">
              Try Again
            </button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default SpotifyCallbackPage;
