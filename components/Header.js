import Link from 'next/link';

export default function Header() {
  return (
    <header className="header">
      <div className="container">
        <h2>Baum Latas 473 ml</h2>
        <nav>
          <Link href="/">Home</Link> | <Link href="/catalogo">Catálogo</Link>
        </nav>
      </div>
    </header>
  );
}
