# Baum Beer Store

Tienda web full-stack para el trabajo práctico de PW 2026 Q1.

## Qué incluye

- Landing semántica y responsive.
- Catálogo navegable con filtros y búsqueda.
- API interna para productos, pedidos y webhook de pagos.
- Panel admin para crear, editar y desactivar productos.
- Integración base con Supabase para catálogo y estructura de pedidos.

## Requisitos

- Node.js 20.
- Variables de entorno definidas en `.env.local`.

## Variables de entorno

Usá estos valores como base:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-public-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
ADMIN_API_TOKEN=your-admin-token
MERCADOPAGO_WEBHOOK_SECRET=your-webhook-secret
```

## Instalación

```bash
npm install
npm run dev
```

## Rutas principales

- `/` landing.
- `/latas` catálogo navegable.
- `/productos` catálogo y detalle.
- `/checkout` checkout.
- `/mi-cuenta` historial del usuario desde API con fallback local.
- `/admin` panel de administración.

## API interna

- `GET /api/products`
- `POST /api/products`
- `GET /api/products/[id]`
- `PATCH /api/products/[id]`
- `DELETE /api/products/[id]`
- `POST /api/orders`
- `POST /api/webhooks/mercadopago`

## Despliegue

Pensado para Vercel. El workflow de GitHub Actions deja un chequeo de build para PRs y pushes.

### Vercel

1. Importá el repo en Vercel.
2. Configurá las variables de entorno del proyecto.
3. Activá previews para Pull Requests.

Variables necesarias:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_API_TOKEN`
- `MERCADOPAGO_WEBHOOK_SECRET`