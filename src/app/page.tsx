'use client';

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from '@/lib/supabaseClient';

import { ContextWindow } from "@/components/ui/context-window";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthAndOnboarding = async () => {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !session) {
        // User not authenticated, redirect to login (or keep on home, depending on app flow)
        // For this task, we assume non-authenticated users can see home, but need to login to proceed.
        setLoading(false);
        return;
      }

      // User is authenticated, check onboarding status
      try {
        const response = await fetch('/api/v1/users/me', {
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
          },
        });
        const userData = await response.json();

        if (response.ok && userData.data) {
          // Check if key onboarding fields are null
          const userProfile = userData.data;
          if (!userProfile.goals || !userProfile.units) { // Example: checking for goals and units
            router.push('/onboarding');
          } else {
            setLoading(false);
          }
        } else {
          // Error fetching profile, treat as un-onboarded or error
          console.error("Error fetching user profile:", userData);
          router.push('/onboarding');
        }
      } catch (error) {
        console.error("Network error fetching user profile:", error);
        router.push('/onboarding'); // Redirect to onboarding on network error
      }
    };

    checkAuthAndOnboarding();
  }, [router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            Welcome to the AI Personal Training Advisor!
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Your personalized fitness journey starts here.
          </p>
        </div>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <a
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
            href="/login" // Link to your login page
          >
            Go to Login
          </a>
          {/* Temporary link to Profile Page for development */}
          <a
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-blue-600 px-5 text-white transition-colors hover:bg-blue-700 md:w-[158px]"
            href="/profile"
          >
            Go to Profile
          </a>
          <ContextWindow />
        </div>
      </main>
    </div>
  );
}
