"use client";

const banners = [
  '/images/banners/baum-banner-1.svg',
  '/images/banners/baum-banner-2.svg',
  '/images/banners/baum-banner-3.svg',
];

export default function HeroSection() {
  const heroBanner = banners[1] || banners[0];
  return (
    <section
      className="hero-section"
      aria-label="Banner principal"
      style={{ backgroundImage: `linear-gradient(95deg, rgba(12,8,6,.88), rgba(51,25,4,.48)), url(${heroBanner})` }}
    >
      <div className="hero-content">
        <p className="hero-chip">Selección artesanal Baum</p>
        <h2>Sabores grandes para momentos gigantes</h2>
        <p className="hero-lead">Packs de cervezas Baum con descuentos por volumen y diseño protagonista.</p>
        <div className="hero-deals">
          <span>x12 · 10% OFF</span>
          <span>x24 · 15% OFF</span>
          <span>Envío gratis desde 2 packs</span>
        </div>
        <a href="#catalogo" className="hero-cta">Ver catálogo</a>
      </div>
    </section>
  );
}
