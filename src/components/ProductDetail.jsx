import { useMemo, useState } from 'react';

const packOptions = [6, 12, 24];

function formatCurrency(value) {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(value);
}

function getPriceByPack(basePack6, pack) {
  const unitPrice = basePack6 / 6;
  const grossPrice = unitPrice * pack;

  if (pack === 12) return grossPrice * 0.85;
  if (pack === 24) return grossPrice * 0.8;
  return grossPrice;
}

export default function ProductDetail({ product, selectedPack, onPackChange }) {
  const [imageError, setImageError] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const gallery = useMemo(() => {
    if (!product?.image) return [];
    return [product.image, product.image, product.image];
  }, [product]);

  if (!product) {
    return (
      <section className="card product-detail-panel">
        <h2>Detalle del producto</h2>
        <p>Seleccioná una cerveza para ver su información completa.</p>
      </section>
    );
  }

  const dynamicPrice = getPriceByPack(product.pricePack6, selectedPack);
  const previousPrice = dynamicPrice * 1.14;
  const selectedImage = gallery[selectedImageIndex] || product.image;

  return (
    <section className="card product-detail-panel" id="ofertas">
      <div className="detail-main">
        <div className="detail-media-wrap">
          <div className="detail-media">
            {!imageError ? (
              <img src={selectedImage} alt={product.name} onError={() => setImageError(true)} />
            ) : (
              <div className="product-image-placeholder detail-placeholder" aria-label={`Imagen no disponible de ${product.name}`}>
                <span>🍺</span>
                <p>Imagen no disponible</p>
              </div>
            )}
          </div>
          <div className="detail-thumbs">
            {gallery.map((image, index) => (
              <button
                key={`${product.id}-${index}`}
                type="button"
                className={selectedImageIndex === index ? 'thumb active' : 'thumb'}
                onClick={() => setSelectedImageIndex(index)}
                aria-label={`Vista ${index + 1} de ${product.name}`}
              >
                <img src={image} alt={`${product.name} miniatura ${index + 1}`} />
              </button>
            ))}
          </div>
        </div>
        <div className="detail-info">
          <p className="product-detail-condition">Nuevo | +500 vendidos</p>
          <h2>{product.name}</h2>
          <p className="product-style">{product.style}</p>
          <p className="product-original-price detail-original">{formatCurrency(previousPrice)}</p>
          <p className="product-detail-price">{formatCurrency(dynamicPrice)}</p>
          <p className="discount-label">Aprovechá hasta 20% OFF por volumen</p>
          <p className="product-stock">Stock disponible para envío inmediato</p>
          <p className="shipping-copy">Llega gratis entre mañana y el próximo sábado en CABA y GBA.</p>
          <div className="pack-buttons">
            {packOptions.map((pack) => (
              <button
                key={pack}
                type="button"
                className={pack === selectedPack ? 'active' : ''}
                onClick={() => onPackChange(pack)}
              >
                Pack x{pack}
              </button>
            ))}
          </div>
          <ul className="benefits-list">
            <li>Compra protegida y atención personalizada</li>
            <li>Despacho en el día para pedidos antes de las 14 hs</li>
            <li>Calidad artesanal con perfil sensorial definido</li>
          </ul>
          <div className="detail-actions">
            <button type="button" className="buy-now">Comprar ahora</button>
            <button type="button" className="add-cart">Agregar al carrito</button>
          </div>
        </div>
      </div>
      <div className="tech-sheet">
        <h3>Descripción y ficha técnica</h3>
        <p className="detail-description">Una cerveza pensada para quienes buscan una experiencia completa: cuerpo balanceado, aroma destacado y final limpio para compartir en encuentros o maridar comidas.</p>
        <div className="tech-grid">
          <p><strong>ABV:</strong> {product.abv}</p>
          <p><strong>IBU:</strong> {product.ibu}</p>
          <p><strong>SRM:</strong> {product.srm}</p>
          <p><strong>Aroma:</strong> {product.aroma}</p>
          <p><strong>Sabor:</strong> {product.flavor}</p>
          <p><strong>Maridaje:</strong> {product.pairing}</p>
          <p><strong>Perfil sensorial:</strong> {product.sensoryProfile}</p>
        </div>
      </div>
    </section>
  );
}
