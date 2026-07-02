import Footer from '../../components/Footer';

const carriers = [
  {
    name: 'Correo Argentino',
    time: '3–7 días hábiles',
    cost: 'Desde $2.500',
    zones: 'Todo el país',
    description: 'Cobertura nacional completa. Ideal para zonas remotas y localidades pequeñas del interior.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="32" height="32">
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.01 1.22 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z" />
      </svg>
    ),
  },
  {
    name: 'Andreani',
    time: '1–3 días hábiles',
    cost: 'Desde $3.200',
    zones: 'AMBA y principales ciudades',
    description: 'Distribución express en AMBA y las principales ciudades del interior. Seguimiento en tiempo real.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="32" height="32">
        <rect x="1" y="3" width="15" height="13" rx="1" />
        <path d="M16 8h4l3 5v3h-7V8z" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    ),
  },
  {
    name: 'EnvioNube',
    time: '2–5 días hábiles',
    cost: 'Desde $2.800',
    zones: 'Todo el país',
    description: 'Red integrada de transportes con múltiples puntos de entrega. Seguimiento incluido.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="32" height="32">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
];

const faqs = [
  { q: '¿Cuándo se despacha mi pedido?', a: 'Los pedidos se procesan en 24–48 hs hábiles tras la confirmación del pago.' },
  { q: '¿Hay envío gratis?', a: 'Sí, en compras mayores a $20.000 el envío es sin cargo.' },
  { q: '¿Cómo hago el seguimiento?', a: 'Te enviamos el número de seguimiento por email al momento del despacho.' },
  { q: '¿Puedo retirar en depósito?', a: 'Sí, para CABA y GBA ofrecemos retiro en depósito sin cargo. Coordiná por WhatsApp.' },
];

export default function EnviosPage() {
  return (
    <div className="app-container">
      <main>
        <section className="card envios-hero">
          <p className="eyebrow">Logística</p>
          <h1>Métodos de envío</h1>
          <p>Trabajamos con los principales operadores logísticos del país para que tu pedido llegue en tiempo y forma.</p>
          <div className="envios-highlight-row">
            <div className="envios-highlight">
              <strong>Gratis</strong>
              <span>en compras +$20.000</span>
            </div>
            <div className="envios-highlight">
              <strong>24–48 hs</strong>
              <span>tiempo de despacho</span>
            </div>
            <div className="envios-highlight">
              <strong>Tracking</strong>
              <span>seguimiento incluido</span>
            </div>
          </div>
        </section>

        <section className="envios-carriers-grid">
          {carriers.map((c) => (
            <article key={c.name} className="card envio-card">
              <div className="envio-icon">{c.icon}</div>
              <h2 className="envio-name">{c.name}</h2>
              <div className="envio-meta-row">
                <span className="envio-meta-item">⏱ {c.time}</span>
                <span className="envio-meta-item">📍 {c.zones}</span>
                <span className="envio-meta-item">💰 {c.cost}</span>
              </div>
              <p className="envio-desc">{c.description}</p>
            </article>
          ))}
        </section>

        <section className="card envios-faq">
          <h2>Preguntas frecuentes</h2>
          <div className="faq-list">
            {faqs.map((item) => (
              <div key={item.q} className="faq-item">
                <strong>{item.q}</strong>
                <p>{item.a}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
