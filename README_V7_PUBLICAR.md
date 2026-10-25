# ExeptedTech NOVA v7 · Publicación

## Entrega
- Copia de la web v6 modernizada, mismo proyecto Supabase / Mercado Pago.
- Una sola tienda con 45 referencias; 40 productos con precio y acción de carrito, 5 por consulta.
- Asesor Nova: recomendaciones explícitas según filtros introducidos por la persona; sin API de IA, sin seguimiento publicitario ni perfiles remotos.
- Diseño premium refinado: hero, RetroLib, interfaz de cuenta y carrito, barra móvil y accesibilidad.
- Métodos existentes: tarjeta con Mercado Pago solo para productos habilitados en Supabase, transferencia Mercado Pago SPEI y Nu SPEI bajo validación humana. La transferencia no produce estado `paid` automático ni correo de pago confirmado.
- `commerceEnabled: false` por seguridad hasta validar la compra de prueba real. Para activarlo cambiar a true en config.js después de pruebas y autorización comercial.

## Publicación segura
1. Crea una rama de respaldo de GitHub Pages y revisa Settings > Pages / CNAME.
2. Sube los archivos interiores de este directorio a la raíz de la rama publicada, preservando `assets`, `CNAME`, `privacidad.html`, `terminos.html`.
3. Elimina archivos v6 obsoletos solo después de verificar que no son referenciados. No incluyas carpetas con código privado ni credenciales.
4. Comprueba inicio de sesión, recuperación, navegación, RetroLib, carrito y WhatsApp en dispositivos; revisa consola y Network del navegador.
5. Prueba cobros aprobados/rechazados/repetidos y webhooks, y los correos de Resend, con producto habilitado; después decide activar checkout productivo.
6. Revisa los términos, comprobantes fiscales, legitimidad y autorización de reventa de servicios/licencias de terceros con asesor legal; el código no garantiza cumplimiento al 100%.

## Rendimiento
- CSS y JS locales y con defer; imágenes WebP existentes, animaciones de transform/opacity con reduced-motion, sin librerías visuales de terceros.
- Recomendaciones calculadas localmente en una lista pequeña (45 referencias).
- Los servicios externos (Supabase, Mercado Pago, Resend y DNS) siguen requiriendo red.

## Atención
Las cuentas bancarias publicadas antes de v7 no se han cambiado. Comprueba su titularidad/CLABE antes de anunciar transferencia al público.
