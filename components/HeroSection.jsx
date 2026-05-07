"use client";

const banners = [
  '/images/banners/banner-2.jpg',
  '/images/banners/baum-banner-2.svg',
  '/images/banners/baum-banner-1.svg',
];

export default function HeroSection() {
  const heroBanner = banners[0] || banners[1];
  return (
    <section className="hero-section" aria-label="Banner principal" style={{ backgroundImage: `linear-gradient(180deg, rgba(8,8,10,.35), rgba(8,8,10,.75)), url(${heroBanner})` }}>
      <div className="hero-content">
        <p className="hero-chip">Edición destacada</p>
        <h2>Fuck IPA</h2>
        <p className="hero-lead">Lúpulo intenso, aroma explosivo y carácter Baum en formato premium.</p>
        <p className="hero-price">Pack x6 desde ARS 18.554</p>
        <a href="#catalogo" className="hero-cta">Ver productos</a>
      </div>
    </section>
  );
}
