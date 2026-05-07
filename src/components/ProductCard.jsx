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
        <div className="pack-chips">
          <span>x6 {formatCurrency(getPackPrice(product, 6))}</span>
          <span>x12 {formatCurrency(getPackPrice(product, 12))} <b>-15%</b></span>
          <span>x24 {formatCurrency(getPackPrice(product, 24))} <b>-20%</b></span>
        </div>
      </div>
    </article>
  );
}
