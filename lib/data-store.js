import { promises as fs } from 'fs';
import path from 'path';
import { getSupabaseAdminClient, isSupabaseServerConfigured } from './supabase/server';

const localDataDir = path.join(process.cwd(), 'data');
const localProductsPath = path.join(localDataDir, 'products.json');
const localOrdersPath = path.join(localDataDir, 'orders.json');
const seededProductsPath = path.join(process.cwd(), 'public', 'data', 'products.json');

const readJsonFile = async (filePath, fallbackPath, defaultValue) => {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    if (fallbackPath) {
      try {
        const fallbackContent = await fs.readFile(fallbackPath, 'utf8');
        return JSON.parse(fallbackContent);
      } catch (fallbackError) {
        return defaultValue;
      }
    }

    return defaultValue;
  }
};

const writeJsonFile = async (filePath, value) => {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(value, null, 2), 'utf8');
};

const normalizeProduct = (product) => ({
  id: product.id,
  name: product.name,
  style: product.style,
  description: product.description || '',
  pricePack6: Number(product.pricePack6 ?? product.price_pack_6 ?? 0),
  images: product.images || [],
  abv: product.abv || '',
  ibu: Number(product.ibu ?? 0),
  srm: Number(product.srm ?? 0),
  aroma: product.aroma || '',
  flavor: product.flavor || '',
  pairing: product.pairing || '',
  profile: product.profile || product.sensory_profile || '',
  stock: Number(product.stock ?? 0),
  active: product.active !== false
});

const mapDbProduct = (productRow, imagesByProductId) => ({
  id: productRow.id,
  name: productRow.name,
  style: productRow.style,
  description: productRow.description || '',
  pricePack6: Number(productRow.price_pack_6 ?? 0),
  images: (imagesByProductId.get(productRow.id) || []).sort((left, right) => left.position - right.position).map((image) => image.image_url),
  abv: productRow.abv || '',
  ibu: Number(productRow.ibu ?? 0),
  srm: Number(productRow.srm ?? 0),
  aroma: productRow.aroma || '',
  flavor: productRow.flavor || '',
  pairing: productRow.pairing || '',
  profile: productRow.sensory_profile || '',
  stock: Number(productRow.stock ?? 0),
  active: productRow.active !== false
});

const productToDbRow = (product) => ({
  id: product.id,
  name: product.name,
  style: product.style,
  description: product.description || '',
  price_pack_6: Number(product.pricePack6 ?? product.price_pack_6 ?? 0),
  abv: product.abv || '',
  ibu: Number(product.ibu ?? 0),
  srm: Number(product.srm ?? 0),
  aroma: product.aroma || '',
  flavor: product.flavor || '',
  pairing: product.pairing || '',
  sensory_profile: product.profile || product.sensory_profile || '',
  stock: Number(product.stock ?? 0),
  active: product.active !== false
});

export async function listProducts() {
  const supabase = getSupabaseAdminClient();

  if (supabase) {
    const [productsResult, imagesResult] = await Promise.all([
      supabase.from('products').select('*').order('name', { ascending: true }),
      supabase.from('product_images').select('*').order('position', { ascending: true })
    ]);

    if (!productsResult.error && !imagesResult.error) {
      const imagesByProductId = new Map();
      for (const image of imagesResult.data || []) {
        const current = imagesByProductId.get(image.product_id) || [];
        current.push(image);
        imagesByProductId.set(image.product_id, current);
      }

      return (productsResult.data || []).filter((product) => product.active !== false).map((product) => mapDbProduct(product, imagesByProductId));
    }
  }

  const products = await readJsonFile(localProductsPath, seededProductsPath, []);
  return products.filter((product) => product.active !== false).map(normalizeProduct);
}

export async function getProductById(productId) {
  const products = await listProducts();
  return products.find((product) => String(product.id) === String(productId)) || null;
}

export async function saveProduct(product) {
  const normalized = normalizeProduct(product);
  const supabase = getSupabaseAdminClient();

  if (supabase) {
    const { error: productError } = await supabase.from('products').upsert(productToDbRow(normalized), { onConflict: 'id' });
    if (productError) throw productError;

    const { error: deleteImagesError } = await supabase.from('product_images').delete().eq('product_id', normalized.id);
    if (deleteImagesError) throw deleteImagesError;

    if (Array.isArray(product.images) && product.images.length) {
      const imageRows = product.images.filter(Boolean).map((imageUrl, index) => ({
        product_id: normalized.id,
        image_url: imageUrl,
        position: index + 1,
        alt_text: `${normalized.name} ${index + 1}`
      }));

      if (imageRows.length) {
        const { error: imagesError } = await supabase.from('product_images').insert(imageRows);
        if (imagesError) throw imagesError;
      }
    }

    return normalized;
  }

  const products = await readJsonFile(localProductsPath, seededProductsPath, []);
  const nextProducts = products.filter((item) => String(item.id) !== String(normalized.id));
  nextProducts.push({ ...normalized, pricePack6: normalized.pricePack6 });
  await writeJsonFile(localProductsPath, nextProducts);
  return normalized;
}

export async function archiveProduct(productId) {
  const supabase = getSupabaseAdminClient();

  if (supabase) {
    const { error } = await supabase.from('products').update({ active: false }).eq('id', productId);
    if (error) throw error;
    return true;
  }

  const products = await readJsonFile(localProductsPath, seededProductsPath, []);
  const nextProducts = products.map((product) => (String(product.id) === String(productId) ? { ...product, active: false } : product));
  await writeJsonFile(localProductsPath, nextProducts);
  return true;
}

export async function createOrder(payload) {
  const supabase = getSupabaseAdminClient();

  if (supabase && payload.userId) {
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: payload.userId,
        status: 'pending',
        total: Number(payload.total || 0),
        currency: 'ARS',
        shipping: payload.shipping || {},
        payment_method: payload.paymentMethod || 'mercadopago',
      })
      .select()
      .single();

    if (orderError) throw orderError;

    if (Array.isArray(payload.items) && payload.items.length > 0) {
      const itemRows = payload.items.map((item) => ({
        order_id: order.id,
        product_id: item.product.id,
        product_name: item.product.name,
        pack: item.pack || 6,
        quantity: Number(item.quantity),
        unit_price: Number(item.unit_price || 0),
        item_total: Number(item.item_total || 0),
        product_snapshot: item.product,
      }));

      const { error: itemsError } = await supabase.from('order_items').insert(itemRows);
      if (itemsError) throw itemsError;
    }

    return {
      id: order.id,
      userId: order.user_id,
      status: order.status,
      total: order.total,
      shipping: order.shipping,
      paymentMethod: order.payment_method,
      items: payload.items || [],
      createdAt: new Date(order.created_at).getTime(),
      date: new Date(order.created_at).getTime(),
      webhookEvents: [],
    };
  }

  // Fallback a JSON local si Supabase no está configurado
  const order = {
    id: payload.id || String(Date.now()),
    user: payload.user || null,
    userId: payload.userId || null,
    shipping: payload.shipping || {},
    paymentMethod: payload.paymentMethod || 'mercadopago',
    status: payload.status || 'ready_to_pay',
    items: payload.items || [],
    subtotal: Number(payload.subtotal || 0),
    shippingCost: Number(payload.shippingCost || 0),
    total: Number(payload.total || 0),
    createdAt: payload.createdAt || Date.now(),
    date: payload.createdAt || Date.now(),
    webhookEvents: payload.webhookEvents || [],
  };

  const orders = await readJsonFile(localOrdersPath, null, []);
  orders.unshift(order);
  await writeJsonFile(localOrdersPath, orders);
  return order;
}

export async function listOrders(userId = null) {
  const supabase = getSupabaseAdminClient();

  if (supabase) {
    let query = supabase
      .from('orders')
      .select('*, order_items(*)')
      .order('created_at', { ascending: false });

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query;

    if (!error && data) {
      return data.map((order) => ({
        id: order.id,
        userId: order.user_id,
        status: order.status,
        total: order.total,
        shipping: order.shipping,
        paymentMethod: order.payment_method,
        items: order.order_items || [],
        createdAt: new Date(order.created_at).getTime(),
        date: new Date(order.created_at).getTime(),
        webhookEvents: [],
      }));
    }
  }

  return readJsonFile(localOrdersPath, null, []);
}

export async function updateOrderStatus(orderId, status, note = '') {
  const supabase = getSupabaseAdminClient();

  if (supabase) {
    const { error: updateError } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId);

    if (!updateError) {
      await supabase
        .from('order_status_history')
        .insert({ order_id: orderId, status, note });
    }

    return { id: orderId, status };
  }

  const orders = await readJsonFile(localOrdersPath, null, []);
  const nextOrders = orders.map((order) => {
    if (String(order.id) !== String(orderId)) return order;
    const webhookEvents = Array.isArray(order.webhookEvents) ? order.webhookEvents.slice() : [];
    webhookEvents.unshift({ status, note, createdAt: Date.now() });
    return { ...order, status, webhookEvents };
  });

  await writeJsonFile(localOrdersPath, nextOrders);
  return nextOrders.find((order) => String(order.id) === String(orderId)) || null;
}
