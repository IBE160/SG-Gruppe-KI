import React from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react'; // Assuming lucide-react for icons, adjust if using Material Symbols

interface ProfileLayoutProps {
  children: React.ReactNode;
}

const ProfileLayout: React.FC<ProfileLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background-dark text-white flex flex-col">
      {/* Top App Bar */}
      <header className="sticky top-0 z-10 flex items-center justify-between p-4 bg-background-dark border-b border-white/10">
        <Link href="/settings" className="text-white">
          <ChevronLeft className="h-6 w-6" />
        </Link>
        <h1 className="text-lg font-bold">User Profile</h1>
        <div className="w-6" /> {/* Placeholder for alignment */}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4">
        {children}
      </main>

      {/* Optional: Bottom Navigation Bar can be added here if needed */}
    </div>
  );
};

export default ProfileLayout;