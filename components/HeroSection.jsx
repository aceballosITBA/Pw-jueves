const banners = [
  '/images/banners/baum-banner-1.svg',
  '/images/banners/baum-banner-2.svg',
  '/images/banners/baum-banner-3.svg',
];

export default function HeroSection() {
  return (
    <section className="hero-section card" aria-label="Banner principal" style={{ backgroundImage: `linear-gradient(90deg, rgba(24,12,5,.78), rgba(24,12,5,.22)), url(${banners[0]})` }}>
      <div className="hero-content">
        <p className="hero-chip">Selección artesanal Baum</p>
        <h2>Packs Baum destacados</h2>
        <p className="hero-lead">Cervezas artesanales en lata, listas para compartir</p>
        <div className="hero-deals">
          <span>x12 · 10% OFF</span>
          <span>x24 · 15% OFF</span>
          <span>Envío gratis desde 2 packs</span>
        </div>
        <a href="#catalogo" className="hero-cta">Ver productos</a>
      </div>
    </section>
  );
}
