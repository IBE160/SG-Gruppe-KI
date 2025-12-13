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
      const params = new URLSearchParams(window.location.search || window.location.hash.substring(1)); // Prioritize search for 'code', then hash for tokens
      const code = params.get('code');
      const error = params.get('error_description') || params.get('error');

      if (error) {
        console.error('Auth Callback Error:', error);
        router.push(`/auth/error?message=${error}`);
        return;
      }

      if (code) {
        // This is a PKCE flow, exchange the code for a session
        const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

        if (exchangeError) {
          console.error('Error exchanging code for session:', exchangeError.message);
          router.push(`/auth/error?message=${exchangeError.message}`);
          return;
        }

        // Successfully exchanged code, now set the session (though setSession might be redundant after exchangeCodeForSession)
        setSession({
          accessToken: data.session?.access_token || null,
          refreshToken: data.session?.refresh_token || null,
          user: data.session?.user || null,
        });

        // Redirect based on whether the user is new or returning
        router.push('/dashboard'); 
      } else {
        console.warn('Auth callback received without code or tokens. Redirecting to login.');
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
