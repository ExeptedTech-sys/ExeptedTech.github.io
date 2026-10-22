# ExeptedTech — entrega de octubre 2026

## Cambios integrados
- Menú «Mi cuenta» con apodo, recomendaciones basadas en categorías consultadas localmente, historial de pedidos, perfil, cambio de contraseña mediante flujo de recuperación OTP y carrito.
- Aviso flotante de carrito con duración de 4 segundos y apertura bajo demanda.
- Total de carrito con cantidades, precios y enlace para seleccionar tarjeta Mercado Pago o transferencia bancaria. El enlace de Mercado Pago **no precarga el importe**: hay que introducirlo manualmente.
- Código extra en `account-extras.js` y `account-extras.css`; no se modificaron los datos bancarios ni el enlace de cobro existentes.

## Antes de lanzar al público
1. **Conserva `config.js` de tu despliegue actual**; por seguridad no está incluido en el ZIP. Únicamente debe incluir claves públicas de Supabase/Turnstile. Confirma dominios permitidos, CAPTCHA, límites de intentos y correo OTP de 8 dígitos en Supabase.
2. El cambio de contraseña requiere correo real y código de recuperación emitido por Supabase. Las comprobaciones del navegador no sustituyen controles del servidor; configura protección de contraseñas filtradas, límites de solicitudes y expiración de OTP.
3. **Historial de compras**: la interfaz lee `shop_orders` por usuario autenticado. Configura esa tabla con columna `user_id` y políticas RLS de solo lectura del propietario. No habilites inserciones/actualizaciones de pagos desde el navegador. Registra pedidos y confirma los pagos desde backend o área administrativa tras verificar el cobro de forma independiente. Si no existe la tabla, el historial mostrará que falta configuración.
4. **Mercado Pago**: se mantiene `https://link.mercadopago.com.mx/exeptedtechluviaco`. Es un enlace de monto abierto y no confirma automáticamente ventas. Para checkout real automático usa un backend con Checkout Pro y webhooks validados. Nunca expongas un access token privado de Mercado Pago.
5. **Transferencia**: revisa beneficiario, institución y CLABE directamente con la cuenta receptora antes de publicar.
6. Sube el contenido del ZIP **a la raíz del repositorio** (no el ZIP). Conserva los archivos `CNAME` y `.nojekyll`.
7. Verifica registro, login, OTP y pagos con claves reales en staging y dispositivos físicos. Las pruebas locales no garantizan el comportamiento de los servicios externos.

## Privacidad y seguridad
Las preferencias de recomendaciones se guardan en el navegador y se pueden borrar desde «Recomendado para mí». El carrito también se guarda localmente y no equivale a un pedido confirmado. Las sesiones de cuenta se mantienen en memoria en este proyecto y se cierran al recargar. Los pagos y productos no se liberan sin verificar abono. El dominio GitHub Pages debe operar bajo HTTPS.
