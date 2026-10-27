# Reyo Assistant integrado en ExeptedTech — Publicación GitHub Pages

## Archivos
- `index.html`: sección informativa Reyo y acceso al chat
- `reyo.html`: página independiente del asistente
- `reyo/assistant.js`: chat de Reyo 3.0, con mensajes, formatos y sesiones Free
- `reyo/assistant.css`, `reyo/assistant-v3.css`, `reyo/shop-integration.css`: estilos adaptativos
- `assets/reyo-assistant-logo.webp`, `assets/reyo-assistant-icon.webp`: emblema oficial optimizado
- `reyo-config.js`: URL pública del servidor (nunca contiene credenciales)

## Para publicar
1. Haz copia de seguridad de tu repositorio actual de la tienda.
2. Extrae el ZIP; sube **el contenido de la carpeta `ExeptedTech.github.io-main`** a la raíz del repositorio del sitio. NO subas solo el ZIP ni incluyas una carpeta extra.
3. Confirma los cambios en la rama que sirve GitHub Pages. Conserva `CNAME`.
4. En Render confirma que Reyo Assistant 3.0 está `Live` y que el backend permite `https://exeptedtech.xyz` y `https://www.exeptedtech.xyz` en `ALLOWED_ORIGINS`. No cambies ni expongas `OPENAI_API_KEY`.
5. Abre `https://exeptedtech.xyz/` y `https://exeptedtech.xyz/reyo.html`. Fuerza recarga Ctrl+F5 / ventana privada para limpiar caché.
6. Prueba desde Android y iPhone: chat abrir/cerrar, WhatsApp, barra inferior, scroll, teclado, formularios, carrito y checkout.
7. Comprueba en DevTools Network que `reyo/assistant.js` y las imágenes locales respondan 200; pregunta a Reyo algo técnico y verifica respuesta real.

## Disposición responsive
- WhatsApp permanece abajo a la derecha. Reyo se muestra abajo a la izquierda.
- En móviles, ambos quedan arriba de la navegación inferior; Reyo abierto cubre viewport para evitar solapamiento.
- El botón usa un icono recortado del emblema original: no recorta ni estira el logo de la página.

## Límites y advertencias
- Las cuotas efectivas, bloqueos y gastos son controlados por el servidor, no por este sitio estático.
- El plan Pro está solo anunciado, sin cobros.
- No se modifican carrito, pagos, registro, productos ni secretos de la web.
- Las pruebas del navegador se realizaron en Chromium con emulación de tamaños. Para garantizar Safari e iOS reales hace falta abrir la página desde esos dispositivos.
