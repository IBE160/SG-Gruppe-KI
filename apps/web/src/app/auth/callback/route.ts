import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';

  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => cookieStore.get(name)?.value,
        set: (name: string, value: string, options: any) => {
          try {
            cookieStore.set({
              name,
              value,
              ...options,
              secure: process.env.NODE_ENV === 'production', // Explicitly handle secure flag
            });
          } catch (error) {
            console.warn(`Failed to set cookie ${name}:`, error);
          }
        },
        remove: (name: string, value: string, options: any) => {
          try {
            cookieStore.set({
              name,
              value: '',
              ...options,
              maxAge: 0,
              secure: process.env.NODE_ENV === 'production', // Explicitly handle secure flag
            });
          } catch (error) {
             console.warn(`Failed to remove cookie ${name}:`, error);
          }
        },
      },
    }
  );

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      console.error("Supabase OAuth exchangeCodeForSession error:", error);
      return NextResponse.redirect(`${origin}/error?message=Could not log in with OAuth. ${error.message}`);
    } else {
      const { data: { user } } = await supabase.auth.getUser();
      const isNewUser = user && user.created_at === user.last_sign_in_at;

      if (isNewUser) {
        return NextResponse.redirect(`${origin}/onboarding`);
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  console.error("No authorization code found in OAuth callback.");
  return NextResponse.redirect(`${origin}/error?message=No authorization code received.`);
}
