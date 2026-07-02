"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabase/client';
import { persistSupabaseAuth } from './auth-utils';
import GoogleLoginButton from './GoogleLoginButton';

export default function AuthForm({
  onSuccess,
  onCancel,
  compact = false,
  defaultMode = 'login',
  showGoogleLogin = true,
  showTabs = true,
  showHeader = true,
  googlePlacement = 'bottom'
}) {
  const router = useRouter();
  const [mode, setMode] = useState(defaultMode);
  const title = mode === 'create' ? 'Crear cuenta' : 'Ingresar';
  const description = mode === 'create' ? 'Completá tus datos para registrarte.' : 'Ingresá tu email para continuar.';
  const submitLabel = mode === 'create' ? 'Crear cuenta' : 'Ingresar';
  const [step, setStep] = useState('email');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
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

    setLoading(true);
    setError('');

    try {
      const authResult = mode === 'create'
        ? await supabase.auth.signUp({
          email: cleanEmail,
          password: cleanPassword,
          options: { data: { name: cleanName } }
        })
        : await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: cleanPassword
        });

      const sessionUser = authResult.data?.user;
      if (!sessionUser) {
        setError(mode === 'create' ? 'Revisá tu correo para confirmar la cuenta.' : 'No pudimos iniciar sesión.');
        return;
      }

      const mappedUser = persistSupabaseAuth(sessionUser);
      onSuccess?.(mappedUser);
    } catch (authError) {
      setError(authError?.message || 'No pudimos iniciar sesión.');
    } finally {
      setLoading(false);
    }
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
            {mode === 'create' && (
              <label>
                Nombre
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Tu nombre" autoComplete="name" />
              </label>
            )}
            <label>
              Contraseña
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" autoComplete={mode === 'create' ? 'new-password' : 'current-password'} />
            </label>
          </>
        )}

        {error ? <p className="auth-error">{error}</p> : null}

        <div className="modal-actions auth-actions">
          {onCancel ? <button type="button" className="btn ghost" onClick={onCancel}>Cancelar</button> : <span />}
          <button type="submit" className="btn primary" disabled={loading}>{step === 'email' ? 'Continuar' : submitLabel}</button>
        </div>
      </form>

      <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '.93rem', color: 'var(--muted)' }}>
        {mode === 'login' ? (
          <>¿No tenés cuenta?{' '}
            <button type="button" className="auth-change-email" onClick={() => { setMode('create'); setStep('email'); setError(''); }}>
              Crear una
            </button>
          </>
        ) : (
          <>¿Ya tenés cuenta?{' '}
            <button type="button" className="auth-change-email" onClick={() => { setMode('login'); setStep('email'); setError(''); }}>
              Ingresar
            </button>
          </>
        )}
      </p>

      {showGoogleLogin && googlePlacement === 'bottom' ? (
        <div className="auth-google-bottom">
          <div className="auth-google-separator"><span>o</span></div>
          <GoogleLoginButton onSuccess={onSuccess} compact={compact} />
        </div>
      ) : null}
    </div>
  );
}
