import ProductCard from './ProductCard';

export default function ProductList({ products, onSelectProduct }) {
  return (
    <section className="grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onSelectProduct={onSelectProduct} />
      ))}
    </section>
  );
}
