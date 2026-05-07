"use client";
import { useState } from 'react';

export default function AgeGate({ onConfirm }) {
  const [denied, setDenied] = useState(false);

  return (
    <section className="age-gate-overlay" role="dialog" aria-modal="true" aria-label="Validación de edad">
      <div className="age-gate-bg" aria-hidden="true" />
      <div className="age-gate-card">
        {!denied ? (
          <>
            <p className="age-gate-tag">Baum Beer Store</p>
            <h1>¿Sos mayor de 18 años?</h1>
            <p className="age-gate-copy">El contenido de este sitio está destinado únicamente a mayores de edad.</p>
            <div className="age-gate-actions">
              <button type="button" className="age-gate-button" onClick={onConfirm}>Sí, soy mayor de 18</button>
              <button type="button" className="age-gate-button ghost" onClick={() => setDenied(true)}>No, salir</button>
            </div>
          </>
        ) : (
          <>
            <p className="age-gate-tag">Acceso restringido</p>
            <h1>Lo sentimos</h1>
            <p className="age-gate-copy">Para ingresar a Baum Beer Store necesitás ser mayor de 18 años.</p>
          </>
        )}
      </div>
    </section>
  );
}
