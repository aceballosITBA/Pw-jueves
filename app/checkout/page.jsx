"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Footer from '../../components/Footer';
import AuthForm from '../../components/AuthForm';
import { readAuthUser, isAuthed } from '../../components/auth-utils';

const formatCurrency = (value) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(value || 0);

const calcPackPrice = (base, pack) => {
  if (pack === 12) return Math.round(base * 2 * 0.9);
  if (pack === 24) return Math.round(base * 4 * 0.8);
  return base;
};

export default function CheckoutPage() {
  const router = useRouter();
  const [pendingOrder, setPendingOrder] = useState(null);
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [shipping, setShipping] = useState({ name: '', email: '', phone: '', address: '', city: '', postalCode: '', notes: '' });
  const [paymentMethod, setPaymentMethod] = useState('mercadopago');
  const [completedOrder, setCompletedOrder] = useState(null);

  useEffect(() => {
    try {
      const rawOrder = localStorage.getItem('pending_checkout');
      const rawCart = localStorage.getItem('cart_items');
      if (rawOrder) {
        setPendingOrder(JSON.parse(rawOrder));
      } else if (rawCart) {
        const items = JSON.parse(rawCart);
        const total = items.reduce((sum, item) => sum + calcPackPrice(item.product.pricePack6 || 0, item.pack) * item.quantity, 0);
        setPendingOrder({ id: String(Date.now()), items, date: Date.now(), total });
      }
      const rawUser = localStorage.getItem('auth_user');
      if (rawUser) setUser(JSON.parse(rawUser));
      const rawShipping = localStorage.getItem('checkout_shipping');
      if (rawShipping) setShipping(JSON.parse(rawShipping));
    } catch (e) {
      setPendingOrder(null);
      setUser(null);
    }
    setAuthReady(true);
  }, []);

  useEffect(() => {
    if (!authReady) return;
    try {
      localStorage.setItem('checkout_shipping', JSON.stringify(shipping));
    } catch (e) {
      // ignore
    }
  }, [shipping, authReady]);

  const subtotal = pendingOrder?.items?.reduce((sum, item) => sum + calcPackPrice(item.product.pricePack6 || 0, item.pack) * item.quantity, 0) || 0;
  const shippingCost = subtotal > 20000 ? 0 : subtotal > 0 ? 1800 : 0;
  const total = subtotal + shippingCost;

  const handleCompleteCheckout = () => {
    if (!pendingOrder || !user) return;
    try {
      const raw = localStorage.getItem('orders');
      const orders = raw ? JSON.parse(raw) : [];
      const order = {
        ...pendingOrder,
        id: pendingOrder.id || String(Date.now()),
        user,
        shipping,
        paymentMethod,
        status: 'ready_to_pay',
        createdAt: Date.now(),
        total
      };
      orders.unshift(order);
      localStorage.setItem('orders', JSON.stringify(orders));
      localStorage.setItem('last_order', JSON.stringify(order));
      localStorage.removeItem('pending_checkout');
      localStorage.removeItem('cart_items');
      localStorage.setItem('last_checkout_order', JSON.stringify(order));
      try { window.dispatchEvent(new Event('orders:updated')); } catch (e) {}
      try { window.dispatchEvent(new Event('cart:updated')); } catch (e) {}
      setCompletedOrder(order);
    } catch (e) {
      setCompletedOrder(null);
    }
  };

  if (!pendingOrder) {
    return (
      <div className="app-container checkout-page">
        <main>
          <section className="catalog-section card">
            <p className="eyebrow">Checkout</p>
            <h2>No hay un pedido pendiente</h2>
            <p>Elegí productos en el catálogo o volvé al carrito para armar tu compra.</p>
            <div className="checkout-empty-actions">
              <Link className="btn primary" href="/latas">Ir al catálogo</Link>
              <Link className="btn ghost" href="/cart">Volver al carrito</Link>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="app-container checkout-page">
      <main>
        {completedOrder ? (
          <section className="checkout-success card">
            <p className="eyebrow">Pedido confirmado</p>
            <h1>Tu pedido quedó listo</h1>
            <p>Lo registramos y ya podés ver el detalle desde tu cuenta.</p>
            <div className="checkout-success-grid">
              <article>
                <span>Pedido</span>
                <strong>#{completedOrder.id}</strong>
              </article>
              <article>
                <span>Total</span>
                <strong>{formatCurrency(completedOrder.total)}</strong>
              </article>
              <article>
                <span>Pago</span>
                <strong>{paymentMethod === 'mercadopago' ? 'Mercado Pago' : paymentMethod}</strong>
              </article>
            </div>
            <div className="checkout-empty-actions">
              <Link className="btn primary" href={`/mi-cuenta/order/${completedOrder.id}`}>Ver pedido</Link>
              <Link className="btn ghost" href="/latas">Seguir comprando</Link>
            </div>
          </section>
        ) : (
          <section className="checkout-layout">
            <div className="card checkout-form-card">
              <div className="checkout-topline">
                <div>
                  <p className="eyebrow">Checkout</p>
                  <h1>Completa tu compra</h1>
                </div>
                <div className="checkout-user-pill">
                  {user ? `Sesión iniciada: ${user.name}` : 'Ingresá para continuar'}
                </div>
              </div>

              {!user ? (
                <div className="checkout-auth-block">
                  <AuthForm
                    title="Iniciá sesión"
                    description="Necesitamos tu cuenta para guardar el pedido y enviarte el detalle."
                    submitLabel="Entrar"
                    onSuccess={(nextUser) => setUser(nextUser)}
                  />
                  <p className="checkout-auth-hint">
                    Si preferís, también podés <Link href="/login?next=/checkout">abrir la página de login</Link>.
                  </p>
                </div>
              ) : (
                <div className="checkout-form-grid">
                  <label className="checkout-field">
                    <span>Nombre y apellido</span>
                    <input value={shipping.name} onChange={(e) => setShipping((current) => ({ ...current, name: e.target.value }))} placeholder="Tu nombre" />
                  </label>
                  <label className="checkout-field">
                    <span>Email</span>
                    <input type="email" value={shipping.email} onChange={(e) => setShipping((current) => ({ ...current, email: e.target.value }))} placeholder="tu@email.com" />
                  </label>
                  <label className="checkout-field">
                    <span>Teléfono</span>
                    <input value={shipping.phone} onChange={(e) => setShipping((current) => ({ ...current, phone: e.target.value }))} placeholder="+54 11..." />
                  </label>
                  <label className="checkout-field checkout-field-wide">
                    <span>Dirección</span>
                    <input value={shipping.address} onChange={(e) => setShipping((current) => ({ ...current, address: e.target.value }))} placeholder="Calle, número, depto." />
                  </label>
                  <label className="checkout-field">
                    <span>Ciudad</span>
                    <input value={shipping.city} onChange={(e) => setShipping((current) => ({ ...current, city: e.target.value }))} placeholder="Ciudad" />
                  </label>
                  <label className="checkout-field">
                    <span>Código postal</span>
                    <input value={shipping.postalCode} onChange={(e) => setShipping((current) => ({ ...current, postalCode: e.target.value }))} placeholder="CP" />
                  </label>
                  <label className="checkout-field checkout-field-wide">
                    <span>Notas opcionales</span>
                    <textarea rows="3" value={shipping.notes} onChange={(e) => setShipping((current) => ({ ...current, notes: e.target.value }))} placeholder="Referencias de entrega, portón, horario..." />
                  </label>
                </div>
              )}

              {user ? (
                <div className="checkout-payments">
                  <h3>Método de pago</h3>
                  <div className="checkout-payment-options">
                    <label className={paymentMethod === 'mercadopago' ? 'checkout-payment-card active' : 'checkout-payment-card'}>
                      <input type="radio" name="payment" checked={paymentMethod === 'mercadopago'} onChange={() => setPaymentMethod('mercadopago')} />
                      <span>Mercado Pago</span>
                      <small>Tarjeta, saldo o transferencia</small>
                    </label>
                    <label className={paymentMethod === 'transferencia' ? 'checkout-payment-card active' : 'checkout-payment-card'}>
                      <input type="radio" name="payment" checked={paymentMethod === 'transferencia'} onChange={() => setPaymentMethod('transferencia')} />
                      <span>Transferencia</span>
                      <small>Te compartimos los datos al confirmar</small>
                    </label>
                  </div>
                </div>
              ) : null}
            </div>

            <aside className="card checkout-summary-card">
              <p className="eyebrow">Resumen</p>
              <h3>Tu pedido</h3>
              <ul className="checkout-item-list">
                {pendingOrder.items.map((it) => {
                  const itemTotal = calcPackPrice(it.product.pricePack6 || 0, it.pack) * it.quantity;
                  return (
                    <li key={`${it.product.id}-${it.pack}`}>
                      <div>
                        <strong>{it.product.name}</strong>
                        <span>Pack x{it.pack} · Cantidad {it.quantity}</span>
                      </div>
                      <strong>{formatCurrency(itemTotal)}</strong>
                    </li>
                  );
                })}
              </ul>
              <div className="checkout-totals">
                <div><span>Subtotal</span><strong>{formatCurrency(subtotal)}</strong></div>
                <div><span>Envío</span><strong>{shippingCost === 0 ? 'Gratis' : formatCurrency(shippingCost)}</strong></div>
                <div className="total"><span>Total</span><strong>{formatCurrency(total)}</strong></div>
              </div>
              {user ? (
                <button className="btn primary checkout-action" onClick={handleCompleteCheckout}>Confirmar y generar pedido</button>
              ) : null}
              <p className="checkout-note">Luego podés conectar Mercado Pago real sin cambiar el diseño.</p>
              <Link className="btn ghost checkout-action" href="/cart">Volver al carrito</Link>
            </aside>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
