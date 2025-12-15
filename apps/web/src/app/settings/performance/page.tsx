// apps/web/src/app/settings/performance/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useOfflineMode } from '../../../lib/useOfflineMode'; // Adjust path if necessary

export default function PerformanceSettingsPage() {
  const { isOfflineModeEnabled, setOfflineMode, clearCache } = useOfflineMode();
  const [isAutoSync, setIsAutoSync] = useState(true);
  const [isClearCacheModalOpen, setClearCacheModalOpen] = useState(false);

  const handleClearCache = async () => {
    await clearCache();
    console.log("Local cache cleared.");
    setClearCacheModalOpen(false);
  };

  return (
    <div className="min-h-screen w-full max-w-md mx-auto flex flex-col bg-background-dark text-white font-display">
      {/* Top App Bar */}
      <header className="sticky top-0 z-10 flex flex-col gap-4 bg-background-dark px-4 pt-8 pb-4">
        <div className="flex items-center">
            <Link href="/settings" className="p-2 -ml-2">
                <span className="material-symbols-outlined">arrow_back_ios_new</span>
            </Link>
            <h1 className="text-xl font-bold leading-tight tracking-tight text-white ml-2">Performance & Data</h1>
        </div>
      </header>

      {/* Settings List */}
      <main className="flex-1 overflow-y-auto px-4 pb-24">
        <div className="flex flex-col gap-px pt-6">
            {/* Offline Mode Toggle */}
            <div className="flex justify-between items-center py-4 border-b border-ui-dark">
                <div>
                    <h2 className="font-semibold">Offline Mode</h2>
                    <p className="text-sm text-text-secondary-dark">Save workout plans and logs locally for offline access.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={isOfflineModeEnabled} onChange={(e) => setOfflineMode(e.target.checked)} className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                </label>
            </div>

            {/* Auto-Sync Toggle */}
            <div className="flex justify-between items-center py-4 border-b border-ui-dark">
                <div>
                    <h2 className="font-semibold">Auto-Sync Offline Data</h2>
                    <p className="text-sm text-text-secondary-dark">Automatically sync your offline data when you reconnect.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={isAutoSync} onChange={(e) => setIsAutoSync(e.target.checked)} className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                </label>
            </div>

            {/* Sync Now Button */}
            {hasUnsyncedData && (
              <button
                  onClick={synchronizeData}
                  className="w-full text-left py-4 border-b border-ui-dark text-primary"
              >
                  Sync Now
              </button>
            )}

            {/* Clear Local Cache */}
            <button
                onClick={() => setClearCacheModalOpen(true)}
                className="w-full text-left py-4 border-b border-ui-dark text-red-500"
            >
                Clear Local Cache
            </button>
        </div>
      </main>

      {/* Clear Cache Confirmation Modal */}
      {isClearCacheModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-surface-dark p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-lg font-bold">Clear Local Cache?</h2>
            <p className="text-sm text-text-secondary-dark mt-2">This will remove all locally stored workout plans and logs. This action cannot be undone.</p>
            <div className="flex justify-end gap-4 mt-6">
              <button onClick={() => setClearCacheModalOpen(false)} className="px-4 py-2 rounded-lg text-white">Cancel</button>
              <button onClick={handleClearCache} className="px-4 py-2 bg-red-500 rounded-lg text-white">Clear</button>
            </div>
          </div>
        </div>
      )}

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
