// apps/web/src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL and/or Anon Key are not set in environment variables.');
  // In a real application, you might want to throw an error or handle this more gracefully
  // For now, we'll ensure the client is not created with undefined values.
  throw new Error('Supabase environment variables are missing.');
}


export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function signOut(): Promise<boolean> {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Error signing out:', error);
    return false;
  }
  return true;
}