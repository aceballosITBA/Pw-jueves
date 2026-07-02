import Footer from '../../components/Footer';

export default function HistoriaPage() {
  return (
    <div className="historia-page">
      <div className="historia-banner">
        <h1 className="historia-banner-title">QUIENES SOMOS</h1>
      </div>

      <div className="historia-content">
        <section className="historia-section">
          <h2 className="historia-section-title">HISTORIA</h2>
          <div className="historia-section-body">
            <p>Baum es una Cervecería Artesanal Marplatense que comenzó a elaborar su producción en 2009, momento en el que se visualizaba el auge por la Cerveza Artesanal tanto a nivel local como nacional a través de los primeros lugares abiertos con este tipo de propuesta.</p>
            <p>El proyecto surge por aventurarse a descubrir y conocer la elaboración de un producto que me venía cautivando; la conexión con un Homebrewer terminó de darle forma a esta iniciativa-proyecto, y junto a él, fundamos Baum, (árbol en alemán), nombre de la Marca que sigue creciendo y posicionándose en el mercado artesanal con una calidad reconocida por los consumidores y público calificado.</p>
            <p>En Baum nos inspiramos en estilos de diferentes partes del mundo. Diseñamos nuestras cervezas aplicando conocimiento y respetando la tradición en los procesos. Utilizamos los sentidos para evaluarlas y luego las compartimos con amigos, colegas y clientes.</p>
            <p>Varias razones nos inspiran a producir cervezas: lo disfrutamos, nos divertimos, jugamos y gozamos compartirlas.</p>
            <div className="historia-firma">
              <strong>Leonardo Luffi</strong>
              <span>Fundador</span>
            </div>
          </div>
        </section>

        <div className="historia-divider" />

        <section className="historia-section">
          <h2 className="historia-section-title">MISION</h2>
          <div className="historia-section-body">
            <p>Nos esforzamos para que cada cerveza producida sea reflejo de dedicación, compromiso y orgullo diario de todo nuestro equipo de trabajo.</p>
          </div>
        </section>

        <div className="historia-divider" />

        <section className="historia-section">
          <h2 className="historia-section-title">VISION</h2>
          <div className="historia-section-body">
            <p>Aspiramos a ser los Artesanos Cerveceros Marplatenses líderes en generar experiencias únicas, brindándole a la comunidad nuestra calidad humana, fusionando la cerveza con el arte y la cultura.</p>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
