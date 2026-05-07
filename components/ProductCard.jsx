"use client";
import { useMemo, useState } from 'react';

const calcPrice = (base, pack) => {
  if (pack === 12) return Math.round(base * 2 * 0.9);
  if (pack === 24) return Math.round(base * 4 * 0.85);
  return base;
};
const formatCurrency = (v) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(v);

export default function ProductCard({ product, onSelect }) {
  const [imageError, setImageError] = useState(false);
  const mainImage = useMemo(() => product.images?.[0], [product]);
  const unitPrice = Math.round(product.pricePack6 / 6);

  return (
    <article className="product-card" onClick={() => onSelect(product)}>
      <div className="product-media">
        <span className="offer-badge">-10%/-15%</span>
        {mainImage && !imageError ? <img src={mainImage} alt={product.name} onError={() => setImageError(true)} /> : <div className="product-image-placeholder"><span>BAUM</span><p>Imagen próximamente</p></div>}
      </div>
      <div className="product-content">
        <h3>{product.name}</h3>
        <p className="product-style">{product.style}</p>
        <p className="product-price">{formatCurrency(product.pricePack6)} <small>pack x6</small></p>
        <p className="product-unitary">{formatCurrency(unitPrice)} c/u</p>
        <div className="pack-chips">
          <span className="pack-chip">x6</span>
          <span className="pack-chip premium">x12 {formatCurrency(calcPrice(product.pricePack6, 12))}</span>
          <span className="pack-chip premium">x24 {formatCurrency(calcPrice(product.pricePack6, 24))}</span>
        </div>
      </div>
    </article>
  );
}
