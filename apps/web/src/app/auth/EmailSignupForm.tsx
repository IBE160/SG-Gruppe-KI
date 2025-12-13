'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function EmailSignupForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');

  const onBack = () => {
    router.back();
  };

  const onSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password || !confirmPassword) {
      setError('All fields are required.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    // Placeholder for Supabase registration logic
    console.log('Attempting to sign up with:', { email, password });
    // Simulate successful registration, then redirect to onboarding
    router.push('/onboarding');
  };

  const onLoginLinkClick = () => {
    router.push('/auth/login');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // For now, static password strength
  const passwordStrength = 'Strong';
  const passwordStrengthFill = 3; // Out of 4

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-10 p-4">
        <div className="relative flex items-center justify-center">
          <button onClick={onBack} className="absolute left-0 flex h-10 w-10 items-center justify-center rounded-full bg-white/10" aria-label="Go back">
            <span className="material-symbols-outlined">arrow_back_ios_new</span>
          </button>
        </div>
      </header>
      <main className="flex flex-grow flex-col justify-between p-4">
        <div className="flex flex-col">
          <div className="pt-4 pb-8">
            <h1 className="text-[32px] font-bold leading-tight tracking-[-0.015em]">Create your account</h1>
            <p className="pt-2 text-base text-zinc-400">Join us to unlock your potential.</p>
          </div>
          <form onSubmit={onSignup} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-zinc-300" htmlFor="email">Email address</label>
              <div className="relative mt-2">
                <span className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">mail</span>
                <input
                  className="w-full rounded-lg border-0 bg-white/10 py-3.5 pl-10 pr-4 text-white placeholder:text-zinc-500 focus:ring-2 focus:ring-inset focus:ring-primary"
                  id="email"
                  name="email"
                  placeholder="you@example.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-zinc-300" htmlFor="password">Password</label>
              <div className="relative mt-2">
                <span className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">lock</span>
                <input
                  className="w-full rounded-lg border-0 bg-white/10 py-3.5 pl-10 pr-10 text-white placeholder:text-zinc-500 focus:ring-2 focus:ring-inset focus:ring-primary"
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <span className="material-symbols-outlined">{showPassword ? 'visibility' : 'visibility_off'}</span>
                </button>
              </div>
            </div>
            <div className="pt-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-zinc-300">Password strength</p>
                <p className="text-sm font-bold text-primary">{passwordStrength}</p>
              </div>
              <div className="mt-2 grid grid-cols-4 gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className={`h-1.5 rounded-full ${i < passwordStrengthFill ? 'bg-primary' : 'bg-white/20'}`}></div>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-zinc-300" htmlFor="confirm-password">Confirm Password</label>
              <div className="relative mt-2">
                <span className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">lock</span>
                <input
                  className="w-full rounded-lg border-0 bg-white/10 py-3.5 pl-10 pr-10 text-white placeholder:text-zinc-500 focus:ring-2 focus:ring-inset focus:ring-primary"
                  id="confirm-password"
                  name="confirm-password"
                  placeholder="Confirm your password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400"
                  aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                >
                  <span className="material-symbols-outlined">{showConfirmPassword ? 'visibility' : 'visibility_off'}</span>
                </button>
              </div>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button type="submit" className="flex h-14 w-full cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-full bg-primary text-base font-bold leading-normal text-background-dark">
              <span className="truncate">Create Account</span>
            </button>
          </form>
        </div>
        <div className="w-full pb-6 pt-8">
          <p className="mt-4 text-center text-sm text-zinc-400">
            Already have an account? <Link href="#" onClick={onLoginLinkClick} className="font-bold text-primary">Log in</Link>
          </p>
        </div>
      </main>
    </div>
  );
}