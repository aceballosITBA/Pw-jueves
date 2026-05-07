const highlights = [
  { title: 'Envíos', icon: '🚚', copy: 'Despacho rápido a todo el país.' },
  { title: 'Métodos de pago', icon: '💳', copy: 'Tarjetas, transferencia y débito.' },
  { title: 'Más vendidos', icon: '🔥', copy: 'Las variedades favoritas del momento.' },
  { title: 'Packs destacados', icon: '📦', copy: 'Ahorro por volumen en packs.' },
];

export default function MarketplaceHighlights() {
  return <section className="highlights-grid">{highlights.map((item) => <article key={item.title} className="highlight-item"><button type="button" className="highlight-icon" aria-label={item.title}>{item.icon}</button><div><h3>{item.title}</h3><p>{item.copy}</p></div></article>)}</section>;
}
