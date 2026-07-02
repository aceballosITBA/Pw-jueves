"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Footer from '../../components/Footer';

const formatCurrency = (v) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(v || 0);

const medals = ['🥇', '🥈', '🥉'];

export default function MasVendidosPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/mas-vendidos')
      .then((r) => r.json())
      .then((data) => setProducts(data.data?.products || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="app-container">
      <main>
        <section className="card mv-hero">
          <div>
            <p className="eyebrow">Ranking</p>
            <h1>Más vendidos</h1>
            <p>Las cervezas favoritas de nuestra comunidad, ordenadas por volumen de ventas.</p>
          </div>
        </section>

        {loading ? (
          <p style={{ textAlign: 'center', color: 'var(--muted)', padding: '2rem' }}>Cargando ranking...</p>
        ) : (
          <section className="mv-grid">
            {products.map((p, i) => (
              <article key={p.id} className="card mv-card">
                <div className="mv-rank-badge">
                  {i < 3 ? <span className="mv-medal">{medals[i]}</span> : <span className="mv-num">#{i + 1}</span>}
                </div>
                <div className="mv-img-wrap">
                  {p.images?.[0] ? (
                    <img src={p.images[0]} alt={p.name} className="mv-img" />
                  ) : (
                    <div className="mv-img-placeholder" />
                  )}
                </div>
                <div className="mv-info">
                  <p className="mv-style eyebrow">{p.style}</p>
                  <h3 className="mv-name">{p.name}</h3>
                  <p className="mv-price">{formatCurrency(p.pricePack6)} <span>/ pack x6</span></p>
                  {p.totalSold > 0 && (
                    <p className="mv-sold">{p.totalSold} unidades vendidas</p>
                  )}
                </div>
                <Link href={`/latas?style=${encodeURIComponent(p.style)}`} className="btn ghost mv-btn">
                  Ver en catálogo
                </Link>
              </article>
            ))}
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
