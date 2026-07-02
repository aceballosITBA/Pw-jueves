import { NextResponse } from 'next/server';
import { updateOrderStatus } from '../../../../lib/data-store';
import { client } from '../../../../lib/mercadopago';
import { Payment } from 'mercadopago';

export async function GET() {
  return NextResponse.json({ ok: true });
}

export async function POST(request) {
  try {
    const body = await request.json();

    const topic = body?.topic || body?.type;
    const resourceId = body?.id || body?.data?.id;

    if (topic !== 'payment') {
      return NextResponse.json({ ok: true, skipped: true });
    }

    if (!resourceId) {
      return NextResponse.json({ error: 'Sin ID de recurso.' }, { status: 400 });
    }

    // Fetchear el pago desde MP para obtener external_reference y estado real
    let paymentData;
    try {
      const payment = new Payment(client);
      paymentData = await payment.get({ id: resourceId });
    } catch {
      // Pago no encontrado (ej: ID de prueba de la simulación) — responder 200 igual
      return NextResponse.json({ ok: true, skipped: true, reason: 'Pago no encontrado en MP' });
    }

    const externalRef = paymentData?.external_reference;
    const paymentStatus = paymentData?.status;

    if (!externalRef) {
      return NextResponse.json({ ok: true, skipped: true, reason: 'Sin external_reference' });
    }

    // Mapear estado de MP a estado interno
    const statusMap = {
      approved: 'paid',
      rejected: 'failed',
      cancelled: 'cancelled',
      refunded: 'refunded',
      in_process: 'pending',
      pending: 'pending',
    };
    const newStatus = statusMap[paymentStatus] || 'pending';
    const note = `MP payment ${resourceId} — estado: ${paymentStatus}`;

    await updateOrderStatus(externalRef, newStatus, note);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'No se pudo procesar el webhook.' }, { status: 500 });
  }
}
