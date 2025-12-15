
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api'; // Import the API client

// Helper component for Material Symbols
const MaterialSymbol = ({ name, className, style }: { name: string; className?: string; style?: React.CSSProperties }) => (
  <span className={`material-symbols-outlined ${className}`} style={style}>{name}</span>
);

export default function ExportDataPage() {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleRequestExport = async () => {
    setLoading(true);
    setError(null);
    // TODO: Get actual authentication token from a global state or cookie
    const token = "YOUR_AUTH_TOKEN_HERE"; // Placeholder

    const { data, error: apiError } = await api.exportData(token);

    if (apiError) {
      setError(apiError.message);
      console.error("Error requesting data export:", apiError);
    } else {
      console.log("Data export requested:", data);
      setShowConfirmation(true);
    }
    setLoading(false);
  };

  const handleGoToSettings = () => {
    router.push('/settings/privacy');
  };

  const handleGoToDashboard = () => {
    router.push('/dashboard');
  };

  return (
    <div className="relative mx-auto flex h-full min-h-screen w-full max-w-md flex-col bg-background-dark font-display text-white">
      {showConfirmation ? (
        // Screen 2: Export Initiated Confirmation
        <main className="flex flex-1 flex-col px-4 pt-6 pb-24">
          <div className="flex items-center justify-between pb-2">
            <div className="flex size-12 shrink-0 items-center justify-center"></div>
            <h2 className="flex-1 text-center text-lg font-bold leading-tight tracking-[-0.015em]">Export Initiated</h2>
            <div className="size-12 shrink-0"></div>
          </div>

          <div className="flex flex-col items-center justify-center pt-8 pb-6">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/20">
              <MaterialSymbol name="task_alt" className="text-5xl text-primary" />
            </div>
          </div>

          <h1 className="text-center text-[32px] font-bold leading-tight tracking-tight pb-3 pt-6">Export Request Received!</h1>
          <p className="text-center text-base font-normal leading-normal text-zinc-300 pb-3 pt-1">Your data export is now being compiled.</p>

          <div className="grid grid-cols-1 gap-x-6 py-6">
            <div className="flex flex-col border-t border-t-zinc-700 py-5">
              <p className="text-sm font-normal leading-normal text-zinc-400">Estimated Time for Export Generation</p>
              <p className="text-sm font-normal leading-normal pt-1">Your export may take up to 5-10 minutes to compile.</p>
            </div>
            <div className="flex flex-col border-t border-t-zinc-700 py-5">
              <p className="text-sm font-normal leading-normal text-zinc-400">Delivery Method</p>
              <p className="text-sm font-normal leading-normal pt-1">Secure download link sent to your email and via in-app notification.</p>
            </div>
          </div>

          <div className="flex-grow"></div>

          <div className="flex flex-col items-stretch gap-3 py-3">
            <button
              onClick={handleGoToSettings}
              className="flex h-12 min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-full bg-primary px-5 text-base font-bold leading-normal tracking-[0.015em] text-background-dark transition-opacity hover:opacity-90"
            >
              <span className="truncate">Go to Settings</span>
            </button>
            <button
              onClick={handleGoToDashboard}
              className="flex h-12 min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-full bg-primary/20 px-5 text-base font-bold leading-normal tracking-[0.015em] text-primary transition-opacity hover:opacity-90"
            >
              <span className="truncate">Go to Dashboard</span>
            </button>
          </div>
        </main>
      ) : (
        // Screen 1: Export Data Information & Request
        <>
          <header className="flex shrink-0 items-center justify-between px-4 py-3">
            <Link href="/settings/privacy" className="flex size-10 items-center justify-center">
              <MaterialSymbol name="arrow_back_ios_new" className="text-2xl" />
            </Link>
            <h1 className="flex-1 text-center text-xl font-bold leading-tight tracking-tight">Export Your Data</h1>
            <div className="size-10" />
          </header>

          <div className="flex flex-col flex-1 pb-24">
            <div className="px-4">
              <p className="text-base font-normal leading-normal pb-3 pt-1 text-zinc-300">
                You have the right to request a copy of your personal data. This report will include information we've collected about your account and activities on the app.
              </p>

              {error && <p className="text-red-500 text-sm mt-2">{error}</p>} {/* Display error message */}

              <h3 className="text-lg font-bold leading-tight tracking-[-0.015em] pb-2 pt-4">What's Included:</h3>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-4 bg-transparent min-h-14 justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center rounded-lg bg-primary/30 shrink-0 size-10">
                      <MaterialSymbol name="person" />
                    </div>
                    <p className="text-base font-normal leading-normal flex-1 truncate">Profile Information</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 bg-transparent min-h-14 justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center rounded-lg bg-primary/30 shrink-0 size-10">
                      <MaterialSymbol name="history" />
                    </div>
                    <p className="text-base font-normal leading-normal flex-1 truncate">Workout History</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 bg-transparent min-h-14 justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center rounded-lg bg-primary/30 shrink-0 size-10">
                      <MaterialSymbol name="monitoring" />
                    </div>
                    <p className="text-base font-normal leading-normal flex-1 truncate">Body Metrics</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 bg-transparent min-h-14 justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center rounded-lg bg-primary/30 shrink-0 size-10">
                      <MaterialSymbol name="flag" />
                    </div>
                    <p className="text-base font-normal leading-normal flex-1 truncate">Fitness Goals</p>
                  </div>
                </div>
              </div>
              <p className="text-sm mt-2 px-2 text-zinc-400">Note: Wearable data is not included in this export.</p>

              <h3 className="text-lg font-bold leading-tight tracking-[-0.015em] pb-2 pt-8">The Process</h3>
              <p className="text-base font-normal leading-normal text-zinc-300">
                Once requested, we'll compile your data. This may take a few days. When it's ready, we'll send a secure, expiring link to your registered email and via an in-app notification.
              </p>
            </div>
          </div>

          <div className="fixed bottom-0 left-0 right-0">
            <div className="p-4">
              <button
                onClick={handleRequestExport}
                className="flex w-full items-center justify-center rounded-full bg-primary py-4 px-6 text-base font-bold text-black transition-transform duration-200 ease-in-out hover:scale-[1.02] active:scale-[0.98]"
                disabled={loading}
              >
                {loading ? 'Requesting...' : 'Request Data Export'}
              </button>
            </div>
          </div>
        </>
      )}

      {/* Bottom Navigation Bar - Common to both screens */}
      <nav className="fixed bottom-0 left-0 right-0 mx-auto h-20 w-full max-w-md border-t border-white/10 bg-background-dark/80 backdrop-blur-lg">
        <div className="flex h-full items-start justify-around px-4 pt-3 text-zinc-400">
          <Link href="/dashboard" className="flex flex-col items-center gap-1 text-center">
            <MaterialSymbol name="dashboard" className="text-2xl" />
            <span className="text-xs">Dashboard</span>
          </Link>
          <Link href="/workout" className="flex flex-col items-center gap-1 text-center">
            <MaterialSymbol name="play_circle" className="text-2xl" />
            <span className="text-xs">Workout</span>
          </Link>
          <Link href="/history" className="flex flex-col items-center gap-1 text-center">
            <MaterialSymbol name="history" className="text-2xl" />
            <span className="text-xs">History</span>
          </Link>
          <Link href="/settings" className="flex flex-col items-center gap-1 text-center text-primary">
            <MaterialSymbol name="settings" className="text-2xl" style={{ fontVariationSettings: "'FILL' 1" }} />
            <span className="text-xs font-semibold">Settings</span>
          </Link>
        </div>
      </nav>
      <div className="pointer-events-none fixed bottom-0 h-8 w-full max-w-md bg-gradient-to-t from-background-dark"></div>
    </div>
  );
}
