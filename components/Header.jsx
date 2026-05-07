export default function Header() {
  return (
    <header className="header ecommerce-header">
      <div className="brand-wrap">
        <div className="brand">Bound</div>
      </div>

      <input className="header-search" type="text" placeholder="Buscar por estilo, aroma o nombre de cerveza" readOnly />

      <nav className="header-nav" aria-label="Navegación principal">
        <a href="#catalogo">Latas</a>
        <a href="#historia">Historia</a>
        <a href="#ofertas">Ofertas</a>
      </nav>

      <div className="header-actions" aria-label="Accesos">
        <a href="#">Mi cuenta</a>
        <a href="#">Carrito</a>
      </div>
    </header>
  );
}
