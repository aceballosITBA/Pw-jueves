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
  if (!product) {
    return (
      <section className="card product-detail-panel">
        <h2>Detalle del producto</h2>
        <p>Seleccioná una cerveza para ver su información completa.</p>
      </section>
    );
  }

  const dynamicPrice = getPriceByPack(product.pricePack6, selectedPack);

  return (
    <section className="card product-detail-panel">
      <div className="detail-main">
        <img src={product.image} alt={product.name} />
        <div>
          <p className="product-detail-condition">Nuevo | +500 vendidos</p>
          <h2>{product.name}</h2>
          <p className="product-style">{product.style}</p>
          <p className="product-detail-price">{formatCurrency(dynamicPrice)}</p>
          <p className="product-stock">Stock disponible</p>
          <div className="pack-buttons">
            {packOptions.map((pack) => (
              <button
                key={pack}
                type="button"
                className={pack === selectedPack ? 'active' : ''}
                onClick={() => onPackChange(pack)}
              >
                x{pack}
              </button>
            ))}
          </div>
          <div className="detail-actions">
            <button type="button" className="buy-now">Comprar ahora</button>
            <button type="button" className="add-cart">Agregar al carrito</button>
          </div>
        </div>
      </div>
      <div className="tech-sheet">
        <h3>Ficha técnica</h3>
        <p><strong>ABV:</strong> {product.abv}</p>
        <p><strong>IBU:</strong> {product.ibu}</p>
        <p><strong>SRM:</strong> {product.srm}</p>
        <p><strong>Aroma:</strong> {product.aroma}</p>
        <p><strong>Sabor:</strong> {product.flavor}</p>
        <p><strong>Maridaje:</strong> {product.pairing}</p>
        <p><strong>Perfil sensorial:</strong> {product.sensoryProfile}</p>
      </div>
    </section>
  );
}
