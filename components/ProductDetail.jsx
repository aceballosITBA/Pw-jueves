"use client";
import { useState } from 'react';
const packOptions = [6, 12, 24];
const formatCurrency = (v) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(v);
const calcPrice = (base, pack) => pack === 12 ? Math.round(base * 2 * 0.9) : pack === 24 ? Math.round(base * 4 * 0.85) : base;

export default function ProductDetail({ product, selectedPack, onPackChange }) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [imageError, setImageError] = useState(false);
  if (!product) return <section className="card product-detail-panel"><p>Seleccioná una cerveza.</p></section>;

  const gallery = product.images?.length ? product.images : [];
  const selectedImage = gallery[selectedImageIndex] || null;

  return (
    <section className="product-detail-panel" id="ofertas">
      <div className="detail-main">
        <div>
          <div className="detail-media">
            {selectedImage && !imageError ? <img src={selectedImage} alt={product.name} onError={() => setImageError(true)} /> : <div className="product-image-placeholder detail-placeholder"><span>BAUM</span><p>Imagen no disponible</p></div>}
          </div>
          <div className="detail-thumbs">
            {gallery.map((image, index) => <button key={`${product.id}-${index}`} className={selectedImageIndex === index ? 'thumb active' : 'thumb'} onClick={() => setSelectedImageIndex(index)}><img src={image} alt={`${product.name} ${index + 1}`} /></button>)}
          </div>
        </div>
        <div className="detail-info">
          <p className="product-style">{product.style}</p>
          <h2>{product.name}</h2>
          <p className="product-detail-price">{formatCurrency(calcPrice(product.pricePack6, selectedPack))}</p>
          <p className="product-stock">Stock disponible: {product.stock} unidades</p>
          <div className="pack-buttons">{packOptions.map((pack) => <button key={pack} className={pack === selectedPack ? 'active' : ''} onClick={() => onPackChange(pack)}>x{pack}</button>)}</div>
          <div className="detail-actions"><button className="buy-now">Comprar ahora</button><button className="add-cart">Agregar al carrito</button></div>
          <p>{product.description}</p>
          <div className="tech-grid"><p><strong>ABV:</strong> {product.abv}</p><p><strong>IBU:</strong> {product.ibu}</p><p><strong>SRM:</strong> {product.srm}</p><p><strong>Aroma:</strong> {product.aroma}</p><p><strong>Sabor:</strong> {product.flavor}</p><p><strong>Maridaje:</strong> {product.pairing}</p><p><strong>Perfil:</strong> {product.profile}</p></div>
        </div>
      </div>
    </section>
  );
}
