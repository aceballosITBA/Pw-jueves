"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Footer from '../../components/Footer';
import { clearAuth, readAuthUser, isAuthed } from '../../components/auth-utils';

export default function MiCuentaPage() {
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState(null);

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

  useEffect(() => {
    try {
      setUser(readAuthUser());
    } catch (e) {
      setUser(null);
    }
    const onAuth = () => setUser(readAuthUser());
    window.addEventListener('auth:updated', onAuth);
    return () => window.removeEventListener('auth:updated', onAuth);
  }, []);

  const handleLogout = () => {
    clearAuth();
    setUser(null);
  };

  return (
    <div className="app-container">
      <main>
        <section className="catalog-section account-layout">
          <div className="card account-hero">
            <div>
              <p className="eyebrow">Mi cuenta</p>
              <h2>Tu historial y datos de acceso</h2>
              <p>Acá ves tus pedidos, tu sesión actual y el seguimiento de cada compra.</p>
            </div>
            <div className="account-actions">
              {user ? <span className="account-chip">Sesión: {user.name}</span> : <Link className="btn primary" href="/login?next=/mi-cuenta">Ingresar</Link>}
              {user ? <button className="btn ghost" onClick={handleLogout}>Cerrar sesión</button> : null}
            </div>
          </div>

          <div className="account-grid">
            <div className="card">
              <h3>Estado de cuenta</h3>
              {user ? (
                <div className="account-user-block">
                  <strong>{user.name}</strong>
                  <p>{user.email}</p>
                  <Link href="/checkout">Volver al checkout</Link>
                </div>
              ) : (
                <div className="account-user-block">
                  <p>No iniciaste sesión todavía.</p>
                  <Link href="/login?next=/mi-cuenta">Entrar ahora</Link>
                </div>
              )}
            </div>

            <div className="card">
              <h3>Pedidos recientes</h3>
              {!orders.length ? (
                <p>No hay pedidos confirmados todavía.</p>
              ) : (
                <ul className="account-order-list">
                  {orders.map((order) => (
                    <li key={order.id}>
                      <div>
                        <strong>Pedido #{order.id}</strong>
                        <span>{new Date(order.date || order.createdAt || Date.now()).toLocaleString()}</span>
                      </div>
                      <div>
                        <strong>{new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(order.total || 0)}</strong>
                        <Link href={`/mi-cuenta/order/${order.id}`}>Ver detalle</Link>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
