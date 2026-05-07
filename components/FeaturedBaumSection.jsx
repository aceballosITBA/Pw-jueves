"use client";
import { useMemo, useState } from 'react';

const formatCurrency = (v) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(v);
const calcPackPrice = (base, pack) => {
  if (pack === 12) return Math.round(base * 2 * 0.9);
  if (pack === 24) return Math.round(base * 4 * 0.85);
  return base;
};

const clean = (value = '') => value.trim().toLowerCase();

function FeaturedCard({ product, index, onSelect }) {
  const [imageError, setImageError] = useState(false);
  const mainImage = product.images?.[0];
  const unitPrice = Math.round(product.pricePack6 / 6);
  const styleIsRedundant = clean(product.name) === clean(product.style);
  const promoPack = index % 2 === 0 ? 12 : 24;
  const promoText = promoPack === 12 ? 'Pack x12 -10%' : 'Pack x24 -15%';

  return (
    <article className="featured-card" onClick={() => onSelect(product)}>
      <div className="featured-media-wrap">
        {mainImage && !imageError ? (
          <img className="featured-media" src={mainImage} alt={product.name} onError={() => setImageError(true)} />
        ) : (
          <div className="featured-placeholder">BAUM · Imagen próximamente</div>
        )}
      </div>
      <div className="featured-overlay" />
      <div className="featured-content">
        <span className="featured-badge">{promoText}</span>
        <h3>{product.name}</h3>
        {!styleIsRedundant ? <p className="featured-style">{product.style}</p> : null}
        <p className="featured-price">{formatCurrency(unitPrice)} <small>c/u</small></p>
        <p className="featured-pack">Pack x6 {formatCurrency(product.pricePack6)}</p>
        <p className="featured-pack">{promoPack === 12 ? 'Pack x12' : 'Pack x24'} {formatCurrency(calcPackPrice(product.pricePack6, promoPack))}</p>
        <button className="featured-cta" type="button">Ver detalle</button>
      </div>
    </article>
  );
}

export default function FeaturedBaumSection({ products, onSelectProduct }) {
  const featured = useMemo(() => products.slice(0, 6), [products]);

  return (
    <section className="featured-section" aria-label="Destacados Baum">
      <div className="section-head">
        <h2>Destacados Baum</h2>
        <p>Sabores intensos, diseño protagonista y beneficios por pack.</p>
      </div>
      <div className="featured-grid">
        {featured.map((product, index) => (
          <FeaturedCard key={product.id} product={product} index={index} onSelect={onSelectProduct} />
        ))}
      </div>
    </section>
  );
}
