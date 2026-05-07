"use client";
import { useEffect, useMemo, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductList from '../components/ProductList';
import AgeGate from '../components/AgeGate';
import HeroSection from '../components/HeroSection';
import MarketplaceHighlights from '../components/MarketplaceHighlights';
import FeaturedBaumSection from '../components/FeaturedBaumSection';
import FloatingWhatsApp from '../components/FloatingWhatsApp';

export default function HomePage() {
  const [isAgeVerified, setIsAgeVerified] = useState(false);
  const [products, setProducts] = useState([]);
  useEffect(() => { fetch('/data/products.json').then((r) => r.json()).then(setProducts); }, []);
  const featuredProducts = useMemo(() => products.slice(0, 8), [products]);
  if (!isAgeVerified) return <AgeGate onConfirm={() => setIsAgeVerified(true)} />;
  return <div className="app-container"><Header /><main><HeroSection /><FeaturedBaumSection products={featuredProducts} onSelectProduct={() => {}} /><MarketplaceHighlights /><section className="card catalog-section" id="catalogo"><div className="section-head"><h2>Catálogo completo</h2><p>Explorá todas las variedades Baum en formato grilla.</p></div><ProductList products={products} onSelectProduct={() => {}} /></section></main><Footer /><FloatingWhatsApp /></div>;
}
