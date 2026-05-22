import './globals.css';
import Header from '../components/Header';
import FloatingWhatsApp from '../components/FloatingWhatsApp';

export const metadata = {
  title: 'Baum Beer Store',
  description: 'Tienda de cervezas artesanales Baum'
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <Header />
        {children}
        <FloatingWhatsApp />
      </body>
    </html>
  );
}
