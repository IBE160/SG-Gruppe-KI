// apps/web/src/lib/profile.ts
import { supabase } from './supabaseClient';

export async function createProfile(userId: string, email: string, initialOnboardedStatus: boolean = false) {
  const { data, error } = await supabase
    .from('profiles')
    .insert([
      { id: userId, email: email, is_onboarded: initialOnboardedStatus }
    ]);

  if (error) {
    console.error('Error creating user profile:', error);
    return { success: false, error };
  }
  return { success: true, data };
}
