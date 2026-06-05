import { getProductById } from '../../../lib/data-store';
import { validarCantidad } from '../../../lib/validations';
import { successResponse, errorResponse } from '../../../lib/api-response';

const calcPackPrice = (base, pack) => {
  if (pack === 12) return Math.round(base * 2 * 0.9);
  if (pack === 24) return Math.round(base * 4 * 0.8);
  return base;
};

export async function POST(request) {
  try {
    const body = await request.json();
    const { product_id, cantidad, pack } = body;

    if (!product_id) {
      return errorResponse('El campo product_id es requerido.', 400, 'MISSING_PRODUCT_ID');
    }
    if (!validarCantidad(cantidad)) {
      return errorResponse('La cantidad debe ser un entero entre 1 y 100.', 400, 'INVALID_CANTIDAD');
    }
    if (![6, 12, 24].includes(pack)) {
      return errorResponse('El pack debe ser 6, 12 o 24.', 400, 'INVALID_PACK');
    }

    const product = await getProductById(product_id);
    if (!product) {
      return errorResponse('Producto no encontrado.', 404, 'PRODUCT_NOT_FOUND');
    }

    if (product.stock < cantidad) {
      return errorResponse(`Stock insuficiente. Disponible: ${product.stock}.`, 400, 'INSUFFICIENT_STOCK');
    }

    const unit_price = calcPackPrice(product.pricePack6, pack);

    return successResponse({
      product_id: product.id,
      product_name: product.name,
      pack,
      cantidad,
      unit_price,
      subtotal: unit_price * cantidad,
    });
  } catch {
    return errorResponse('Error al procesar el carrito.', 500, 'SERVER_ERROR');
  }
}
