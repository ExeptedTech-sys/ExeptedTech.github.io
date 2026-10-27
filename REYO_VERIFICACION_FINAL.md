# Informe de verificación — ExeptedTech con Reyo Assistant

**Fecha:** 27/10/2026 · **Sitio origen:** ZIP `ExeptedTech.github.io-main (7).zip`.

## Cambios principales
- Nuevo bloque Reyo con funciones de aprendizaje técnico, logo oficial, enlaces y planes Free / Pro próximo.
- Nueva `reyo.html` para presentar el asistente de forma independiente.
- Widget chat integrado con Render, CTA desde la página y navegación a sección Reyo.
- La esquina izquierda inferior se reserva para Reyo; WhatsApp conserva la derecha.
- En pantallas móviles, los dos accesos se posicionan sobre la barra de navegación inferior; el chat abierto es de pantalla completa.
- Ajuste de altura del chat con `visualViewport` cuando el teclado virtual modifica la ventana.
- Política CSP actualizada para permitir **únicamente** el host Render de Reyo en `connect-src`.
- PNG original de Reyo (aprox. 2.7 MB) reemplazado en web por logo WebP optimizado (aprox. 45 KB) e icono WebP (aprox. 12 KB).
- Se mantienen componentes originales de catálogo, carrito, registro, WhatsApp, donaciones y demás archivos.

## Pruebas técnicas realizadas
- Análisis de sintaxis JavaScript de los scripts; CSS mediante analizador; comprobación de archivos vinculados, HTML y duplicados de ID.
- Prueba de interacción de chat con datos **simulados** en Chromium (Playwright) mediante `set_content`: tamaños 320x640, 375x667, 390x844, 412x915, 768x1024, 1280x800 y 1440x900.
- Se comprobó en estos tamaños: WhatsApp sin choque con Reyo, barra inferior sin choque, sin desbordamiento horizontal del documento, abrir/cerrar chat, escritura, respuesta simulada, renderizado de negritas y ausencia de excepciones JavaScript en la interacción probada.
- La emulación se ejecutó con el CSS de la web y su HTML, más el JS del widget; los demás scripts de negocio no se cargaron durante esa prueba aislada.

## No verificado / pendiente después de la publicación
- Safari en un iPhone real, otros motores de navegador, teclados virtuales reales y hardware Android de diferentes gamas.
- Flujo real de facturación, pago, registro y checkout con proveedores externos.
- Que CORS en Render ya tenga `https://exeptedtech.xyz` y `https://www.exeptedtech.xyz`.
- Conexión real con OpenAI y limitaciones del backend después del deploy, o pruebas de carga / múltiples visitantes reales.
- Rendimiento real de Internet móvil o Core Web Vitals en producción.

**Resultado de revisión estática e interacciones del chat:** sin errores detectados.

**Nota:** este ZIP publica la web en GitHub Pages, pero no actualiza automáticamente el backend de Render.
