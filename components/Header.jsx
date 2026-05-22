"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Header() {
  const [ageVerified, setAgeVerified] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const read = () => {
      try {
        const raw = localStorage.getItem('cart_items');
        const items = raw ? JSON.parse(raw) : [];
        const total = items.reduce((s, it) => s + (it.quantity || 0), 0);
        setCartCount(total);
      } catch (e) {
        setCartCount(0);
      }
    };
    read();
    const onStorage = () => read();
    window.addEventListener('storage', onStorage);
    window.addEventListener('cart:updated', onStorage);
    const readAge = () => {
      try {
        const v = localStorage.getItem('age_verified');
        setAgeVerified(!!v);
      } catch (e) {
        setAgeVerified(false);
      }
    };
    readAge();
    const onAge = () => readAge();
    window.addEventListener('age:updated', onAge);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('cart:updated', onStorage);
      window.removeEventListener('age:updated', onAge);
    };
  }, []);
  if (!ageVerified) return null;

  return (
    <header className="header ecommerce-header">
      <div className="brand-wrap">
        <Link href="/" className="brand">Baum</Link>
      </div>

      <div className="header-search-wrap" aria-label="Buscador">
        <span className="header-search-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" role="presentation" focusable="false" aria-hidden="true">
            <circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="M16 16l4.5 4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </span>
        <input className="header-search" type="text" placeholder="Buscar por estilo, aroma o nombre de cerveza" readOnly />
      </div>

      <div className="header-links-group">
        <nav className="header-nav" aria-label="Navegación principal">
          <Link href="/latas"><span aria-hidden="true" className="header-link-icon">🥫</span><span>Latas</span></Link>
          <Link href="/historia"><span aria-hidden="true" className="header-link-icon">📖</span><span>Historia</span></Link>
          <Link href="/ofertas"><span aria-hidden="true" className="header-link-icon">💲</span><span>Ofertas</span></Link>
        </nav>

        <div className="header-actions" aria-label="Accesos">
          <Link href="/mi-cuenta"><span aria-hidden="true" className="header-link-icon">👤</span><span>Mi cuenta</span></Link>
          <Link href="/cart" className="header-cart-link">
            <span aria-hidden="true" className="header-link-icon">🛒</span>
            <span>Carrito</span>
            {cartCount > 0 ? <span className="cart-badge" aria-live="polite">{cartCount}</span> : null}
          </Link>
        </div>
      </div>
    </header>
  );
}
