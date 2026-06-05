"use client";
import { useEffect, useMemo, useState } from 'react';

const calcPrice = (base, pack) => {
  if (pack === 12) return Math.round(base * 2 * 0.9);
  if (pack === 24) return Math.round(base * 4 * 0.8);
  return base;
};
const formatCurrency = (v) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(v);

export default function ProductCard({ product, onSelect }) {
  const [imageError, setImageError] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [activePack, setActivePack] = useState(6);
  const mainImage = useMemo(() => product.images?.[0], [product]);
  const gallery = useMemo(() => product.images?.filter(Boolean) ?? [], [product]);
  const totalPrice = calcPrice(product.pricePack6, activePack);
  const unitPrice = Math.round(totalPrice / activePack);

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
    setActivePack(6);
  };

  return (
    <article className={`product-card ${product.id === 'ipa-mdp' ? 'distant-image' : ''}`} onClick={() => onSelect(product)} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <div className="product-media">
        {currentImage && !imageError ? <img src={currentImage} alt={product.name} onError={() => setImageError(true)} /> : <div className="product-image-placeholder"><span>BAUM</span><p>Imagen próximamente</p></div>}
        <div className="product-overlay" />
        <div className="product-content">
          <p className="product-style">{product.name}</p>
          <p className="product-unitary">{formatCurrency(unitPrice)} c/u</p>
          <p className="product-price">{formatCurrency(totalPrice)} <small>pack x{activePack}</small></p>
          <div className="pack-chips">
            <button type="button" className={activePack === 6 ? 'pack-chip active' : 'pack-chip'} onPointerEnter={() => setActivePack(6)} onFocus={() => setActivePack(6)} onClick={(event) => event.stopPropagation()}>x6</button>
            <button type="button" className={activePack === 12 ? 'pack-chip premium active' : 'pack-chip premium'} onPointerEnter={() => setActivePack(12)} onFocus={() => setActivePack(12)} onClick={(event) => event.stopPropagation()}>x12</button>
            <button type="button" className={activePack === 24 ? 'pack-chip premium active' : 'pack-chip premium'} onPointerEnter={() => setActivePack(24)} onFocus={() => setActivePack(24)} onClick={(event) => event.stopPropagation()}>x24</button>
          </div>
          <p className="pack-discount-note" aria-live="polite">
            {activePack === 12 ? 'Se adquiere un 10% de descuento.' : activePack === 24 ? 'Se adquiere un 20% de descuento.' : ' '}
          </p>
        </div>
      </div>
    </article>
  );
}
