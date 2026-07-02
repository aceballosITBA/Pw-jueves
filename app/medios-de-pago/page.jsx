import Link from 'next/link';
import Footer from '../../components/Footer';

const methods = [
  {
    name: 'Mercado Pago',
    description: 'Pagá con tarjeta de crédito, débito, saldo de cuenta MP o código QR. Cuotas sin interés disponibles según banco emisor.',
    badges: ['Visa', 'Mastercard', 'American Express', 'Cabal', 'Naranja'],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="32" height="32">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
        <line x1="1" y1="10" x2="23" y2="10" />
      </svg>
    ),
  },
  {
    name: 'Transferencia bancaria',
    description: 'Transferí directamente a nuestra cuenta. El pedido se confirma una vez acreditado el pago (hasta 2 hs hábiles).',
    badges: ['CBU / CVU', 'Alias', 'Banco a banco'],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="32" height="32">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
      </svg>
    ),
  },
  {
    name: 'Débito inmediato',
    description: 'Pago instantáneo con tarjeta de débito a través de Mercado Pago. Sin comisiones adicionales.',
    badges: ['Visa Débito', 'Mastercard Débito'],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="32" height="32">
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
        <line x1="12" y1="18" x2="12.01" y2="18" />
      </svg>
    ),
  },
];

const security = [
  { title: 'HTTPS', desc: 'Toda la comunicación está cifrada con certificado SSL.' },
  { title: 'Sin almacenamiento de tarjetas', desc: 'No guardamos datos de tarjetas. El procesamiento lo hace Mercado Pago.' },
  { title: 'Datos protegidos', desc: 'Tu información personal se maneja según la Ley 25.326 de protección de datos.' },
];

export default function MediosDePagoPage() {
  return (
    <div className="app-container">
      <main>
        <section className="card pagos-hero">
          <p className="eyebrow">Pagos</p>
          <h1>Métodos de pago</h1>
          <p>Aceptamos múltiples formas de pago para que tu compra sea simple y segura.</p>
        </section>

        <section className="pagos-grid">
          {methods.map((m) => (
            <article key={m.name} className="card pago-card">
              <div className="pago-icon">{m.icon}</div>
              <h2 className="pago-name">{m.name}</h2>
              <p className="pago-desc">{m.description}</p>
              <div className="pago-badges">
                {m.badges.map((b) => <span key={b} className="payment-badge">{b}</span>)}
              </div>
            </article>
          ))}
        </section>

        <section className="card pagos-seguridad">
          <h2>Pago 100% seguro</h2>
          <div className="seguridad-grid">
            {security.map((s) => (
              <div key={s.title} className="seguridad-item">
                <strong>{s.title}</strong>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
          <Link className="btn primary" href="/checkout" style={{ marginTop: '1.5rem', display: 'inline-flex' }}>
            Ir al checkout
          </Link>
        </section>
      </main>
      <Footer />
    </div>
  );
}
