// apps/web/src/app/settings/page.tsx

import React from 'react';
import Link from 'next/link';

export default function SettingsPage() {
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
            />
          </div>
        </div>
      </header>

      {/* Settings List */}
      <main className="flex-1 overflow-y-auto px-4 pb-24">
        <div className="flex flex-col gap-px pt-6">
          {/* General */}
          <Link href="/settings/general" className="flex cursor-pointer items-center gap-4 bg-background-dark px-4 min-h-[3.5rem] justify-between border-b border-ui-dark">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-blue-500 text-white">
              <span className="material-symbols-outlined">settings</span>
            </div>
            <p className="flex-1 truncate text-base font-normal leading-normal text-text-dark">General</p>
            <span className="material-symbols-outlined text-text-subtle-dark">chevron_right</span>
          </Link>

          {/* Appearance */}
          <Link href="/settings/appearance" className="flex cursor-pointer items-center gap-4 bg-background-dark px-4 min-h-[3.5rem] justify-between border-b border-ui-dark">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-purple-500 text-white">
              <span className="material-symbols-outlined">brush</span>
            </div>
            <p className="flex-1 truncate text-base font-normal leading-normal text-text-dark">Appearance</p>
            <span className="material-symbols-outlined text-text-subtle-dark">chevron_right</span>
          </Link>

          {/* User Profile - NEW ITEM */}
          <Link href="/settings/profile" className="flex cursor-pointer items-center gap-4 bg-background-dark px-4 min-h-[3.5rem] justify-between border-b border-ui-dark">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-white">
              <span className="material-symbols-outlined">person</span>
            </div>
            <p className="flex-1 truncate text-base font-normal leading-normal text-text-dark">User Profile</p>
            <span className="material-symbols-outlined text-text-subtle-dark">chevron_right</span>
          </Link>

          {/* Health */}
          <Link href="/settings/health" className="flex cursor-pointer items-center gap-4 bg-background-dark px-4 min-h-[3.5rem] justify-between border-b border-ui-dark">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-red-500 text-white">
              <span className="material-symbols-outlined">favorite</span>
            </div>
            <p className="flex-1 truncate text-base font-normal leading-normal text-text-dark">Health</p>
            <span className="material-symbols-outlined text-text-subtle-dark">chevron_right</span>
          </Link>

          {/* Playback */}
          <Link href="/settings/playback" className="flex cursor-pointer items-center gap-4 bg-background-dark px-4 min-h-[3.5rem] justify-between border-b border-ui-dark">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-green-500 text-white">
              <span className="material-symbols-outlined">music_note</span>
            </div>
            <p className="flex-1 truncate text-base font-normal leading-normal text-text-dark">Playback</p>
            <span className="material-symbols-outlined text-text-subtle-dark">chevron_right</span>
          </Link>

          {/* AI & Personalization */}
          <Link href="/settings/ai" className="flex cursor-pointer items-center gap-4 bg-background-dark px-4 min-h-[3.5rem] justify-between border-b border-ui-dark">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-orange-500 text-white">
              <span className="material-symbols-outlined">psychology</span>
            </div>
            <p className="flex-1 truncate text-base font-normal leading-normal text-text-dark">AI & Personalization</p>
            <span className="material-symbols-outlined text-text-subtle-dark">chevron_right</span>
          </Link>

          {/* Privacy & Account */}
          <Link href="/settings/privacy" className="flex cursor-pointer items-center gap-4 bg-background-dark px-4 min-h-[3.5rem] justify-between border-b border-ui-dark">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-gray-500 text-white">
              <span className="material-symbols-outlined">shield_person</span>
            </div>
            <p className="flex-1 truncate text-base font-normal leading-normal text-text-dark">Privacy & Account</p>
            <span className="material-symbols-outlined text-text-subtle-dark">chevron_right</span>
          </Link>
        </div>
      </main>

      {/* Bottom Navigation Bar - Placeholder */}
      <nav className="fixed bottom-0 left-0 right-0 mx-auto w-full max-w-md border-t border-ui-dark/50 bg-background-dark/80 backdrop-blur-lg">
        <div className="flex h-20 items-center justify-around px-2 text-zinc-400">
          {/* Icons here */}
        </div>
      </nav>
    </div>
  );
}
