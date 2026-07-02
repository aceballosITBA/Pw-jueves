"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Footer from '../../components/Footer';

const formatCurrency = (v) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(v || 0);

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
        <div className="ranking-banner">
          <div className="ranking-banner-inner">
            <p className="ranking-banner-eyebrow">Baum Beer Store</p>
            <h1 className="ranking-banner-title">Descubrí los más vendidos</h1>
            <p className="ranking-banner-sub">Las cervezas favoritas de nuestra comunidad, ordenadas por volumen real de ventas.</p>
          </div>
        </div>

        {loading ? (
          <p style={{ textAlign: 'center', color: 'var(--muted)', padding: '3rem' }}>Cargando ranking...</p>
        ) : (
          <section className="ranking-grid">
            {products.map((p, i) => (
              <Link key={p.id} href={`/latas?style=${encodeURIComponent(p.style)}`} className="ranking-card">
                <div className="ranking-badge-wrap">
                  <span className="ranking-badge">{i + 1}° MÁS VENDIDO</span>
                </div>
                <div className="ranking-img-wrap">
                  {p.images?.[0] ? (
                    <img src={p.images[0]} alt={p.name} className="ranking-img" />
                  ) : (
                    <div className="ranking-img-placeholder" />
                  )}
                </div>
                <div className="ranking-card-body">
                  <p className="ranking-card-price">{formatCurrency(p.pricePack6)}</p>
                  <p className="ranking-card-name">{p.name}</p>
                  <p className="ranking-card-style">{p.style}</p>
                  {p.totalSold > 0 && (
                    <p className="ranking-card-sold">{p.totalSold} unidades vendidas</p>
                  )}
                </div>
              </Link>
            ))}
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
