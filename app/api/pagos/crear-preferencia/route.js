import { getSupabaseAdminClient, isSupabaseServerConfigured } from '../../../../lib/supabase/server';
import { successResponse, errorResponse } from '../../../../lib/api-response';
import { client, Preference } from '../../../../lib/mercadopago';

const getAccessToken = (request) => {
  const header = request.headers.get('authorization') || '';
  if (!header.toLowerCase().startsWith('bearer ')) return '';
  return header.slice(7).trim();
};

export async function POST(request) {
  if (!isSupabaseServerConfigured()) {
    return errorResponse('Supabase no configurado.', 500, 'CONFIG_ERROR');
  }

  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return errorResponse('Supabase no configurado.', 500, 'CONFIG_ERROR');
  }

  if (!process.env.MERCADOPAGO_ACCESS_TOKEN) {
    return errorResponse('Mercado Pago no configurado.', 500, 'MP_CONFIG_ERROR');
  }

  const token = getAccessToken(request);
  if (!token) {
    return errorResponse('No autorizado.', 401, 'UNAUTHORIZED');
  }

  const { data: authData, error: authError } = await supabase.auth.getUser(token);
  if (authError || !authData?.user) {
    return errorResponse('No autorizado.', 401, 'UNAUTHORIZED');
  }

  const user = authData.user;

  try {
    const body = await request.json();
    const { orden_id } = body;

    if (!orden_id) {
      return errorResponse('Se requiere orden_id.', 400, 'MISSING_ORDER_ID');
    }

    // Obtener la orden con sus items — debe pertenecer al usuario autenticado
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('id', orden_id)
      .eq('user_id', user.id)
      .single();

    if (orderError || !order) {
      return errorResponse('Orden no encontrada.', 404, 'ORDER_NOT_FOUND');
    }

    if (order.status !== 'pending') {
      return errorResponse(
        `La orden no está en estado pendiente (estado actual: ${order.status}).`,
        400,
        'INVALID_STATUS'
      );
    }

    if (!order.order_items?.length) {
      return errorResponse('La orden no tiene ítems válidos.', 400, 'NO_ITEMS');
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // Crear preferencia real en Mercado Pago
    const preference = new Preference(client);

    const preferenceData = {
      items: order.order_items.map((item) => ({
        id: item.product_id,
        title: item.product_name,
        description: `Pack x${item.pack} · Cantidad ${item.quantity}`,
        quantity: item.quantity,
        unit_price: item.unit_price,
        currency_id: order.currency || 'ARS'
      })),
      payer: {
        email: user.email
      },
      external_reference: String(order.id),
      notification_url: `${appUrl}/api/webhooks/mercadopago`,
      back_urls: {
        success: `${appUrl}/pago-completado`,
        failure: `${appUrl}/pago-fallido`,
        pending: `${appUrl}/pago-pendiente`
      },
      auto_return: 'approved'
    };

    const result = await preference.create({ body: preferenceData });

    return successResponse({
      init_point: result.init_point,
      preference_id: result.id,
      orden_id: order.id,
      total: order.total
    });
  } catch (err) {
    return errorResponse(
      `No se pudo crear la preferencia: ${err?.message || 'error desconocido'}`,
      500,
      'MP_ERROR'
    );
  }
}
