'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { useAuthStore } from '@/store/auth'; // Assuming a Zustand store for auth state

const AuthCallbackPage = () => {
  const router = useRouter();
  const setSession = useAuthStore((state) => state.setSession); // Assuming setSession action

  useEffect(() => {
    const handleCallback = async () => {
      console.log('AuthCallbackPage: Full URL:', window.location.href);
      console.log('AuthCallbackPage: Hash:', window.location.hash);
      console.log('AuthCallbackPage: Search:', window.location.search);

      const supabase = createClient();
      // Supabase's signInWithOAuth handles the PKCE exchange automatically on redirect.
      // We just need to ensure the session is retrieved and updated.
      const { data: { session }, error: getSessionError } = await supabase.auth.getSession();

      if (getSessionError) {
        console.error('Error getting session:', getSessionError.message);
        router.push(`/auth/error?message=${getSessionError.message}`);
        return;
      }

      if (session) {
        // Successfully got session, now set the session in the store
        setSession({
          accessToken: session.access_token || null,
          refreshToken: session.refresh_token || null,
          user: session.user || null,
        });

        // For now, always redirect to onboarding if a new session is established.
        // The actual onboarding_complete check will be re-introduced once the DB schema is updated.
        router.push('/onboarding');

      } else {
        console.warn('Auth callback received without a session. Redirecting to login.');
        router.push('/auth/login');
      }
    };

    handleCallback();
  }, [router, setSession]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background-dark text-white">
      <p>Processing authentication...</p>
      {/* Add a spinner or loading animation */}
    </div>
  );
};

export default AuthCallbackPage;
