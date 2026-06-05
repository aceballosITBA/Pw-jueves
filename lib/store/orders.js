import fs from 'fs/promises';
import path from 'path';
import { getSupabaseAdminClient } from '../supabase/server';

const ordersPath = path.join(process.cwd(), 'data', 'orders.json');

async function ensureOrdersFile() {
  await fs.mkdir(path.dirname(ordersPath), { recursive: true });
  try {
    await fs.access(ordersPath);
  } catch (error) {
    await fs.writeFile(ordersPath, '[]\n', 'utf8');
  }
}

async function readLocalOrders() {
  await ensureOrdersFile();
  const raw = await fs.readFile(ordersPath, 'utf8');
  return JSON.parse(raw || '[]');
}

async function writeLocalOrders(orders) {
  await ensureOrdersFile();
  await fs.writeFile(ordersPath, `${JSON.stringify(orders, null, 2)}\n`, 'utf8');
}

function buildOrderPayload(payload) {
  return {
    user_id: payload.userId || payload.user?.id || null,
    status: payload.status || 'pending',
    total: Number(payload.total || 0),
    currency: payload.currency || 'ARS',
    shipping: payload.shipping || {},
    payment_method: payload.paymentMethod || 'mercadopago'
  };
}

export async function createOrder(payload) {
  const orderInput = buildOrderPayload(payload);
  const orderId = payload.id || payload.orderId || String(Date.now());
  const items = Array.isArray(payload.items) ? payload.items : [];
  const createdAt = payload.createdAt || Date.now();

  const supabase = getSupabaseAdminClient();
  if (supabase) {
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({ id: orderId, ...orderInput })
      .select('*')
      .single();

    if (orderError) throw orderError;

    const orderItems = items.map((item) => ({
      order_id: order.id,
      product_id: item.product?.id || item.product_id || '',
      product_name: item.product?.name || item.product_name || '',
      pack: Number(item.pack || 6),
      quantity: Number(item.quantity || 1),
      unit_price: Number(item.unit_price || item.product?.pricePack6 || 0),
      item_total: Number(item.item_total || 0),
      product_snapshot: item.product || item.product_snapshot || {}
    }));

    if (orderItems.length) {
      const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
      if (itemsError) throw itemsError;
    }

    const { error: historyError } = await supabase.from('order_status_history').insert({
      order_id: order.id,
      status: order.status,
      note: payload.note || 'Pedido creado'
    });

    if (historyError) throw historyError;

    return {
      id: order.id,
      items,
      total: order.total,
      shipping: order.shipping,
      paymentMethod: order.payment_method,
      status: order.status,
      createdAt,
      updatedAt: createdAt
    };
  }

  const orders = await readLocalOrders();
  const order = {
    id: orderId,
    items,
    total: orderInput.total,
    currency: orderInput.currency,
    shipping: orderInput.shipping,
    paymentMethod: orderInput.payment_method,
    status: orderInput.status,
    createdAt,
    updatedAt: createdAt,
    history: [
      {
        status: orderInput.status,
        note: payload.note || 'Pedido creado',
        createdAt
      }
    ]
  };
  orders.unshift(order);
  await writeLocalOrders(orders);
  return order;
}

export async function updateOrderStatus(orderId, status, note = '') {
  const supabase = getSupabaseAdminClient();
  const createdAt = Date.now();

  if (supabase) {
    const { error: orderError } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId);

    if (orderError) throw orderError;

    const { error: historyError } = await supabase.from('order_status_history').insert({
      order_id: orderId,
      status,
      note
    });

    if (historyError) throw historyError;

    return { id: orderId, status, updatedAt: createdAt };
  }

  const orders = await readLocalOrders();
  const nextOrders = orders.map((order) => {
    if (String(order.id) !== String(orderId)) return order;
    const historyEntry = { status, note, createdAt };
    return {
      ...order,
      status,
      updatedAt: createdAt,
      history: [...(order.history || []), historyEntry]
    };
  });
  await writeLocalOrders(nextOrders);
  return { id: orderId, status, updatedAt: createdAt };
}

export async function listOrders() {
  const supabase = getSupabaseAdminClient();
  if (supabase) {
    const { data: orders, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return orders || [];
  }

  return readLocalOrders();
}