/**
 * @file modules.ts
 * @description Configuración de módulos para este cliente.
 * Generado automáticamente por release:client.
 */

export interface ModuleDefinition {
  enabled: boolean;
  label: string;
  description: string;
  core: boolean;
  routes: string[];
}

export const enabledModules = {
  auth:        true,
  users:       true,
  roles:       true,
  settings:    true,
  uploads:     true,
  notifications: true,
  audit:       true,
  landing:     true,
  blocks:      true,
  leads:       true,
  appointments: false,
  whitelabel:  true,
  analytics:   true,
  whitelabel_whatsapp: true,
  whitelabel_chatbot_simple: true,
  whitelabel_chatbot_advanced: true,
  analytics_traffic: true,
  analytics_conversions: true,
  analytics_behavior: true,
} as const;

export type ModuleName = keyof typeof enabledModules;

export const MODULES_META: Record<ModuleName, ModuleDefinition> = {
  auth:{        enabled:true,label:"Autenticación",       description:"Login, registro y sesiones de usuarios",core:true,routes:["/admin","/login","/register"]},
  users:{       enabled:true,label:"Usuarios",            description:"Gestión de cuentas y perfiles de usuario",core:true,routes:["/dashboard/profile"]},
  roles:{       enabled:true,label:"Roles",               description:"Sistema de permisos y roles (admin, editor, etc.)",core:true,routes:[]},
  settings:{    enabled:true,label:"Configuración",       description:"Ajustes generales de la tienda (moneda, idioma, envíos)",core:true,routes:["/dashboard/settings"]},
  uploads:{     enabled:true,label:"Archivos",            description:"Subida y gestión de imágenes y documentos",core:true,routes:[]},
  notifications:{ enabled:true,label:"Notificaciones",      description:"Sistema de notificaciones push y email",core:true,routes:[]},
  audit:{       enabled:true,label:"Auditoría",           description:"Registro de acciones y logs de seguridad",core:true,routes:[]},
  landing:{     enabled:true,label:"Landing Page",        description:"Página pública de la tienda con diseño personalizable",core:false,routes:[]},
  blocks:{      enabled:true,label:"Editor de Bloques",   description:"Constructor visual de secciones (hero, CTA, galería)",core:false,routes:["/dashboard/blocks"]},
  leads:{       enabled:true,label:"Leads de Contacto",   description:"Mensajes y formularios del formulario de la landing",core:false,routes:["/dashboard/leads"]},
  appointments:{ enabled:false,label:"Citas",               description:"Agendamiento de citas desde la landing",core:false,routes:["/dashboard/appointments"]},
  whitelabel:{  enabled:true,label:"Marca Blanca",        description:"Personalización avanzada de identidad (chat, WhatsApp, branding)",core:false,routes:[]},
  analytics:{   enabled:true,label:"Analíticas",          description:"Píxeles de conversión y analítica web (GA4, Meta, TikTok)",core:false,routes:["/dashboard/settings/integrations"]},
  whitelabel_whatsapp:{ enabled:true,label:"Botón de WhatsApp",   description:"Widget flotante de WhatsApp",core:false,routes:[]},
  whitelabel_chatbot_simple:{ enabled:true,label:"Chatbot Simple",      description:"Chatbot con respuestas predefinidas",core:false,routes:[]},
  whitelabel_chatbot_advanced:{ enabled:true,label:"Chatbot Avanzado (IA)", description:"Chatbot con IA generativa",core:false,routes:[]},
  analytics_traffic:{ enabled:true,label:"Métricas de tráfico", description:"Google Analytics 4",core:false,routes:[]},
  analytics_conversions:{ enabled:true,label:"Conversiones",        description:"Meta Pixel, Google Ads, TikTok Pixel",core:false,routes:[]},
  analytics_behavior:{ enabled:true,label:"Comportamiento",      description:"Google Tag Manager",core:false,routes:[]},
};

/**
 * Verifica si un módulo opcional está activo.
 */
export function isModuleEnabled(moduleName: ModuleName): boolean {
  return enabledModules[moduleName];
}

/**
 * Verifica si una ruta pertenece a un módulo inactivo.
 */
export function isRouteAllowed(pathname: string): boolean {
  for (const key in MODULES_META) {
    const moduleName = key as ModuleName;
    const meta = MODULES_META[moduleName];
    if (!meta.enabled) {
      const isBlockedRoute = meta.routes.some((route) =>
        pathname === route || pathname.startsWith(route + "/")
      );
      if (isBlockedRoute) {
        return false;
      }
    }
  }
  return true;
}
