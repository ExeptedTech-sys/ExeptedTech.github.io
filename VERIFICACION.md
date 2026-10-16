# Verificación de esta entrega

16 de octubre de 2026.

## Comprobado

- Sintaxis válida de app.js, account.js y experience.js con Node.
- Archivos locales y destinos de enlaces internos presentes; sin IDs duplicados en HTML.
- Los 23 productos del catálogo y los 8 servicios/paquetes vendidos incluyen cotización y Pagar.
- Todos los filtros conservan el acceso a pagos. Al seleccionar un producto, su nombre y concepto aparecen en la sección de pagos.
- La canción utiliza el concepto Cancion, anuncia desde $250 MXN y prepara un mensaje de cotización musical.
- Los botones de WhatsApp contienen el producto o la solicitud elegida, sin enviar mensajes automáticamente.
- Menú: apertura, cierre con Escape y estado accesible.
- Con la configuración entregada, el formulario informa que el acceso está en preparación y no intenta crear cuentas.
- Con configuración de prueba y respuestas de servidor simuladas: rechazo de contraseñas diferentes, alta, verificación por código, acceso, cierre de sesión, recuperación y cambio de contraseña.
- Compatibilidad del campo de código con 6 a 10 dígitos y verificación de correo con tipo email.
- Se conservan CNAME, .nojekyll, logotipos, RetroLib, datos de transferencia y páginas legales del sitio original.

## Pendiente de comprobar en producción

No se realizó una inspección visual en navegador ni pruebas en teléfonos físicos: no había disponible un controlador de navegador para esta tarea. Las pruebas de interacción se ejecutaron sobre un DOM simulado; no validan el renderizado CSS, CSP, accesibilidad completa ni la entrega de correos.

No se accedió al panel privado de Supabase, Resend o Cloudflare. No se crearon cuentas reales, no se enviaron correos, no se hicieron transferencias ni se probó disponibilidad de los servicios externos. No se publicó el sitio ni se modificó un repositorio de GitHub.

Antes de activar clientes, completa CONFIGURACION_Y_PUBLICACION.md y realiza una prueba real del flujo de correo. Antes de anunciar pagos, verifica los datos bancarios existentes. El botón Pagar lleva a transferencia manual; no es un checkout ni confirma pagos automáticamente.
