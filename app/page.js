import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <section className="hero container">
          <h1>Tienda de Cervezas Artesanales Baum en Lata</h1>
          <p>
            Catálogo simple para mostrar estilos, datos técnicos y armar pedidos básicos por packs de 6, 12 y 24 unidades.
          </p>
          <Link href="/catalogo" className="btn">Ir al catálogo</Link>
          <p className="notice">Venta exclusiva para mayores de 18 años. Beber con moderación.</p>
        </section>
      </main>
      <Footer />
    </>
  );
}
