export default function ProductDetail({ product }) {
  if (!product) {
    return (
      <section className="card">
        <h2>Detalle del producto</h2>
        <p>Seleccioná una cerveza para ver su información completa.</p>
      </section>
    );
  }

  return (
    <section className="card">
      <h2>{product.name}</h2>
      <p><strong>Descripción:</strong> {product.description}</p>
      <p><strong>Aroma:</strong> {product.aroma}</p>
      <p><strong>Sabor:</strong> {product.flavor}</p>
      <p><strong>Maridaje:</strong> {product.pairing}</p>
      <p><strong>Perfil sensorial:</strong> {product.sensoryProfile}</p>
    </section>
  );
}
