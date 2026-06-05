import { NextResponse } from 'next/server';
import { createOrder, listOrders } from '../../../lib/data-store';
import { getSupabaseAdminClient, isSupabaseServerConfigured } from '../../../lib/supabase/server';

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

export async function GET(request) {
  const authenticatedUser = await getAuthenticatedUser(request);

  if (isSupabaseServerConfigured() && !authenticatedUser) {
    return NextResponse.json({ error: 'No autorizado.' }, { status: 401 });
  }

  const orders = await listOrders();
  const filteredOrders = authenticatedUser
    ? orders.filter((order) => String(order?.user_id || order?.user?.id || '') === String(authenticatedUser.id))
    : orders;

  return NextResponse.json({ orders: filteredOrders });
}

export async function POST(request) {
  try {
    const authenticatedUser = await getAuthenticatedUser(request);
    if (isSupabaseServerConfigured() && !authenticatedUser) {
      return NextResponse.json({ error: 'No autorizado.' }, { status: 401 });
    }

    const payload = await request.json();
    const order = await createOrder({ ...payload, userId: authenticatedUser?.id || payload.userId });
    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'No se pudo crear el pedido.' }, { status: 500 });
  }
}