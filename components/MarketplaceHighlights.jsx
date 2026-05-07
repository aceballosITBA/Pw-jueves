const highlights = [
  { title: 'Envío gratis', icon: '🚚' },
  { title: 'Más vendidos', icon: '🔥' },
  { title: 'Menos de $20.000', icon: '💸' },
  { title: 'Medios de pago', icon: '💳' },
  { title: 'Packs recomendados', icon: '📦' },
];

export default function MarketplaceHighlights() {
  return (
    <section className="highlights-grid" aria-label="Beneficios destacados">
      {highlights.map((item) => (
        <article key={item.title} className="highlight-item">
          <span className="highlight-icon" aria-hidden="true">{item.icon}</span>
          <div>
            <h3>{item.title}</h3>
            <p>Opciones pensadas para comprar mejor y recibir rápido.</p>
          </div>
        </article>
      ))}
    </section>
  );
}
