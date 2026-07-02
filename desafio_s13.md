# Desafío S13 — Mercado Pago Sandbox

## 1. Setup

- SDK instalado: `mercadopago` v3
- Credenciales sandbox configuradas en `.env.local`:
  - `MERCADOPAGO_ACCESS_TOKEN` (TEST-)
  - `NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY` (TEST-)
  - `NEXT_PUBLIC_APP_URL` — URL de producción en Vercel

## 2. API `/api/pagos/crear-preferencia`

- Requiere autenticación (Bearer token de Supabase)
- Obtiene la orden desde Supabase validando que pertenezca al usuario y esté en estado `pending`
- Crea preferencia con items reales, precio calculado en servidor, `external_reference` = UUID de la orden
- Configura `notification_url` al webhook y `back_urls` para éxito, fallo y pendiente
- Retorna `init_point` para redirigir al checkout de Mercado Pago

## 3. Páginas

| Ruta | Descripción |
|------|-------------|
| `/checkout` | Formulario de datos de envío + selección de método de pago. Valida campos antes de crear la orden. Redirige a MP con `window.location.href`. |
| `/pago-completado` | Muestra `payment_id` y `external_reference` recibidos por query params. Botones para ver pedidos o seguir comprando. |
| `/pago-fallido` | Informa el rechazo con posibles causas. Botón para reintentar. |
| `/pago-pendiente` | Notifica que el pago está en proceso. Muestra ID de orden y de pago. |

## 4. Webhook `/api/webhooks/mercadopago`

- Recibe notificaciones POST de Mercado Pago
- Fetchea el pago real desde la API de MP para obtener `external_reference` y estado
- Mapea estados MP → internos: `approved→paid`, `rejected→failed`, `cancelled→cancelled`, `in_process→pending`
- Actualiza la orden en Supabase y registra en `order_status_history`

## 5. Testing con tarjetas de prueba

| Tarjeta | Número | Titular | Resultado esperado |
|---------|--------|---------|-------------------|
| APROBADA | 4111 1111 1111 1111 | APRO | Redirige a `/pago-completado`, orden queda `paid` |
| RECHAZADA | 4111 1111 1111 1112 | OTHE | Redirige a `/pago-fallido`, orden queda `failed` |
| PENDIENTE | 4111 1111 1111 1113 | PENDING | Redirige a `/pago-pendiente`, orden queda `pending` |

Vencimiento para todas: `11/25` — CVV: `123`
