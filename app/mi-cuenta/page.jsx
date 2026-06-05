"use client";
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Footer from '../../components/Footer';
import { clearAuth, readAuthUser } from '../../components/auth-utils';
import { supabase } from '../../lib/supabase/client';

const formatCurrency = (value) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(value || 0);

const readLocalOrders = () => {
  try {
    const raw = localStorage.getItem('orders');
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    return [];
  }
};

export default function MiCuentaPage() {
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState(null);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [ordersError, setOrdersError] = useState('');

  useEffect(() => {
    setOrders(readLocalOrders());
    const onOrders = () => setOrders(readLocalOrders());
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

  useEffect(() => {
    let cancelled = false;

    const loadOrders = async () => {
      const { data } = await supabase.auth.getSession();
      const accessToken = data?.session?.access_token;

      if (!accessToken) {
        setLoadingOrders(false);
        setOrders(readLocalOrders());
        return;
      }

      setLoadingOrders(true);
      setOrdersError('');

      try {
        const response = await fetch('/api/orders', { cache: 'no-store', headers: { Authorization: `Bearer ${accessToken}` } });
        if (!response.ok) throw new Error('API error');
        const data = await response.json();
        if (!cancelled) setOrders(Array.isArray(data.orders) ? data.orders : []);
      } catch (error) {
        if (!cancelled) {
          setOrdersError('No pudimos cargar los pedidos desde la API. Mostrando el historial local.');
          setOrders(readLocalOrders());
        }
      } finally {
        if (!cancelled) setLoadingOrders(false);
      }
    };

    loadOrders();
    return () => { cancelled = true; };
  }, [user]);

  const handleLogout = () => {
    clearAuth();
    setUser(null);
  };

  const hasOrders = useMemo(() => orders.length > 0, [orders]);

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
              {loadingOrders ? (
                <p>Cargando pedidos...</p>
              ) : !hasOrders ? (
                <p>No hay pedidos confirmados todavía.</p>
              ) : (
                <>
                  {ordersError ? <p>{ordersError}</p> : null}
                  <ul className="account-order-list">
                  {orders.map((order) => (
                    <li key={order.id}>
                      <div>
                        <strong>Pedido #{order.id}</strong>
                        <span>{new Date(order.date || order.createdAt || Date.now()).toLocaleString()}</span>
                      </div>
                      <div>
                        <strong>{formatCurrency(order.total || 0)}</strong>
                        <Link href={`/mi-cuenta/order/${order.id}`}>Ver detalle</Link>
                      </div>
                    </li>
                  ))}
                  </ul>
                </>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
