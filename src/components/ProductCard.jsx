function formatCurrency(value) {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(value);
}

export default function ProductCard({ product, onSelect }) {
  const unitPrice = product.pricePack6 / 6;

  return (
    <article className="product-card" onClick={() => onSelect(product)}>
      <img src={product.image} alt={product.name} />
      <div>
        <h3>{product.name}</h3>
        <p><strong>Estilo:</strong> {product.style}</p>
        <p><strong>Pack x6:</strong> {formatCurrency(product.pricePack6)}</p>
        <p><strong>Unitaria:</strong> {formatCurrency(unitPrice)}</p>
        <p><strong>ABV:</strong> {product.abv}</p>
        <p><strong>IBU:</strong> {product.ibu}</p>
        <p><strong>SRM:</strong> {product.srm}</p>
      </div>
    </article>
  );
}
