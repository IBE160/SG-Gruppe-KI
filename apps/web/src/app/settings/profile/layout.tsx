// apps/web/src/app/settings/profile/layout.tsx
import React from 'react';
import Link from 'next/link';

interface ProfileLayoutProps {
  children: React.ReactNode;
}

export default function ProfileLayout({ children }: ProfileLayoutProps) {
  return (
    <div className="min-h-screen w-full flex-col bg-background-dark text-white font-display">
      {/* Top App Bar */}
      <header className="sticky top-0 z-10 flex shrink-0 items-center justify-between bg-background-dark px-4 py-3">
        <Link href="/settings/privacy" className="flex size-8 items-center justify-center">
          <span className="material-symbols-outlined text-zinc-100">arrow_back_ios_new</span>
        </Link>
        <h1 className="text-white text-xl font-bold">User Profile</h1>
        <div className="size-8"></div> {/* Placeholder for right-aligned item if needed */}
      </header>

      <main className="flex-grow p-4">
        {children}
      </main>
    </div>
  );
}
