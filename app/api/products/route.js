import { NextResponse } from 'next/server';
import { listProducts, saveProduct } from '../../../lib/data-store';

const hasAdminAccess = (request) => {
  const expectedToken = process.env.ADMIN_API_TOKEN;
  if (!expectedToken) return true;
  return request.headers.get('x-admin-token') === expectedToken;
};

export async function GET() {
  try {
    const products = await listProducts();
    return NextResponse.json({ products });
  } catch (error) {
    return NextResponse.json({ error: 'No se pudieron cargar los productos.' }, { status: 500 });
  }
}

export async function POST(request) {
  if (!hasAdminAccess(request)) {
    return NextResponse.json({ error: 'No autorizado.' }, { status: 401 });
  }

  try {
    const payload = await request.json();
    if (!payload?.id || !payload?.name || !payload?.style) {
      return NextResponse.json({ error: 'Faltan campos obligatorios.' }, { status: 400 });
    }

    const product = await saveProduct(payload);
    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'No se pudo crear el producto.' }, { status: 500 });
  }
}