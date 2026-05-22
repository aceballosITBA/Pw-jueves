import Footer from '../../components/Footer';

const milestones = [
  { year: '2015', title: 'Primeras recetas', copy: 'Nacen los primeros lotes de prueba con foco en balance, tomabilidad y carácter artesanal.' },
  { year: '2019', title: 'Crecimiento de la marca', copy: 'Baum consolida una identidad propia y una propuesta más amplia de estilos y packs.' },
  { year: '2026', title: 'Experiencia digital', copy: 'La tienda se vuelve un punto de entrada para conocer la historia, comparar estilos y preparar pedidos.' },
];

const values = [
  { title: 'Calidad primero', copy: 'Cada receta prioriza materia prima, control y consistencia en cada tirada.' },
  { title: 'Cultura cervecera', copy: 'La marca acerca estilos clásicos y modernos con lenguaje simple y contenido claro.' },
  { title: 'Momentos compartidos', copy: 'Todo está pensado para picadas, reuniones y experiencias de consumo con identidad.' },
];

export default function HistoriaPage() {
  return (
    <div className="app-container">
      <main>
        <section className="history-hero card">
          <div>
            <p className="eyebrow">Nuestra historia</p>
            <h1>Baum y la cultura cervecera</h1>
            <p>Baum nace desde la idea de que cada cerveza artesanal puede contar una historia: del productor, de la receta y del momento en que se comparte.</p>
          </div>
          <div className="history-hero-note">
            <h2>Una marca para contar mejor</h2>
            <p>La tienda queda preparada para sumar contenidos, notas de proceso, lanzamientos y relatos por estilo sin rehacer la estructura.</p>
          </div>
        </section>

        <section className="history-grid">
          {values.map((item) => (
            <article key={item.title} className="card history-card">
              <h2>{item.title}</h2>
              <p>{item.copy}</p>
            </article>
          ))}
        </section>

        <section className="card history-timeline">
          <div className="section-head">
            <h2>Hitos de la marca</h2>
            <p>Una base lista para ir agregando fechas, lanzamientos y cambios de identidad.</p>
          </div>
          <div className="timeline-list">
            {milestones.map((item) => (
              <article key={item.year} className="timeline-item">
                <p className="timeline-year">{item.year}</p>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.copy}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
