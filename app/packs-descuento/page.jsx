"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Footer from '../../components/Footer';

const formatCurrency = (v) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(v || 0);

export default function PacksDescuentoPage() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/products')
      .then((r) => r.json())
      .then((data) => {
        const products = data.data?.products || [];
        const allDeals = products.flatMap((p) => [
          {
            product: p,
            pack: 12,
            packPrice: Math.round(p.pricePack6 * 2 * 0.9),
            fullPrice: p.pricePack6 * 2,
            savings: Math.round(p.pricePack6 * 2 * 0.1),
            discountPct: 10,
          },
          {
            product: p,
            pack: 24,
            packPrice: Math.round(p.pricePack6 * 4 * 0.8),
            fullPrice: p.pricePack6 * 4,
            savings: Math.round(p.pricePack6 * 4 * 0.2),
            discountPct: 20,
          },
        ]);
        // Sort by savings descending: más caro × mayor descuento primero
        allDeals.sort((a, b) => b.savings - a.savings);
        setDeals(allDeals);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="app-container">
      <main>
        <section className="card deals-hero">
          <p className="eyebrow">Ofertas</p>
          <h1>Packs con descuento</h1>
          <p>Cuanto más comprás, más ahorrás.</p>
          <div className="deals-hero-tags">
            <span className="deal-tag">Pack x12 · 10% off</span>
            <span className="deal-tag">Pack x24 · 20% off</span>
          </div>
        </section>

        {loading ? (
          <p style={{ textAlign: 'center', color: 'var(--muted)', padding: '2rem' }}>Calculando mejores ofertas...</p>
        ) : (
          <section className="deals-grid">
            {deals.map((deal) => (
              <article key={`${deal.product.id}-${deal.pack}`} className="card deal-card">
                <div className={`deal-badge deal-badge-${deal.discountPct}`}>-{deal.discountPct}%</div>
                <div className="deal-img-wrap">
                  {deal.product.images?.[0] ? (
                    <img src={deal.product.images[0]} alt={deal.product.name} className="deal-img" />
                  ) : (
                    <div className="deal-img-placeholder" />
                  )}
                </div>
                <div className="deal-info">
                  <p className="eyebrow deal-style">{deal.product.style}</p>
                  <h3 className="deal-name">{deal.product.name}</h3>
                  <p className="deal-pack-label">Pack x{deal.pack}</p>
                  <div className="deal-prices">
                    <span className="deal-old">{formatCurrency(deal.fullPrice)}</span>
                    <strong className="deal-new">{formatCurrency(deal.packPrice)}</strong>
                  </div>
                  <p className="deal-savings">Ahorrás {formatCurrency(deal.savings)}</p>
                </div>
                <Link href="/latas" className="btn primary deal-btn">
                  Comprar
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
