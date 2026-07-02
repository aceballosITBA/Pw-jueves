import { createClient } from '@supabase/supabase-js';
import { listProducts, saveProduct } from '../../../lib/data-store';
import { successResponse, errorResponse } from '../../../lib/api-response';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const hasAdminAccess = async (request) => {
  const auth = request.headers.get('Authorization');
  if (!auth?.startsWith('Bearer ')) return false;
  const token = auth.slice(7);
  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !user) return false;
  const { data: profile } = await supabaseAdmin.from('profiles').select('rol').eq('id', user.id).single();
  return profile?.rol === 'admin';
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
  if (!await hasAdminAccess(request)) {
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