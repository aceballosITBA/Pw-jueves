import { useEffect, useMemo, useState } from 'react';
import ProductFilter from './components/ProductFilter';
import ProductList from './components/ProductList';

export default function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');

  useEffect(() => {
    // Carga inicial para explicar fetch + useEffect en el parcial.
    const loadProducts = async () => {
      try {
        const response = await fetch('/data/products.json');
        if (!response.ok) throw new Error('No se pudo cargar el catálogo.');
        const data = await response.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error inesperado.');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return products;
    return products.filter((p) =>
      String(p.name || '')
        .toLowerCase()
        .includes(term)
    );
  }, [products, query]);

  return (
    <main className="container">
      <h1>Semana 7 · React SPA</h1>
      <p className="subtitle">Ejemplo simple para parcial oral.</p>

      <ProductFilter query={query} onChange={setQuery} />

      {loading && <p>Cargando productos...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && <ProductList products={filteredProducts} />}
    </main>
  );
}
