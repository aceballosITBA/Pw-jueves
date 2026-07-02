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
        allDeals.sort((a, b) => b.savings - a.savings);
        setDeals(allDeals);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="app-container">
      <main>
        <div className="deals-banner">
          <div className="deals-banner-inner">
            <p className="deals-banner-eyebrow">Baum Beer Store</p>
            <h1 className="deals-banner-title">Packs con descuento</h1>
            <div className="deals-banner-tags">
              <span className="deals-banner-tag">Pack x12 · 10% OFF</span>
              <span className="deals-banner-tag">Pack x24 · 20% OFF</span>
            </div>
          </div>
        </div>

        {loading ? (
          <p style={{ textAlign: 'center', color: 'var(--muted)', padding: '3rem' }}>Calculando mejores ofertas...</p>
        ) : (
          <section className="ranking-grid">
            {deals.map((deal) => (
              <Link key={`${deal.product.id}-${deal.pack}`} href="/latas" className="ranking-card">
                <div className="ranking-badge-wrap">
                  <span className={`ranking-badge ranking-badge-deal${deal.discountPct}`}>
                    {deal.discountPct}% OFF · Pack x{deal.pack}
                  </span>
                </div>
                <div className="ranking-img-wrap">
                  {deal.product.images?.[0] ? (
                    <img src={deal.product.images[0]} alt={deal.product.name} className="ranking-img" />
                  ) : (
                    <div className="ranking-img-placeholder" />
                  )}
                </div>
                <div className="ranking-card-body">
                  <p className="ranking-card-old">{formatCurrency(deal.fullPrice)}</p>
                  <p className="ranking-card-price">{formatCurrency(deal.packPrice)}</p>
                  <p className="ranking-card-name">{deal.product.name}</p>
                  <p className="ranking-card-style">{deal.product.style}</p>
                  <p className="ranking-card-savings">Ahorrás {formatCurrency(deal.savings)}</p>
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
