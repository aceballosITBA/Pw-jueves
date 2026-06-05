import { NextResponse } from 'next/server';
import { listOrders } from '../../../../lib/data-store';
import { getSupabaseAdminClient, isSupabaseServerConfigured } from '../../../../lib/supabase/server';

const getAccessToken = (request) => {
  const header = request.headers.get('authorization') || '';
  if (!header.toLowerCase().startsWith('bearer ')) return '';
  return header.slice(7).trim();
};

async function getAuthenticatedUser(request) {
  if (!isSupabaseServerConfigured()) return null;

  const token = getAccessToken(request);
  if (!token) return null;

  const supabase = getSupabaseAdminClient();
  if (!supabase) return null;

  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data?.user) return null;
  return data.user;
}

export async function GET(request, { params }) {
  const authenticatedUser = await getAuthenticatedUser(request);
  if (isSupabaseServerConfigured() && !authenticatedUser) {
    return NextResponse.json({ error: 'No autorizado.' }, { status: 401 });
  }

  const orders = await listOrders();
  const order = orders.find((item) => String(item.id) === String(params.orderId) && (!authenticatedUser || String(item.user_id || item.user?.id || '') === String(authenticatedUser.id)));

  if (!order) {
    return NextResponse.json({ error: 'Pedido no encontrado.' }, { status: 404 });
  }

  return NextResponse.json({ order });
}