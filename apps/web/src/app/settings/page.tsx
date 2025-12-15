'use client';
import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const { accessToken, loading } = useAuth(); // Destructure loading as well
  const router = useRouter();

  useEffect(() => {
    if (!loading && !accessToken) { // Check loading state before redirecting
      console.log("SettingsPage: No accessToken, redirecting to login.");
      router.push('/auth/login');
    }
  }, [accessToken, loading, router]); // Add loading to dependency array

  console.log("SettingsPage: Current AccessToken", accessToken);
  console.log("SettingsPage: Loading state", loading);

  const settingsCategories = [
    { href: '/settings/general', icon: 'settings', title: 'General', color: 'bg-blue-500' },
    { href: '/settings/appearance', icon: 'brush', title: 'Appearance', color: 'bg-purple-500' },
    { href: '/settings/performance', icon: 'database', title: 'Performance & Data', color: 'bg-yellow-500' },
    { href: '/settings/profile', icon: 'person', title: 'User Profile', color: 'bg-primary' },
    { href: '/settings/health', icon: 'favorite', title: 'Health', color: 'bg-red-500' },
    { href: '/settings/playback', icon: 'music_note', title: 'Playback', color: 'bg-green-500' },
    { href: '/settings/ai', icon: 'psychology', title: 'AI & Personalization', color: 'bg-orange-500' },
    { href: '/settings/privacy', icon: 'shield_person', title: 'Privacy & Account', color: 'bg-gray-500' },
  ];

  const filteredCategories = useMemo(() => {
    if (!searchQuery) {
      return settingsCategories;
    }
    return settingsCategories.filter(category =>
      category.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, settingsCategories]);

  if (!accessToken) {
    return null; // or a loading spinner
  }

  return (
    <div className="min-h-screen w-full max-w-md mx-auto flex flex-col bg-background-dark text-white font-display">
      {/* Top App Bar */}
      <header className="sticky top-0 z-10 flex flex-col gap-4 bg-background-dark px-4 pt-8 pb-4">
        <h1 className="text-3xl font-bold leading-tight tracking-tight text-white">Settings</h1>
        {/* Search Bar */}
        <div className="px-4 py-2">
          <div className="flex w-full flex-1 items-stretch rounded-lg h-11 bg-ui-dark">
            <span className="material-symbols-outlined text-text-subtle-dark flex items-center pl-3">search</span>
            <input
              type="text"
              placeholder="Search Settings..."
              className="flex-1 rounded-lg bg-transparent text-text-dark focus:outline-none px-2"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </header>

      {/* Settings List */}
      <main className="flex-1 overflow-y-auto px-4 pb-24">
        <div className="flex flex-col gap-px pt-6">
          {filteredCategories.map(category => (
            <Link key={category.href} href={category.href} className="flex cursor-pointer items-center gap-4 bg-background-dark px-4 min-h-[3.5rem] justify-between border-b border-ui-dark">
              <div className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${category.color} text-white`}>
                <span className="material-symbols-outlined">{category.icon}</span>
              </div>
              <p className="flex-1 truncate text-base font-normal leading-normal text-text-dark">{category.title}</p>
              <span className="material-symbols-outlined text-text-subtle-dark">chevron_right</span>
            </Link>
          ))}
        </div>
      </main>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 mx-auto w-full max-w-md border-t border-ui-dark/50 bg-background-dark/80 backdrop-blur-lg">
        <div className="flex h-20 items-center justify-around px-2 text-zinc-400">
            <Link href="/dashboard" className="flex flex-col items-center gap-1 text-white/70">
                <span className="material-symbols-outlined">dashboard</span>
                <span className="text-xs font-medium">Dashboard</span>
            </Link>
            <Link href="/workout" className="flex flex-col items-center gap-1 text-white/70">
                <span className="material-symbols-outlined">play_circle</span>
                <span className="text-xs font-medium">Workout</span>
            </Link>
            <Link href="/history" className="flex flex-col items-center gap-1 text-white/70">
                <span className="material-symbols-outlined">history</span>
                <span className="text-xs font-medium">History</span>
            </Link>
            <Link href="/settings" className="flex flex-col items-center gap-1 text-primary">
                <span className="material-symbols-outlined fill">settings</span>
                <span className="text-xs font-medium">Settings</span>
            </Link>
        </div>
      </nav>
    </div>
  );
}
