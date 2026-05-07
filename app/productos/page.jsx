"use client";

import { useEffect, useMemo, useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ProductFilter from '../../components/ProductFilter';
import ProductList from '../../components/ProductList';
import ProductDetail from '../../components/ProductDetail';
import FloatingWhatsApp from '../../components/FloatingWhatsApp';

const quickCategories = ['IPA', 'Lager', 'Honey', 'Stout', 'Porter', 'Más vendidas', 'Packs x12', 'Packs x24'];

function getCategoryMatch(product, category) {
  if (!category) return true;
  if (category === 'Más vendidas') return Number(product.ibu) >= 20;
  if (category === 'Packs x12' || category === 'Packs x24') return true;
  return product.style.toLowerCase().includes(category.toLowerCase());
}

export default function ProductosPage() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedPack, setSelectedPack] = useState(6);
  const [selectedStyle, setSelectedStyle] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    fetch('/data/products.json').then((response) => response.json()).then((data) => {
      setProducts(data);
      if (data.length) setSelectedProduct(data[0]);
    });
  }, []);

  useEffect(() => {
    if (selectedCategory === 'Packs x12') setSelectedPack(12);
    if (selectedCategory === 'Packs x24') setSelectedPack(24);
  }, [selectedCategory]);

  const availableStyles = useMemo(() => [...new Set(products.map((product) => product.style))], [products]);

  const filteredProducts = useMemo(() => products.filter((product) => {
    const styleMatch = selectedStyle ? product.style === selectedStyle : true;
    const nameMatch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const categoryMatch = getCategoryMatch(product, selectedCategory);
    return styleMatch && nameMatch && categoryMatch;
  }), [products, selectedStyle, searchTerm, selectedCategory]);

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setSelectedPack(6);
  };

  return (
    <div className="app-container">
      <Header />
      <main>
        <section className="quick-categories card">
          <div className="section-head">
            <h2>Catálogo de cervezas Baum</h2>
            <button type="button" onClick={() => setSelectedCategory('')} className="clear-filter">Ver todo</button>
          </div>
          <div className="quick-grid">
            {quickCategories.map((category) => (
              <button key={category} type="button" className={selectedCategory === category ? 'quick-pill active' : 'quick-pill'} onClick={() => setSelectedCategory(category)}>
                {category}
              </button>
            ))}
          </div>
        </section>

        <ProductFilter styles={availableStyles} selectedStyle={selectedStyle} searchTerm={searchTerm} onStyleChange={setSelectedStyle} onSearchChange={setSearchTerm} />
        <ProductList products={filteredProducts} onSelectProduct={handleSelectProduct} />
        <ProductDetail product={selectedProduct} selectedPack={selectedPack} onPackChange={setSelectedPack} />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
