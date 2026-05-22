"use client";
import { useEffect, useMemo, useState } from 'react';
import ProductList from '../../components/ProductList';
import Footer from '../../components/Footer';

const calcPrice = (base, pack) => {
  if (pack === 12) return Math.round(base * 2 * 0.9);
  if (pack === 24) return Math.round(base * 4 * 0.8);
  return base;
};

export default function LatasPage() {
  const [products, setProducts] = useState([]);
  const [styleFilter, setStyleFilter] = useState('all');
  const [packFilter, setPackFilter] = useState(6);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  useEffect(() => {
    fetch('/data/products.json').then((r) => r.json()).then(setProducts).catch(() => setProducts([]));
  }, []);

  const styles = useMemo(() => {
    const set = new Set(products.map((p) => p.style));
    return ['all', ...Array.from(set)];
  }, [products]);

  const filtered = useMemo(() => {
    const min = minPrice ? Number(minPrice) : -Infinity;
    const max = maxPrice ? Number(maxPrice) : Infinity;
    return products.filter((p) => {
      if (styleFilter !== 'all' && p.style !== styleFilter) return false;
      const packPrice = calcPrice(p.pricePack6, Number(packFilter));
      if (packPrice < min || packPrice > max) return false;
      return true;
    });
  }, [products, styleFilter, packFilter, minPrice, maxPrice]);

  const handleAddToCart = (product, pack = 6) => {
    try {
      const raw = localStorage.getItem('cart_items');
      const current = raw ? JSON.parse(raw) : [];
      const idx = current.findIndex((it) => it.product.id === product.id && it.pack === pack);
      if (idx >= 0) {
        current[idx].quantity += 1;
      } else {
        current.push({ product, pack, quantity: 1 });
      }
      localStorage.setItem('cart_items', JSON.stringify(current));
      try { window.dispatchEvent(new Event('cart:updated')); } catch (e) {}
    } catch (e) {
      // ignore
    }
  };

  return (
    <div className="app-container">
      <main>
        <h1 style={{marginTop:0}}>Catálogo</h1>
        <section className="catalog-section">
          <div className="section-head">
            <h2>Latas</h2>
            <div className="filters" style={{display:'flex',gap:'0.6rem',alignItems:'center'}}>
              <label style={{display:'flex',alignItems:'center',gap:6}}>
                Estilo
                <select value={styleFilter} onChange={(e) => setStyleFilter(e.target.value)}>
                  {styles.map((s) => (<option key={s} value={s}>{s}</option>))}
                </select>
              </label>
              <label style={{display:'flex',alignItems:'center',gap:6}}>
                Pack
                <select value={packFilter} onChange={(e) => setPackFilter(e.target.value)}>
                  <option value={6}>x6</option>
                  <option value={12}>x12</option>
                  <option value={24}>x24</option>
                </select>
              </label>
              <label style={{display:'flex',alignItems:'center',gap:6}}>
                Precio entre
                <input placeholder="Min" value={minPrice} onChange={(e)=>setMinPrice(e.target.value)} style={{width:80}} />
                <input placeholder="Max" value={maxPrice} onChange={(e)=>setMaxPrice(e.target.value)} style={{width:80}} />
              </label>
            </div>
          </div>
          <ProductList products={filtered} onAddToCart={handleAddToCart} onSelectProduct={() => {}} />
        </section>
      </main>
      <Footer />
    </div>
  );
}
