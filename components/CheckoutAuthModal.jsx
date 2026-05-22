"use client";
import AuthForm from './AuthForm';

export default function CheckoutAuthModal({ open, onClose, onAuthed }) {
  if (!open) return null;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-card card auth-modal">
        <AuthForm
          title="Antes de continuar"
          description="Iniciá sesión o creá una cuenta para seguir con el pago."
          submitLabel="Continuar"
          onCancel={onClose}
          onSuccess={onAuthed}
          compact
        />
      </div>
    </div>
  );
}
