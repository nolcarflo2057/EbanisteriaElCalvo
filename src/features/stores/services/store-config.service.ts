import { SettingsService } from "@/features/settings/services/settings.service";

export interface StoreConfig {
  name: string;
  logoUrl?: string;
  logoDarkUrl?: string;
  faviconUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  locale?: string;
  currency?: string;
}

export async function getStoreConfig(tenantId: string): Promise<StoreConfig> {
  const [settings, appearance] = await Promise.all([
    SettingsService.getSettings(tenantId),
    SettingsService.getAppearance(tenantId),
  ]);

  return {
    name: settings?.name || "Mi Tienda",
    logoUrl: appearance?.logoUrl || undefined,
    logoDarkUrl: appearance?.logoDarkUrl || undefined,
    faviconUrl: appearance?.faviconUrl || undefined,
    primaryColor: appearance?.primaryColor || undefined,
    secondaryColor: appearance?.secondaryColor || undefined,
    locale: settings?.locale || undefined,
    currency: settings?.currency || undefined,
  };
}

/**
 * Versión que NO falla: si la BD tarda o falla (p.ej. timeouts de Neon),
 * devuelve la config default en vez de propagar el error. Crítica para las
 * páginas de login que no deben romperse por lentitud de la BD.
 */
export async function getStoreConfigSafe(tenantId: string): Promise<StoreConfig> {
  try {
    return await getStoreConfig(tenantId);
  } catch {
    return {
      name: "Mi Tienda",
      logoUrl: undefined,
      logoDarkUrl: undefined,
      faviconUrl: undefined,
      primaryColor: undefined,
      secondaryColor: undefined,
      locale: undefined,
      currency: undefined,
    };
  }
}
