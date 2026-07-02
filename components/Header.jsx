"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { readAuthUser } from './auth-utils';
import { supabase } from '../lib/supabase/client';
import { persistSupabaseAuth, clearAuth } from './auth-utils';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [ageVerified, setAgeVerified] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [searchValue, setSearchValue] = useState('');
  const [authUser, setAuthUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const syncSupabaseSession = async () => {
      const { data } = await supabase.auth.getSession();
      const sessionUser = data?.session?.user || null;

      if (cancelled) return;

      if (sessionUser) {
        setAuthUser(persistSupabaseAuth(sessionUser));
        try {
          const res = await fetch('/api/auth/rol', {
            headers: { Authorization: `Bearer ${data.session.access_token}` }
          });
          const json = await res.json();
          if (!cancelled) setIsAdmin(json.data?.rol === 'admin');
        } catch {
          // ignorar error de rol
        }
      } else {
        setAuthUser(readAuthUser());
        setIsAdmin(false);
      }
    };

    syncSupabaseSession();

    const { data: authSubscription } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const sessionUser = session?.user || null;
      if (sessionUser) {
        setAuthUser(persistSupabaseAuth(sessionUser));
        try {
          const res = await fetch('/api/auth/rol', {
            headers: { Authorization: `Bearer ${session.access_token}` }
          });
          const json = await res.json();
          setIsAdmin(json.data?.rol === 'admin');
        } catch {
          setIsAdmin(false);
        }
      } else {
        clearAuth();
        setAuthUser(null);
        setIsAdmin(false);
      }
    });

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
    const onAge = () => {
      try {
        setAgeVerified(!!sessionStorage.getItem('age_verified'));
      } catch (e) {
        setAgeVerified(false);
      }
    };
    const onAuth = () => {
      setAuthUser(readAuthUser());
    };
    onAge();
    onAuth();
    window.addEventListener('age:updated', onAge);
    window.addEventListener('auth:updated', onAuth);
    return () => {
      cancelled = true;
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('cart:updated', onStorage);
      window.removeEventListener('age:updated', onAge);
      window.removeEventListener('auth:updated', onAuth);
      authSubscription.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      setSearchValue(params.get('search') || '');
    } catch (e) {
      setSearchValue('');
    }
  }, [pathname]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const goToSearch = (nextValue) => {
    const term = nextValue.trim();
    const nextUrl = term ? `/latas?search=${encodeURIComponent(term)}` : '/latas';
    router.replace(nextUrl);
  };
  if (!ageVerified) return null;

  if (pathname === '/login') {
    return (
      <header className="ml-header ml-header-login">
        <Link href="/" className="ml-logo">Baum</Link>
      </header>
    );
  }

  return (
    <header className="ml-header">
      <div className="ml-left">
        <Link href="/" className="ml-logo">Baum</Link>
        <div className="ml-location" aria-hidden="true">
          <span className="ml-pin">📍</span>
          <div className="ml-location-text"><small>Enviar a</small><strong>Buenos Aires 1832</strong></div>
        </div>
      </div>

      <form className="ml-search" aria-label="Buscador" onSubmit={(e) => { e.preventDefault(); goToSearch(); }}>
        <input
          className="ml-search-input"
          type="text"
          placeholder="Buscar latas"
          value={searchValue}
          onChange={(e) => {
            const nextValue = e.target.value;
            setSearchValue(nextValue);
            goToSearch(nextValue);
          }}
        />
        <button type="submit" className="ml-search-btn" aria-label="Buscar">🔍</button>
      </form>

      <div className="ml-right">
        <div className="ml-menu-row">
          <button
            type="button"
            className="ml-menu-toggle"
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={menuOpen}
            aria-controls="main-nav"
            onClick={() => setMenuOpen((current) => !current)}
          >
            <span aria-hidden="true">{menuOpen ? '✕' : '☰'}</span>
          </button>
        </div>
        <nav id="main-nav" className={`ml-nav ${menuOpen ? 'open' : ''}`} aria-label="Navegación principal">
          <Link href="/latas" className="ml-nav-link" onClick={() => setMenuOpen(false)}>Latas</Link>
          <Link href="/historia" className="ml-nav-link" onClick={() => setMenuOpen(false)}>Historia</Link>
          {isAdmin && (
            <Link href="/admin" className="ml-nav-link" style={{ background: 'rgba(0,0,0,.15)', borderRadius: 6 }} onClick={() => setMenuOpen(false)}>Admin</Link>
          )}
          {authUser ? (
            <Link href="/mi-cuenta" className="ml-user" onClick={() => setMenuOpen(false)}>Hola, {authUser.name}</Link>
          ) : (
            <Link href="/login" className="ml-user" onClick={() => setMenuOpen(false)}>Ingresar</Link>
          )}
          <Link href="/cart" className="ml-cart" aria-label="Carrito" onClick={() => setMenuOpen(false)}>
            <span className="ml-cart-icon">🛒</span>
            {cartCount > 0 ? <span className="ml-cart-badge" aria-live="polite">{cartCount}</span> : null}
          </Link>
        </nav>
      </div>
    </header>
  );
}
