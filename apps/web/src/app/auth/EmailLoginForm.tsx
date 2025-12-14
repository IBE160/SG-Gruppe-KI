'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

const EmailLoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      alert(`Login error: ${error.message}`);
    } else {
      // Her sjekker vi om det er første login (optional, du kan fjerne first_login hvis metadata ikke finnes)
      const isNewUser = data.user?.user_metadata?.first_login ?? true;

      if (isNewUser) {
        router.push('/onboarding');
      } else {
        router.push('/dashboard');
      }
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col font-display bg-background-dark text-white">
      <header className="sticky top-0 z-10 p-4">
        <div className="relative flex items-center justify-center">
          <Link href="/" className="absolute left-0 flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
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

            <div className="w-full pb-6 pt-8">
              <button type="submit" className="flex h-14 w-full cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-full bg-primary text-base font-bold leading-normal text-background-dark">
                Log In
              </button>
              <p className="mt-4 text-center text-sm text-zinc-400">
                Don't have an account? <Link className="font-bold text-primary" href="/auth/signup">Sign up</Link>
              </p>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default EmailLoginForm;
