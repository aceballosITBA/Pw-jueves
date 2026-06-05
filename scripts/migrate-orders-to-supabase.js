#!/usr/bin/env node
try { global.WebSocket = global.WebSocket || require('ws'); } catch (e) {}
const fs = require('fs/promises');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
supabaseUrl = supabaseUrl.replace(/\/rest\/v1\/?$/i, '');
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });

async function main() {
  const ordersPath = path.join(process.cwd(), 'data', 'orders.json');
  let raw = '[]';
  try { raw = await fs.readFile(ordersPath, 'utf8'); } catch (e) { console.warn('No local orders file found, nothing to migrate.'); }

  const orders = JSON.parse(raw || '[]');
  console.log(`Found ${orders.length} local orders to migrate.`);

  for (const o of orders) {
    const orderId = String(o.id || o.orderId || Date.now());
    const userId = o.userId || o.user?.id || null;
    const createdAt = o.createdAt ? new Date(o.createdAt).toISOString() : new Date().toISOString();

    console.log(`Upserting order ${orderId} (user ${userId})`);

    const { error: orderErr } = await supabase.from('orders').upsert({
      id: orderId,
      user_id: userId,
      status: o.status || 'pending',
      total: Number(o.total || o.subtotal || 0),
      currency: o.currency || 'ARS',
      shipping: o.shipping || {},
      payment_method: o.paymentMethod || o.payment_method || 'mercadopago',
      created_at: createdAt,
      updated_at: new Date(o.updatedAt || o.createdAt || Date.now()).toISOString()
    }, { onConflict: 'id' });

    if (orderErr) {
      console.error('Order upsert error', orderErr);
      continue;
    }

    try {
      await supabase.from('order_items').delete().eq('order_id', orderId);
    } catch (e) {
      // ignore
    }

    const items = (o.items || []).map((it) => ({
      order_id: orderId,
      product_id: it.product?.id || it.product_id || '',
      product_name: it.product?.name || it.product_name || '',
      pack: Number(it.pack || 6),
      quantity: Number(it.quantity || 1),
      unit_price: Number(it.unit_price || it.product?.pricePack6 || 0),
      item_total: Number(it.item_total || 0),
      product_snapshot: it.product || it.product_snapshot || {}
    }));

    if (items.length) {
      const { error: itemsErr } = await supabase.from('order_items').insert(items);
      if (itemsErr) console.error('Order items insert error', itemsErr);
    }

    const history = (o.history || o.webhookEvents || []).map((h) => ({
      order_id: orderId,
      status: h.status || o.status || 'pending',
      note: h.note || '',
      created_at: h.createdAt ? new Date(h.createdAt).toISOString() : new Date().toISOString()
    }));

    if (history.length) {
      const { error: histErr } = await supabase.from('order_status_history').insert(history);
      if (histErr) console.error('History insert error', histErr);
    }

    console.log(`Migrated order ${orderId}`);
  }

  console.log('Migration finished.');
}

main().catch((err) => { console.error(err); process.exit(1); });
