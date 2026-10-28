# Publicar RetroLib en tu sitio de GitHub Pages (plan gratuito)

Tu web ya existe en `www.exeptedtech.xyz`; **no cambies su dominio ni borres su archivo CNAME**.

## Subir los archivos

1. En GitHub, abre el repositorio **que actualmente publica tu página** y ubica la carpeta desde la que se sirve el sitio (normalmente la raíz de `main` o `/docs`; compruébalo en **Settings → Pages → Build and deployment**).
2. En esa carpeta haz **Add file → Upload files** y sube juntos `retrolib.html`, `retrolib-logo.webp` y `privacidad-retrolib.html`.
3. Pulsa **Commit changes**. Si usas una rama protegida, crea un commit/pull request siguiendo tu flujo habitual.
4. Para añadir la sección a la portada, abre tu `index.html` y elige **Edit** (lápiz). Copia el contenido de `SECCION-RETROLIB-PARA-TU-INDEX.html` justo antes de `</main>`; si no existe `</main>`, colócalo antes de `</body>`. Haz Commit changes.
5. Comprueba desde un navegador sin iniciar sesión los enlaces `https://www.exeptedtech.xyz/retrolib.html` y `https://www.exeptedtech.xyz/privacidad-retrolib.html`.
6. En Play Console → Política de privacidad, indica la URL HTTPS verificada de la política.
7. Antes de la revisión pública, **añade un correo real de contacto para privacidad** a la política y a la ficha de Play; en esta entrega no hay correo inventado. Asegúrate de que la declaración de Datos de seguridad describa correctamente el acceso a CDN.
8. No añadas aún un botón de descarga inventado. Cuando Google apruebe RetroLib, cambia `Estado de disponibilidad` por un enlace real de Google Play.

## Si no aparece tu dominio

En GitHub **Settings → Pages**, verifica la fuente de publicación (branch/folder) y en Custom domain comprueba el dominio que ya usas. No lo reconfigures sin necesidad. El hosting GitHub Pages es gratuito para repositorios públicos compatibles.

## Restricciones de contenido

No publiques ROMs, BIOS, juegos comerciales ni capturas de videojuegos protegidos sin autorización. Usa capturas reales de la **interfaz** de RetroLib para la ficha de Play. Antes de anunciar compatibilidad universal, prueba cada núcleo.
