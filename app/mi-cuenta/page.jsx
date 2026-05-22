"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Footer from '../../components/Footer';

export default function MiCuentaPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('orders');
      if (raw) setOrders(JSON.parse(raw));
    } catch (e) {
      setOrders([]);
    }
    const onOrders = () => {
      try { const raw = localStorage.getItem('orders'); if (raw) setOrders(JSON.parse(raw)); else setOrders([]); } catch (e) { setOrders([]); }
    };
    window.addEventListener('orders:updated', onOrders);
    return () => window.removeEventListener('orders:updated', onOrders);
  }, []);

  return (
    <div className="app-container">
      <main>
        <section className="catalog-section">
          <h2>Mi cuenta</h2>
          {!orders.length ? (
            <p>No hay pedidos confirmados todavía.</p>
          ) : (
            <div className="card">
              <h3>Historial de pedidos</h3>
              <ul>
                {orders.map((order) => (
                  <li key={order.id} style={{marginBottom:8}}>
                    <div><strong>Pedido #{order.id}</strong> — {new Date(order.date).toLocaleString()}</div>
                    <div>Total: {new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(order.total || 0)}</div>
                    <div style={{marginTop:6}}><Link href={`/mi-cuenta/order/${order.id}`}>Ver detalle</Link></div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
