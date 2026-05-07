const highlights = [
  { title: 'Envío gratis', icon: '🚚', copy: 'En compras seleccionadas.' },
  { title: 'Más vendidos', icon: '🔥', copy: 'Etiquetas preferidas por clientes.' },
  { title: 'Medios de pago', icon: '💳', copy: 'Tarjetas, transferencia y débito.' },
  { title: 'Packs destacados', icon: '📦', copy: 'Ahorro por volumen x12 y x24.' },
];

export default function MarketplaceHighlights() {
  return <section className="highlights-grid">{highlights.map((item) => <article key={item.title} className="highlight-item"><span className="highlight-icon">{item.icon}</span><div><h3>{item.title}</h3><p>{item.copy}</p></div></article>)}</section>;
}
