'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const AuthErrorPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [errorMessage, setErrorMessage] = useState('An unknown authentication error occurred.');

  useEffect(() => {
    const message = searchParams.get('message');
    if (message) {
      setErrorMessage(decodeURIComponent(message.replace(/\+/g, ' ')));
    }
  }, [searchParams]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background-dark text-white p-4">
      <h1 className="text-4xl font-bold mb-4">Authentication Error</h1>
      <p className="text-lg text-red-400 text-center mb-8">{errorMessage}</p>
      <button
        onClick={() => router.push('/auth')} // Redirect to the Welcome/Auth page
        className="px-6 py-3 rounded-full bg-primary text-background-dark text-lg font-bold"
      >
        Try Again
      </button>
    </div>
  );
};

export default AuthErrorPage;
