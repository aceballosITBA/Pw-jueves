"use client";
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';
import Footer from '../../components/Footer';

function PagoFallidoContent() {
  const params = useSearchParams();
  const externalRef = params.get('external_reference');

  return (
    <div className="app-container">
      <main>
        <section className="catalog-section card" style={{ borderTop: '4px solid #e74c3c', textAlign: 'center', maxWidth: 560, margin: '48px auto' }}>
          <p className="eyebrow" style={{ color: '#e74c3c' }}>Pago rechazado</p>
          <h1>No pudimos procesar tu pago</h1>
          <p>El pago fue rechazado. Posibles razones:</p>
          <ul style={{ textAlign: 'left', display: 'inline-block', marginTop: 12, lineHeight: 2 }}>
            <li>Fondos insuficientes en la tarjeta</li>
            <li>Tarjeta rechazada por el banco</li>
            <li>Datos de la tarjeta incorrectos</li>
            <li>Cancelación durante el proceso</li>
          </ul>

          {externalRef && (
            <p style={{ marginTop: 16, color: '#888', fontSize: 14 }}>
              Referencia de orden: #{externalRef.slice(0, 8)}
            </p>
          )}

          <div className="checkout-empty-actions" style={{ marginTop: 32 }}>
            <Link className="btn primary" href="/checkout">Reintentar pago</Link>
            <Link className="btn ghost" href="/mi-cuenta">Ver mis pedidos</Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default function PagoFallidoPage() {
  return (
    <Suspense fallback={<div className="app-container"><main><p style={{ padding: 48 }}>Cargando...</p></main></div>}>
      <PagoFallidoContent />
    </Suspense>
  );
}
