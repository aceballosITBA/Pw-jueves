export default function ProductDetail({ product }) {
  if (!product) {
    return (
      <section className="detail">
        <p>Seleccioná una cerveza para ver su ficha técnica.</p>
      </section>
    );
  }

  return (
    <section className="detail">
      <h3>{product.name}</h3>
      <p>{product.description}</p>
      <p><strong>Perfil sensorial:</strong> {product.profile}</p>
      <p><strong>Aroma:</strong> {product.aroma}</p>
      <p><strong>Sabor:</strong> {product.flavor}</p>
      <p><strong>Maridaje:</strong> {product.pairing}</p>
      <div className="metrics">
        <span>ABV {product.abv}%</span>
        <span>IBU {product.ibu}</span>
        <span>SRM {product.srm}</span>
      </div>
    </section>
  );
}
