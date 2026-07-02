export default function Footer() {
  return (
    <footer className="ecommerce-footer">
      <div className="footer-top">
        <section className="footer-col">
          <h4>Categorías</h4>
          <a href="/latas?style=Rubia">Rubias</a>
          <a href="/latas?style=IPA">IPA</a>
          <a href="/latas?style=Negra">Negras</a>
        </section>

        <section className="footer-col">
          <h4>Contactanos</h4>
          <p>WhatsApp · 54-115-708-4665</p>
          <p>Teléfono · 54-115-708-4665</p>
          <p>griseballos@hotmail.com</p>
        </section>

        <section className="footer-col footer-social">
          <h4>Sigamos conectados</h4>
          <div className="social-row" aria-label="Redes sociales">
            <a href="#" className="social-badge instagram" aria-label="Instagram">
              <svg viewBox="0 0 24 24" role="presentation" focusable="false" aria-hidden="true">
                <rect x="3.2" y="3.2" width="17.6" height="17.6" rx="5" ry="5" fill="none" stroke="currentColor" strokeWidth="2" />
                <circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" strokeWidth="2" />
                <circle cx="17.4" cy="6.7" r="1.2" fill="currentColor" />
              </svg>
            </a>
            <a href="#" className="social-badge facebook" aria-label="Facebook">
              <svg viewBox="0 0 24 24" role="presentation" focusable="false" aria-hidden="true">
                <path d="M13.6 21v-8h2.8l.4-3.1h-3.2V7.9c0-.9.3-1.5 1.6-1.5h1.7V3.6c-.8-.1-1.7-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.1H7.4V13h2.8v8h3.4z" fill="currentColor" />
              </svg>
            </a>
          </div>
        </section>
      </div>

      <div className="footer-divider" />

      <div className="footer-bottom">
        <small>Copyright Cerveza Baum - 2026. Todos los derechos reservados.</small>
        <small>Defensa de las y los consumidores. Para reclamos ingresá acá. / Botón de arrepentimiento</small>
      </div>
    </footer>
  );
}
