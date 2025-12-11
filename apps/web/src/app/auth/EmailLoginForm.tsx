// apps/web/src/app/auth/EmailLoginForm.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';

const EmailLoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Supabase login logic will go here
    console.log({ email, password });
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
            <h1 className="text-[32px] font-bold leading-tight tracking-[-0.015em]">Welcome back!</h1>
          </div>
          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label className="text-sm font-medium text-zinc-300" htmlFor="email">Email address</label>
              <div className="relative mt-2">
                <span className="material-symbols-outlined pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#92c9a4]">mail</span>
                <input
                  className="form-input w-full resize-none overflow-hidden rounded-full text-white focus:outline-0 focus:ring-2 focus:ring-primary border-none bg-[#23482f] h-14 placeholder:text-[#92c9a4] pl-12 pr-4 text-base font-normal leading-normal"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-zinc-300" htmlFor="password">Password</label>
              <div className="relative mt-2">
                <span className="material-symbols-outlined pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#92c9a4]">lock</span>
                <input
                  className="form-input w-full resize-none overflow-hidden rounded-full text-white focus:outline-0 focus:ring-2 focus:ring-primary border-none bg-[#23482f] h-14 placeholder:text-[#92c9a4] pl-12 pr-12 text-base font-normal leading-normal"
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button className="absolute right-4 top-1/2 -translate-y-1/2 text-[#92c9a4]" type="button" onClick={() => setShowPassword(!showPassword)}>
                  <span className="material-symbols-outlined">{showPassword ? 'visibility' : 'visibility_off'}</span>
                </button>
              </div>
            </div>
            <div className="flex justify-end pt-3">
              <Link className="text-primary text-sm font-medium leading-normal underline" href="/auth/forgot-password">Forgot Password?</Link>
            </div>
            <div className="w-full pb-6 pt-8">
              <button
                type="submit"
                className="w-full rounded-full bg-primary py-4 text-center font-bold text-background-dark text-lg leading-snug hover:opacity-90 active:opacity-80 transition-opacity"
              >
                Log In
              </button>
              <p className="mt-4 text-center text-sm text-zinc-400">
                Don't have an account? <Link className="font-bold text-primary underline" href="/auth/signup">Sign up</Link>
              </p>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default EmailLoginForm;
