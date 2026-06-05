import { createClient } from '@supabase/supabase-js';

let supabaseClient = null;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function getSupabaseClient() {
  if (!supabaseUrl || !supabaseAnonKey) return null;

  if (!supabaseClient) {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    });
  }

  return supabaseClient;
}

export const supabase = getSupabaseClient();
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);
