/**
 * Configuración de diseño de componentes por tenant.
 * Controla cómo se renderizan los componentes visuales de la landing.
 */
export interface TenantThemeConfig {
  /** Forma del botón CTA */
  buttonStyle: "rounded" | "pill" | "sharp";
  /** Estilo del navbar */
  navbarStyle: "glass" | "solid" | "transparent";
  /** Forma de los widgets flotantes (whatsapp, chatbot) */
  widgetShape: "circle" | "rounded" | "square";
  /** Variantes de color por contexto */
  colorScheme: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

/** Configuración por defecto cuando no hay themeConfig en BD */
export const DEFAULT_THEME_CONFIG: TenantThemeConfig = {
  buttonStyle: "rounded",
  navbarStyle: "glass",
  widgetShape: "circle",
  colorScheme: {
    primary: "#F97316",
    secondary: "#F4F4F5",
    accent: "#EA580C",
  },
};
