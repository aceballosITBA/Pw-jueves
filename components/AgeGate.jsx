"use client";

export default function AgeGate({ onConfirm }) {
  return (
    <section className="age-gate-overlay" role="dialog" aria-modal="true" aria-label="Validación de edad">
      <div className="age-gate-glow" aria-hidden="true" />
      <div className="age-gate-card">
        <p className="age-gate-tag">Ingreso exclusivo +18</p>
        <h1>Baum Beer Store</h1>
        <p className="age-gate-question">¿Sos mayor de 18 años?</p>
        <p className="age-gate-copy">Esta tienda comercializa bebidas alcohólicas. Confirmá tu edad para continuar.</p>
        <button type="button" className="age-gate-button" onClick={onConfirm}>
          Sí, soy mayor de 18
        </button>
      </div>
    </section>
  );
}
