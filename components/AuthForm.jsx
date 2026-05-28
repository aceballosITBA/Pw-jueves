"use client";
import { useState } from 'react';
import { persistAuth } from './auth-utils';
import GoogleLoginButton from './GoogleLoginButton';

export default function AuthForm({
  title = 'Ingresar',
  description = 'Usá tu cuenta para continuar con el pedido.',
  submitLabel = 'Continuar',
  onSuccess,
  onCancel,
  compact = false,
  defaultMode = 'login',
  showGoogleLogin = true,
  showTabs = true,
  showHeader = true,
  googlePlacement = 'bottom'
}) {
  const [mode, setMode] = useState(defaultMode);
  const [step, setStep] = useState('email');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();
    const cleanName = name.trim();

    if (step === 'email') {
      if (!cleanEmail) {
        setError('Ingresá tu email.');
        return;
      }
      setError('');
      setStep('password');
      return;
    }

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
      {showHeader ? (
        <header className={compact ? 'auth-header compact' : 'auth-header'}>
          <p className="eyebrow">Baum</p>
          <h2>{title}</h2>
          <p>{description}</p>
        </header>
      ) : null}

      <form className="auth-form" onSubmit={handleSubmit}>
        {step === 'email' ? (
          <label>
            Email
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@email.com" autoComplete="email" />
          </label>
        ) : (
          <>
            <div className="auth-email-summary">
              <span>Correo</span>
              <strong>{email}</strong>
              <button type="button" className="auth-change-email" onClick={() => setStep('email')}>Cambiar</button>
            </div>
            <label>
              Contraseña
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" autoComplete={mode === 'create' ? 'new-password' : 'current-password'} />
            </label>
          </>
        )}

        {error ? <p className="auth-error">{error}</p> : null}

        <div className="modal-actions auth-actions">
          {onCancel ? <button type="button" className="btn ghost" onClick={onCancel}>Cancelar</button> : <span />}
          <button type="submit" className="btn primary">{step === 'email' ? 'Continuar' : submitLabel}</button>
        </div>
      </form>

      {showGoogleLogin && googlePlacement === 'bottom' ? (
        <div className="auth-google-bottom">
          <div className="auth-google-separator"><span>o</span></div>
          <GoogleLoginButton onSuccess={onSuccess} compact={compact} />
        </div>
      ) : null}
    </div>
  );
}
