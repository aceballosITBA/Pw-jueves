import { NextResponse } from 'next/server';
import { updateOrderStatus } from '../../../../lib/data-store';

export async function POST(request) {
  const expectedSecret = process.env.MERCADOPAGO_WEBHOOK_SECRET;
  if (expectedSecret) {
    const incomingSecret = request.headers.get('x-webhook-secret');
    if (incomingSecret !== expectedSecret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  try {
    const payload = await request.json();
    const orderId = payload?.order_id || payload?.external_reference || payload?.data?.id || payload?.id;
    const status = payload?.status || payload?.action || 'paid';
    const note = payload?.description || 'Webhook recibido desde Mercado Pago';

    if (!orderId) {
      return NextResponse.json({ error: 'No se recibió un identificador de pedido.' }, { status: 400 });
    }

    const order = await updateOrderStatus(orderId, status, note);
    return NextResponse.json({ ok: true, order });
  } catch (error) {
    return NextResponse.json({ error: 'No se pudo procesar el webhook.' }, { status: 500 });
  }
}