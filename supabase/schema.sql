-- Base schema for the Baum store in Supabase.
-- Run this in the Supabase SQL editor after creating the project.

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, name, email, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.email,
    coalesce(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture', '')
  )
  on conflict (id) do update set
    name = excluded.name,
    email = excluded.email,
    avatar_url = excluded.avatar_url,
    updated_at = now();

  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null default '',
  email text not null unique,
  avatar_url text not null default '',
  phone text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'pending',
  total integer not null default 0,
  currency text not null default 'ARS',
  shipping jsonb not null default '{}'::jsonb,
  payment_method text not null default 'mercadopago',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id bigserial primary key,
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id text not null,
  product_name text not null,
  pack integer not null default 6,
  quantity integer not null check (quantity > 0),
  unit_price integer not null default 0,
  item_total integer not null default 0,
  product_snapshot jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists orders_user_id_idx on public.orders(user_id);
create index if not exists order_items_order_id_idx on public.order_items(order_id);

create table if not exists public.products (
  id text primary key,
  name text not null,
  style text not null,
  description text not null default '',
  price_pack_6 integer not null default 0,
  abv text not null default '',
  ibu integer not null default 0,
  srm integer not null default 0,
  aroma text not null default '',
  flavor text not null default '',
  pairing text not null default '',
  sensory_profile text not null default '',
  stock integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.product_images (
  id bigserial primary key,
  product_id text not null references public.products(id) on delete cascade,
  image_url text not null,
  position integer not null default 1,
  alt_text text not null default '',
  created_at timestamptz not null default now(),
  unique (product_id, position)
);

create table if not exists public.order_status_history (
  id bigserial primary key,
  order_id uuid not null references public.orders(id) on delete cascade,
  status text not null,
  note text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists products_active_idx on public.products(active);
create index if not exists products_style_idx on public.products(style);
create index if not exists product_images_product_id_idx on public.product_images(product_id);
create index if not exists order_status_history_order_id_idx on public.order_status_history(order_id);

alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.order_status_history enable row level security;

alter table public.profiles enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

create policy "Products are publicly readable"
  on public.products
  for select
  using (active = true);

create policy "Product images are publicly readable"
  on public.product_images
  for select
  using (exists (
    select 1
    from public.products
    where public.products.id = product_images.product_id
      and public.products.active = true
  ));

create policy "Order history is readable by owner"
  on public.order_status_history
  for select
  using (
    exists (
      select 1
      from public.orders
      where public.orders.id = order_status_history.order_id
        and public.orders.user_id = auth.uid()
    )
  );

create policy "Order history is insertable through its order"
  on public.order_status_history
  for insert
  with check (
    exists (
      select 1
      from public.orders
      where public.orders.id = order_status_history.order_id
        and public.orders.user_id = auth.uid()
    )
  );

create policy "Profiles are readable by owner"
  on public.profiles
  for select
  using (auth.uid() = id);

create policy "Profiles are insertable by owner"
  on public.profiles
  for insert
  with check (auth.uid() = id);

create policy "Profiles are updatable by owner"
  on public.profiles
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "Orders are readable by owner"
  on public.orders
  for select
  using (auth.uid() = user_id);

create policy "Orders are insertable by owner"
  on public.orders
  for insert
  with check (auth.uid() = user_id);

create policy "Orders are updatable by owner"
  on public.orders
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Order items are readable through their order"
  on public.order_items
  for select
  using (
    exists (
      select 1
      from public.orders
      where public.orders.id = order_items.order_id
        and public.orders.user_id = auth.uid()
    )
  );

create policy "Order items are insertable through their order"
  on public.order_items
  for insert
  with check (
    exists (
      select 1
      from public.orders
      where public.orders.id = order_items.order_id
        and public.orders.user_id = auth.uid()
    )
  );

create trigger set_products_updated_at
before update on public.products
for each row
execute function public.set_updated_at();

create trigger set_profiles_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

create trigger set_orders_updated_at
before update on public.orders
for each row
execute function public.set_updated_at();

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

insert into public.products (id, name, style, description, price_pack_6, abv, ibu, srm, aroma, flavor, pairing, sensory_profile, stock)
values
  ('lager', 'Lager Dorada', 'Lager Dorada', 'Lager dorada, fresca y fácil de tomar, ideal para encuentros y picadas.', 8082, '4.7%', 16, 4, 'Cereal suave, pan fresco', 'Ligera, limpia y refrescante', 'Pizza, papas fritas, empanadas', 'Seca, liviana, alta tomabilidad', 43),
  ('blondie', 'Blond', 'Blond', 'Rubia artesanal de perfil frutado leve y final balanceado.', 10206, '5.1%', 20, 5, 'Malta dulce, notas cítricas', 'Balance entre malta y lúpulo suave', 'Hamburguesas, tacos, rabas', 'Equilibrada, amable y versátil', 29),
  ('scottish', 'Scottish', 'Scottish', 'Cerveza maltosa con tonos caramelo y cuerpo medio.', 10843, '5.5%', 18, 16, 'Caramelo, toffee y pan tostado', 'Maltosa, suave amargor final', 'Carnes asadas, queso gouda', 'Maltosa, redonda y envolvente', 18),
  ('honey', 'Maldita Honey', 'Maldita Honey', 'Ale rubia con miel, amable y aromática.', 11132, '5.0%', 17, 6, 'Miel floral, malta clara', 'Dulzor tenue y final limpio', 'Pollo grillado, quesos blandos', 'Suave, dulce justa, ligera', 34),
  ('porter', 'Porter', 'Porter', 'Oscura con notas tostadas y cacao.', 11130, '5.7%', 28, 30, 'Café suave, chocolate amargo', 'Tostado elegante y seco', 'Brownie, carnes braseadas', 'Oscura, cremosa, tostada', 16),
  ('fuck-ipa', 'FUCK IPA', 'FUCK IPA', 'IPA intensa, lupulada y muy aromática.', 18554, '6.5%', 62, 8, 'Cítrico, resina, frutas tropicales', 'Amargor marcado y final seco', 'Comida picante, burgers', 'Potente, amarga, aromática', 12),
  ('ipa-mdp', 'Session IPA Marplatense', 'Session IPA Marplatense', 'IPA de cuerpo liviano con perfil costero y cítrico.', 15120, '5.4%', 44, 7, 'Pomelo, maracuyá, pino', 'Fresca con amargor medio', 'Pescados, tacos de camarón', 'Cítrica, refrescante, moderna', 22),
  ('california', 'Session IPA California', 'Session IPA California', 'Amber lager ale con notas tostadas y final firme.', 22589, '5.8%', 36, 13, 'Caramelo, herbal, pan tostado', 'Maltosa con amargor persistente', 'Costillas, provoleta', 'Compleja, ámbar, robusta', 8),
  ('iron-ale', 'Iron Ale', 'Iron Ale', 'Pale Ale de lúpulo expresivo y final refrescante.', 11122, '5.3%', 24, 17, 'Caramelo, frutos secos', 'Balanceada, tostado suave', 'Milanesas, cheddar, ahumados', 'Ámbar, maltosa y noble', 20),
  ('gladstone', 'Glassstone', 'Glassstone', 'Ale cobriza con carácter maltoso y final seco.', 15120, '5.6%', 38, 9, 'Naranja, herbal, floral', 'Amargor medio y final limpio', 'Sándwiches, sushi, pizza', 'Aromática, equilibrada, seca', 15)
on conflict (id) do update set
  name = excluded.name,
  style = excluded.style,
  description = excluded.description,
  price_pack_6 = excluded.price_pack_6,
  abv = excluded.abv,
  ibu = excluded.ibu,
  srm = excluded.srm,
  aroma = excluded.aroma,
  flavor = excluded.flavor,
  pairing = excluded.pairing,
  sensory_profile = excluded.sensory_profile,
  stock = excluded.stock,
  updated_at = now();

insert into public.product_images (product_id, image_url, position, alt_text)
values
  ('lager', '/images/lager.png', 1, 'Lager Dorada'),
  ('blondie', '/images/blonde-1.png', 1, 'Blond imagen 1'),
  ('blondie', '/images/blonde-2.png', 2, 'Blond imagen 2'),
  ('blondie', '/images/blonde-3.png', 3, 'Blond imagen 3'),
  ('scottish', '/images/scottish1.png', 1, 'Scottish imagen 1'),
  ('scottish', '/images/scottish2.webp', 2, 'Scottish imagen 2'),
  ('scottish', '/images/scottish3.webp', 3, 'Scottish imagen 3'),
  ('honey', '/images/Maldita honey1.webp', 1, 'Maldita Honey imagen 1'),
  ('honey', '/images/Maldita Honey2.webp', 2, 'Maldita Honey imagen 2'),
  ('honey', '/images/Malditahoney3.webp', 3, 'Maldita Honey imagen 3'),
  ('porter', '/images/porter1.webp', 1, 'Porter imagen 1'),
  ('fuck-ipa', '/images/fuck-ipa-3.png', 1, 'FUCK IPA imagen 1'),
  ('fuck-ipa', '/images/fuck-ipa-1.png', 2, 'FUCK IPA imagen 2'),
  ('fuck-ipa', '/images/fuck-ipa-2.png', 3, 'FUCK IPA imagen 3'),
  ('ipa-mdp', '/images/ipa-mdp-1.png', 1, 'Session IPA Marplatense imagen 1'),
  ('california', '/images/california-3.png', 1, 'Session IPA California imagen 1'),
  ('california', '/images/california-1.png', 2, 'Session IPA California imagen 2'),
  ('california', '/images/california-2.png', 3, 'Session IPA California imagen 3'),
  ('iron-ale', '/images/ironale1.webp', 1, 'Iron Ale imagen 1'),
  ('gladstone', '/images/gladstone1.webp', 1, 'Glassstone imagen 1'),
  ('gladstone', '/images/gladstone2.webp', 2, 'Glassstone imagen 2'),
  ('gladstone', '/images/gladstone3.webp', 3, 'Glassstone imagen 3')
on conflict (product_id, position) do update set
  image_url = excluded.image_url,
  alt_text = excluded.alt_text;
