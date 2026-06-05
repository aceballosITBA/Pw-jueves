#!/usr/bin/env node
try { global.WebSocket = global.WebSocket || require('ws'); } catch (e) {}
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
supabaseUrl = supabaseUrl.replace(/\/rest\/v1\/?$/i, '');
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL');
  process.exit(1);
}

async function main() {
  const anon = anonKey ? createClient(supabaseUrl, anonKey) : null;
  const admin = serviceKey ? createClient(supabaseUrl, serviceKey) : null;

  console.log('Testing RLS:');

  if (anon) {
    console.log('Using URL:', supabaseUrl);
    const { data: anonOrders, error: anonError } = await anon.from('orders').select('*').limit(5);
    console.log('Anon select error:', anonError ? JSON.stringify(anonError) : 'none');
    console.log('Anon rows:', (anonOrders || []).length);
  } else {
    console.log('No anon key available; skipping anon test.');
  }

  if (admin) {
    const { data: adminOrders, error: adminError } = await admin.from('orders').select('*').limit(5);
    console.log('Admin select error:', adminError ? JSON.stringify(adminError) : 'none');
    console.log('Admin rows:', (adminOrders || []).length);
  } else {
    console.log('No service role key available; skipping admin test.');
  }

  console.log('RLS test completed.');
}

main().catch((e) => { console.error(e); process.exit(1); });
