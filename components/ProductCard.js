export default function ProductCard({ product, onSelect }) {
  const unitPrice = (product.pricePack6 / 6).toFixed(2);

  return (
    <article className="card">
      <img src={product.image} alt={`Lata ${product.name}`} />
      <h3>{product.name}</h3>
      <p><span className="badge">{product.style}</span></p>
      <p>Pack x6: ${product.pricePack6}</p>
      <p>Unidad aprox: ${unitPrice}</p>
      <div className="metrics">
        <span>ABV {product.abv}%</span>
        <span>IBU {product.ibu}</span>
        <span>SRM {product.srm}</span>
      </div>
      <button className="btn" onClick={() => onSelect(product)}>Ver detalle</button>
    </article>
  );
}
