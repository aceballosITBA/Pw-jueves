import Link from 'next/link';

const baseHighlights = [
  {
    title: 'Más vendidos',
    copy: 'Las variedades favoritas del momento.',
    href: '/latas',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
        <polyline points="17 6 23 6 23 12" />
      </svg>
    ),
  },
  {
    title: 'Envíos',
    copy: 'Despacho rápido a todo el país.',
    href: '/cart',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13" rx="1" />
        <path d="M16 8h4l3 5v3h-7V8z" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    ),
  },
  {
    title: 'Métodos de pago',
    copy: 'Tarjetas, transferencia y débito.',
    href: '/checkout',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
        <line x1="1" y1="10" x2="23" y2="10" />
      </svg>
    ),
  },
];

const getBestPromo = (products = []) => {
  const offers = products.flatMap((product) => {
    const basePrice = product.pricePack6;
    return [
      { product, pack: 12, discountRate: 0.1, savings: basePrice * 0.1, promoPrice: Math.round(basePrice * 0.9 * 2) },
      { product, pack: 24, discountRate: 0.2, savings: basePrice * 0.2, promoPrice: Math.round(basePrice * 0.8 * 4) },
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
  const promoLabel = bestPromo
    ? `x${bestPromo.pack} con -${Math.round(bestPromo.discountRate * 100)}% en ${bestPromo.product.name}.`
    : 'Ahorro por volumen en packs.';
  const highlights = [
    ...baseHighlights,
    {
      title: 'Packs con descuento',
      copy: promoLabel,
      href: '/latas',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
          <line x1="7" y1="7" x2="7.01" y2="7" />
        </svg>
      ),
    },
  ];

  return (
    <section className="highlights-strip">
      {highlights.map((item) => (
        <Link key={item.title} href={item.href} className="highlight-item highlight-item-link">
          <div className="highlight-icon">{item.icon}</div>
          <div>
            <h3>{item.title}</h3>
            <p>{item.copy}</p>
          </div>
        </Link>
      ))}
    </section>
  );
}
