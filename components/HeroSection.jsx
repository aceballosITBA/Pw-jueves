export default function HeroSection() {
  return (
    <section className="hero-section card" aria-label="Banner principal">
      <div className="hero-overlay" />
      <div className="hero-content">
        <p className="hero-chip">Tienda premium de cervezas artesanales</p>
        <h2>Sabores de fábrica, experiencia de marketplace</h2>
        <p className="hero-lead">Comprá latas y packs con precios por volumen, envíos rápidos y selección curada estilo Baum.</p>
        <div className="hero-deals">
          <span>x12 · 15% OFF</span>
          <span>x24 · 20% OFF</span>
          <span>Envío gratis desde 2 packs</span>
        </div>
        <a href="#catalogo" className="hero-cta">Ver catálogo completo</a>
      </div>
      <div className="hero-carousel-dots" aria-hidden="true">
        <span className="active" />
        <span />
        <span />
      </div>
    </section>
  );
}
