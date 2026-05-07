"use client";

const packOptions = [6, 12, 24];

function formatCurrency(value) {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(value);
}

export default function PackSelector({ product, selectedPack, onPackChange }) {
  if (!product) {
    return null;
  }

  const selectedPrice = (product.pricePack6 / 6) * selectedPack;

  return (
    <section className="card">
      <h2>Seleccionar pack</h2>
      <div className="pack-buttons">
        {packOptions.map((pack) => (
          <button
            key={pack}
            type="button"
            className={pack === selectedPack ? 'active' : ''}
            onClick={() => onPackChange(pack)}
          >
            x{pack}
          </button>
        ))}
      </div>
      <p><strong>Total pack x{selectedPack}:</strong> {formatCurrency(selectedPrice)}</p>
    </section>
  );
}
