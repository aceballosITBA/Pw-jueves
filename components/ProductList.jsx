import ProductCard from './ProductCard';

export default function ProductList({ products, onSelectProduct, onAddToCart }) {
  if (!products.length) return <p>No hay productos para mostrar.</p>;

  return (
    <section className="product-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onSelect={onSelectProduct} onAddToCart={onAddToCart} />
      ))}
    </section>
  );
}
