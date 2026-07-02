import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { archiveProduct, getProductById, saveProduct } from '../../../../lib/data-store';

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

export async function GET(_request, { params }) {
  const product = await getProductById(params.id);

  if (!product) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json({ product });
}

export async function PATCH(request, { params }) {
  if (!await hasAdminAccess(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const product = await saveProduct({ ...body, id: params.id });
  return NextResponse.json({ product });
}

export async function DELETE(request, { params }) {
  if (!await hasAdminAccess(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await archiveProduct(params.id);
  return NextResponse.json({ ok: true });
}
