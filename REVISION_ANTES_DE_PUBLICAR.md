# ExeptedTech / revisión final para GitHub

## Precios y extras
- Exepted Personal: pendiente de cotización porque no se proporcionó un precio de construcción.
- Tech Business: $2,200 -> $1,800 MXN.
- Tech Business Plus: $3,000 -> $2,800 MXN (interpretamos esta descripción como paquete adicional más elaborado; confirmar el nombre comercial).
- Luvia Corp VIP: $5,000 -> $4,800 MXN.
- Mantenimiento Personal $250/15 días; Business y Plus $250/semana; VIP $1,000/semana.
- Apps Android/iOS por plataforma $2,000–$8,000 sujetos a cotización; Google Ads setup $1,500 por única vez; canción original $799 con licencia según contrato.
- No se programan cargos ni renovaciones automáticas.
- Los precios explícitos se respetaron tal cual. Revisa si tu margen absorbe la comisión de Mercado Pago y los impuestos; no se ha añadido un cargo sorpresa al checkout.

## Pago y seguridad
- Mercado Pago: https://link.mercadopago.com.mx/exeptedtechluviaco, un enlace de monto libre. No se puede fijar el total ni verificar un abono desde una web estática.
- El cliente introduce manualmente el total después de confirmar disponibilidad y autorización. El vendedor debe verificar la recepción exacta en Mercado Pago.
- Un botón de carrito NO representa un pago confirmado; NO entregues acceso ni producto por una captura de pantalla.
- Para automatizar estados pagado / pendiente, necesitas backend, verificación de firma y Mercado Pago Checkout Pro.
- Productos de terceros, cuentas de juegos y suscripciones: revisa licencias y autorización comercial y las reglas de Mercado Pago antes de aceptar cobros.
- No se almacenan números de tarjeta ni CVV en el sitio. No subas secretos ni contraseñas a GitHub.
- El ZIP intencionalmente NO contiene config.js. En GitHub debe quedar el config.js válido ya desplegado: solo claves públicas aptas para navegador, sin Resend API key, service_role ni Mercado Pago access token.
- RetroLib usa una contraseña visible en el JavaScript: puerta visual, NO control de acceso seguro.
- GitHub Pages es hosting estático: ciertas cabeceras de seguridad HTTP requieren un proxy/CDN con funciones apropiadas; una CSP meta ayuda pero no constituye garantía total. Supabase necesita RLS y políticas comprobadas en el servidor.

## Derechos, publicidad, portafolio
- La información de permisos para mostrar los tres ejemplos fue proporcionada por el propietario del sitio; comprueba que las autorizaciones estén documentadas y vigentes.
- Los enlaces externos no pudieron ser verificados como páginas operativas; revisa sus URL tras la publicación.
- No se garantiza posicionamiento SEO ni ventas de Google Ads; la inversión publicitaria es adicional.
- No se inventaron cifras de rendimiento de clientes.
- La privacidad/condiciones son textos de orientación y deben revisarse con un profesional conforme a la actividad real; falta confirmar los datos de identificación comercial exigibles.

## Despliegue seguro
1. Respalda el repositorio.
2. Descomprime y sube EL CONTENIDO a la raíz de GitHub Pages (no la carpeta ni el ZIP).
3. Conserva CNAME y .nojekyll; no sobreescribas config.js.
4. Publica y comprueba Android/iOS/PC/Mac en tu sitio real, login y OTP 8 dígitos, navegación, asistencia por WhatsApp, preparación de pagos y consentimiento de cookies.
5. Verifica el beneficiario e importe del enlace de Mercado Pago en la propia plataforma.
6. Antes de cobrar, comprueba políticas y licencias de cada producto.
