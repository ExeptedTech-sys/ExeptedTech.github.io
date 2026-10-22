# ExeptedTech · Entrega de diseño, donaciones y seguridad

**Fecha:** 22 de octubre de 2026  
**Versión:** compatible con GitHub Pages, frontend estático sin procesamiento directo de tarjetas. Incluye la cuenta Nu en pagos y carrito.

## Cambios incorporados

- Dos tarjetas de aportaciones claramente diferenciadas: Mercado Pago en **amarillo neón** y Nu México en **morado neón**. Animaciones CSS de brillo y energía, con soporte `prefers-reduced-motion` para accesibilidad.
- Para **cada institución**, botones independientes de **Copiar CLABE** y **Copiar nombre**, con confirmación accesible y alternativa en navegadores que bloquean el portapapeles.
- **Mercado Pago:** CLABE `722969011686374403`, beneficiario indicado previamente: **Iñaki Adrian Reyo Olan**.
- **Nu México (donaciones y pagos de productos/servicios):** CLABE `638180010114203813`, beneficiario facilitado por el dueño: **Iñaki A Reyo**.
- Botón para tarjeta a través del enlace público existente de Mercado Pago. Ninguna tarjeta se introduce en la web.
- La sección **Pagos y compras** también muestra la CLABE Nu `638180010114203813`, a nombre de **Iñaki A Reyo**, con botones de copia para cada dato. El carrito ofrece opciones independientes para transferencia Nu y Mercado Pago y abre el panel del banco seleccionado.
- Menú «Sobre nosotros» y página de historia de ExeptedTech/Luvia Company, RetroLib retrofuturista, donaciones inspiradas en exploración y supervivencia (sin assets comerciales de terceros).
- Cotizador autocompletable con sugerencias por coincidencias de inicio, nombre, categoría y palabras, navegación con teclado y precios orientativos para productos no restringidos. Los restringidos requieren cotización/autorización.
- Interfaz móvil en 320, 375, 393 y 768 px; ajustes para zonas seguras/notch, botones táctiles, modales del carrito y reducción de movimiento.
- Corrección del evento del flujo seguro para solicitar recuperación de contraseña por OTP de correo; ya no queda escuchando en un destino de eventos distinto del emisor.
- Ajuste al cierre del carrito al acceder a transferencia, actualización del apodo en cabecera y registro local de categorías visitadas.
- Términos y aviso de privacidad actualizados con información proporcionada y advertencias expresas de datos pendientes.

## Verificaciones realizadas

- `node --check` sin errores sintácticos en los archivos JavaScript incluidos.
- Pruebas de interfaz en Chromium **con el documento cargado en memoria** a 320×740, 375×812, 393×852, 768×1024 y 1440×900: **sin errores de ejecución JS detectados**; el ancho desplazable del documento principal quedó dentro de la anchura de cada viewport. La franja de categorías se desplaza horizontalmente de forma intencional.
- Se verificaron la presencia de dos botones de copia por cuenta, copia de la CLABE Nu con confirmación, sugerencias de cotización (`Minecraft` devuelve resultados), selección de sugerencia, apertura/cierre del carrito, incremento del contador al añadir un producto y aparición del aviso de carrito.
- Se verificó **solo la longitud y el dígito de control matemático** de ambas CLABE, no titularidad, activación ni recepción de transferencias.
- Pruebas complementarias del panel Nu en **Pagos** a 320×740, 375×812, 393×852 y 1440×900: apertura, copia de titular, opciones para elegir Nu o Mercado Pago desde el carrito, cierre del carrito, enfoque y desplazamiento hacia los datos elegidos, sin errores JavaScript. Se corrigió la superposición del aviso de privacidad sobre el carrito y los fondos originales de los botones bancarios (Nu morado / Mercado Pago amarillo).
- Las pruebas ejecutadas **no** prueban pasarela de pago real, recaudación, entrega, autenticación real ni envío de correos; dependen de sistemas externos. La navegación automática a localhost y `file://` fue denegada en el navegador de prueba, por lo que se usó renderizado aislado en memoria.

## Pendientes indispensables antes de anunciar una operación comercial segura

1. **Titularidad bancaria:** abre tu app Nu y verifica la CLABE, el nombre que muestra la transferencia y que la cuenta está activa. Repite la comprobación en Mercado Pago. No publiques instrucciones falsas ni promesas de pago confirmado.
2. **Datos legales:** añade y valida calle, número, colonia, código postal y otros datos completos del domicilio físico de atención/notificaciones; informa RFC y situación fiscal donde corresponda. El dato «alcaldía Cuauhtémoc, CDMX» **no sustituye un domicilio completo**. Solicita revisión jurídica mexicana de términos, reembolsos, responsabilidades y aviso de privacidad antes de cobrar.
3. **Supabase y Turnstile:** conserva `config.js` público de la versión que ya tienes en GitHub (falta intencionalmente en el ZIP), verifica que solo contiene URL, publishable/anon key y sitekey públicas. Activa email confirmado, CAPTCHA de servidor, límites de envío y contraseña, configuraciones correctas de dominio y las políticas **RLS** de tablas y pedidos. Nunca publiques `service_role`, contraseñas SMTP, claves privadas ni tokens de servidor.
4. **Pedidos y pagos:** el carrito estima importes; el enlace público de Mercado Pago no sincroniza importes ni marca pedidos pagados. Una integración automática exige backend y webhook del procesador con firma y comprobación del lado servidor; GitHub Pages, por sí solo, no lo realiza.
5. **Pruebas en dispositivos físicos:** prueba Chrome Android y Safari iPhone con conexión segura HTTPS y también un navegador de escritorio, incluidos teclado, zoom del 200 %, acceso y registro, verificación de correo, recuperación de contraseña, transferencia, WhatsApp y pago de prueba autorizado.
6. **Ventas de licencias/cuentas de terceros:** solo acepta pedidos cuyas autorizaciones comerciales y reglas de plataforma hayas confirmado por escrito.

## Despliegue en GitHub Pages

1. Haz una copia del repositorio actual y de `config.js`.
2. Extrae el ZIP, sube sus archivos y la carpeta `assets` **a la raíz** del repositorio publicado, conservando `.nojekyll` y `CNAME`.
3. **No borres el `config.js` existente de tu repositorio**. El ZIP no lo incluye para evitar sustituir la configuración de tu instalación.
4. Espera a que GitHub Pages publique el cambio y vacía la caché del navegador, si hace falta.
5. Ejecuta los controles anteriores **antes** de activar cobros al público.

### Referencias oficiales para revisión jurídica

- Ley Federal de Protección de Datos Personales en Posesión de los Particulares, arts. 15, 16, 18 y ARCO: https://www.diputados.gob.mx/LeyesBiblio/pdf/LFPDPPP.pdf
- PROFECO, requisitos de información al consumidor en comercio electrónico: https://www.gob.mx/profeco/articulos/garantia-y-compras-en-linea?idiom=es
- Código de Ética en materia de Comercio Electrónico, identificación y contacto del proveedor: https://sidof.segob.gob.mx/notas/docFuente/5612351

**Alcance de la entrega:** implementación y pruebas de interfaz, no dictamen legal, certificación de ciberseguridad ni auditoría de pentesting.
