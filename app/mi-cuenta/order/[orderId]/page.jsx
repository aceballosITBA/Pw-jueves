"use client";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '../../../../lib/supabase/client';

const formatCurrency = (value) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(value || 0);

const readLocalOrder = (orderId) => {
  try {
    const raw = localStorage.getItem('orders');
    const orders = raw ? JSON.parse(raw) : [];
    return orders.find((item) => String(item.id) === String(orderId)) || null;
  } catch (error) {
    return null;
  }
};

export default function OrderDetailPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let cancelled = false;

    const loadOrder = async () => {
      setLoading(true);
      setErrorMessage('');

      try {
        const sessionResp = await supabase.auth.getSession();
        const accessToken = sessionResp?.data?.session?.access_token;

        if (!accessToken) throw new Error('No auth');

        const response = await fetch(`/api/orders/${encodeURIComponent(orderId)}`, { cache: 'no-store', headers: { Authorization: `Bearer ${accessToken}` } });
        if (!response.ok) throw new Error('API error');
        const data = await response.json();
        if (!cancelled) setOrder(data.order || null);
      } catch (error) {
        if (!cancelled) {
          const localOrder = readLocalOrder(orderId);
          setOrder(localOrder);
          if (!localOrder) setErrorMessage('No pudimos cargar el pedido desde la API.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadOrder();
    return () => { cancelled = true; };
  }, [orderId]);

  if (loading) return (
    <div className="app-container">
      <main>
        <section className="catalog-section">
          <p>Cargando pedido...</p>
        </section>
      </main>
    </div>
  );

  if (!order) return (
    <div className="app-container">
      <main>
        <section className="catalog-section">
          <p>{errorMessage || 'Pedido no encontrado.'}</p>
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
          <p>Fecha: {new Date(order.date || order.createdAt || order.updatedAt || Date.now()).toLocaleString()}</p>
          <h3>Items</h3>
          <ul>
            {(order.items || []).map((it) => (
              <li key={`${it.product?.id || it.product_id || it.product_name}-${it.pack}`}>{it.quantity} × {(it.product?.name || it.product_name || 'Producto')} (pack x{it.pack})</li>
            ))}
          </ul>
          <p><strong>Total:</strong> {formatCurrency(order.total || 0)}</p>
          <p><Link href="/mi-cuenta">Volver al historial</Link></p>
        </section>
      </main>
    </div>
  );
}
