'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { useState, useEffect } from 'react'; // Import useState and useEffect

// Helper function to generate PKCE code verifier and challenge
// const generateCodeVerifier = () => {
//   const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
//   let randomString = '';
//   for (let i = 0; i < 128; i++) {
//     randomString += possible.charAt(Math.floor(Math.random() * possible.length));
//   }
//   return randomString;
// };

// const generateCodeChallenge = async (verifier: string) => {
//   const encoder = new TextEncoder();
//   const data = encoder.encode(verifier);
//   const digest = await window.crypto.subtle.digest('SHA-256', data);
//   return btoa(String.fromCharCode(...new Uint8Array(digest)))
//     .replace(/\+/g, '-')
//     .replace(/\//g, '_')
//     .replace(/=+$/, '');
// };

const WelcomeScreen = () => {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false); // To ensure window is defined

  useEffect(() => {
    setIsClient(true);
  }, []);

  const onCreateAccount = () => {
    router.push('/auth/signup');
  };

  const onLogin = () => {
    router.push('/auth/login');
  };





  const onGoogleAuth = async () => {
    console.log('Initiate Google OAuth');
    const supabase = createClient();

    try {
      if (!isClient) {
        console.warn('Cannot initiate OAuth: Not in client environment yet.');
        return;
      }

      // Supabase handles PKCE automatically with signInWithOAuth
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          skipBrowserRedirect: false,
        },
      });

      if (error) {
        console.error('Google OAuth Error (signInWithOAuth):', error.message);
      } else {
        console.log('Google OAuth initiated, data from signInWithOAuth:', data);
      }
    } catch (e) {
      console.error('Unexpected error during Google OAuth initiation:', e);
    }
  };

  const onAppleAuth = () => {
    console.log('Initiate Apple OAuth');
    // Implement Apple OAuth logic here
  };

  const onTermsOfService = () => {
    // Navigate to Terms of Service page
    console.log('Navigate to Terms of Service');
  };

  const onPrivacyPolicy = () => {
    // Navigate to Privacy Policy page
    console.log('Navigate to Privacy Policy');
  };

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col dark group/design-root overflow-x-hidden bg-background-dark">
      <div className="flex-grow flex flex-col">
        <div className="@container">
          <div className="@[480px]:px-4 @[480px]:py-3">
            <div
              className="w-full bg-center bg-no-repeat bg-cover flex flex-col justify-end overflow-hidden bg-[#112217] @[480px]:rounded-xl min-h-80"
              data-alt="A person in athletic gear using a rowing machine in a modern gym with dynamic lighting"
              style={{
                backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuDs-V6etJjea_B1LU5zZRmZFl_Qcpt409fTU6OHoGDdv-GhACQ8J-iZnSO8L6l5drn2fPVj1N7MCPVMXHNVfm9AMF4IAHmeibD7bUQkjVGil1wZdBqg1ryua8qa5g3RUAuxsHsL1d4W_3k8rMiJdO9adiuAkk1ifIJach5GYmd6kUuscWyr3nxGwguZM3Fbj_0zyeBtMayv9PPQAod_aFnPF2rerk3YNxox_Rjdks7EunX7TcP35v-SNtfebPXAdcNi3tyc8s8ENw")`,
              }}
            >
              <div className="w-full h-32 bg-gradient-to-t from-background-dark to-transparent"></div>
            </div>
          </div>
        </div>
        <div className="px-4 text-center -mt-24">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-background-dark/80 backdrop-blur-sm mb-4">
            <span className="material-symbols-outlined text-primary text-4xl">neurology</span>
          </div>
          <h1 className="text-white tracking-light text-[32px] font-bold leading-tight">Your Personal AI Trainer</h1>
          <p className="text-white/80 text-base font-normal leading-normal pt-1">Smart, personalized workouts that adapt to you.</p>
        </div>
      </div>
      <div className="flex flex-col gap-y-4 px-4 pb-8 pt-8">
        <div className="flex px-4 py-3 justify-center">
          <button
            onClick={onCreateAccount}
            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 px-5 flex-1 bg-primary text-[#112217] text-base font-bold leading-normal tracking-[0.015em]"
          >
            <span className="truncate">Create Account</span>
          </button>
        </div>
        <div className="flex px-4 py-3 justify-center">
          <button
            onClick={onLogin}
            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 px-5 flex-1 bg-[#23482f] text-white text-base font-bold leading-normal tracking-[0.015em]"
          >
            <span className="truncate">Log In</span>
          </button>
        </div>
        <div className="flex flex-col items-center justify-center pt-4">
          <p className="text-sm text-white/60 mb-4">Or continue with</p>
          <div className="flex gap-x-6">
            <button onClick={onGoogleAuth} className="flex h-12 w-12 items-center justify-center rounded-full bg-[#23482f]" aria-label="Continue with Google">
              <svg aria-hidden="true" className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.0001 4.88C15.1601 4.88 17.6901 6.01 19.5001 7.64L16.8901 10.1C15.8201 9.27 14.1901 8.54 12.0001 8.54C9.1101 8.54 6.7101 10.45 5.8201 13.04H2.1501V10.23C3.7801 7.03 7.5601 4.88 12.0001 4.88Z"></path>
                <path d="M23.24 12.27C23.24 11.53 23.18 10.83 23.06 10.15H12V14.16H18.34C18.13 15.4 17.43 16.42 16.38 17.15V19.85H20.04C22.1 17.99 23.24 15.36 23.24 12.27Z"></path>
                <path d="M5.8201 15.38C5.5901 14.71 5.4501 13.98 5.4501 13.24C5.4501 12.5 5.5901 11.77 5.8201 11.1L2.1501 8.29C0.8101 10.73 0.8101 15.75 2.1501 18.19L5.8201 15.38Z"></path>
                <path d="M12.0001 21.62C14.4301 21.62 16.4601 20.82 17.8701 19.86L15.3401 17.51C14.3601 18.23 13.0801 18.67 12.0001 18.67C9.3701 18.67 7.1401 16.96 6.3801 14.48L2.7101 17.29C4.3401 20.49 7.9201 21.62 12.0001 21.62Z"></path>
              </svg>
            </button>
            <button onClick={onAppleAuth} className="flex h-12 w-12 items-center justify-center rounded-full bg-[#23482f]" aria-label="Continue with Apple">
              <svg aria-hidden="true" className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16.142 3.633c-1.63.03-3.21.783-4.223 2.156-.983 1.33-1.31 3.083-1.02 4.656.32 1.733 1.31 3.2 2.768 4.093 1.478.9 3.259 1.083 4.897.527 1.638-.546 2.949-1.84 3.515-3.416a5.533 5.533 0 0 0-3.328-6.527c-1.38-.636-2.95-.596-4.26-.46.33-1.666.98-3.259 1.94-4.595.32-.456.1-1.03-.38-1.28a.89.89 0 0 0-1.29.352z"></path>
                <path d="M12.443 11.433c-2.31.2-4.39.88-6.15 2.056-1.74 1.166-3.08 2.8-3.88 4.716-.8 1.916-.98 4.049-.49 6.049.49 2.01 1.64 3.81 3.29 5.126 1.64 1.316 3.73 2.07 5.92 2.156h.14c4.89 0 9.23-3.696 9.87-8.566.2-1.666-.23-3.359-1.2-4.756-1.04-1.466-2.65-2.456-4.46-2.736-1.5-.236-3.04-.08-4.45.396a9.99 9.99 0 0 1-1.7-.5z"></path>
              </svg>
            </button>
          </div>
        </div>
        <div className="px-6 pt-6 text-center">
          <p className="text-xs text-white/50">
            By continuing, you agree to our{' '}
            <Link href="#" onClick={onTermsOfService} className="underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="#" onClick={onPrivacyPolicy} className="underline">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;