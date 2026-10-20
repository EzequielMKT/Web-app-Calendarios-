# Calendarios Creativos · Colección 2027

Portal en español, con diseño adaptable a móviles. Orden de la página: presentación, grupo de WhatsApp, sorteo de 50 caballetes, opciones de pago, calendarios con vista previa/descarga, guía y videoclase Diamante.

## Desarrollo y publicación

Node.js 22 o superior, sin dependencias de ejecución. Desde la raíz: `npm start` (puerto 3000, configurable con `PORT`) y `npm run check` para sintaxis. En Vercel: Framework Other, sin build, Output Directory `public`. No ejecutar el servidor Node para el despliegue estático.

## Contenidos

`public/catalog.json` incluye 50 calendarios (10 PDFs disponibles y 40 posiciones bloqueadas con nombres provisionales), una guía pública y una videoclase bloqueada. Las imágenes de `public/previews/` son miniaturas reales de la primera página de los PDFs. Los PDFs disponibles pueden consultarse en un diálogo y descargarse con un enlace independiente. El soporte de vista previa del PDF depende del navegador; siempre se ofrece descarga.

Para añadir materiales: `npm run content -- pdf "Título" "Calendarios 2027" "/ruta/material.pdf" "Descripción"`. No duplicar los 50 diseños: al recibir los pendientes, actualizar la entrada correspondiente. El comando no genera miniaturas automáticamente. No subir archivos premium a `public/`.

## Datos comerciales de demostración

`public/site-config.json` centraliza los datos públicos. `demoMode: true` indica que los valores en COP, cuentas y titular son ficticios: los diálogos indican no realizar pagos, no ofrecen copiar cuentas ni contactar números de ejemplo. Los botones de WhatsApp muestran avisos de demostración sin redirigir a grupos o personas desconocidas.

Antes de habilitar compras: sustituir precios, `whatsappGroupUrl`, `whatsappContact` (número internacional solo con dígitos), métodos de pago y titular por información real revisada; entonces cambiar `demoMode` a `false`. Los datos de pago de esta configuración son públicos. No guardar claves, contraseñas ni tokens.

El sorteo muestra la cantidad indicada por el responsable (50 caballetes). La imagen es una ilustración, no una foto del premio. Fecha, condiciones, distribución de premios y participación están pendientes; no se inventan ganadores ni inscripciones automáticas.

## Acceso de pago pendiente

Los candados presentan la oferta, pero no son autenticación ni cobro. El pago será confirmado manualmente por WhatsApp. Para liberar de forma segura se requiere identificación del comprador, permisos en servidor y almacenamiento privado de materiales premium. No hay desbloqueo automático ni un botón que marque un pago como verificado. El vídeo no entrega su URL en el catálogo público; el enlace se publicó anteriormente y retirarlo no revoca el acceso directo ni copias anteriores. YouTube no listado por sí solo no limita el acceso a compradores.
