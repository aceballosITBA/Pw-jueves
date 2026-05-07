import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function HistoriaPage() {
  return (
    <div className="app-container">
      <Header />
      <main>
        <section className="card history-section">
          <h1>Historia Baum y la cultura cervecera</h1>
          <p>Baum nace desde la idea de que cada cerveza artesanal puede contar una historia: del productor, de la receta y del momento en que se comparte.</p>
          <p>La propuesta combina sabores de autor, identidad local y una experiencia de consumo premium con foco en calidad, maridaje y ritual.</p>
          <p>Esta tienda busca acercar esa experiencia con una navegación clara, selección por estilos y propuestas en packs para distintos momentos de consumo.</p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
