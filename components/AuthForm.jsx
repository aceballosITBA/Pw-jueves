"use client";
import { useState } from 'react';
import { persistAuth } from './auth-utils';

export default function AuthForm({
  title = 'Ingresar',
  description = 'Usá tu cuenta para continuar con el pedido.',
  submitLabel = 'Continuar',
  onSuccess,
  onCancel,
  compact = false,
  defaultMode = 'login'
}) {
  const [mode, setMode] = useState(defaultMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();
    const cleanName = name.trim();

    if (!cleanEmail || !cleanPassword) {
      setError('Completá email y contraseña.');
      return;
    }

    if (mode === 'create' && !cleanName) {
      setError('Completá tu nombre.');
      return;
    }

    const user = {
      name: cleanName || cleanEmail.split('@')[0] || 'Usuario',
      email: cleanEmail
    };

    persistAuth(user);
    setError('');
    onSuccess?.(user);
  };

  return (
    <div className={compact ? 'auth-inline' : 'auth-shell'}>
      <header className={compact ? 'auth-header compact' : 'auth-header'}>
        <p className="eyebrow">Baum</p>
        <h2>{title}</h2>
        <p>{description}</p>
      </header>

      <div className="auth-tabs">
        <button type="button" className={mode === 'login' ? 'auth-tab active' : 'auth-tab'} onClick={() => setMode('login')}>Iniciar sesión</button>
        <button type="button" className={mode === 'create' ? 'auth-tab active' : 'auth-tab'} onClick={() => setMode('create')}>Crear usuario</button>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        {mode === 'create' ? (
          <label>
            Nombre
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Tu nombre" autoComplete="name" />
          </label>
        ) : null}
        <label>
          Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@email.com" autoComplete="email" />
        </label>
        <label>
          Contraseña
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" autoComplete={mode === 'create' ? 'new-password' : 'current-password'} />
        </label>

        {error ? <p className="auth-error">{error}</p> : null}

        <div className="modal-actions auth-actions">
          {onCancel ? <button type="button" className="btn ghost" onClick={onCancel}>Cancelar</button> : <span />}
          <button type="submit" className="btn primary">{submitLabel}</button>
        </div>
      </form>
    </div>
  );
}
