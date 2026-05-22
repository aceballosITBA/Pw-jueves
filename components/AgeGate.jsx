"use client";
import { useState } from 'react';

export default function AgeGate({ onConfirm }) {
  const [denied, setDenied] = useState(false);

  const handleExit = () => {
    window.location.replace('about:blank');
  };

  return (
    <section className="age-gate-overlay" role="dialog" aria-modal="true" aria-label="Validación de edad">
      <div className="age-gate-bg" aria-hidden="true" />
      <div className="age-gate-card">
        {!denied ? (
          <>
            <p className="age-gate-tag">BAUM</p>
            <h1>¿Sos mayor de 18 años?</h1>
            <p className="age-gate-copy">Si soy mayor de 18 años, entro a la aplicación. Si no, salgo.</p>
            <div className="age-gate-actions">
              <button
                type="button"
                className="age-gate-button"
                onClick={() => {
                  try { sessionStorage.setItem('age_verified', '1'); window.dispatchEvent(new Event('age:updated')); } catch (e) {}
                  onConfirm();
                }}
              >
                Sí, soy mayor de 18
              </button>
              <button type="button" className="age-gate-button ghost" onClick={handleExit}>No, salir</button>
            </div>
          </>
        ) : (
          <>
            <p className="age-gate-tag">Acceso restringido</p>
            <h1>Lo sentimos</h1>
            <p className="age-gate-copy">Para ingresar a BAUN necesitás ser mayor de 18 años.</p>
            <div className="age-gate-actions">
              <button type="button" className="age-gate-button ghost" onClick={handleExit}>Salir de la aplicación</button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
