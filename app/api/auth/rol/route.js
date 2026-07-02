import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const auth = request.headers.get('authorization') || '';
  if (!auth.toLowerCase().startsWith('bearer ')) {
    return NextResponse.json({ success: true, data: { rol: 'cliente', autenticado: false } });
  }

  const token = auth.slice(7).trim();
  if (!token) {
    return NextResponse.json({ success: true, data: { rol: 'cliente', autenticado: false } });
  }

  const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/\/$/, '');
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !anonKey) {
    return NextResponse.json({ success: true, data: { rol: 'cliente', autenticado: false } });
  }

  const supabase = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { autoRefreshToken: false, persistSession: false }
  });

  // Validar el JWT y obtener el usuario
  const { data: { user }, error: userError } = await supabase.auth.getUser(token);
  if (userError || !user) {
    return NextResponse.json({ success: true, data: { rol: 'cliente', autenticado: false } });
  }

  // Función SECURITY DEFINER — bypasea RLS sin necesitar service role key
  const { data: rol } = await supabase.rpc('get_user_rol', { p_user_id: user.id });

  return NextResponse.json({
    success: true,
    data: { rol: rol ?? 'cliente', autenticado: true, email: user.email }
  });
}
