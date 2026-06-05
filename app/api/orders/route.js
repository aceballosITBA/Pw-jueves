import { createOrder, listOrders, getProductById } from '../../../lib/data-store';
import { getSupabaseAdminClient, isSupabaseServerConfigured } from '../../../lib/supabase/server';
import { successResponse, errorResponse } from '../../../lib/api-response';

const getAccessToken = (request) => {
  const header = request.headers.get('authorization') || '';
  if (!header.toLowerCase().startsWith('bearer ')) return '';
  return header.slice(7).trim();
};

async function getAuthenticatedUser(request) {
  if (!isSupabaseServerConfigured()) return null;

  const token = getAccessToken(request);
  if (!token) return null;

  const supabase = getSupabaseAdminClient();
  if (!supabase) return null;

  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data?.user) return null;
  return data.user;
}

const calcPackPrice = (base, pack) => {
  if (pack === 12) return Math.round(base * 2 * 0.9);
  if (pack === 24) return Math.round(base * 4 * 0.8);
  return base;
};

export async function GET(request) {
  const authenticatedUser = await getAuthenticatedUser(request);

  if (isSupabaseServerConfigured() && !authenticatedUser) {
    return errorResponse('No autorizado.', 401, 'UNAUTHORIZED');
  }

  const orders = await listOrders(authenticatedUser?.id || null);
  const filteredOrders =
    authenticatedUser && !isSupabaseServerConfigured()
      ? orders.filter((order) => String(order?.user_id || order?.userId || '') === String(authenticatedUser.id))
      : orders;

  return successResponse({ orders: filteredOrders });
}

export async function POST(request) {
  try {
    const authenticatedUser = await getAuthenticatedUser(request);
    if (isSupabaseServerConfigured() && !authenticatedUser) {
      return errorResponse('No autorizado.', 401, 'UNAUTHORIZED');
    }

    const payload = await request.json();
    const items = payload.items || [];

    if (!items.length) {
      return errorResponse('El carrito está vacío.', 400, 'EMPTY_CART');
    }

    // Validar cada item y calcular precios en servidor
    const enrichedItems = [];
    for (const item of items) {
      const productId = item.product?.id;
      if (!productId) {
        return errorResponse('Item con producto inválido.', 400, 'INVALID_ITEM');
      }

      const product = await getProductById(productId);
      if (!product) {
        return errorResponse(`Producto ${productId} no encontrado.`, 404, 'PRODUCT_NOT_FOUND');
      }

      const cantidad = Number(item.quantity);
      if (!Number.isInteger(cantidad) || cantidad < 1) {
        return errorResponse('Cantidad inválida.', 400, 'INVALID_CANTIDAD');
      }

      if (product.stock < cantidad) {
        return errorResponse(
          `Stock insuficiente para ${product.name}. Disponible: ${product.stock}.`,
          400,
          'INSUFFICIENT_STOCK'
        );
      }

      const pack = item.pack || 6;
      const unit_price = calcPackPrice(product.pricePack6, pack);
      const item_total = unit_price * cantidad;

      enrichedItems.push({ ...item, product, unit_price, item_total });
    }

    // Total calculado en servidor — nunca confiar en el cliente
    const subtotal = enrichedItems.reduce((sum, item) => sum + item.item_total, 0);
    const shippingCost = subtotal > 20000 ? 0 : subtotal > 0 ? 1800 : 0;
    const total = subtotal + shippingCost;

    const order = await createOrder({
      ...payload,
      items: enrichedItems,
      userId: authenticatedUser?.id || payload.userId,
      subtotal,
      shippingCost,
      total,
    });

    return successResponse({ order }, 201);
  } catch {
    return errorResponse('No se pudo crear el pedido.', 500, 'SERVER_ERROR');
  }
}