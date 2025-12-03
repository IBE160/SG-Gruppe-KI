'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabaseClient'; // Adjust path if needed

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        console.error('Error getting session:', error);
        // Redirect to an error page or login page with an error message
        router.push('/login?error=session_failed');
        return;
      }

      if (session) {
        // Here you would typically store the session in a global state (Context, Redux, Zustand)
        // For simplicity, we'll just redirect.
        console.log('Session recovered, redirecting to profile...');
        
        // We need to make sure the backend gets the token. A common way is to
        // make a call to a backend endpoint to set a cookie.
        // For now, let's redirect to profile, and the profile page will handle fetching user data.
        router.push('/profile');
      } else {
         // This might happen if the user cancels the OAuth flow.
         router.push('/login?error=no_session');
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN') {
            console.log('Supabase SIGNED_IN event:', session);
            handleSession();
        }
    });
    
    // Initial check in case the event is missed
    handleSession();

    return () => {
      subscription?.unsubscribe();
    };
  }, [router]);

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Authenticating...</h1>
      <p>Please wait while we redirect you.</p>
    </div>
  );
}
