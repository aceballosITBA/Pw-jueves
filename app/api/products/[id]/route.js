import { NextResponse } from 'next/server';
import { archiveProduct, getProductById, saveProduct } from '../../../../lib/data-store';

const hasAdminAccess = (request) => {
  const expectedToken = process.env.ADMIN_API_TOKEN;
  if (!expectedToken) return true;
  return request.headers.get('x-admin-token') === expectedToken;
};

export async function GET(_request, { params }) {
  const product = await getProductById(params.id);

  if (!product) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json({ product });
}

export async function PATCH(request, { params }) {
  if (!hasAdminAccess(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const product = await saveProduct({ ...body, id: params.id });
  return NextResponse.json({ product });
}

export async function DELETE(request, { params }) {
  if (!hasAdminAccess(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await archiveProduct(params.id);
  return NextResponse.json({ ok: true });
}
