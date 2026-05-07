export default function Header() {
  return (
    <header className="header ecommerce-header">
      <div className="brand">Baum Beer Store</div>
      <input className="header-search" type="text" placeholder="¿Qué querés tomar?" readOnly />
      <nav className="header-nav" aria-label="Navegación principal">
        <a href="#" onClick={(event) => event.preventDefault()}>Latas</a>
        <a href="#" onClick={(event) => event.preventDefault()}>Historia</a>
        <a href="#" onClick={(event) => event.preventDefault()}>Ofertas</a>
      </nav>
      <div className="header-actions" aria-label="Accesos">
        <a href="#" onClick={(event) => event.preventDefault()}>Mi cuenta</a>
        <a href="#" onClick={(event) => event.preventDefault()}>Carrito</a>
      </div>
    </header>
  );
}
