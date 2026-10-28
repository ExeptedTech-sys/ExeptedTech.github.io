# ExeptedTech + RetroLib Libre 1.3.5 — publicación en GitHub Pages

## Qué está hecho

- `index.html`: sección RetroLib **integrada** y actualizada (sin duplicados, ni enlace Drive con contraseña).
- `retrolib.html`: página detallada de la aplicación, 10 plataformas, beneficios y disponibilidad.
- `privacidad-retrolib.html`: política de privacidad de RetroLib con el correo ya publicado en el aviso de privacidad general del sitio.
- `retrolib-logo.webp`: imagen de la aplicación; `retrolib-home.css`: ajustes de portada.
- `sitemap.xml`, `terminos.html`, `polish.js` y enlaces del pie: adaptados a la nueva versión.
- Se conservan los archivos del sitio original, incluidos `CNAME`, tienda y Reyo Assistant.

## Cómo subir el sitio completo

1. Haz una copia de seguridad del repositorio actual en GitHub antes de sustituir archivos.
2. Abre el repositorio que actualmente publica `exeptedtech.xyz` y verifica **Settings → Pages → Build and deployment** (la fuente puede ser `main` raíz o `/docs`).
3. **Descomprime** `EXEPTEDTECH-RETROLIB-135-GITHUB-LISTO.zip`. En la carpeta `ExeptedTech.github.io-main` están los archivos y subcarpetas listos. GitHub Pages no publica un ZIP subido como archivo.
4. Copia / sube el **contenido de esa carpeta**, no la carpeta contenedora ni el ZIP. Conserva la misma estructura de `assets/`, `reyo/`, CSS, JS y HTML. En la web de GitHub utiliza **Add file → Upload files**, arrastrando el contenido, o utiliza Git para sincronizarlo; comprueba que se reemplazan los archivos cambiados.
5. Haz commit y comprueba el despliegue en **Actions** o **Settings → Pages**. No borres `CNAME` ni cambies el dominio sin necesidad.
6. Prueba estas direcciones en modo incógnito:
   - https://www.exeptedtech.xyz/
   - https://www.exeptedtech.xyz/retrolib.html
   - https://www.exeptedtech.xyz/privacidad-retrolib.html
7. Confirma que la dirección pública de privacidad coincide con la que declares en Play Console; revisa el contacto `exepteduniversity@gmail.com` antes de publicarlo.
8. El botón a Google Play **no está habilitado** hasta que tengas la URL oficial verificada de la aplicación y esté aprobada. No distribuyas en la web el AAB ni la clave de firma `.jks`.

## Comprobaciones pendientes de producción

Esta actualización afecta únicamente a la web. No garantiza que Google Play apruebe la app. Revisa licencias de los núcleos, política de seguridad de datos, el AAB y la URL de privacidad. La aplicación no incluye ROMs ni BIOS.
