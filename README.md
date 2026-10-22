# Actualización móvil v4

Revisa `ACTUALIZACION_MOVIL_V4.md` para cambios, pruebas y publicación en GitHub.

# ExeptedTech Ultimate — GitHub Pages

Actualización: 22 de octubre de 2026. Sitio público HTML/CSS/JS con portafolio, servicios web, extras, catálogo, carrito y pagos manuales por Mercado Pago.

## Contenido
- 4 paquetes web: Personal bajo cotización, Tech Business $1,800 (antes $2,200), Tech Business Plus $2,800 (antes $3,000), Luvia Corp VIP $4,800 (antes $5,000).
- Mantenimiento opcional Personal $250/15 días; Business y Plus $250/semana; VIP $1,000/semana. No hay suscripciones automáticas.
- Apps Android/iOS $2,000-$8,000 por plataforma según cotización, Google Ads asesoría $1,500 (sin inversión publicitaria), canción de negocio $799 sujeto a licencia escrita.
- 45 artículos y variantes en catálogo; asistencia WhatsApp disponible en todos; productos de terceros restringidos quedan en consulta, no compra directa.
- Portafolio con enlaces a SIAMA, Save & Care y Emiliano Magaña.
- Mejoras accesibles en móvil, efectos CSS con reducción de movimiento, nueva sección de donaciones y transferencia, aviso informativo de privacidad y avisos de contratación ampliados.
- Login/OTP de 8 dígitos conservados de la versión que funcionaba en Supabase.

## Publicar
1. **No elimines `config.js` de tu repositorio**. Está OMITIDO de este ZIP; la configuración pública vigente permanece en GitHub.
2. Respaldar repositorio y subir los archivos y directorio `assets` de este ZIP a la raíz de la rama publicada. No subir una carpeta contenedora.
3. Conserva `.nojekyll` y `CNAME`.
4. Espera GitHub Actions y prueba en modo privado: login y OTP, carrito, WhatsApp, Mercado Pago, donaciones, transferencia, portafolio, privacidad, móviles.
5. Confirma por escrito alcances/precios, autorizaciones, datos legales y beneficiario de Mercado Pago antes de cobrar.

**Los archivos del ZIP son públicos. Nunca publiques el access token de Mercado Pago, contraseña SMTP de Resend, service_role de Supabase ni tokens secretos.**

Consulta `REVISION_ANTES_DE_PUBLICAR.md` y `AUDITORIA_FINAL.md`.


## Actualización neón y cuentas bancarias · 22 de octubre de 2026
Se implementaron tarjetas de donaciones Mercado Pago (amarillo neón) y Nu (morado neón), con botones para copiar CLABE y nombre de titular, verificación visual, mejoras de interfaz y optimización móvil. Se corrigió el evento del cambio de contraseña por OTP, el cierre del carrito al pasar a transferencia y el cotizador de productos. **Nu también está disponible para pagar compras previamente confirmadas**, además de las aportaciones voluntarias. Consultar `PRUEBAS_Y_PUBLICACION_FINAL.md` para pruebas realizadas, límites y pasos de publicación.

## Actualización pagos Nu · 22 de octubre de 2026

Se habilita transferencia SPEI a **Nu México** (CLABE `638180010114203813`, titular **Iñaki A Reyo**) también en **Pagos y compras** y en la selección de pago del carrito. Se mantienen Mercado Pago y el apartado de donaciones. La confirmación y conciliación de abonos son manuales; ninguna transferencia se certifica automáticamente por la web.
