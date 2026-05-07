"use client";
import { useEffect, useMemo, useState } from 'react';

const calcPrice = (base, pack) => {
  if (pack === 12) return Math.round(base * 2 * 0.9);
  if (pack === 24) return Math.round(base * 4 * 0.85);
  return base;
};
const formatCurrency = (v) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(v);

export default function ProductCard({ product, onSelect }) {
  const [imageError, setImageError] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const mainImage = useMemo(() => product.images?.[0], [product]);
  const gallery = useMemo(() => product.images?.filter(Boolean) ?? [], [product]);
  const unitPrice = Math.round(product.pricePack6 / 6);

  useEffect(() => {
    if (!isHovering || gallery.length <= 1) return undefined;
    const timer = setInterval(() => {
      setActiveImageIndex((current) => (current + 1) % gallery.length);
    }, 1200);
    return () => clearInterval(timer);
  }, [gallery, isHovering]);

  const currentImage = gallery[activeImageIndex] ?? mainImage;

  const handleMouseEnter = () => {
    if (gallery.length > 1) setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    setActiveImageIndex(0);
  };

  return (
    <article className="product-card" onClick={() => onSelect(product)} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <div className="product-media">
        {currentImage && !imageError ? <img src={currentImage} alt={product.name} onError={() => setImageError(true)} /> : <div className="product-image-placeholder"><span>BAUM</span><p>Imagen próximamente</p></div>}
        <div className="product-overlay" />
        <div className="product-content">
          <p className="product-style">{product.style}</p>
          <h3>{product.name}</h3>
          <p className="product-unitary">{formatCurrency(unitPrice)} c/u</p>
          <p className="product-price">{formatCurrency(product.pricePack6)} <small>pack x6</small></p>
          <div className="pack-chips">
            <span className="pack-chip">x12 -10%</span>
            <span className="pack-chip">x24 -15%</span>
            <span className="pack-chip premium">x12 {formatCurrency(calcPrice(product.pricePack6, 12))}</span>
            <span className="pack-chip premium">x24 {formatCurrency(calcPrice(product.pricePack6, 24))}</span>
          </div>
        </div>
      </div>
    </article>
  );
}
