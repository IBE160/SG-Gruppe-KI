// apps/web/src/app/onboarding/layout.tsx
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface OnboardingLayoutProps {
  children: React.ReactNode;
}

const OnboardingLayout: React.FC<OnboardingLayoutProps> = ({ children }) => {
  const router = useRouter();

  return (
    <div className="h-screen w-full flex flex-col bg-background-dark font-display text-white">
      {/* Header */}
      <header className="sticky top-0 z-10 p-4 bg-background-dark/80 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <Link href="#" onClick={() => router.back()} className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
            <span className="material-symbols-outlined text-white/80" aria-label="Back">arrow_back_ios_new</span>
          </Link>
          {/* Placeholder for Progress Dots */}
          <div className="flex w-full flex-row items-center justify-center gap-3">
            <div className="h-2 w-2 rounded-full bg-primary" aria-label="progress-dot"></div>
            <div className="h-2 w-2 rounded-full bg-white/20" aria-label="progress-dot"></div>
            <div className="h-2 w-2 rounded-full bg-white/20" aria-label="progress-dot"></div>
            <div className="h-2 w-2 rounded-full bg-white/20" aria-label="progress-dot"></div>
            <div className="h-2 w-2 rounded-full bg-white/20" aria-label="progress-dot"></div>
          </div>
          <div className="w-10"></div> {/* Spacer to balance the back button */}
        </div>
      </header>
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default OnboardingLayout;