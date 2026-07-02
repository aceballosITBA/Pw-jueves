import { getSupabaseAdminClient } from '../../../lib/supabase/server';
import { listProducts } from '../../../lib/data-store';
import { successResponse } from '../../../lib/api-response';

export async function GET() {
  const products = await listProducts();
  const supabase = getSupabaseAdminClient();

  if (supabase) {
    const { data: items } = await supabase
      .from('order_items')
      .select('product_id, quantity');

    if (items && items.length > 0) {
      const salesMap = {};
      for (const row of items) {
        const key = String(row.product_id);
        salesMap[key] = (salesMap[key] || 0) + Number(row.quantity);
      }

      const sorted = products
        .map((p) => ({ ...p, totalSold: salesMap[String(p.id)] || 0 }))
        .sort((a, b) => b.totalSold - a.totalSold || a.name.localeCompare(b.name));

      return successResponse({ products: sorted });
    }
  }

  return successResponse({ products: products.map((p) => ({ ...p, totalSold: 0 })) });
}
