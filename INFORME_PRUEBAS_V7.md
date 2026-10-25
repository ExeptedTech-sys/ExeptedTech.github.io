# Informe de verificación — NOVA v7 — 25 de octubre de 2026

## Comprobaciones completadas
- Sintaxis con `node --check` en JS del sitio v7 y en herramientas JavaScript del Centro de Android: superada.
- XML Android (manifest, layout, styles y drawables): validación estructural superada.
- Tests de navegador Chromium para la web en 320, 375, 430, 768 y 1366 px: 45 productos, 45 enlaces de ayuda, un catálogo, sin overflow horizontal y sin errores JavaScript.
- Asesor NOVA: envía una lista de tres recomendaciones de prueba basadas en filtros. No recopila ni transmite datos personales.
- Carrito: se abre y contiene las opciones de Mercado Pago con tarjeta (condicional) y transferencias SPEI a Mercado Pago y Nu. Checkout automático `commerceEnabled: false` por defecto.
- Centro NOVA Android: en navegador Chromium, se visualiza `Mi plan`, se agrega un artículo con precio y se recalcula el presupuesto sin excepciones JavaScript. La persistencia local y los recordatorios requieren prueba en dispositivo.
- Web y copia local Android sincronizadas: mismos archivos web de NOVA v7.

## Verificaciones NO realizadas
- Compilación Gradle/Android Studio y ejecución en equipo físico: Android SDK ausente en el entorno de creación. El proyecto incluye GitHub Actions como método alterno de compilación.
- Login real, pagos, correo Resend, webhook Mercado Pago, seguridad de Supabase, transferencias, acceso RetroLib y comportamiento con red móvil lenta: requieren servicios reales y pruebas de integración.
- Pruebas exhaustivas de accesibilidad con lectores de pantalla, seguridad pen-test, todo iPhone/Android y auditoría legal. No existen garantías de 100% cobertura, cero lag ni '100% legal'.

## Recomendaciones de lanzamiento
1. Respaldar repo y publicar web v7. No subir tokens privados ni `.env`.
2. Verificar el CNAME `exeptedtech.xyz`, login, carrito, RetroLib y derechos sobre servicios de terceros.
3. Habilitar en Supabase únicamente productos autorizados y probar pagos de prueba antes de `commerceEnabled: true`.
4. Para confirmar transferencias, usar comprobación bancaria manual con referencia y no asignar `paid` automáticamente.
5. Probar en Android 9, 11, 13, 15 y 17 con conexiones wifi y datos; probar permiso de notificaciones y navegación a apps externas.
