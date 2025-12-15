'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase'; // Import Supabase client

export default function EmailLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const onBack = () => {
    router.back();
  };

  const onLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Both email and password are required.');
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        return;
      }

      if (data.user) {
        // Here, we need to check if the user has completed onboarding.
        // This will involve querying the backend for user profile/goals.
        // For now, let's assume all users after login are redirected to dashboard.
        // In a later step, we will implement the actual check.

        // Placeholder for onboarding check:
        // const hasCompletedOnboarding = await checkOnboardingStatus(data.user.id);
        // if (hasCompletedOnboarding) {
        //   router.push('/dashboard');
        // } else {
        //   router.push('/onboarding');
        // }
        
        // For now, always redirect to dashboard after successful login.
        router.push('/dashboard');
      }

    } catch (err: any) {
      setError(err.message);
    }
  };

  const onForgotPassword = () => {
    console.log('Navigate to Forgot Password page');
    // router.push('/auth/forgot-password');
  };

  const onSignupLinkClick = () => {
    router.push('/auth/signup');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden">
      {/* TopAppBar */}
      <div className="flex items-center p-4 pb-2 justify-between">
        <button onClick={onBack} className="text-white flex size-12 shrink-0 items-center justify-center rounded-full hover:bg-white/10 active:bg-white/20 transition-colors" aria-label="Go back">
          <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>arrow_back_ios_new</span>
        </button>
      </div>
      <div className="flex flex-col h-full flex-grow px-4">
        {/* HeadlineText */}
        <h1 className="text-white tracking-light text-[32px] font-bold leading-tight text-left pb-8 pt-6">Welcome back!</h1>
        {/* Form */}
        <form onSubmit={onLogin} className="flex flex-col space-y-4">
          {/* TextField: Email */}
          <div className="flex flex-col">
            <label className="text-white text-base font-medium leading-normal pb-2" htmlFor="email">Email address</label>
            <div className="relative flex w-full flex-1 items-stretch">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#92c9a4]">mail</span>
              <input
                className="form-input w-full resize-none overflow-hidden rounded-full text-white focus:outline-0 focus:ring-2 focus:ring-primary border-none bg-[#23482f] h-14 placeholder:text-[#92c9a4] pl-12 pr-4 text-base font-normal leading-normal"
                id="email"
                placeholder="Enter your email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          {/* TextField: Password */}
          <div className="flex flex-col">
            <label className="text-white text-base font-medium leading-normal pb-2" htmlFor="password">Password</label>
            <div className="relative flex w-full flex-1 items-stretch">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#92c9a4]">lock</span>
              <input
                className="form-input w-full resize-none overflow-hidden rounded-full text-white focus:outline-0 focus:ring-2 focus:ring-primary border-none bg-[#23482f] h-14 placeholder:text-[#92c9a4] pl-12 pr-12 text-base font-normal leading-normal"
                id="password"
                placeholder="Enter your password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#92c9a4]"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                <span className="material-symbols-outlined">visibility_off</span>
              </button>
            </div>
          </div>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          {/* MetaText: Forgot Password? */}
          <div className="flex justify-end pt-3">
            <Link onClick={onForgotPassword} className="text-primary text-sm font-medium leading-normal underline" href="#">Forgot Password?</Link>
          </div>
          {/* Spacer */}
          <div className="flex-grow"></div>
          {/* Actions */}
          <div className="flex flex-col items-center gap-6 py-8">
            {/* Primary Button */}
            <button type="submit" className="w-full rounded-full bg-primary py-4 text-center font-bold text-background-dark text-lg leading-snug hover:opacity-90 active:opacity-80 transition-opacity">Log In</button>
            {/* Secondary Link */}
            <p className="text-white text-base font-normal leading-normal">
              Don't have an account? <Link onClick={onSignupLinkClick} className="font-bold text-primary underline" href="#">Sign up</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}