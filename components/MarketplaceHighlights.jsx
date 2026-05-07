const highlights = [
  'Envío gratis',
  'Más vendidos',
  'Menos de $20.000',
  'Medios de pago',
  'Packs recomendados',
];

export default function MarketplaceHighlights() {
  return (
    <section className="highlights-grid">
      {highlights.map((item) => (
        <article key={item} className="highlight-item card">
          <h3>{item}</h3>
          <p>Descubrí opciones ideales para tu próxima compra cervecera.</p>
        </article>
      ))}
    </section>
  );
}
