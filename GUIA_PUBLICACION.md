# ExeptedTech · Guía de publicación y comprobaciones

## Resumen
Esta actualización está preparada para reemplazar los archivos públicos de tu repositorio GitHub Pages ACTUAL. No cambies el dominio ni los DNS. **El ZIP no incluye `config.js` intencionalmente**; conserva el `config.js` que ya está publicado en tu repositorio.

## Actualizar con GitHub Desktop (recomendado)
1. Descarga una copia de seguridad del repositorio actual desde GitHub → Code → Download ZIP.
2. Abre GitHub Desktop → File → Clone repository y selecciona el repositorio que ya publica exeptedtech.xyz.
3. Descomprime este ZIP y COPIA su contenido dentro de la carpeta local del repositorio. Acepta reemplazar los archivos que coincidan.
4. **No elimines `config.js`**, aunque no figure en este ZIP. Tampoco elimines tus propios archivos que todavía sean necesarios.
5. En GitHub Desktop revisa el listado de archivos modificados y haz Commit to main → Push origin. Si tu sitio publica desde otra rama, utiliza esa rama.
6. En GitHub → Actions confirma que el despliegue finalizó sin errores y en Settings → Pages conserva dominio y fuente de publicación.

## Actualizar desde el navegador
1. Entra al repositorio actual de GitHub → Code → Add file → Upload files.
2. Arrastra los archivos y carpetas **descomprimidos** del ZIP (no el ZIP en sí ni una carpeta contenedora).
3. Confirma la rama de publicación correcta y haz Commit changes.
4. Si GitHub no deja sobrescribir correctamente varios archivos o carpetas, utiliza GitHub Desktop.
5. Comprueba que `index.html`, `polish.css`, `polish.js`, `account.js`, `styles.css`, `account.css`, `assets/`, `robots.txt`, `sitemap.xml`, `CNAME` y el `config.js` existente están en la raíz.

## Comprobaciones tras publicar
- Abre https://exeptedtech.xyz/ en ventana privada. Si ves la versión anterior, fuerza recarga Ctrl+Shift+R (Windows) o Cmd+Shift+R (Mac).
- Revisa en celular y PC: menú, botón de iniciar sesión/registro (abre el formulario real), WhatsApp, botón Pagos, enlaces legales y sección de recomendaciones.
- Haz clic en Descargar RetroLib: contraseña incorrecta se rechaza; contraseña correcta muestra el agradecimiento y un botón de Google Drive. Es un filtro de interfaz, **no una protección de archivo del servidor**.
- En https://exeptedtech.xyz/robots.txt y https://exeptedtech.xyz/sitemap.xml confirma que ambas rutas responden.
- Revisa que https://exeptedtech.xyz siga apareciendo en Settings → Pages como dominio personalizado y que se mantenga HTTPS.
- Para crear cuenta real: confirma que el `config.js` EXISTENTE contiene supabaseUrl y supabaseAnonKey PUBLICABLES, turnstileSiteKey pública correcta y registrationEnabled: true. Supabase debe tener Confirm Email, SMTP y Turnstile habilitados.
- Completa Turnstile, pulsa Crear cuenta, revisa el mensaje de la web, Resend → Logs y Supabase → Authentication → Logs. Si el correo no llega, NO declares el registro listo.
- Opcional: verificar el sitio en Google Search Console y enviar https://exeptedtech.xyz/sitemap.xml. No se garantiza una posición de búsqueda.

## Advertencias
- El paquete público no contiene contraseñas SMTP, claves Resend ni claves privadas de Turnstile o service_role. **Nunca incluyas dichas claves en GitHub**.
- Las verificaciones disponibles son locales y con respuestas simuladas de Supabase. No constituyen una prueba real de SMTP ni de cobro con tarjeta.
- RetroLib redirige al enlace público de Drive tras introducir la contraseña. Si necesitas que el archivo esté realmente protegido, debes mover la validación del acceso a un servidor privado o usar permisos por usuario.
- Opiniones: se ha dejado una sección para testimonios auténticos, sin inventar clientes.
