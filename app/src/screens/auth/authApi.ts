import { supabase } from '../../supabase/client';

export async function register(email: string, password: string) {
  return supabase.auth.signUp({ email, password });
}

export async function login(email: string, password: string) {
  return supabase.auth.signInWithPassword({ email, password });
}

export async function logout() {
  return supabase.auth.signOut();
}
