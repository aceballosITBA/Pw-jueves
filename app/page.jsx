"use client";
import { useEffect, useState } from 'react';
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
  useEffect(() => { fetch('/data/products.json').then((r) => r.json()).then(setProducts); }, []);
  if (!isAgeVerified) return <AgeGate onConfirm={() => setIsAgeVerified(true)} />;
  return <div className="app-container"><Header /><main><HeroSection /><MarketplaceHighlights /><section className="catalog-section" id="catalogo"><ProductList products={products} onSelectProduct={() => {}} /></section></main><Footer /><FloatingWhatsApp /></div>;
}
