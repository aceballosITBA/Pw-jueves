import './globals.css';

export const metadata = {
  title: 'Baum Latas - Tienda Académica',
  description: 'Primera versión frontend para parcial oral de Programación Web'
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
