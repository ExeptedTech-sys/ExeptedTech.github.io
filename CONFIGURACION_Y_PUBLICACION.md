# Publicar la actualización completa

1. Descomprime el ZIP.
2. Abre tu repositorio existente en GitHub y la rama que publica tu página.
3. Add file → Upload files. Arrastra todos los archivos y la carpeta assets desde DENTRO de la carpeta descomprimida. index.html debe estar en la raíz.
4. Guarda con Commit changes y espera el despliegue correcto en Actions.
5. Abre https://exeptedtech.xyz y actualiza con Ctrl+F5. En el teléfono, recarga la página o abre una pestaña privada para comprobar la versión nueva.

Esta versión lleva referencias de CSS y JavaScript con el identificador 20261016-release3 para evitar reutilizar los archivos de diseño de entregas anteriores.

## Acceso de clientes

config.js incluye registrationEnabled: true y la Site Key pública proporcionada por el propietario. No es necesario editarlo para habilitar el formulario.

El propietario indicó haber configurado Turnstile en Supabase y Resend para el correo. Es necesario que la Secret Key de Supabase corresponda al mismo widget de Cloudflare. Los dominios autorizados son exeptedtech.xyz y www.exeptedtech.xyz. La Secret Key y las claves SMTP/Resend NO se publican en GitHub.

Las plantillas de confirmación y recuperación deben incluir {{ .Token }} para introducir el código numérico en la página. El campo acepta de 6 a 10 dígitos. Mantén la confirmación de correo habilitada en Supabase.

Prueba con tu correo: alta → código recibido → verificación → cerrar sesión → iniciar sesión → recuperación. Si falla, identifica el mensaje de la página y comprueba el registro correspondiente de Supabase o Resend. No compartas contraseñas ni códigos.

La sesión se mantiene en memoria; al recargar se vuelve a iniciar sesión. El sitio no incluye historial de compras ni verificación automática de pagos.

## Documentación técnica

https://supabase.com/docs/guides/auth/auth-captcha
https://supabase.com/docs/guides/auth/auth-smtp
https://supabase.com/docs/guides/auth/auth-email-templates
https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/widget-configurations/
