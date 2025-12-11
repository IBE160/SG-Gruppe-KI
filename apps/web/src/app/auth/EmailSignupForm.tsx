// apps/web/src/app/auth/EmailSignupForm.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';

const EmailSignupForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    // Supabase signup logic will go here
    console.log({ email, password, confirmPassword });
  };

  return (
    <div className="flex min-h-screen w-full flex-col font-display bg-background-dark text-white">
      <header className="sticky top-0 z-10 p-4">
        <div className="relative flex items-center justify-center">
            <Link href="/" passHref className="absolute left-0 flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
                <span className="material-symbols-outlined">arrow_back_ios_new</span>
            </Link>
        </div>
      </header>
      <main className="flex flex-grow flex-col justify-between p-4">
        <div className="flex flex-col">
          <div className="pt-4 pb-8">
            <h1 className="text-[32px] font-bold leading-tight tracking-[-0.015em]">Create your account</h1>
            <p className="pt-2 text-base text-zinc-400">Join us to unlock your potential.</p>
          </div>
          <form className="space-y-4" onSubmit={handleSignup}>
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
                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400" type="button" onClick={() => setShowPassword(!showPassword)}>
                  <span className="material-symbols-outlined">{showPassword ? 'visibility' : 'visibility_off'}</span>
                </button>
              </div>
            </div>
            <div className="pt-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-zinc-300">Password strength</p>
                <p className="text-sm font-bold text-primary">Strong</p>
              </div>
              <div className="mt-2 grid grid-cols-4 gap-2">
                <div className="h-1.5 rounded-full bg-primary"></div>
                <div className="h-1.5 rounded-full bg-primary"></div>
                <div className="h-1.5 rounded-full bg-primary"></div>
                <div className="h-1.5 rounded-full bg-white/20"></div>
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
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                {password === confirmPassword && confirmPassword !== '' && (
                    <button className="absolute right-3 top-1/2 -translate-y-1/2 text-primary" type="button">
                        <span className="material-symbols-outlined">check_circle</span>
                    </button>
                )}
              </div>
            </div>
            <div className="w-full pb-6 pt-8">
              <button
                type="submit"
                className="flex h-14 w-full cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-full bg-primary text-base font-bold leading-normal text-background-dark"
              >
                <span className="truncate">Create Account</span>
              </button>
              <p className="mt-4 text-center text-sm text-zinc-400">
                Already have an account? <Link className="font-bold text-primary" href="/auth/login">Log in</Link>
              </p>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default EmailSignupForm;
