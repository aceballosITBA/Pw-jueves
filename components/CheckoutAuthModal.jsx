"use client";
import AuthForm from './AuthForm';

export default function CheckoutAuthModal({ open, onClose, onAuthed }) {
  if (!open) return null;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-card card auth-modal">
        <AuthForm
          title="Ingresá para terminar tu compra"
          description="Usá Google o tu email para continuar con el checkout sin perder el pedido."
          submitLabel="Continuar"
          onCancel={onClose}
          onSuccess={onAuthed}
          compact
          showTabs={false}
          showHeader={true}
          showGoogleLogin={true}
        />
      </div>
    </div>
  );
}
