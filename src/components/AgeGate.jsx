export default function AgeGate({ onConfirm }) {
  return (
    <section className="age-gate-overlay" role="dialog" aria-modal="true" aria-label="Validación de edad">
      <div className="age-gate-card">
        <p className="age-gate-tag">Ingreso exclusivo +18</p>
        <h1>Bienvenido a la experiencia Baum Beer Store</h1>
        <p>Validamos tu edad para mostrarte una tienda premium de cervezas artesanales con promociones y packs especiales.</p>
        <button type="button" className="age-gate-button" onClick={onConfirm}>
          Confirmar mayoría de edad
        </button>
      </div>
    </section>
  );
}
