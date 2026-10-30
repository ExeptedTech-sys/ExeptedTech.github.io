# ExeptedTech + RetroLib Libre 1.3.8 — Publicación en GitHub Pages

Última revisión local: 29 de octubre de 2026.

## Qué contiene este paquete

Es la **web que enviaste**, no una sustitución global por otro diseño. Se conserva la estructura actual, `CNAME`, la tienda, las cuentas, Reyo Assistant y el resto de archivos. Únicamente se actualizó RetroLib en `index.html` y se incorporaron `retrolib.html`, `privacidad-retrolib.html`, `licencias-retrolib.html`, `fuentes/` y `licencias/` de la edición 1.3.8.

La sección de portada anuncia cuatro plataformas (NES, Game Boy, Game Boy Color, Game Boy Advance), núcleos integrados localmente y ninguna descarga de ROMs/BIOS. No se anuncia una disponibilidad de Google Play que aún no existe.

## Subir al repositorio que publica exeptedtech.xyz

1. Realiza una copia del repositorio actual (descárgalo desde GitHub).
2. En GitHub, abre el repositorio que contiene `index.html` y `CNAME`. Comprueba en **Settings → Pages** que se publica desde la rama y carpeta correctas (normalmente `main` y `/`).
3. Descomprime este ZIP. Abre **dentro** de `ExeptedTech.github.io-main` y sube su **contenido**, no la carpeta exterior ni el ZIP. En GitHub Web: **Add file → Upload files**, arrastra archivos y carpetas, pulsa **Commit changes**.
4. Comprueba en **Actions** que la publicación acabó correctamente; conserva `CNAME` con `exeptedtech.xyz`.
5. Comprueba desde una ventana privada, sin iniciar sesión:
   - https://exeptedtech.xyz/
   - https://exeptedtech.xyz/retrolib.html
   - https://exeptedtech.xyz/privacidad-retrolib.html
   - https://exeptedtech.xyz/licencias-retrolib.html
   - https://exeptedtech.xyz/fuentes/emulatorjs-v4.2.3-source.zip
6. Completa el campo **Política de privacidad** de RetroLib en Google Play Console con la URL pública anterior (solo si realmente abre y coincide con la app). Revisa la sección de **Seguridad de los datos** con información real del AAB.
7. Haz la compilación firmada **1.3.8, código 111, variante playNoAds**, pruébala e inicia **Prueba interna**. El ZIP web no modifica el AAB ni publica la aplicación.

## Lo que aún NO está certificado

- Las instantáneas de fuentes en `fuentes/` son **fuentes de referencia**; la correspondencia reproducible con los binarios `.data` de RetroLib no está demostrada. Un archivo de licencia por sí solo no prueba cumplimiento GPL/MPL. Revisa todos los avisos y componentes de terceros antes de producción.
- No se ha confirmado desde aquí que GitHub Pages haya publicado esta actualización ni que el dominio responda. La configuración DNS/HTTPS y permisos de GitHub están fuera del ZIP.
- No se asegura la aprobación de Google Play. El informe previo al lanzamiento, la ficha de tienda y los requisitos de prueba y de datos de Play Console siguen pendientes.

**Seguridad:** No subas a GitHub archivos `.jks`, contraseñas, tokens, `local.properties`, ROMs o BIOS de terceros.
