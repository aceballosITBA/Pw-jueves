import { useEffect, useMemo, useState } from 'react';
import Header from './components/Header';
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';
import PackSelector from './components/PackSelector';
import OrderForm from './components/OrderForm';
import Footer from './components/Footer';

const styleFilters = ['Todas', 'IPA', 'Lager', 'Porter', 'Stout', 'Honey', 'Blonde'];

export default function App() {
  const [products, setProducts] = useState([]);
  const [selectedStyle, setSelectedStyle] = useState('Todas');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedPack, setSelectedPack] = useState(6);

  useEffect(() => {
    fetch('/data/products.json')
      .then((response) => response.json())
      .then((data) => setProducts(data));
  }, []);

  const filteredProducts = useMemo(() => {
    if (selectedStyle === 'Todas') return products;
    return products.filter((product) => product.style === selectedStyle);
  }, [products, selectedStyle]);

  return (
    <>
      <Header />
      <main className="container">
        <section className="hero">
          <h1>Tienda de Cervezas Artesanales Baum en Lata</h1>
          <p>Catálogo académico para practicar React: componentes, estado, props, eventos, fetch y validación de formularios.</p>
          <p className="notice">Venta exclusiva para mayores de 18 años. Beber con moderación.</p>
          <a href="#catalogo" className="btn">Ir al catálogo</a>
        </section>

        <section id="catalogo" className="filters">
          <h2>Catálogo de cervezas</h2>
          {styleFilters.map((style) => (
            <button key={style} className="btn" onClick={() => setSelectedStyle(style)}>
              {style}
            </button>
          ))}
        </section>

        <div className="catalog-layout">
          <ProductList products={filteredProducts} onSelectProduct={setSelectedProduct} />
          <aside>
            <ProductDetail product={selectedProduct} />
            <PackSelector selectedPack={selectedPack} onPackChange={setSelectedPack} basePrice={selectedProduct?.pricePack6 || 0} />
            <OrderForm products={products} selectedProduct={selectedProduct} selectedPack={selectedPack} />
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}
