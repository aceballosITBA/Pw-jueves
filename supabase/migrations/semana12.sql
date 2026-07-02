-- ============================================================
-- Semana 12: Transacciones, Roles y Preparación para Pagos
-- Ejecutar en el SQL Editor de Supabase
-- ============================================================


-- ============================================================
-- 1. SISTEMA DE ROLES
-- ============================================================

-- Agregar columna rol a profiles (tabla de usuarios del proyecto)
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS rol VARCHAR(50) NOT NULL DEFAULT 'cliente';

CREATE INDEX IF NOT EXISTS idx_profiles_rol ON public.profiles(rol);

-- Actualizar handle_new_user para asignar 'cliente' automáticamente al registrarse
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, avatar_url, rol)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture', ''),
    'cliente'
  )
  ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    email = EXCLUDED.email,
    avatar_url = EXCLUDED.avatar_url,
    updated_at = NOW();
  RETURN NEW;
END;
$$;


-- ============================================================
-- 2. PREPARACIÓN DE PAGOS
-- ============================================================

-- Campos adicionales en orders para el ciclo de pago
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS referencia_pago VARCHAR(255),
  ADD COLUMN IF NOT EXISTS pagado_en TIMESTAMPTZ;

-- ENUM para los estados de una orden
DO $$ BEGIN
  CREATE TYPE public.estado_orden AS ENUM (
    'pendiente', 'pagada', 'confirmada', 'enviada', 'entregada', 'cancelada'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;


-- ============================================================
-- 3. RLS AVANZADO — POLÍTICAS PARA ADMIN
-- ============================================================

-- Admins pueden ver todas las órdenes
DO $$ BEGIN
  CREATE POLICY "Admins pueden ver todas las ordenes"
    ON public.orders FOR SELECT
    USING (
      auth.uid() IN (SELECT id FROM public.profiles WHERE rol = 'admin')
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Admins pueden actualizar cualquier orden (cambiar estado, agregar referencia de pago, etc.)
DO $$ BEGIN
  CREATE POLICY "Admins pueden actualizar cualquier orden"
    ON public.orders FOR UPDATE
    USING (
      auth.uid() IN (SELECT id FROM public.profiles WHERE rol = 'admin')
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Admins pueden ver todos los order_items
DO $$ BEGIN
  CREATE POLICY "Admins pueden ver todos los order items"
    ON public.order_items FOR SELECT
    USING (
      auth.uid() IN (SELECT id FROM public.profiles WHERE rol = 'admin')
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Admins pueden ver todo el historial de estados
DO $$ BEGIN
  CREATE POLICY "Admins pueden ver todo el historial"
    ON public.order_status_history FOR SELECT
    USING (
      auth.uid() IN (SELECT id FROM public.profiles WHERE rol = 'admin')
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Admins pueden insertar entradas de historial en cualquier orden
DO $$ BEGIN
  CREATE POLICY "Admins pueden insertar historial"
    ON public.order_status_history FOR INSERT
    WITH CHECK (
      auth.uid() IN (SELECT id FROM public.profiles WHERE rol = 'admin')
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Admins pueden ver todos los profiles
DO $$ BEGIN
  CREATE POLICY "Admins pueden ver todos los profiles"
    ON public.profiles FOR SELECT
    USING (
      auth.uid() IN (SELECT id FROM public.profiles WHERE rol = 'admin')
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Admins pueden actualizar cualquier profile (ej: cambiar rol manualmente)
DO $$ BEGIN
  CREATE POLICY "Admins pueden actualizar cualquier profile"
    ON public.profiles FOR UPDATE
    USING (
      auth.uid() IN (SELECT id FROM public.profiles WHERE rol = 'admin')
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Admins pueden gestionar productos (INSERT, UPDATE, DELETE)
DO $$ BEGIN
  CREATE POLICY "Admins pueden insertar productos"
    ON public.products FOR INSERT
    WITH CHECK (
      auth.uid() IN (SELECT id FROM public.profiles WHERE rol = 'admin')
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Admins pueden actualizar productos"
    ON public.products FOR UPDATE
    USING (
      auth.uid() IN (SELECT id FROM public.profiles WHERE rol = 'admin')
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;


-- ============================================================
-- 4. STORED PROCEDURE: crear_orden_completa
-- Transacción atómica: orden + items + descuento de stock + historial
-- Si cualquier paso falla, se hace ROLLBACK automático de todo
-- ============================================================

CREATE OR REPLACE FUNCTION public.crear_orden_completa(
  p_user_id        UUID,
  p_items          JSONB,
  p_total          INTEGER,
  p_currency       TEXT    DEFAULT 'ARS',
  p_shipping       JSONB   DEFAULT '{}'::JSONB,
  p_payment_method TEXT    DEFAULT 'mercadopago'
)
RETURNS TABLE (
  orden_id   UUID,
  success    BOOLEAN,
  error_msg  TEXT
)
LANGUAGE plpgsql
AS $$
DECLARE
  v_order_id     UUID;
  v_item         JSONB;
  v_product_id   TEXT;
  v_product_name TEXT;
  v_pack         INTEGER;
  v_quantity     INTEGER;
  v_unit_price   INTEGER;
  v_item_total   INTEGER;
  v_stock        INTEGER;
BEGIN
  -- Crear la orden principal
  INSERT INTO public.orders (user_id, status, total, currency, shipping, payment_method)
  VALUES (p_user_id, 'pending', p_total, p_currency, p_shipping, p_payment_method)
  RETURNING id INTO v_order_id;

  -- Iterar sobre cada item del carrito
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    v_product_id   := v_item->>'product_id';
    v_product_name := v_item->>'product_name';
    v_pack         := (v_item->>'pack')::INTEGER;
    v_quantity     := (v_item->>'quantity')::INTEGER;
    v_unit_price   := (v_item->>'unit_price')::INTEGER;
    v_item_total   := (v_item->>'item_total')::INTEGER;

    -- Verificar que el producto existe y tiene stock suficiente
    SELECT stock INTO v_stock FROM public.products WHERE id = v_product_id FOR UPDATE;

    IF v_stock IS NULL THEN
      RAISE EXCEPTION 'Producto % no encontrado', v_product_id;
    END IF;

    IF v_stock < v_quantity THEN
      RAISE EXCEPTION 'Stock insuficiente para %. Disponible: %', v_product_name, v_stock;
    END IF;

    -- Insertar el item de la orden
    INSERT INTO public.order_items (
      order_id, product_id, product_name, pack, quantity,
      unit_price, item_total, product_snapshot
    )
    VALUES (
      v_order_id, v_product_id, v_product_name, v_pack, v_quantity,
      v_unit_price, v_item_total, v_item
    );

    -- Descontar stock del producto
    UPDATE public.products
    SET stock = stock - v_quantity
    WHERE id = v_product_id;
  END LOOP;

  -- Registrar en historial de estados
  INSERT INTO public.order_status_history (order_id, status, note)
  VALUES (v_order_id, 'pending', 'Pedido creado con transacción atómica');

  RETURN QUERY SELECT v_order_id, TRUE, NULL::TEXT;

EXCEPTION WHEN OTHERS THEN
  -- El EXCEPTION bloque hace ROLLBACK automático de todo lo anterior
  RETURN QUERY SELECT NULL::UUID, FALSE, SQLERRM;
END;
$$;


-- ============================================================
-- PARA CREAR UN ADMIN MANUALMENTE (ejecutar por separado):
-- UPDATE public.profiles SET rol = 'admin' WHERE email = 'tu@email.com';
-- ============================================================
