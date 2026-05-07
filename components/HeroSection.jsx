export default function HeroSection() {
  return (
    <section className="hero-section card" aria-label="Banner principal">
      <div className="hero-overlay" />
      <div className="hero-content">
        <p className="hero-chip">Selección artesanal Baum</p>
        <h2>Packs Baum destacados</h2>
        <p className="hero-lead">Cervezas artesanales en lata, listas para compartir</p>
        <div className="hero-deals">
          <span>x12 · 15% OFF</span>
          <span>x24 · 20% OFF</span>
          <span>Envío gratis desde 2 packs</span>
        </div>
        <a href="#catalogo" className="hero-cta">Ver productos</a>
      </div>
      <div className="hero-carousel-dots" aria-hidden="true">
        <span className="active" />
        <span />
        <span />
      </div>
    </section>
  );
}
