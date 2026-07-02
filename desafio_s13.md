# Desafío S13 — Mercado Pago Sandbox

## 1. Setup

- SDK instalado: `mercadopago` v3
- Credenciales del vendedor (cuenta de prueba `TESTUSER3758652475346590466`) configuradas en Vercel:
  - `MERCADOPAGO_ACCESS_TOKEN` = `APP_USR-8161517815676718-070218-377736217a45193404af7c9ba0acc916-3515191858`
  - `NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY` = `APP_USR-2b4f8dc1-baa9-4c62-8f02-57b9bca03cba`
  - `NEXT_PUBLIC_APP_URL` — URL pública de Vercel

## 2. Cuentas de prueba

| Rol | Usuario | Contraseña | User ID |
|-----|---------|------------|---------|
| Vendedor | `TESTUSER3758652475346590466` | `JuakQ5T2L3` | 3515191858 |
| Comprador | `TESTUSER2858611034191493925` | `kPg6H81VlU` | 3515408862 |

> **Importante:** para testear, el comprador debe iniciar sesión en mercadopago.com con la cuenta `TESTUSER2858611034191493925` antes de completar el pago en el checkout.

## 3. API `/api/pagos/crear-preferencia`

- Requiere autenticación (Bearer token de Supabase)
- Obtiene la orden desde Supabase validando que pertenezca al usuario y esté en estado `pending`
- Crea preferencia con items reales, precio calculado en servidor, `external_reference` = UUID de la orden
- Configura `notification_url` al webhook y `back_urls` para éxito, fallo y pendiente
- Retorna `init_point` para redirigir al checkout de Mercado Pago

## 4. Páginas

| Ruta | Descripción |
|------|-------------|
| `/checkout` | Formulario de datos de envío + selección de método de pago. Valida campos antes de crear la orden. Redirige a MP con `window.location.href`. |
| `/pago-completado` | Muestra `payment_id` y `external_reference` recibidos por query params. Estado: **Approved**. |
| `/pago-fallido` | Informa el rechazo con posibles causas. Botón para reintentar. |
| `/pago-pendiente` | Notifica que el pago está en proceso. Muestra ID de orden y de pago. |

## 5. Webhook `/api/webhooks/mercadopago`

- Recibe notificaciones POST de Mercado Pago
- Fetchea el pago real desde la API de MP para obtener `external_reference` y estado
- Mapea estados MP → internos: `approved→paid`, `rejected→failed`, `cancelled→cancelled`, `in_process→pending`
- Actualiza la orden en Supabase y registra en `order_status_history`

## 6. Tarjeta de prueba

| Campo | Valor |
|-------|-------|
| Número | `5031 7557 3453 0604` |
| Vencimiento | `11/30` |
| CVV | `123` |
| DNI | `12345678` |
| Titular (según caso) | ver tabla abajo |

| Titular | Resultado |
|---------|-----------|
| `APRO` | Pago aprobado → redirige a `/pago-completado` |
| `OTHE` | Pago rechazado → redirige a `/pago-fallido` |
| `CONT` | Pago pendiente → redirige a `/pago-pendiente` |

## 7. Resultado de la prueba realizada

- Comprador: `TESTUSER2858611034191493925` (Cami)
- Tarjeta: `5031 7557 3453 0604` · Titular: `APRO`
- Resultado MP: **¡Listo! Tu pago ya se acreditó** — Operación #166897277616
- Resultado app: pantalla `/pago-completado` con estado **Approved**, Orden #7, ID de pago #166897277616
- Orden registrada en Supabase con `total: 32659`
