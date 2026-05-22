"use client";
import { useState } from 'react';

export default function CheckoutAuthModal({ open, onClose, onAuthed }) {
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!open) return null;

  const handleSubmit = (event) => {
    event.preventDefault();
    const user = mode === 'create'
      ? { name: name.trim(), email: email.trim() }
      : { name: email.split('@')[0] || 'Usuario', email: email.trim() };

    try {
      localStorage.setItem('auth_user', JSON.stringify(user));
      localStorage.setItem('auth_session', '1');
      window.dispatchEvent(new Event('auth:updated'));
    } catch (e) {
      // ignore
    }

    onAuthed(user);
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-card card auth-modal">
        <header className="modal-header">
          <h3>Antes de continuar</h3>
          <p className="auth-modal-copy">Iniciá sesión o creá una cuenta para seguir con el pago.</p>
        </header>

        <div className="auth-tabs">
          <button type="button" className={mode === 'login' ? 'auth-tab active' : 'auth-tab'} onClick={() => setMode('login')}>Iniciar sesión</button>
          <button type="button" className={mode === 'create' ? 'auth-tab active' : 'auth-tab'} onClick={() => setMode('create')}>Crear usuario</button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === 'create' ? (
            <label>
              Nombre
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Tu nombre" required />
            </label>
          ) : null}
          <label>
            Email
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@email.com" required />
          </label>
          <label>
            Contraseña
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
          </label>

          <div className="modal-actions">
            <div className="modal-buttons">
              <button type="button" className="btn ghost" onClick={onClose}>Cancelar</button>
              <button type="submit" className="btn primary">Continuar</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
