# Baum Beer Store

Tienda web full-stack para el trabajo práctico de PW 2026 Q1.

## Stack

- **Frontend/Backend**: Next.js 15 (App Router)
- **Base de datos**: Supabase (PostgreSQL + Auth)
- **Pagos**: Mercado Pago Checkout Pro (sandbox)
- **Deploy**: Vercel + GitHub Actions CI/CD

## Qué incluye

- Landing semántica y responsive con hero slider, highlights y catálogo.
- Age gate al ingresar.
- Catálogo navegable (`/latas`) con filtros por estilo, pack y precio, y búsqueda en tiempo real.
- Panel admin protegido por rol para crear, editar y desactivar productos.
- Autenticación con Supabase (email/password + Google OAuth).
- Checkout completo: formulario de envío → validación → creación de orden en Supabase → redirección a Mercado Pago.
- Webhook de Mercado Pago que actualiza el estado de la orden al recibir notificaciones.
- Mi cuenta con historial de pedidos del usuario autenticado.
- Páginas dedicadas: Más vendidos, Packs con descuento, Envíos, Medios de pago, Historia/Quiénes somos.

## Requisitos

- Node.js 20.
- Variables de entorno definidas en `.env.local`.

## Variables de entorno

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-public-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Mercado Pago
MERCADOPAGO_ACCESS_TOKEN=APP_USR-...
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY=APP_USR-...
MERCADOPAGO_WEBHOOK_SECRET=your-webhook-secret

# App
NEXT_PUBLIC_APP_URL=https://your-vercel-url.vercel.app
ADMIN_API_TOKEN=your-admin-token
```

## Instalación

```bash
npm install
npm run dev
```

## Rutas principales

| Ruta | Descripción |
|------|-------------|
| `/` | Landing con hero, highlights y catálogo |
| `/latas` | Catálogo navegable con filtros |
| `/cart` | Carrito de compras |
| `/checkout` | Checkout con datos de envío y método de pago |
| `/pago-completado` | Confirmación de pago aprobado |
| `/pago-fallido` | Aviso de pago rechazado |
| `/pago-pendiente` | Aviso de pago en proceso |
| `/mi-cuenta` | Historial de pedidos del usuario |
| `/admin` | Panel de administración (requiere rol admin) |
| `/historia` | Historia, misión y visión de Baum |
| `/mas-vendidos` | Ranking de productos por volumen de ventas |
| `/packs-descuento` | Packs x12 y x24 ordenados por ahorro |
| `/envios` | Información de métodos de envío |
| `/medios-de-pago` | Métodos de pago aceptados |

## API interna

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/products` | Lista productos activos |
| POST | `/api/products` | Crea producto (admin) |
| GET | `/api/products/[id]` | Detalle de producto |
| PATCH | `/api/products/[id]` | Edita producto (admin) |
| DELETE | `/api/products/[id]` | Desactiva producto (admin) |
| GET | `/api/orders` | Lista pedidos del usuario autenticado |
| POST | `/api/orders` | Crea pedido (valida stock y precios en servidor) |
| POST | `/api/pagos/crear-preferencia` | Crea preferencia de Mercado Pago |
| POST | `/api/webhooks/mercadopago` | Recibe notificaciones de pago |
| GET | `/api/mas-vendidos` | Productos ordenados por unidades vendidas |

## Despliegue

Desplegado en Vercel con CI/CD via GitHub Actions. El workflow valida el build en cada push y PR. Vercel genera previews automáticas por PR.

### Pasos para desplegar

1. Importá el repo en Vercel.
2. Configurá todas las variables de entorno listadas arriba.
3. Activá previews para Pull Requests en Vercel.
4. El workflow `.github/workflows/ci.yml` corre `npm run build` automáticamente.

## Prueba del flujo de pagos

Ver [`desafio_s13.md`](./desafio_s13.md) para instrucciones completas de testing con Mercado Pago sandbox, cuentas de prueba y tarjetas de prueba.
