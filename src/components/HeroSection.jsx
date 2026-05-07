export default function HeroSection() {
  return (
    <section className="hero-section card" aria-label="Banner principal">
      <div className="hero-overlay" />
      <div className="hero-content">
        <p className="hero-chip">Packs recomendados</p>
        <h2>Tu birra favorita, en formato tienda real</h2>
        <p className="hero-lead">Descuentos por volumen para armar tu heladera con precio mayorista.</p>
        <div className="hero-deals">
          <span>x12 · 15% OFF</span>
          <span>x24 · 20% OFF</span>
        </div>
      </div>
      <div className="hero-carousel-dots" aria-hidden="true">
        <span className="active" />
        <span />
        <span />
      </div>
    </section>
  );
}
