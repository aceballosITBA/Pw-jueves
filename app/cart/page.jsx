"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import CartPanel from '../../components/CartPanel';
import ConfirmModal from '../../components/ConfirmModal';
import CheckoutAuthModal from '../../components/CheckoutAuthModal';
import { useRef } from 'react';

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('cart_items');
      if (raw) setCartItems(JSON.parse(raw));
    } catch (e) {
      // ignore
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem('cart_items', JSON.stringify(cartItems));
      try { window.dispatchEvent(new Event('cart:updated')); } catch (e) {}
    } catch (e) {
      // ignore
    }
  }, [cartItems, hydrated]);

  const timerRef = useRef(null);
  const [lastRemoved, setLastRemoved] = useState(null);

  const clearPendingUndo = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setLastRemoved(null);
  };

  const handleChangeQuantity = (productId, pack, quantity) => {
    setCartItems((current) => {
      if (quantity <= 0) return current.filter((it) => !(it.product.id === productId && it.pack === pack));
      return current.map((it) => (it.product.id === productId && it.pack === pack ? { ...it, quantity } : it));
    });
  };

  const handleRemoveItem = (productId, pack) => {
    setCartItems((current) => {
      const found = current.find((it) => it.product.id === productId && it.pack === pack);
      if (!found) return current;
      const remaining = current.filter((it) => !(it.product.id === productId && it.pack === pack));
      // set lastRemoved and start undo timer
      setLastRemoved(found);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        timerRef.current = null;
        setLastRemoved(null);
      }, 5000);
      return remaining;
    });
  };
  const handleClearCart = () => setCartItems([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmItems, setConfirmItems] = useState([]);
  const [confirmTotal, setConfirmTotal] = useState(0);
  const [authOpen, setAuthOpen] = useState(false);
  const [pendingOrder, setPendingOrder] = useState(null);

  const handleConfirmCart = (items) => {
    const total = items.reduce((sum, item) => {
      const base = item.product.pricePack6 || 0;
      const packPrice = item.pack === 12 ? Math.round(base * 2 * 0.9) : item.pack === 24 ? Math.round(base * 4 * 0.8) : base;
      return sum + packPrice * item.quantity;
    }, 0);
    setConfirmItems(items);
    setConfirmTotal(total);
    setConfirmOpen(true);
  };

  const proceedToCheckout = (order) => {
    try {
      setConfirmOpen(false);
      setPendingOrder(order);
      localStorage.setItem('pending_checkout', JSON.stringify(order));
      try { window.dispatchEvent(new Event('checkout:updated')); } catch (e) {}
      router.push('/checkout');
    } catch (e) {
      setConfirmOpen(false);
    }
  };

  const handleModalConfirm = () => {
    const order = { id: String(Date.now()), items: confirmItems, date: Date.now(), total: confirmTotal };
    try {
      const isAuthed = !!localStorage.getItem('auth_session');
      if (!isAuthed) {
        setPendingOrder(order);
        localStorage.setItem('pending_checkout', JSON.stringify(order));
        setConfirmOpen(false);
        setAuthOpen(true);
        return;
      }
    } catch (e) {
      // ignore
    }
    proceedToCheckout(order);
  };

  const handleAuthed = () => {
    setAuthOpen(false);
    if (pendingOrder) {
      proceedToCheckout(pendingOrder);
    }
  };

  const handleUndo = () => {
    if (!lastRemoved) return;
    setCartItems((current) => {
      const same = current.find((it) => it.product.id === lastRemoved.product.id && it.pack === lastRemoved.pack);
      if (same) {
        return current.map((it) => (it.product.id === lastRemoved.product.id && it.pack === lastRemoved.pack ? { ...it, quantity: it.quantity + lastRemoved.quantity } : it));
      }
      return [...current, lastRemoved];
    });
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setLastRemoved(null);
  };

  return (
    <div className="app-container">
      <main>
        <section className="catalog-section" id="carrito">
          <CartPanel items={cartItems} onChangeQuantity={handleChangeQuantity} onRemoveItem={handleRemoveItem} onClearCart={handleClearCart} onConfirmCart={handleConfirmCart} />
          <ConfirmModal open={confirmOpen} onClose={() => setConfirmOpen(false)} onConfirm={handleModalConfirm} items={confirmItems} total={confirmTotal} primaryLabel="Continuar al pago" />
          <CheckoutAuthModal open={authOpen} onClose={() => setAuthOpen(false)} onAuthed={handleAuthed} />
          {lastRemoved ? (
            <div className="undo-toast">
              <span>Eliminaste {lastRemoved.product.name} (pack x{lastRemoved.pack})</span>
              <button className="btn ghost" onClick={handleUndo}>Deshacer</button>
            </div>
          ) : null}
        </section>
      </main>
    </div>
  );
}
