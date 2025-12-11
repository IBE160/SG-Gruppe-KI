// apps/web/src/app/error/page.tsx
'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const errorMessage = searchParams.get('message') || 'An unexpected error occurred.';

  return (
    <div className="flex min-h-screen items-center justify-center bg-background-dark text-white p-4 text-center">
      <div className="max-w-md w-full">
        <h1 className="text-4xl font-bold text-red-500 mb-4">Error</h1>
        <p className="text-lg text-white/80 mb-6">{errorMessage}</p>
        <Link href="/" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-full text-background-dark bg-primary hover:bg-primary/90">
            Go to Home
        </Link>
      </div>
    </div>
  );
}
