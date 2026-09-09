import type { TenantThemeConfig } from "./tenant-theme.types";

/**
 * Resuelve las clases de Tailwind para un botón CTA según la config del tenant.
 */
export function resolveButtonClasses(config: TenantThemeConfig): string {
  switch (config.buttonStyle) {
    case "pill":
      return "rounded-full";
    case "sharp":
      return "rounded-none";
    case "rounded":
    default:
      return "rounded-xl";
  }
}

/**
 * Resuelve las clases de Tailwind para el navbar según la config del tenant.
 */
export function resolveNavbarClasses(config: TenantThemeConfig): string {
  switch (config.navbarStyle) {
    case "solid":
      return "bg-background border-b border-border";
    case "transparent":
      return "bg-transparent";
    case "glass":
    default:
      return "bg-background/80 backdrop-blur-md border-b border-border/50";
  }
}

/**
 * Resuelve las clases de Tailwind para widgets flotantes (whatsapp, chatbot).
 */
export function resolveWidgetClasses(config: TenantThemeConfig): string {
  switch (config.widgetShape) {
    case "rounded":
      return "rounded-2xl";
    case "square":
      return "rounded-lg";
    case "circle":
    default:
      return "rounded-full";
  }
}

/**
 * Resuelve el estilo inline de CSS para border-radius según la config del tenant.
 */
export function resolveBorderRadius(config: TenantThemeConfig): string {
  switch (config.buttonStyle) {
    case "pill":
      return "9999px";
    case "sharp":
      return "0px";
    case "rounded":
    default:
      return "0.75rem";
  }
}
