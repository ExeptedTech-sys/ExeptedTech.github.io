# Auditoría técnica ExeptedTech Ultimate

**Fecha:** 17 octubre 2026. **Entorno:** HTML incrustado en Chromium con el código CSS/JavaScript cargado desde los archivos del proyecto.

## Comprobaciones ejecutadas
- 10 resoluciones: 320, 360, 375, 390, 430, 600, 768, 900, 1024 y 1440 px.
- Se renderizan los 45 productos/variantes; asistencia por WhatsApp en todos.
- El carrito suma una selección Tech Business ($1,800) + primer periodo de mantenimiento ($250) = $2,050 y precarga ese importe manual en el formulario de Mercado Pago.
- Búsqueda de Gemini muestra tres opciones; las ofertas restringidas remiten a consulta.
- Cuatro paquetes web y tres enlaces externos del portafolio presentes.
- Mensaje de privacidad se puede cerrar y no instala trackers propios de marketing.
- No hubo excepciones JavaScript ni desbordamiento horizontal en las pruebas embebidas.
- Código de verificación en formulario y JavaScript: ocho dígitos.
- Enlace de cobro público se conserva, pero es de monto abierto y no valida ni confirma los pedidos.
- Rutas y anclas locales revisadas. El archivo `config.js` falta INTENCIONALMENTE en el ZIP; debe existir en el repositorio.

## Límites de validación
La prueba de navegación por HTTP local fue bloqueada por la política de red del entorno y **no está aprobada ni se presenta como superada**. No se pueden asegurar ausencia universal de errores, acceso a todas las plataformas, correcta configuración Supabase, Turnstile, verificación de cuentas, créditos de Google Ads ni cobros de Mercado Pago sin pruebas manuales sobre dominio real.

El hosting GitHub Pages no ofrece controles backend ni confirmaciones firmadas de pagos. La contraseña RetroLib en JavaScript solo es una barrera de interfaz, no una protección criptográfica. Revisa RLS Supabase y el inventario real de accesos. El aviso de privacidad requiere completar domicilio/identidad empresarial y validación legal conforme a actividad, y los sitios mostrados requieren autorización documentada. No se han publicado cifras o resultados no verificados de clientes.

**Mercado Pago:** El usuario debe introducir exactamente el importe confirmado en la página de Mercado Pago; el equipo comprueba el pago en su cuenta oficial. No es un checkout automatizado. Para cobrar y actualizar historial de forma automática se necesita Checkout Pro/Orders API más backend confiable y webhook firmado.
