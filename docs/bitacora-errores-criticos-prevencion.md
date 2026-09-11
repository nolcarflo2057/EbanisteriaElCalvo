# Bitácora de Errores Críticos y Prevención

Este documento registra errores severos que rompen el build de producción (Vercel/Turbopack) o la aplicación en tiempo de ejecución, junto con sus causas y soluciones para evitar regresiones.

---

## 🛑 Error de Build: Turbopack y Rutas Relativas en Imports Dinámicos

**Fecha:** 2026-09-10
**Módulo:** `src/features/whiteLabel/services/chat.service.ts`

**Síntoma:**
El despliegue en Vercel falla durante la fase de build con el siguiente error de Turbopack:
```
Module not found: Can't resolve './chatbot.constants'
> 378 | const { buildDefaultChatbotTags } = await import("./chatbot.constants");
```

**Causa Raíz:**
El servicio `chat.service.ts` intentó usar un `import()` dinámico asumiendo que el archivo de constantes estaba en su mismo directorio (`./chatbot.constants`), pero en realidad estaba en `../constants/chatbot.constants.ts`. 
Turbopack es extremadamente estricto con la resolución de rutas en importaciones dinámicas durante el build (a diferencia de algunos entornos de desarrollo que podrían perdonarlo o resolverlo si los archivos se movieron recientemente pero quedaron en caché).

**Solución Implementada:**
Se corrigió la ruta de importación dinámica para que apunte exactamente al directorio correcto:
`await import("../constants/chatbot.constants")`

**Prevención Futura:**
1. Siempre verificar que las rutas relativas en `import()` dinámicos sean precisas.
2. Si se mueven archivos de constantes o utilidades de un directorio a otro (ej. de `services/` a `constants/`), asegurarse de hacer una búsqueda global de `import("...` para actualizar las referencias dinámicas, ya que el refactor automático de los IDEs a veces omite actualizar los strings dentro de imports dinámicos.
