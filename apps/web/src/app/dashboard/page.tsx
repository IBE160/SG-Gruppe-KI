// apps/web/src/app/dashboard/page.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client'; // Import client-side supabase

export default function DashboardPage() {
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/'; // Redirect to home after logout
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background-dark text-white p-4">
      <h1 className="text-3xl font-bold mb-4">Welcome to your Dashboard!</h1>
      <p className="text-lg text-white/80 mb-8">Your personalized fitness journey starts here.</p>
      <div className="flex flex-col gap-4">
        <Link href="/onboarding" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-full text-background-dark bg-primary hover:bg-primary/90">
            Go to Onboarding (if new user)
        </Link>
        <button
          onClick={handleLogout}
          className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-full text-primary bg-background-dark hover:bg-white/10"
        >
          Logout
        </button>
      </div>
    </div>
  );
}