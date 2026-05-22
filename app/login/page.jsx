"use client";
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Footer from '../../components/Footer';
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
        <section className="auth-hero card">
          <div>
            <p className="eyebrow">Baum</p>
            <h1>Ingresá para seguir con tu compra</h1>
            <p>Accedé a tu historial, completá el checkout y recuperá tu pedido en cualquier momento.</p>
          </div>
          <div className="auth-hero-badges">
            <span>Checkout rápido</span>
            <span>Historial de pedidos</span>
            <span>Seguridad local</span>
          </div>
        </section>

        <section className="auth-grid">
          <div className="card auth-info-card">
            {user ? (
              <div className="auth-session-card">
                <p className="eyebrow">Sesión activa</p>
                <h2>{user.name}</h2>
                <p>{user.email}</p>
                <div className="auth-session-actions">
                  <button className="btn primary" onClick={() => router.push(nextPath)}>Continuar</button>
                  <button className="btn ghost" onClick={handleLogout}>Cerrar sesión</button>
                </div>
              </div>
            ) : (
              <AuthForm
                title="Entrar o crear cuenta"
                description="Usá el mismo flujo que el checkout para guardar tus datos."
                submitLabel="Entrar"
                onSuccess={handleSuccess}
              />
            )}
          </div>

          <div className="card auth-side-card">
            <h3>Qué obtenés</h3>
            <ul>
              <li>Confirmación inmediata del pedido.</li>
              <li>Acceso al historial y al detalle por pedido.</li>
              <li>Flujo listo para conectar Mercado Pago después.</li>
            </ul>
            <p>
              <Link href={nextPath}>Volver al checkout</Link>
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
