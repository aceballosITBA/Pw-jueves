"use client";
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import AuthForm from '../../components/AuthForm';
import { clearAuth, readAuthUser } from '../../components/auth-utils';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get('next') || '/mi-cuenta';
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(readAuthUser());
  }, []);

  const handleSuccess = () => {
    setUser(readAuthUser());
    router.push(nextPath);
  };

  const handleLogout = () => {
    clearAuth();
    setUser(null);
  };

  return (
    <div className="app-container auth-page">
      <main>
        <section className="auth-marketplace-shell auth-marketplace-shell-grid">
          <div className="auth-marketplace-copy auth-marketplace-copy-login">
            <p className="eyebrow">Baum</p>
            <h1>Ingresá tu e-mail para iniciar sesión</h1>
          </div>

          <section className="auth-marketplace-single card">
            {user ? (
              <div className="auth-session-card auth-session-card-compact">
                <p className="eyebrow">Baum</p>
                <h1>Ingresaste correctamente</h1>
                <p>{user.name} · {user.email}</p>
                <div className="auth-session-actions">
                  <button className="btn primary" onClick={() => router.push(nextPath)}>Continuar</button>
                  <button className="btn ghost" onClick={handleLogout}>Cerrar sesión</button>
                </div>
              </div>
            ) : (
              <AuthForm
                title="Ingresá a tu cuenta"
                description="Primero tu email, después la contraseña."
                submitLabel="Ingresar"
                onSuccess={handleSuccess}
                showHeader={true}
                showTabs={false}
                showGoogleLogin={true}
                googlePlacement="bottom"
              />
            )}
          </section>
        </section>
      </main>
    </div>
  );
}
