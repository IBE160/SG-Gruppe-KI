// apps/web/src/app/onboarding/layout.tsx
import React from 'react';

interface OnboardingLayoutProps {
  children: React.ReactNode;
}

const OnboardingLayout: React.FC<OnboardingLayoutProps> = ({ children }) => {
  return (
    <div className="h-screen w-full flex flex-col bg-background-dark font-display text-white">
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default OnboardingLayout;
