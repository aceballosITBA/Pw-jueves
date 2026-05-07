import { useEffect, useMemo, useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import ProductFilter from './components/ProductFilter';
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';
import OrderForm from './components/OrderForm';
import AgeGate from './components/AgeGate';
import HeroSection from './components/HeroSection';
import MarketplaceHighlights from './components/MarketplaceHighlights';
import FloatingWhatsApp from './components/FloatingWhatsApp';

const quickCategories = ['IPA', 'Lager', 'Honey', 'Stout', 'Porter', 'Más vendidas', 'Packs x12', 'Packs x24'];

function getCategoryMatch(product, category) {
  if (!category) return true;
  if (category === 'Más vendidas') return Number(product.ibu) >= 20;
  if (category === 'Packs x12' || category === 'Packs x24') return true;
  return product.style.toLowerCase().includes(category.toLowerCase());
}

export default function App() {
  const [isAgeVerified, setIsAgeVerified] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedPack, setSelectedPack] = useState(6);
  const [selectedStyle, setSelectedStyle] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    fetch('/data/products.json')
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
        if (data.length) setSelectedProduct(data[0]);
      });
  }, []);

  useEffect(() => {
    if (selectedCategory === 'Packs x12') setSelectedPack(12);
    if (selectedCategory === 'Packs x24') setSelectedPack(24);
  }, [selectedCategory]);

  const availableStyles = useMemo(() => [...new Set(products.map((product) => product.style))], [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const styleMatch = selectedStyle ? product.style === selectedStyle : true;
      const nameMatch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      const categoryMatch = getCategoryMatch(product, selectedCategory);
      return styleMatch && nameMatch && categoryMatch;
    });
  }, [products, selectedStyle, searchTerm, selectedCategory]);

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setSelectedPack(6);
  };

  if (!isAgeVerified) {
    return <AgeGate onConfirm={() => setIsAgeVerified(true)} />;
  }

  return (
    <div className="app-container">
      <Header />
      <main>
        <HeroSection />
        <MarketplaceHighlights />

        <section className="quick-categories card">
          <div className="section-head">
            <h2>Categorías rápidas</h2>
            <button type="button" onClick={() => setSelectedCategory('')} className="clear-filter">Ver todo</button>
          </div>
          <div className="quick-grid">
            {quickCategories.map((category) => (
              <button
                key={category}
                type="button"
                className={selectedCategory === category ? 'quick-pill active' : 'quick-pill'}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </section>

        <section id="catalogo" className="catalog-section">
          <ProductFilter
            styles={availableStyles}
            selectedStyle={selectedStyle}
            searchTerm={searchTerm}
            onStyleChange={setSelectedStyle}
            onSearchChange={setSearchTerm}
          />
          <ProductList products={filteredProducts} onSelectProduct={handleSelectProduct} />
        </section>

        <ProductDetail product={selectedProduct} selectedPack={selectedPack} onPackChange={setSelectedPack} />
        <OrderForm product={selectedProduct} selectedPack={selectedPack} />

        <section id="historia" className="card history-section">
          <h2>Historia de la cerveza artesanal</h2>
          <p>La cerveza artesanal nació como respuesta a la producción masiva: más aroma, más identidad y más cuidado en cada cocción.</p>
          <p>En Baum, esa filosofía se traduce en recetas de autor, ingredientes nobles y una búsqueda constante por elevar la experiencia de consumo.</p>
          <p>Desde una IPA intensa hasta una Honey suave, cada estilo invita a disfrutar el ritual: elegir, servir, maridar y compartir en un momento lifestyle.</p>
        </section>
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
