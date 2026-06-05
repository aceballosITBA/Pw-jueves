import fs from 'fs/promises';
import path from 'path';
import { getSupabaseAdminClient } from '../supabase/server';

const productsPath = path.join(process.cwd(), 'public', 'data', 'products.json');

const productShape = (product, images = []) => ({
  id: product.id,
  name: product.name,
  style: product.style,
  description: product.description,
  pricePack6: Number(product.pricePack6 ?? product.price_pack_6 ?? 0),
  images: images.length ? images.map((image) => image.image_url ?? image.url ?? image) : product.images ?? [],
  abv: product.abv ?? '',
  ibu: Number(product.ibu ?? 0),
  srm: Number(product.srm ?? 0),
  aroma: product.aroma ?? '',
  flavor: product.flavor ?? '',
  pairing: product.pairing ?? '',
  profile: product.profile ?? product.sensory_profile ?? '',
  stock: Number(product.stock ?? 0),
  active: product.active ?? true
});

const normalizeImages = (images = []) => images
  .map((image, index) => {
    if (!image) return null;
    if (typeof image === 'string') return { image_url: image, position: index + 1, alt_text: '' };
    return {
      image_url: image.image_url ?? image.url ?? '',
      position: Number(image.position ?? index + 1),
      alt_text: image.alt_text ?? image.altText ?? ''
    };
  })
  .filter((image) => image && image.image_url);

const productRowToState = (row, images = []) => productShape(row, images);

async function readLocalProducts() {
  const raw = await fs.readFile(productsPath, 'utf8');
  const products = JSON.parse(raw);
  return products.map((product) => productShape(product));
}

async function writeLocalProducts(products) {
  await fs.writeFile(productsPath, `${JSON.stringify(products, null, 2)}\n`, 'utf8');
}

export async function listProducts() {
  const supabase = getSupabaseAdminClient();
  if (supabase) {
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: true });

    if (productsError) throw productsError;

    const { data: productImages, error: imagesError } = await supabase
      .from('product_images')
      .select('*')
      .order('position', { ascending: true });

    if (imagesError) throw imagesError;

    return (products || []).map((product) => productRowToState(
      product,
      (productImages || []).filter((image) => image.product_id === product.id)
    ));
  }

  return readLocalProducts();
}

export async function getProductById(id) {
  const products = await listProducts();
  return products.find((product) => String(product.id) === String(id)) || null;
}

function stateToDbRow(product) {
  return {
    id: product.id,
    name: product.name,
    style: product.style,
    description: product.description ?? '',
    price_pack_6: Number(product.pricePack6 ?? product.price_pack_6 ?? 0),
    abv: product.abv ?? '',
    ibu: Number(product.ibu ?? 0),
    srm: Number(product.srm ?? 0),
    aroma: product.aroma ?? '',
    flavor: product.flavor ?? '',
    pairing: product.pairing ?? '',
    sensory_profile: product.profile ?? product.sensory_profile ?? '',
    stock: Number(product.stock ?? 0),
    active: product.active ?? true
  };
}

export async function upsertProduct(payload) {
  const product = productShape(payload, normalizeImages(payload.images || []));
  const supabase = getSupabaseAdminClient();

  if (supabase) {
    const { error: productError } = await supabase.from('products').upsert(stateToDbRow(product), { onConflict: 'id' });
    if (productError) throw productError;

    await supabase.from('product_images').delete().eq('product_id', product.id);

    const images = normalizeImages(payload.images || []);
    if (images.length) {
      const { error: imageError } = await supabase.from('product_images').insert(
        images.map((image) => ({
          product_id: product.id,
          image_url: image.image_url,
          position: image.position,
          alt_text: image.alt_text
        }))
      );
      if (imageError) throw imageError;
    }

    return product;
  }

  const products = await readLocalProducts();
  const nextProducts = products.filter((current) => String(current.id) !== String(product.id));
  nextProducts.push(product);
  nextProducts.sort((left, right) => String(left.id).localeCompare(String(right.id)));
  await writeLocalProducts(nextProducts);
  return product;
}

export async function deleteProduct(id) {
  const supabase = getSupabaseAdminClient();
  if (supabase) {
    await supabase.from('product_images').delete().eq('product_id', id);
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw error;
    return { ok: true };
  }

  const products = await readLocalProducts();
  const nextProducts = products.filter((product) => String(product.id) !== String(id));
  await writeLocalProducts(nextProducts);
  return { ok: true };
}