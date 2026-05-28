"use client";
import { useEffect, useRef, useState } from 'react';
import { decodeGoogleCredential, persistAuth } from './auth-utils';

const GOOGLE_SCRIPT_ID = 'google-identity-services';

function loadGoogleScript() {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      resolve(null);
      return;
    }

    if (window.google?.accounts?.id) {
      resolve(window.google);
      return;
    }

    const existing = document.getElementById(GOOGLE_SCRIPT_ID);
    if (existing) {
      existing.addEventListener('load', () => resolve(window.google));
      existing.addEventListener('error', reject);
      return;
    }

    const script = document.createElement('script');
    script.id = GOOGLE_SCRIPT_ID;
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(window.google);
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

export default function GoogleLoginButton({ onSuccess, className = '', compact = false }) {
  const buttonRef = useRef(null);
  const [status, setStatus] = useState('idle');
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  useEffect(() => {
    let cancelled = false;

    if (!clientId) {
      setStatus('missing-config');
      return () => {
        cancelled = true;
      };
    }

    const renderButton = async () => {
      try {
        const google = await loadGoogleScript();
        if (cancelled || !google?.accounts?.id || !buttonRef.current) return;

        google.accounts.id.initialize({
          client_id: clientId,
          callback: (response) => {
            const payload = decodeGoogleCredential(response?.credential || '');
            if (!payload?.email) {
              setStatus('error');
              return;
            }

            const user = {
              name: payload.name || payload.email.split('@')[0] || 'Usuario',
              email: payload.email,
              picture: payload.picture || '',
              provider: 'google',
              googleId: payload.sub || ''
            };

            persistAuth(user);
            setStatus('ready');
            onSuccess?.(user);
          }
        });

        google.accounts.id.renderButton(buttonRef.current, {
          theme: 'outline',
          size: compact ? 'medium' : 'large',
          shape: 'pill',
          width: compact ? 280 : 360,
          text: 'continue_with',
          logo_alignment: 'left'
        });

        setStatus('ready');
      } catch (error) {
        if (!cancelled) setStatus('error');
      }
    };

    renderButton();

    return () => {
      cancelled = true;
    };
  }, [clientId, compact, onSuccess]);

  if (!clientId) {
    return (
      <button type="button" className={`google-login-fallback google-login-real ${className}`.trim()}>
        <svg className="google-login-mark" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path fill="#EA4335" d="M12 10.2v3.95h5.58c-.23 1.43-1.6 4.19-5.58 4.19a6.5 6.5 0 1 1 0-13c1.86 0 3.11.8 3.83 1.48l2.61-2.52C16.87 3 14.7 2 12 2 6.48 2 2 6.48 2 12s4.48 10 10 10c5.7 0 9.47-4 9.47-9.64 0-.65-.07-1.14-.15-1.63H12Z"/>
          <path fill="#34A853" d="M3.69 8.72l3.02 2.21A6.51 6.51 0 0 1 12 5.5c1.37 0 2.62.44 3.65 1.18l2.73-2.62C16.88 2.91 14.72 2 12 2 7.58 2 3.8 4.82 2.22 8.72h1.47Z"/>
          <path fill="#FBBC05" d="M2.06 12c0 .63.09 1.24.23 1.83H4.9a6.5 6.5 0 0 1-.08-1.03c0-.35.03-.7.08-1.03H2.29c-.15.58-.23 1.2-.23 1.83Z"/>
          <path fill="#4285F4" d="M12 22c2.72 0 4.98-.9 6.62-2.44l-3.07-2.38c-.84.58-1.9.92-3.55.92a6.5 6.5 0 0 1-6.05-4.17H2.29A10 10 0 0 0 12 22Z"/>
        </svg>
        <span>Iniciar sesión con Google</span>
      </button>
    );
  }

  return (
    <div className={`google-login ${className}`.trim()}>
      <div ref={buttonRef} className="google-login-slot" />
    </div>
  );
}
