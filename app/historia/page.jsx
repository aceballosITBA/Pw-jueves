import Footer from '../../components/Footer';

export default function HistoriaPage() {
  return (
    <div className="app-container">
      <main>
        <section className="historia-hero card">
          <h1 className="historia-title">NOS UNE UN MISMO ESPÍRITU</h1>
          <div className="historia-body">
            <div className="historia-claim">
              <p>
                NOS QUISIMOS AVENTURAR ALLÁ POR EL 2009 EN DESCUBRIR Y CONOCER LA ELABORACIÓN DE
                UN PRODUCTO QUE NOS VENÍA CAUTIVANDO COMO CONSUMIDORES: LA CERVEZA ARTESANAL.
                DECIDIMOS UTILIZAR LA PALABRA BAUM (ÁRBOL EN ALEMÁN), YA QUE REPRESENTA LA
                PROTECCIÓN DE NUESTRA RAZA, EL EQUILIBRIO DE LA NATURALEZA, QUIEN NOS ENTREGA SUS
                FRUTOS, NOS PROTEGE DEL SOL Y LA LLUVIA.{' '}
                <strong>
                  HOY, MÁS DE UNA DÉCADA DESPUÉS, Y CON MUCHOS ESTILOS REALIZADOS EN NUESTRO
                  HABER, DECIDIMOS TRAER ESTE MATERIAL.
                </strong>
              </p>
            </div>
            <div className="historia-text">
              <p>
                Decidimos compartir a través de este catálogo, nuestras fichas técnicas: un material
                que elaboramos específicamente para nuestras franquicias, y mediante el cual llevamos
                a cabo la capacitación en cada estilo a través del cual llevamos a cabo la
                capacitación. Para darle un valor agregado importante a todo nuestro personal a lo
                largo del país nos capacitamos en cada estilo a través del cual llevamos la
                capacitación en cada estilo.
              </p>
              <p>
                Porcentaje de maltas de cada estilo, así como los momentos de adición de lúpulos
                que forman parte de la receta. De este modo, aquellas almas curiosas no solo podrán
                adentrarse en la estructura y anatomía de cada una de nuestras cervezas, sino
                también en llevar a cabo el estilo a través de su propio equipamiento. Finalmente,
                decidimos incluir otras características como: historia de cada estilo, categoría
                BJCP, código QR hacia más material, gráficos araña, entre los aspectos más
                destacados.
              </p>
              <p>
                Esperamos que puedas disfrutar de este catálogo tanto como nosotros disfrutamos
                de vivir de aquello que nos gusta, y que te animes a replicar esos estilos favoritos
                que disfrutas de Baum.
              </p>
              <p className="historia-firma">El equipo de Baum.</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
