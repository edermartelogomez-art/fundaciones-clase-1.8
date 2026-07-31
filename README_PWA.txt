FUNDACIONES · CLASE 1 — PWA

Contenido principal
- index.html: aplicación completa.
- styles.css: interfaz responsiva para proyección, computador y móvil.
- app.js: navegación, simuladores, gráficas SVG, ejemplos y retroalimentación.
- manifest.webmanifest y sw.js: instalación y funcionamiento sin conexión.
- assets/: imágenes e iconos locales.

Publicación
1. Sube todo el contenido de esta carpeta al mismo directorio de GitHub Pages.
2. La PWA debe abrirse mediante HTTPS; no funciona como instalable desde file://.
3. Después de actualizar una versión publicada, recarga una vez para que el nuevo service worker reemplace la caché anterior.

La aplicación no necesita librerías externas ni conexión a internet después de su primera carga.

CORRECCIÓN v8
- Se eliminó la franja artificial que hacía parecer cortada la imagen principal.
- Se ajustó la proporción del recurso visual al contenedor real de la app.
- Se cambió el nombre del archivo y la versión de caché para forzar su actualización en GitHub Pages/PWA.


CORRECCIÓN v9
- Se reemplazó la imagen principal de la introducción por una escena más ancha y limpia, sin franja oscura incrustada.
- Se reajustó la posición de la flecha principal y de las flechas animadas para que coincidan mejor con la cimentación.
- Se actualizó la caché del service worker para forzar la nueva versión en la PWA.


CORRECCIÓN v10
- La imagen principal se conserva porque sí es adecuada.
- La animación dejó de depender de posiciones CSS independientes.
- Las flechas ahora forman un SVG responsivo con el mismo encuadre de la imagen, por lo que permanecen alineadas al cambiar el tamaño de la ventana.
- Se eliminó la duplicación desordenada de flechas y se añadió un pulso suave bajo la cimentación.
- Caché actualizada a v10.


CORRECCIÓN v11
- La imagen principal permanece completa antes, durante y después de la animación.
- Imagen y SVG usan la misma proporción 1536 × 1024 y preserveAspectRatio="meet".
- Se eliminó el recorte producido por object-fit: cover y los filtros SVG que podían generar artefactos de composición.
- La animación solo afecta las líneas superpuestas; nunca transforma la imagen.
