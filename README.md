# Sala — biblioteca pública

Web app en español para compartir PDFs y videoclases. Cualquier persona con el enlace puede consultar el catálogo, sin iniciar sesión. Búsqueda, filtros por módulo y tipo, y diseño adaptable a móviles.

## Desarrollo

Node.js 22 o superior, sin dependencias adicionales. Desde la raíz del proyecto:

- `npm start`: servidor en el puerto 3000 (configurable con `PORT`).
- `npm run check`: comprobación de sintaxis.

## Publicar contenidos

El responsable añade materiales desde la terminal del proyecto; los visitantes no pueden modificar el catálogo.

```sh
npm run content -- pdf "Guía de estudio" "Módulo 1" "/ruta/guia.pdf" "Material de apoyo"
npm run content -- video "Primera clase" "Módulo 1" "https://www.youtube.com/watch?v=ID_REAL" "Introducción"
```

También se admite una URL HTTP/HTTPS pública para PDFs. Los archivos locales se copian a `public/materials/`; los metadatos se guardan en `public/catalog.json`. Para eliminar o editar contenidos, modifica ese catálogo y elimina los archivos que ya no necesites. Conserva estos cambios al publicar. Ejecuta el comando de alta de forma secuencial.

No se incluyen aulas ficticias. El catálogo inicial está vacío. Las fuentes de Google son opcionales y tienen alternativas de sistema. Las videoclases de YouTube se reproducen dentro de la aplicación. Se admiten enlaces watch, youtu.be, shorts y live. El vídeo debe permitir inserción y estar disponible para los visitantes. Cerrar el reproductor detiene la reproducción.

## Compartir

La aplicación necesita alojamiento con una URL pública para que otras personas puedan acceder. Puede ejecutarse con Node.js o publicarse la carpeta `public` en un alojamiento estático HTTPS. El servidor local de desarrollo no publica la aplicación en Internet. No hay credenciales, pagos ni servicios externos obligatorios.
