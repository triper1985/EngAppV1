// src/supabase/client.ts
import 'react-native-url-polyfill';

import { createClient } from '@supabase/supabase-js';

// Expo: values from .env
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY; 

if (!supabaseUrl || !supabaseAnonKey) {
  // Throw early so it's obvious in development
  throw new Error(
    'Missing Supabase env vars. Please set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY in .env'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
});
