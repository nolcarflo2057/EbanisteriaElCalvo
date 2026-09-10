# Bitácora de Limpieza de Proyectos Parásitos (Vivaldi)

**Fecha:** 2026-09-07
**Objetivo:** Eliminar datos fantasma e información corrupta remanente del proyecto base (plantilla Vivaldi) para asegurar la integridad de la configuración de "Ebanisteria El Calvo".

## Acciones Realizadas

### 1. Variables de Entorno (`.env`)
- Se corrigió la variable `APP_NAME`, reemplazando el valor por defecto `VIVALDI` por `"Ebanisteria El Calvo"`.
- Se validó que el `NEXT_PUBLIC_TENANT_SLUG` apuntara correctamente a `ebanisteria-el-calvo`.

### 2. Eliminación de Bloques CMS Huérfanos
Los siguientes bloques específicos de la plantilla Vivaldi fueron eliminados permanentemente del directorio `src/features/blocks/blocks/` y `src/features/blocks/templates/`, ya que representaban código y componentes parásitos:
- `vivaldi-footer` (Directorio y componentes asociados eliminados)
- `vivaldi-final-cta` (Directorio y componentes asociados eliminados)
- `vivaldi-landing.ts` (Plantilla de página eliminada)

### 3. Actualización de Scripts de Release
Se actualizaron los scripts encargados de compilar y deshabilitar módulos para evitar que intenten buscar componentes eliminados:
- En `scripts/release-client.js`: Se removió el bloque de parcheo de importaciones referidas a `vivaldi-final-cta.component.tsx`.
- En `scripts/update-release.js`: Se removió la misma referencia al componente obsoleto.

### 4. Limpieza de Textos por Defecto (Schema)
- En `src/features/blocks/blocks/navbar-minimal/navbar-minimal.schema.ts`, se eliminaron los textos por defecto (e.g., `"Vivaldi Architectural Odontology Logo, minimal, gold, dark luxury"` y la marca `"VIVALDI"`) en las propiedades del CMS (CMS schema defaults).
- Se reemplazaron por `Ebanisteria El Calvo Logo, minimal` y `"EBANISTERIA EL CALVO"`.

## Prevención y Consideraciones Futuras
- **Registry & Imports:** Se debe tener cuidado al reutilizar bloques de la plantilla original. Cualquier bloque no utilizado debe ser removido tanto del sistema de archivos como de cualquier script de empaquetado (como `update-release.js`) para prevenir que Next.js o los scripts de despliegue fallen por referencias inexistentes.
- **Cache:** Si surgen problemas de enrutamiento o 404 tras esta limpieza profunda, se recomienda vaciar el directorio `.next` (Turbopack cache) y reiniciar el servidor de desarrollo, tal como está documentado en `AGENTS.md`.

## 5. Actualización de SEO y Redes Sociales (Enfoque en Restauración)
Para alinear la presencia digital de "Ebanisteria El Calvo" con su principal fortaleza y diferenciador, se ajustaron las configuraciones de SEO general y Open Graph (Redes Sociales) desde el panel de administración (`/dashboard/settings/seo` y `/dashboard/settings/social`). 

**Nuevos valores configurados:**
- **Título SEO:** Ebanistería El Calvo | Expertos en Restauración de Muebles de Madera
- **Meta Descripción:** Especialistas en restaurar, reparar y conservar muebles de madera y antigüedades. Devolvemos la vida y el esplendor a tus piezas más valiosas con auténtica ebanistería.
- **Palabras Clave:** restauración de muebles, reparar muebles de madera, restaurador de antigüedades, ebanistería, conservación de madera, arreglar muebles finos, ebanista, restauración premium
- **OG Title:** Ebanistería El Calvo | Restauración Premium de Muebles
- **OG Description:** Devolvemos el esplendor a tus muebles y antigüedades con técnicas de ebanistería fina. Confía en nuestros expertos en restauración de madera.
