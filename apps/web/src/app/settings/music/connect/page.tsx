"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const SpotifyConnectExplainer: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleConnectSpotify = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/music/connect/spotify`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to initiate Spotify connection.');
      }
      const data = await response.json();
      router.push(data.auth_url); // Redirect user to Spotify's auth page
    } catch (err: any) {
      setError(err.message);
      console.error('Spotify connection error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark group/design-root overflow-x-hidden">
      {/* TopAppBar */}
      <div className="sticky top-0 z-10 flex items-center justify-between p-4 pb-2 bg-background-light dark:bg-background-dark">
        <div className="flex w-12 items-center justify-start">
          <Link href="/settings/music">
            <button className="flex h-12 max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full bg-transparent text-gray-800 dark:text-white min-w-0 p-0">
              <span className="material-symbols-outlined text-gray-800 dark:text-white" style={{ fontSize: '24px' }}>close</span>
            </button>
          </Link>
        </div>
        <h2 className="flex-1 text-center text-lg font-bold leading-tight tracking-[-0.015em] text-gray-900 dark:text-white">Connect Spotify</h2>
        <div className="flex w-12 items-center justify-end"></div>
      </div>
      <div className="flex flex-col px-4">
        {/* HeaderImage */}
        <div className="container">
          <div
            className="w-full bg-center bg-no-repeat bg-cover flex flex-col justify-end overflow-hidden rounded-lg min-h-60"
            style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCYalFCcYOw1OPmKtlTs6C0g3wV1CEJcFObsVjKZc1AznzPyuwEZ9Yr2TSRo2dTKABEB_63tjbBtDIVz7yUoohhkXZ0b5LPdPkuKw-jzhqa6Kp_15FvK2Jz1MYj3U7xWgS05Nkp2zYHhHzNhu-PulQAEhPkxVWpUeHnSj6z6N-L6koIyKAqMvJ77p_8089qwdcQ81kq1zqxVLd5Qd6tjzP1yAYOg5mzBcOB1JCEPkGGsz0yYKl6uZiecCkiSVwTEJ189w-1bkLrBA")' }}
          ></div>
        </div>
        {/* HeadlineText */}
        <h1 className="text-gray-900 dark:text-white tracking-tight text-[32px] font-bold leading-tight text-center pb-3 pt-8">Power Your Workouts with Music</h1>
        {/* BodyText */}
        <p className="text-gray-600 dark:text-gray-300 text-base font-normal leading-normal pb-3 pt-1 text-center">
          Connect Spotify to get AI-curated playlists that match your intensity, motivate you, and help you hit your goals.
        </p>
      </div>
      <div className="flex flex-col gap-2 pt-6 pb-6 px-4">
        {/* ListItem 1 */}
        <div className="flex items-center gap-4 bg-transparent min-h-[72px] py-2">
          <div className="flex items-center justify-center rounded-full bg-primary/20 shrink-0 size-12">
            <span className="material-symbols-outlined text-primary" style={{ fontSize: '24px' }}>psychology</span>
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-gray-900 dark:text-white text-base font-medium leading-normal line-clamp-1">AI-Powered Playlists</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-normal leading-normal line-clamp-2">Music dynamically selected to match your workout pace and intensity.</p>
          </div>
        </div>
        {/* ListItem 2 */}
        <div className="flex items-center gap-4 bg-transparent min-h-[72px] py-2">
          <div className="flex items-center justify-center rounded-full bg-primary/20 shrink-0 size-12">
            <span className="material-symbols-outlined text-primary" style={{ fontSize: '24px' }}>analytics</span>
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-gray-900 dark:text-white text-base font-medium leading-normal line-clamp-1">Performance Insights</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-normal leading-normal line-clamp-2">Understand how music impacts your training and endurance.</p>
          </div>
        </div>
        {/* ListItem 3 */}
        <div className="flex items-center gap-4 bg-transparent min-h-[72px] py-2">
          <div className="flex items-center justify-center rounded-full bg-primary/20 shrink-0 size-12">
            <span className="material-symbols-outlined text-primary" style={{ fontSize: '24px' }}>music_note</span>
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-gray-900 dark:text-white text-base font-medium leading-normal line-clamp-1">Seamless Experience</p>
            <p className="text-500 dark:text-gray-400 text-sm font-normal leading-normal line-clamp-2">Control your music directly from your workout screen.</p>
          </div>
        </div>
      </div>
      {/* Permissions Section */}
      <div className="flex flex-col gap-4 bg-gray-100 dark:bg-white/10 p-4 mx-4 rounded-lg">
        <h3 className="text-base font-bold text-gray-900 dark:text-white">To do this, we'll need permission to:</h3>
        <div className="flex items-start gap-3">
          <span className="material-symbols-outlined text-primary mt-0.5" style={{ fontSize: '20px' }}>check_circle</span>
          <p className="text-sm font-normal text-gray-600 dark:text-gray-300">
            <span className="font-medium text-gray-800 dark:text-gray-100">Access your listening history &amp; saved tracks</span>
            <br />To analyze your music taste for better recommendations.
          </p>
        </div>
        <div className="flex items-start gap-3">
          <span className="material-symbols-outlined text-primary mt-0.5" style={{ fontSize: '20px' }}>check_circle</span>
          <p className="text-sm font-normal text-gray-600 dark:text-gray-300">
            <span className="font-medium text-gray-800 dark:text-gray-100">View your account data</span>
            <br />To view your public profile and connect your account.
          </p>
        </div>
      </div>
      {/* Sticky Footer for CTA */}
      <div className="sticky bottom-0 mt-auto flex flex-col gap-4 bg-background-light dark:bg-background-dark pt-6 pb-8 px-4">
        {error && <p className="text-red-500 text-center">{error}</p>}
        {/* CTA Button */}
        <button
          className="flex w-full items-center justify-center gap-2.5 rounded-full bg-primary py-4 text-center font-bold text-background-dark"
          onClick={handleConnectSpotify}
          disabled={isLoading}
        >
          {isLoading ? (
            <svg data-testid="loading-spinner" className="animate-spin h-5 w-5 text-background-dark" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg aria-hidden="true" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24">
              <path d="M12 2.577a9.423 9.423 0 1 0 0 18.846 9.423 9.423 0 0 0 0-18.846zm-1.588 14.113a.688.688 0 0 1-.974 0 .688.688 0 0 1 0-.974c2.2-2.2 2.2-5.776 0-7.975a.688.688 0 0 1 .974-.974c2.686 2.686 2.686 7.058 0 9.749zm3.14-6.476a.688.688 0 0 1-.974 0 .688.688 0 0 1 0-.974c.94-.94.94-2.47 0-3.41a.688.688 0 0 1 .974-.974c1.428 1.428 1.428 3.75 0 5.178zm2.41 3.23a.688.688 0 0 1-.974 0 .688.688 0 0 1 0-.974c1.64-1.64 1.64-4.305 0-5.945a.688.688 0 1 1 .974-.974c2.128 2.128 2.128 5.586 0 7.713z"></path>
            </svg>
          )}
          Connect with Spotify
        </button>
        {/* Disclaimer */}
        <p className="text-center text-xs text-gray-500 dark:text-gray-400">
          We will never post anything without your permission.
          <Link className="font-medium underline" href="/privacy">Read our Privacy Policy</Link>.
        </p>
      </div>
    </div>
  );
};

export default SpotifyConnectExplainer;
