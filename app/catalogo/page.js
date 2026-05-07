'use client';
import { useEffect, useMemo, useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ProductList from '../../components/ProductList';
import ProductDetail from '../../components/ProductDetail';
import PackSelector from '../../components/PackSelector';
import OrderForm from '../../components/OrderForm';

const styles = ['Todas', 'IPA', 'Lager', 'Porter', 'Stout', 'Honey', 'Blonde'];

export default function CatalogoPage() {
  const [products, setProducts] = useState([]);
  const [style, setStyle] = useState('Todas');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [pack, setPack] = useState(6);

  useEffect(() => {
    fetch('/data/products.json')
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

  const filtered = useMemo(
    () => style === 'Todas' ? products : products.filter((p) => p.style === style),
    [products, style]
  );

  return (
    <>
      <Header />
      <main className="container">
        <section className="filters">
          <h2>Catálogo de cervezas</h2>
          {styles.map((item) => (
            <button key={item} className="btn" onClick={() => setStyle(item)}>{item}</button>
          ))}
        </section>

        <div className="catalog-layout">
          <div>
            <ProductList products={filtered} onSelect={setSelectedProduct} />
          </div>
          <aside>
            <ProductDetail product={selectedProduct} />
            <PackSelector pack={pack} setPack={setPack} basePrice={selectedProduct?.pricePack6} />
            <OrderForm products={products} selectedProduct={selectedProduct} pack={pack} />
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}
