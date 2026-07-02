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
  const items = Array.isArray(payload.items) ? payload.items : [];
  const createdAt = payload.createdAt || Date.now();

  const supabase = getSupabaseAdminClient();
  if (supabase) {
    // Usar stored procedure para garantizar atomicidad (transacción con rollback automático)
    const rpcItems = items.map((item) => ({
      product_id: item.product?.id || item.product_id || '',
      product_name: item.product?.name || item.product_name || '',
      pack: Number(item.pack || 6),
      quantity: Number(item.quantity || 1),
      unit_price: Number(item.unit_price || 0),
      item_total: Number(item.item_total || 0)
    }));

    const { data, error } = await supabase.rpc('crear_orden_completa', {
      p_user_id: payload.userId || payload.user_id,
      p_items: rpcItems,
      p_total: Number(payload.total || 0),
      p_currency: payload.currency || 'ARS',
      p_shipping: payload.shipping || {},
      p_payment_method: payload.paymentMethod || 'mercadopago'
    });

    if (error) throw error;

    const result = Array.isArray(data) ? data[0] : data;
    if (!result?.success) {
      throw new Error(result?.error_msg || 'Error al crear la orden');
    }

    return {
      id: result.orden_id,
      items,
      total: Number(payload.total || 0),
      shipping: payload.shipping || {},
      paymentMethod: payload.paymentMethod || 'mercadopago',
      status: 'pending',
      createdAt,
      updatedAt: createdAt
    };
  }

  const orderInput = buildOrderPayload(payload);
  const orderId = payload.id || payload.orderId || String(Date.now());
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