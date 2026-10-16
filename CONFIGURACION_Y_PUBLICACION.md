# ExeptedTech — publicación y acceso de clientes

Revisión: 16 de octubre de 2026.

## Estado real

La página pública es estática y se puede subir a GitHub Pages. El catálogo, las cotizaciones y la sección de pagos no necesitan una cuenta. No hay carrito ni cobro automático: el botón Pagar lleva a los datos de transferencia y muestra el producto seleccionado. La recepción del dinero se comprueba manualmente.

El inicio de sesión y el registro NO están activos: `config.js` contiene `registrationEnabled: false` y `turnstileSiteKey: ''`. Hay URL y clave pública de Supabase, pero no se ha comprobado la configuración privada del proyecto, SMTP ni la entrega real de correos. El archivo original hacía referencia a una guía que no estaba incluida; esta guía cubre los pendientes de esta entrega.

## Activar las cuentas

1. Abre tu proyecto en Supabase. En Authentication, habilita el proveedor Email y la confirmación de correo. No desactives Confirm email: el formulario está diseñado para cuentas verificadas.
2. Configura un proveedor SMTP propio para enviar correos a clientes. Si utilizas Resend, verifica tu dominio y su remitente y copia en Supabase los datos SMTP que te proporcione Resend. Las contraseñas SMTP y claves privadas van únicamente en los paneles de esos servicios.
3. En las plantillas de confirmación de alta y recuperación, incluye `{{ .Token }}` para que el cliente pueda copiar el código. El sitio permite códigos numéricos de 6 a 10 dígitos. No depende de un enlace de confirmación: el usuario escribe el código en esta página.
4. Configura la URL del sitio como `https://exeptedtech.xyz` y las URL de redirección que realmente utilices. Si pruebas en un dominio de GitHub Pages, agrégalo también. Comprueba que CNAME y DNS apuntan al dominio deseado.
5. Crea un widget de Cloudflare Turnstile para los dominios donde publicarás. Registra su clave secreta en la protección CAPTCHA de Supabase. Copia solamente su clave pública en `turnstileSiteKey` dentro de `config.js`.
6. Completa los datos de contacto que el aviso de privacidad original marca como pendientes. Si creas tablas de perfiles, pedidos u otros datos, configura sus políticas RLS antes de exponerlas. Esta versión solo utiliza Supabase Auth; no crea tablas de pedidos ni notificaciones administrativas.
7. Cambia `registrationEnabled` a `true` cuando termines los pasos anteriores y publica `config.js`. Eso habilita los formularios; no sustituye las pruebas siguientes.
8. Prueba con una cuenta de correo tuya: alta → recepción de código → verificación → cerrar sesión → iniciar sesión → recuperar contraseña → nuevo acceso. Prueba también contraseña incorrecta, código vencido y reenvío. No entregues el registro a clientes hasta completar esta prueba real.

La sesión se guarda solo en memoria. Recargar la página exige volver a entrar. No incluye historial de compras ni panel de administración. Un registro de usuario por sí solo no demuestra que un pago se haya recibido.

Nunca subas a GitHub la API privada de Resend, la contraseña SMTP, una clave `service_role`, `sb_secret_` o la clave secreta de Turnstile. La clave `sb_publishable_` existente es pública por diseño.

## Subir a GitHub Pages

1. Descomprime el ZIP en tu computadora.
2. Abre el repositorio de tu sitio y reemplaza sus archivos por el contenido de esta carpeta. `index.html` debe quedar en la raíz, no dentro de otra carpeta ni dentro de un ZIP.
3. Incluye `experience.css`, `experience.js`, los archivos originales actualizados, la carpeta `assets`, `CNAME` y `.nojekyll`.
4. Guarda los cambios con Commit changes. En Settings → Pages, utiliza la rama de publicación correspondiente y la carpeta raíz.
5. Cuando termine el despliegue, abre el sitio y actualiza con Ctrl+F5. Comprueba Catálogo, Canciones IA, cotización, Pagar y los enlaces de privacidad.
6. Confirma en tu banco que la CLABE y el beneficiario conservados del sitio original son correctos. No se han validado con una entidad bancaria.

## Qué incluye la mejora

- Identidad azul eléctrico, tarjetas con profundidad y luces, vinilo y ecualizador decorativos, transiciones y efectos suaves.
- Diseño adaptado a pantallas pequeñas y respeto de la preferencia de reducir movimiento.
- Canciones con IA desde $250 MXN, dos versiones, corrido/rap/reggaetón y entrega anunciada de 1 a 3 días a confirmar.
- Formulario de solicitud musical que prepara el mensaje de WhatsApp sin enviarlo automáticamente.
- Cotización y Pagar en todos los productos del catálogo, paquetes web y servicios vendidos.
- Selección de producto y concepto en pagos, y mensaje de comprobante con el producto elegido.

## Referencias técnicas para configurar

- https://supabase.com/docs/guides/auth/auth-email-templates
- https://supabase.com/docs/guides/auth/auth-captcha
- https://supabase.com/docs/guides/auth/auth-smtp

## Límites de la revisión

Consulta `VERIFICACION.md`. La comprobación del código no equivale a probar SMTP, cobros, disponibilidad de servicios externos o el aspecto visual en navegadores y teléfonos reales.
