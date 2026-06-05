"use client";
import { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import ProductList from '../components/ProductList';
import AgeGate from '../components/AgeGate';
import HeroSection from '../components/HeroSection';
import MarketplaceHighlights from '../components/MarketplaceHighlights';
import FloatingWhatsApp from '../components/FloatingWhatsApp';

export default function HomePage() {
  const [isAgeVerified, setIsAgeVerified] = useState(() => {
    try {
      return !!sessionStorage.getItem('age_verified');
    } catch (e) {
      return false;
    }
  });
  useEffect(() => {
    const onAge = () => {
      try {
        setIsAgeVerified(!!sessionStorage.getItem('age_verified'));
      } catch (e) {
        setIsAgeVerified(false);
      }
    };
    window.addEventListener('age:updated', onAge);
    return () => window.removeEventListener('age:updated', onAge);
  }, []);
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [cartHydrated, setCartHydrated] = useState(false);
  useEffect(() => { fetch('/api/products').then((r) => r.json()).then((data) => setProducts(data.products || [])); }, []);
  useEffect(() => {
    try {
      const raw = localStorage.getItem('cart_items');
      if (raw) setCartItems(JSON.parse(raw));
    } catch (e) {
      // ignore
    }
    setCartHydrated(true);
  }, []);

  useEffect(() => {
    if (!cartHydrated) return;
    try {
      localStorage.setItem('cart_items', JSON.stringify(cartItems));
      try { window.dispatchEvent(new Event('cart:updated')); } catch (e) {}
    } catch (e) {
      // ignore
    }
  }, [cartItems, cartHydrated]);

  const handleAddToCart = (product, pack = 6) => {
    setCartItems((current) => {
      const keyMatch = (it) => it.product.id === product.id && it.pack === pack;
      const existing = current.find(keyMatch);
      if (existing) return current.map((it) => (keyMatch(it) ? { ...it, quantity: it.quantity + 1 } : it));
      return [...current, { product, pack, quantity: 1 }];
    });
  };

  const handleChangeQuantity = (productId, pack, quantity) => {
    setCartItems((current) => {
      if (quantity <= 0) return current.filter((it) => !(it.product.id === productId && it.pack === pack));
      return current.map((it) => (it.product.id === productId && it.pack === pack ? { ...it, quantity } : it));
    });
  };

  const handleRemoveItem = (productId, pack) => setCartItems((c) => c.filter((it) => !(it.product.id === productId && it.pack === pack)));
  const handleClearCart = () => setCartItems([]);

  if (!isAgeVerified) return <AgeGate onConfirm={() => setIsAgeVerified(true)} />;

  return (
    <div className="app-container">
      <main>
        <HeroSection />
        <MarketplaceHighlights products={products} />
        <section className="catalog-section" id="catalogo">
          <ProductList products={products} onSelectProduct={() => {}} onAddToCart={handleAddToCart} />
        </section>
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
