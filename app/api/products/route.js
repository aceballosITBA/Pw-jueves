import { listProducts, saveProduct } from '../../../lib/data-store';
import { successResponse, errorResponse } from '../../../lib/api-response';

const hasAdminAccess = (request) => {
  const expectedToken = process.env.ADMIN_API_TOKEN;
  if (!expectedToken) return true;
  return request.headers.get('x-admin-token') === expectedToken;
};

export async function GET() {
  try {
    const products = await listProducts();
    return successResponse({ products });
  } catch {
    return errorResponse('No se pudieron cargar los productos.', 500, 'SERVER_ERROR');
  }
}

export async function POST(request) {
  if (!hasAdminAccess(request)) {
    return errorResponse('No autorizado.', 401, 'UNAUTHORIZED');
  }

  try {
    const payload = await request.json();
    if (!payload?.id || !payload?.name || !payload?.style) {
      return errorResponse('Faltan campos obligatorios.', 400, 'MISSING_FIELDS');
    }

    const product = await saveProduct(payload);
    return successResponse({ product }, 201);
  } catch {
    return errorResponse('No se pudo crear el producto.', 500, 'SERVER_ERROR');
  }
}