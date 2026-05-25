import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// A safe checker to verify if Supabase is properly configured in env variables
export const isSupabaseConfigured = (): boolean => {
  return (
    supabaseUrl.trim() !== '' &&
    supabaseUrl !== 'YOUR_SUPABASE_URL' &&
    supabaseAnonKey.trim() !== '' &&
    supabaseAnonKey !== 'YOUR_SUPABASE_ANON_KEY'
  );
};

// Initialize Supabase Client. If credentials are missing, we create a placeholder mock
// to avoid runtime errors on page load, and rely on `isSupabaseConfigured()` to bypass calls safely.
export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : (null as any); // Safe cast, db service will check config state
