
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api'; // Import the API client
import { signOut } from '@/lib/supabaseClient'; // Import the signOut function

// Helper component for Material Symbols
const MaterialSymbol = ({ name, className, style }: { name: string; className?: string; style?: React.CSSProperties }) => (
  <span className={`material-symbols-outlined ${className}`} style={style}>{name}</span>
);

enum DeleteScreen {
  WARNING,
  CONFIRMATION,
  INITIATED,
  COMPLETE,
}

export default function DeleteAccountPage() {
  const [currentScreen, setCurrentScreen] = useState(DeleteScreen.WARNING);
  const [confirmationText, setConfirmationText] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const isConfirmationButtonEnabled = confirmationText === 'DELETE' && password.length > 0;

  const handleContinueToDelete = () => setCurrentScreen(DeleteScreen.CONFIRMATION);
  const handleCancel = () => router.push('/settings/privacy'); // Go back to privacy settings

  const handleDeleteConfirm = async () => {
    setLoading(true);
    setError(null);
    // TODO: Get actual authentication token from a global state or cookie
    const token = "YOUR_AUTH_TOKEN_HERE"; // Placeholder

    const { data, error: apiError } = await api.deleteAccount(token);

    if (apiError) {
      setError(apiError.message);
      console.error("Error deleting account:", apiError);
    } else {
      console.log("Account deletion initiated:", data);
      setCurrentScreen(DeleteScreen.INITIATED);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    const success = await signOut();
    if (success) {
      console.log("Logout successful after deletion initiation");
      setCurrentScreen(DeleteScreen.COMPLETE);
    } else {
      console.error("Logout failed after deletion initiation");
      // Even if logout fails, the account deletion process might have started.
      // We still transition to the complete screen.
      setCurrentScreen(DeleteScreen.COMPLETE);
    }
  };

  const handleReturnToLogin = () => {
    router.push('/login'); // Assuming a /login route
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case DeleteScreen.WARNING:
        return (
          <>
            <main className="flex flex-1 flex-col justify-center px-4 sm:px-6">
              <div className="flex flex-col items-center text-center">
                <div className="flex size-16 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-6">
                  <MaterialSymbol name="warning" className="!text-4xl" />
                </div>
                <h1 className="text-destructive text-[32px] font-bold leading-tight tracking-tight">Permanently Delete Your Account?</h1>
                <h2 className="text-[#F5F5F5] text-[22px] font-bold leading-tight tracking-[-0.015em] pt-5">This action cannot be undone.</h2>
                <div className="pt-4 pb-3 text-left max-w-md mx-auto">
                  <p className="text-[#F5F5F5] text-base font-normal leading-normal text-center">You will permanently lose all of your data, including:</p>
                  <ul className="list-disc list-inside text-[#F5F5F5] text-base font-normal leading-normal mt-3 space-y-1">
                    <li>Personal Profile & Settings</li>
                    <li>Complete Workout History & Progress</li>
                    <li>Personal Bests & Achievements</li>
                    <li>Custom Generated Workout Plans</li>
                  </ul>
                </div>
                <p className="text-[#8A8A8E] text-sm font-normal leading-normal px-4 pt-4">This action complies with your right to be forgotten under GDPR.</p>
                <div className="mt-8 text-center text-[#F5F5F5] text-base">
                  <p>Want to keep a copy of your progress? <Link href="/settings/privacy/export-data" className="font-bold text-primary hover:underline">Export your data</Link> before you go.</p>
                </div>
              </div>
            </main>
            <div className="w-full px-4 sm:px-6 pb-6 pt-4 space-y-3">
              <button
                onClick={handleContinueToDelete}
                className="flex h-14 w-full items-center justify-center rounded-full bg-destructive px-6 text-base font-bold text-white transition-colors hover:bg-destructive/90"
              >
                Continue to Delete
              </button>
              <button
                onClick={handleCancel}
                className="flex h-14 w-full items-center justify-center rounded-full bg-transparent px-6 text-base font-bold text-[#F5F5F5] ring-1 ring-inset ring-white/20 transition-colors hover:bg-white/10"
              >
                Cancel / Go Back
              </button>
            </div>
          </>
        );

      case DeleteScreen.CONFIRMATION:
        return (
          <>
            <main className="flex flex-1 flex-col overflow-y-auto px-4">
              <div className="flex items-center pt-4 pb-2">
                <button onClick={() => setCurrentScreen(DeleteScreen.WARNING)} className="text-white flex size-12 shrink-0 items-center justify-center">
                  <MaterialSymbol name="arrow_back_ios_new" className="text-2xl" />
                </button>
                <h2 className="flex-1 text-center text-lg font-bold leading-tight tracking-[-0.015em] text-destructive pr-12">Confirm Account Deletion</h2>
              </div>
              <div className="flex flex-col items-center justify-center text-center pt-8">
                <h1 className="text-white tracking-light text-[32px] font-bold leading-tight pb-3">This action is irreversible.</h1>
                <p className="text-gray-300 text-base font-normal leading-normal pb-3">All your workout data, history, and personal progress will be permanently lost.</p>
                <p className="text-gray-300 text-base font-normal leading-normal pt-4">To confirm, please type 'DELETE' in the box below.</p>
              </div>
              <div className="flex-grow flex flex-col justify-start pt-8 gap-6">
                <div className="flex max-w-[480px] w-full flex-col gap-4">
                  <label className="flex flex-col min-w-40 flex-1">
                    <p className="text-white text-base font-medium leading-normal pb-2">Type 'DELETE' to confirm</p>
                    <input
                      type="text"
                      className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-white focus:outline-0 focus:ring-2 focus:ring-primary border border-primary/30 bg-white/5 h-14 placeholder:text-gray-500 p-[15px] text-base font-normal leading-normal"
                      placeholder="DELETE"
                      value={confirmationText}
                      onChange={(e) => setConfirmationText(e.target.value)}
                    />
                  </label>
                </div>
                <div className="flex max-w-[480px] w-full flex-col gap-4">
                  <label className="flex flex-col min-w-40 flex-1">
                    <p className="text-white text-base font-medium leading-normal pb-2">Re-enter your password</p>
                    <div className="flex w-full flex-1 items-stretch rounded-xl">
                      <input
                        type={showPassword ? "text" : "password"}
                        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-white focus:outline-0 focus:ring-2 focus:ring-primary border border-primary/30 bg-white/5 h-14 placeholder:text-gray-500 p-[15px] rounded-r-none border-r-0 pr-2 text-base font-normal leading-normal"
                        placeholder="Re-enter your password for security"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <div className="text-gray-400 flex border border-primary/30 bg-white/5 items-center justify-center pr-[15px] rounded-r-xl border-l-0">
                        <span className="material-symbols-outlined text-2xl cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                          {showPassword ? "visibility" : "visibility_off"}
                        </span>
                      </div>
                    </div>
                  </label>
                </div>
              </div>
              <div className="py-6">
                <button
                  onClick={handleDeleteConfirm}
                  className={`flex w-full items-center justify-center rounded-xl h-14 px-6 text-base font-bold text-white ${isConfirmationButtonEnabled ? 'bg-destructive' : 'bg-destructive/50 cursor-not-allowed'}`}
                  disabled={!isConfirmationButtonEnabled}
                >
                  Permanently Delete My Account
                </button>
              </div>
            </main>
            <nav className="flex h-[84px] w-full items-center justify-around border-t border-white/10 bg-background-dark/80 backdrop-blur-lg">
                <Link href="/dashboard" className="flex flex-col items-center gap-1.5 text-gray-400">
                  <MaterialSymbol name="dashboard" className="text-2xl" />
                  <span className="text-xs font-medium">Dashboard</span>
                </Link>
                <Link href="/workout" className="flex flex-col items-center gap-1.5 text-gray-400">
                  <MaterialSymbol name="play_circle" className="text-2xl" />
                  <span className="text-xs font-medium">Workout</span>
                </Link>
                <Link href="/history" className="flex flex-col items-center gap-1.5 text-gray-400">
                  <MaterialSymbol name="history" className="text-2xl" />
                  <span className="text-xs font-medium">History</span>
                </Link>
                <Link href="/settings" className="flex flex-col items-center gap-1.5 text-primary">
                  <MaterialSymbol name="settings" className="text-2xl filled" style={{ fontVariationSettings: "'FILL' 1" }} />
                  <span className="text-xs font-bold">Settings</span>
                </Link>
            </nav>
          </>
        );

      case DeleteScreen.INITIATED:
        return (
          <>
            <div className="flex items-center p-4 pb-2">
              <div className="flex size-12 shrink-0 items-center justify-start"></div>
              <h2 className="flex-1 text-center text-lg font-bold leading-tight tracking-[-0.015em]">Account Deletion Initiated</h2>
              <div className="flex w-12 items-center justify-end"></div>
            </div>
            <div className="flex flex-1 flex-col justify-between p-4">
              <div className="flex flex-1 flex-col items-center justify-center text-center">
                <div className="flex w-full grow items-center justify-center bg-transparent py-3">
                  <MaterialSymbol name="task_alt" className="text-primary" style={{ fontSize: '96px' }} />
                </div>
                <h1 className="tracking-light text-[32px] font-bold leading-tight">Deletion Process Has Begun</h1>
                <p className="pt-1 text-base font-normal leading-normal text-zinc-300">Your account deletion process has begun.</p>
                <div className="mt-8 w-full max-w-md rounded-lg bg-white/5 p-6 text-left">
                  <h3 className="text-md font-bold">Deletion Timeline</h3>
                  <p className="mt-2 text-sm font-normal leading-normal text-zinc-300">All your personal data will be permanently removed within 30 days. You will receive an email confirmation once the process is complete.</p>
                </div>
              </div>
              <div className="py-3">
                <button
                  onClick={handleLogout}
                  className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 px-5 flex-1 w-full bg-primary text-background-dark text-base font-bold leading-normal tracking-[0.015em]"
                >
                  <span className="truncate">Okay, Log Me Out</span>
                </button>
              </div>
            </div>
          </>
        );

      case DeleteScreen.COMPLETE:
        return (
          <div className="flex h-full min-h-screen w-full flex-col items-center justify-between p-6">
            <div className="flex w-full flex-col items-center justify-center text-center">
              {/* This image URL is from the HTML, ideally should be local asset */}
              <div className="w-20 h-20 bg-center bg-no-repeat bg-contain mb-8 mt-16" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBbfqp-MN23A5NZyBXn4me28gfvivuK6sHY4WyK1-DuSkn9xMmYAavbYqobJv57twAsO8ojduAqWmmfukKiO3CMxxcZqbOhql9Btlya0GeucKZEzWNFk97KQ63rsSUZQ4iUQNEYff4C0wt9rkxVv5T-q4VdvaNW2o_ROUjGkisRSrMujObM-X0MrGDfWtFvmwGUUY_-_EZ7wMavztsKDpcKRl3-PCq7yb4LV7p8N6LmB2uBw45HV2YirZGlJll21MZO25IoJj-9noQK")' }} data-alt="AI Personal Trainer App Logo"></div>
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/20 mb-6">
                <MaterialSymbol name="task_alt" className="text-5xl text-primary" />
              </div>
              <h1 className="text-white tracking-light text-[32px] font-bold leading-tight px-4 text-center pb-3 pt-6">Deletion Initiated</h1>
              <p className="text-white/80 text-base font-normal leading-normal pb-3 pt-1 px-4 text-center max-w-sm">
                Your account deletion process is underway. Your data will be permanently erased within 30 days.
              </p>
            </div>
            <div className="w-full max-w-md">
              <div className="flex px-4 py-3">
                <button
                  onClick={handleReturnToLogin}
                  className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 px-5 flex-1 bg-primary text-background-dark text-base font-bold leading-normal tracking-[0.015em]"
                >
                  <span className="truncate">Return to Login</span>
                </button>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="relative flex h-screen w-full flex-col bg-background-dark font-display text-white">
      {renderScreen()}
    </div>
  );
}
