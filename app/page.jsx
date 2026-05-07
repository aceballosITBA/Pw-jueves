"use client";

import { useEffect, useMemo, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductList from '../components/ProductList';
import AgeGate from '../components/AgeGate';
import HeroSection from '../components/HeroSection';
import MarketplaceHighlights from '../components/MarketplaceHighlights';
import FloatingWhatsApp from '../components/FloatingWhatsApp';

export default function HomePage() {
  const [isAgeVerified, setIsAgeVerified] = useState(false);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('/data/products.json').then((response) => response.json()).then((data) => setProducts(data));
  }, []);

  const featuredProducts = useMemo(() => products.slice(0, 3), [products]);

  if (!isAgeVerified) return <AgeGate onConfirm={() => setIsAgeVerified(true)} />;

  return (
    <div className="app-container">
      <Header />
      <main>
        <HeroSection />
        <MarketplaceHighlights />
        <section className="card">
          <div className="section-head">
            <h2>Destacados de la semana</h2>
          </div>
          <ProductList products={featuredProducts} onSelectProduct={() => {}} />
        </section>
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
