import ProductCard from './ProductCard';

export default function ProductList({ products, onSelect }) {
  return (
    <section className="grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onSelect={onSelect} />
      ))}
    </section>
  );
}
