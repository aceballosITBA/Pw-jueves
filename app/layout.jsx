import './globals.css';

export const metadata = {
  title: 'Baum Beer Store',
  description: 'Tienda de cervezas artesanales Baum'
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
