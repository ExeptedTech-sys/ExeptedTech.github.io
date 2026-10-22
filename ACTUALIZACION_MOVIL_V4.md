# ExeptedTech — actualización de rendimiento móvil v4

## Qué se corrigió

- **Mi cuenta**: el desplegable ahora se mueve a una capa independiente del encabezado, se calcula dentro del ancho real del teléfono, tiene desplazamiento interno si la pantalla es corta y se cierra tocando fuera o presionando Escape. El apodo se trunca únicamente en el botón del encabezado; en el desplegable se lee completo.
- **Menú hamburguesa**: se usa también en tablets y laptops estrechas, donde antes la navegación completa podía salirse del borde.
- **Inicio de sesión**: al recibir una sesión válida, el formulario modal se cierra y el foco vuelve a Mi cuenta. Continúa siendo obligatorio configurar Supabase y Cloudflare Turnstile.
- **Carrito**: ancho completo en celular; cierre visible en la parte superior incluso durante desplazamiento; navegación por teclado; conserva cantidades, total, Mercado Pago y Nu.
- **Rendimiento**: desactivadas en pantalla pequeña las capas desenfocadas fijas y animaciones ornamentales continuas más costosas. Conservaron los gradientes, contornos y colores neón.
- **Desplazamiento**: actualización agrupada mediante requestAnimationFrame, barra de avance con transform GPU en lugar de cambiar el ancho, transiciones más cortas y desplazamiento automático en teléfonos.
- **Catálogo**: filtrado con índice de búsqueda, demora de 110 ms al escribir y actualización agrupada con DocumentFragment.
- **Imágenes**: decodificación asíncrona y carga diferida de RetroLib.

## Pruebas reproducibles efectuadas

Chromium en modo de emulación: 320×680, 360×740, 375×812, 393×852, 430×932, 768×1024, 1024×768 y 1440×900. En las 8 resoluciones se comprobó: menú Mi cuenta dentro del viewport, seis opciones accesibles, abrir y cerrar carrito, añadir un producto, aviso flotante, selección Nu en el checkout, datos Nu, cierre del modal de acceso tras evento de autenticación y ausencia de errores JavaScript detectados. El área horizontal del documento no superó el ancho de pantalla.

**Límites:** los ensayos usaron HTML/CSS/JS locales y una sesión simulada para revisar la interfaz. No se pudo verificar el inicio de sesión real con Supabase/Turnstile, la liquidación de pagos ni el rendimiento en dispositivos físicos. El comportamiento depende de la conexión, memoria, navegador y servicios externos.

## Publicación en GitHub Pages

1. Descomprime el ZIP y sube todos sus archivos a la raíz de tu repositorio, sustituyendo los anteriores.
2. **Conserva el `config.js` actual** si está correctamente configurado. Este paquete no incluye ni genera credenciales y no debe contener claves privadas. Usa únicamente la clave pública y el identificador público de Turnstile.
3. Conserva tus ajustes de dominio y DNS; el archivo `CNAME` corresponde al paquete previo.
4. Tras publicar, comprueba el dominio desde una pestaña de incógnito o borra la caché. Las referencias a CSS/JS renovadas ayudan a evitar una versión antigua almacenada.
5. Realiza una compra de prueba **sin transferir dinero** y revisa en Android Chrome y Safari iOS real: menú, inicio/cierre de sesión, carrito, ver opciones y copiar datos bancarios. Verifica que la cuenta Nu y el enlace Mercado Pago correspondan a los datos autorizados.

No hay ninguna promesa de seguridad absoluta ni se implementa en esta versión un procesador propio de tarjetas.
