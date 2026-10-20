# Calendarios Creativos · Colección 2027

Portal en español, con diseño adaptable a móviles. Orden de la página: presentación, grupo de WhatsApp, sorteo de 50 caballetes, opciones de pago, calendarios con vista previa/descarga, guía y videoclase Diamante.

## Desarrollo y publicación

Node.js 22 o superior, sin dependencias de ejecución. Desde la raíz: `npm start` (puerto 3000, configurable con `PORT`) y `npm run check` para sintaxis. En Vercel: Framework Other, sin build, Output Directory `public`. No ejecutar el servidor Node para el despliegue estático.

## Contenidos

`public/catalog.json` incluye 50 calendarios (10 PDFs disponibles y 40 posiciones bloqueadas con nombres provisionales), una guía pública y una videoclase bloqueada. Las imágenes de `public/previews/` son miniaturas reales de la primera página de los PDFs. Los PDFs disponibles pueden consultarse en un diálogo y descargarse con un enlace independiente. El soporte de vista previa del PDF depende del navegador; siempre se ofrece descarga.

Los calendarios pueden incluir un campo `mockup` con la imagen de presentación generada a partir de su diseño. Se muestra como **mockup ilustrativo**, tanto en las tarjetas como en la portada, sin sustituir el campo `preview` ni el archivo `url`: las opciones **Ver PDF** y **Descargar** siempre usan el PDF original. Los mockups cuadrados se muestran completos, también en móvil. La guía de impresión conserva su miniatura real.

Para añadir materiales: `npm run content -- pdf "Título" "Calendarios 2027" "/ruta/material.pdf" "Descripción"`. No duplicar los 50 diseños: al recibir los pendientes, actualizar la entrada correspondiente. El comando no genera miniaturas automáticamente. No subir archivos premium a `public/`.

## Flujo de venta y entrega

La venta se acuerda por WhatsApp y corresponde a un paquete de 50 calendarios 2027. El cliente recibe acceso a los primeros 10 antes de pagar. Después de realizar el pago acordado y enviar el comprobante por WhatsApp, el vendedor confirma el pago y envía los 40 restantes como archivos o mediante un enlace en esa misma conversación de WhatsApp. Los 40 permanecen bloqueados en la página pública; la entrega posterior ocurre fuera de este portal. Los textos no presentan esos 40 como una compra adicional. La videoclase permanece vinculada al Plan Diamante, según el plan acordado por WhatsApp. Esta actualización de textos no implementa liberación automática ni identificación de compradores.

## Datos comerciales de demostración

`public/site-config.json` centraliza los datos públicos. `demoMode: true` indica que los valores en COP, cuentas y titular son ficticios: los diálogos indican no realizar pagos, no ofrecen copiar cuentas ni contactar números de ejemplo. Los botones de WhatsApp muestran avisos de demostración sin redirigir a grupos o personas desconocidas.

Antes de habilitar compras: sustituir precios, `whatsappGroupUrl`, `whatsappContact` (número internacional solo con dígitos), métodos de pago y titular por información real revisada; entonces cambiar `demoMode` a `false`. Los datos de pago de esta configuración son públicos. No guardar claves, contraseñas ni tokens.

El sorteo muestra la cantidad indicada por el responsable (50 caballetes). La imagen es una ilustración, no una foto del premio. Fecha, condiciones, distribución de premios y participación están pendientes; no se inventan ganadores ni inscripciones automáticas.

## Entrega manual de los materiales de pago

Los candados presentan la oferta, pero no son autenticación ni cobro. El pago será confirmado manualmente por WhatsApp. Después de confirmar el pago, el vendedor envía los archivos o un enlace privado al comprador por WhatsApp. Este flujo mantiene los PDFs premium fuera de la carpeta pública del sitio y no requiere habilitar sus descargas en esta página. No hay desbloqueo automático ni un botón que marque un pago como verificado. El vídeo no entrega su URL en el catálogo público; el enlace se publicó anteriormente y retirarlo no revoca el acceso directo ni copias anteriores. YouTube no listado por sí solo no limita el acceso a compradores.

Los diseños de Brujas, Ángeles, BTS y Friends sustituyen cuatro posiciones bloqueadas y muestran sus mockups. Sus PDFs completos están preservados fuera de la carpeta pública, en `/workspace/premium-calendarios/`, con un manifiesto de correspondencia; no se incluyen en el despliegue estático ni en Git. El vendedor utiliza estos originales para la entrega manual por WhatsApp o para preparar el enlace que enviará al comprador. Los restantes 36 diseños bloqueados mantienen nombres provisionales.
