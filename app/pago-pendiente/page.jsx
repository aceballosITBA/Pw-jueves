"use client";
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';
import Footer from '../../components/Footer';

function PagoPendienteContent() {
  const params = useSearchParams();
  const externalRef = params.get('external_reference');
  const paymentId = params.get('payment_id');

  return (
    <div className="app-container">
      <main>
        <section className="catalog-section card" style={{ borderTop: '4px solid #f39c12', textAlign: 'center', maxWidth: 560, margin: '48px auto' }}>
          <p className="eyebrow" style={{ color: '#f39c12' }}>Pago pendiente</p>
          <h1>Tu pago está en proceso</h1>
          <p>
            El pago está siendo verificado. Si realizaste una transferencia bancaria,
            puede tardar entre 1 y 2 días hábiles en confirmarse.
          </p>
          <p style={{ marginTop: 12 }}>
            Te notificaremos cuando el pago sea confirmado y procesaremos tu pedido automáticamente.
          </p>

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

export default function PagoPendientePage() {
  return (
    <Suspense fallback={<div className="app-container"><main><p style={{ padding: 48 }}>Cargando...</p></main></div>}>
      <PagoPendienteContent />
    </Suspense>
  );
}
