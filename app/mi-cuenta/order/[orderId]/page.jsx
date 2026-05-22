"use client";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function OrderDetailPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('orders');
      const orders = raw ? JSON.parse(raw) : [];
      const found = orders.find((o) => String(o.id) === String(orderId));
      setOrder(found || null);
    } catch (e) {
      setOrder(null);
    }
  }, [orderId]);

  if (!order) return (
    <div className="app-container">
      <main>
        <section className="catalog-section">
          <p>Pedido no encontrado.</p>
          <p><Link href="/mi-cuenta">Volver al historial</Link></p>
        </section>
      </main>
    </div>
  );

  return (
    <div className="app-container">
      <main>
        <section className="catalog-section">
          <h2>Detalle del pedido #{order.id}</h2>
          <p>Fecha: {new Date(order.date).toLocaleString()}</p>
          <h3>Items</h3>
          <ul>
            {order.items.map((it) => (
              <li key={`${it.product.id}-${it.pack}`}>{it.quantity} × {it.product.name} (pack x{it.pack})</li>
            ))}
          </ul>
          <p><strong>Total:</strong> {new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(order.total || 0)}</p>
          <p><Link href="/mi-cuenta">Volver al historial</Link></p>
        </section>
      </main>
    </div>
  );
}
