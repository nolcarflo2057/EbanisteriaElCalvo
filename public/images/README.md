# Imágenes requeridas para producción

Coloca las siguientes imágenes optimizadas en formato **WebP** en estas rutas:

## Hero / Portada
- `public/images/hero/hero.webp` — Imagen de fondo del hero (1920x1080px recomendado, < 200KB)

## Sección Artesano
- `public/images/hero/artisan.webp` — Foto del taller/artesano (800x1000px, < 150KB)

## Galería
- `public/images/gallery/kitchen.webp` — Cocina integral (800x600px, < 100KB)
- `public/images/gallery/door.webp` — Puerta de diseño (800x600px, < 100KB)
- `public/images/gallery/table.webp` — Mesa de comedor (800x600px, < 100KB)
- `public/images/gallery/closet.webp` — Closet personalizado (800x600px, < 100KB)

## Recomendaciones
- Usa **WebP** con calidad 80-85%
- Ancho máximo 1920px para hero, 800px para galería
- Comprime con herramientas como `cwebp`, `squoosh.app` o `imagemin`
- Las imágenes se sirven desde `/images/` y Next.js las optimiza automáticamente