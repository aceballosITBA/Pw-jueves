export default function AgeGate({ onConfirm }) {
  return (
    <section className="age-gate-overlay" role="dialog" aria-modal="true" aria-label="Validación de edad">
      <div className="age-gate-card">
        <p className="age-gate-tag">Venta exclusiva para mayores de edad</p>
        <h1>¿Sos mayor de 18 años?</h1>
        <p>Necesitamos confirmar tu edad para mostrar la tienda de Baum Beer Store.</p>
        <button type="button" className="age-gate-button" onClick={onConfirm}>
          Sí, soy mayor de 18 años
        </button>
      </div>
    </section>
  );
}
