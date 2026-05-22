"use client";
import React from 'react';

export default function ConfirmModal({ open, onClose, onConfirm, items = [], total = 0, primaryLabel = 'Confirmar pedido' }) {
  if (!open) return null;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-card card">
        <header className="modal-header">
          <h3>Confirmar pedido</h3>
        </header>
        <div className="modal-body">
          {items.length ? (
            <ul className="modal-items">
              {items.map((it) => (
                <li key={`${it.product.id}-${it.pack}`} className="modal-item">
                  <div className="modal-item-left">
                    {it.product.images?.[0] ? <img src={it.product.images[0]} alt={it.product.name} /> : null}
                  </div>
                  <div className="modal-item-body">
                    <div className="modal-item-title">{it.product.name}</div>
                    <div className="modal-item-meta">Pack x{it.pack} · Cantidad: {it.quantity}</div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No hay productos en el carrito.</p>
          )}
        </div>
        <footer className="modal-actions">
          <div className="modal-total">Total: <strong>{new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(total)}</strong></div>
          <div className="modal-buttons">
            <button className="btn ghost" onClick={onClose}>Cancelar</button>
            <button className="btn primary" onClick={onConfirm}>{primaryLabel}</button>
          </div>
        </footer>
      </div>
    </div>
  );
}
