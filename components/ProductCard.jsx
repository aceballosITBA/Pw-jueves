"use client";

import { useState } from 'react';

function formatCurrency(value) {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(value);
}

function getPackPrice(product, pack) {
  const unit = product.pricePack6 / 6;
  return unit * pack;
}

export default function ProductCard({ product, onSelect }) {
  const [imageError, setImageError] = useState(false);

  return (
    <article className="product-card" onClick={() => onSelect(product)}>
      <div className="product-media">
        <span className="offer-badge">Oferta</span>
        {!imageError ? (
          <img src={product.image} alt={product.name} onError={() => setImageError(true)} />
        ) : (
          <div className="product-image-placeholder" aria-label={`Imagen no disponible de ${product.name}`}>
            <span>🍺</span>
            <p>Imagen próximamente</p>
          </div>
        )}
      </div>
      <div className="product-content">
        <h3>{product.name}</h3>
        <p className="product-style">{product.style}</p>
        <p className="product-price">{formatCurrency(product.pricePack6)} <small>pack x6</small></p>
        <p className="product-original-price">{formatCurrency(getPackPrice(product, 6) * 1.12)}</p>
        <div className="pack-chips">
          <span className="pack-chip">Pack x6</span>
          <span className="pack-chip premium">Pack x12 <b>-15%</b></span>
          <span className="pack-chip premium">Pack x24 <b>-20%</b></span>
        </div>
      </div>
    </article>
  );
}
