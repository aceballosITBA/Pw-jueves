export default function ProductList({ products }) {
  if (products.length === 0) {
    return <p>No hay productos para mostrar.</p>;
  }

  return (
    <ul className="list">
      {products.map((product, index) => (
        <li key={product.id ?? index} className="card">
          <h3>{product.name ?? 'Producto sin nombre'}</h3>
          {product.style && <p>Estilo: {product.style}</p>}
          {typeof product.price === 'number' && <p>Precio: ${product.price}</p>}
        </li>
      ))}
    </ul>
  );
}
