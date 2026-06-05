export function validarEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

export function validarCantidad(cantidad) {
  return Number.isInteger(cantidad) && cantidad > 0 && cantidad <= 100;
}

export function sanitizar(str) {
  return String(str)
    .replace(/<\/?[^>]+>/g, '')
    .trim()
    .substring(0, 255);
}
