"use client";
import { useEffect, useState } from 'react';
import ProductList from '../../components/ProductList';
import Footer from '../../components/Footer';

export default function OfertasPage() {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    fetch('/api/products').then((r) => r.json()).then((data) => setProducts(data.data?.products || [])).catch(() => setProducts([]));
  }, []);

  // Regla simple para ofertas: precio pack6 <= 11000 ARS (se puede cambiar)
  const OFFER_THRESHOLD = 11000;
  const offers = products.filter((p) => (p.pricePack6 || Infinity) <= OFFER_THRESHOLD);

  const handleAddToCart = async (product, pack = 6) => {
    try {
      const res = await fetch('/api/carrito', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ product_id: product.id, cantidad: 1, pack }),
      });
      if (!res.ok) {
        const err = await res.json();
        alert(err.error || 'No se pudo agregar al carrito.');
        return;
      }
    } catch {
      // Si la API no responde, igual permite agregar
    }
    try {
      const raw = localStorage.getItem('cart_items');
      const current = raw ? JSON.parse(raw) : [];
      const idx = current.findIndex((it) => it.product.id === product.id && it.pack === pack);
      if (idx >= 0) current[idx].quantity += 1; else current.push({ product, pack, quantity: 1 });
      localStorage.setItem('cart_items', JSON.stringify(current));
      try { window.dispatchEvent(new Event('cart:updated')); } catch (e) {}
    } catch (e) {}
  };

  return (
    <div className="app-container">
      <main>
        <section className="catalog-section">
          <h2>Ofertas</h2>
          {offers.length ? <ProductList products={offers} onAddToCart={handleAddToCart} onSelectProduct={() => {}} /> : <p>No hay ofertas disponibles por ahora.</p>}
        </section>
      </main>
      <Footer />
    </div>
  );
}
