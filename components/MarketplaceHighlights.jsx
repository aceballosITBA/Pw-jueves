const baseHighlights = [
  { title: 'Más vendidos', highlightImage: '/images/banners/beer-can.png', copy: 'Las variedades favoritas del momento.' },
  { title: 'Envíos', highlightImage: '/images/banners/box.png', copy: 'Despacho rápido a todo el país.' },
  { title: 'Métodos de pago', highlightImage: '/images/banners/hand.png', copy: 'Tarjetas, transferencia y débito.' },
];

const getBestPromo = (products = []) => {
  const offers = products.flatMap((product) => {
    const basePrice = product.pricePack6;
    return [
      {
        product,
        pack: 12,
        discountRate: 0.1,
        savings: basePrice * 0.1,
        promoPrice: Math.round(basePrice * 0.9 * 2),
      },
      {
        product,
        pack: 24,
        discountRate: 0.2,
        savings: basePrice * 0.2,
        promoPrice: Math.round(basePrice * 0.8 * 4),
      },
    ];
  });

  return offers.reduce((best, current) => {
    if (!best) return current;
    if (current.discountRate > best.discountRate) return current;
    if (current.discountRate < best.discountRate) return best;
    if (current.savings > best.savings) return current;
    if (current.savings < best.savings) return best;
    return current.promoPrice > best.promoPrice ? current : best;
  }, null);
};

export default function MarketplaceHighlights({ products = [] }) {
  const bestPromo = getBestPromo(products);
  const promoImage = '/images/banners/star.png';
  const promoLabel = bestPromo ? `Mayor descuento: x${bestPromo.pack} -${Math.round(bestPromo.discountRate * 100)}% en ${bestPromo.product.name}.` : 'Ahorro por volumen en packs.';
  const highlights = [
    ...baseHighlights,
    { title: 'Packs destacados', highlightImage: promoImage, copy: promoLabel },
  ];

  return (
    <section className="highlights-grid">
      {highlights.map((item) => (
        <article key={item.title} className="highlight-item">
          <img className="highlight-image" src={item.highlightImage} alt={item.title} />
          <div>
            <h3>{item.title}</h3>
            <p>{item.copy}</p>
          </div>
        </article>
      ))}
    </section>
  );
}
