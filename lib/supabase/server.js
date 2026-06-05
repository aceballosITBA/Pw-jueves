import { createClient } from '@supabase/supabase-js';

let supabaseAdminClient = null;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export function isSupabaseServerConfigured() {
  return Boolean(supabaseUrl && supabaseServiceRoleKey);
}

export function getSupabaseAdminClient() {
  if (!isSupabaseServerConfigured()) return null;

  if (!supabaseAdminClient) {
    supabaseAdminClient = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false
      }
    });
  }

  return supabaseAdminClient;
}