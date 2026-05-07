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

export default function App() {
  const [isAgeVerified, setIsAgeVerified] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedPack, setSelectedPack] = useState(6);
  const [selectedStyle, setSelectedStyle] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('/data/products.json')
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
        if (data.length) setSelectedProduct(data[0]);
      });
  }, []);

  const availableStyles = useMemo(() => [...new Set(products.map((product) => product.style))], [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const styleMatch = selectedStyle ? product.style === selectedStyle : true;
      const nameMatch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      return styleMatch && nameMatch;
    });
  }, [products, selectedStyle, searchTerm]);

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
        <ProductFilter
          styles={availableStyles}
          selectedStyle={selectedStyle}
          searchTerm={searchTerm}
          onStyleChange={setSelectedStyle}
          onSearchChange={setSearchTerm}
        />
        <ProductList products={filteredProducts} onSelectProduct={handleSelectProduct} />
        <ProductDetail product={selectedProduct} selectedPack={selectedPack} onPackChange={setSelectedPack} />
        <OrderForm product={selectedProduct} selectedPack={selectedPack} />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
