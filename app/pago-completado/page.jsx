"use client";
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';
import Footer from '../../components/Footer';

function PagoCompletadoContent() {
  const params = useSearchParams();
  const paymentId = params.get('payment_id');
  const externalRef = params.get('external_reference');
  const status = params.get('status');

  return (
    <div className="app-container">
      <main>
        <section className="catalog-section card" style={{ borderTop: '4px solid #27ae60', textAlign: 'center', maxWidth: 560, margin: '48px auto' }}>
          <p className="eyebrow" style={{ color: '#27ae60' }}>Pago aprobado</p>
          <h1>Tu pago fue procesado</h1>
          <p>Gracias por tu compra. Ya registramos el pago y pronto procesamos tu pedido.</p>

          <div className="checkout-success-grid" style={{ marginTop: 24 }}>
            {externalRef && (
              <article>
                <span>Orden</span>
                <strong>#{externalRef.slice(0, 8)}</strong>
              </article>
            )}
            {paymentId && (
              <article>
                <span>ID de pago</span>
                <strong>#{paymentId}</strong>
              </article>
            )}
            {status && (
              <article>
                <span>Estado</span>
                <strong style={{ color: '#27ae60', textTransform: 'capitalize' }}>{status}</strong>
              </article>
            )}
          </div>

          <div className="checkout-empty-actions" style={{ marginTop: 32 }}>
            <Link className="btn primary" href="/mi-cuenta">Ver mis pedidos</Link>
            <Link className="btn ghost" href="/latas">Seguir comprando</Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default function PagoCompletadoPage() {
  return (
    <Suspense fallback={<div className="app-container"><main><p style={{ padding: 48 }}>Cargando...</p></main></div>}>
      <PagoCompletadoContent />
    </Suspense>
  );
}
